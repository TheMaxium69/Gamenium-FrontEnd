import {Component, ViewChild} from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import {UserInterface} from "./-interface/user.interface";
import {AuthService} from "./-service/auth.service";
import {ApicallInterface} from "./-interface/apicall.interface";
import {Router} from "@angular/router";
import {NavbarComponent} from "./-global/navbar/navbar.component";
import { CookieService } from 'ngx-cookie-service';
import {PageAccountComponent} from "./account/page-account/page-account.component";
import {HistoryMyGameInterface} from "./-interface/history-my-game.interface";
import {GameInterface} from "./-interface/game.interface";
import {NgForm} from "@angular/forms";
import {HistoryMyGameService} from "./-service/history-my-game.service";
import {ProfilePrivateComponent} from "./mygame/profile-private/profile-private.component";
import {GameService} from "./-service/game.service";
import Swal from "sweetalert2";
import {PlateformInterface} from "./-interface/plateform.interface";
import {CountryInterface} from "./-interface/country.interface";
import {LikeService} from "./-service/like.service";
import {ProviderInterface} from "./-interface/provider.interface";
import {UserRateInterface} from "./-interface/user-rate.interface";
import {BuyWhereInterface} from "./-interface/buy-where.interface";
import { HmgTagsInterface } from './-interface/hmg-tags.interface';
import {DeviseInterface} from "./-interface/devise.interface";
import {UserDefaultInterface} from "./-interface/user-default.interface";
import {HmgCopyLanguageInterface} from "./-interface/hmg-copy-language.interface";
import {HmgCopyEtatInterface} from "./-interface/hmg-copy-etat.interface";
import {HmgCopyFormatInterface} from "./-interface/hmg-copy-format.interface";
import {HmgCopyRegionInterface} from "./-interface/hmg-copy-region.interface";
import {HmgScreenshotCategoryInterface} from "./-interface/hmg-screenshot-category.interface";
import { HistoryMyPlatformInterface } from './-interface/history-my-platform.interface';
import { HistoryMyPlateformService } from './-service/history-my-plateform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  @ViewChild(PageAccountComponent) pageAccountComponent!: PageAccountComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private histoireMyGameService: HistoryMyGameService,
    private gameService: GameService,
    private historyMyPlatformService: HistoryMyPlateformService
  ) {
    const cookieToken:string = this.cookieService.get('tokenGamenium');
    const cookieUser:string = this.cookieService.get('userGamenium');

    if (cookieToken && cookieUser){
      this.loginWithCookie(cookieToken, cookieUser);
    } else {
      this.router.navigate(['/account']);
    }
  }


  /******************************************************************************************************************
   *
   * VARIABLE GLOBAL
   *
   * ******************************************************************************************************************/


  //%     API - GAMENIUM      %//
    AppEnv: string = "DEV"; // DEV or PROD or PRODMAX
    urlApiDev: string = "http://127.0.0.1:8000";
    urlApiDevMax: string = "https://127.0.0.1:8000";
    urlApiProd: string = "http://vps216.tyrolium.fr:8000";
    urlApiProdMax: string = "http://home.vps216.tyrolium.fr:8000";
    urlApiV1: string = "https://vps209.tyrolium.fr";
  //%     API - GAMENIUM      %//

  //%     API - GAME      %//
    AppEnvOther:string = "DEV" // DEV or PROD
    urlApiGetGameDev:string = "http://127.0.0.1/html-to-api/"
    urlApiGetGameProd:string = "https://vps216.tyrolium.fr/html-to-api/"
    urlApiGetGameV1:string = "https://vps209.tyrolium.fr/html-to-api/"
    urlApiGiantbomb:string = this.setURLApiOther() + "giantbomb.php";
    urlApiMetacritic:string = this.setURLApiOther() + "metacritic.php";
  //%     API - GAME      %//

  //%     API - TYROLIUM      %//
    urlGeneratePP:string = "https://tyrolium.fr/generate-pp/"
  //%     API - TYROLIUM      %//

  // SETTING
  Debug:Boolean = false; // Active la view Serv and Local
  isLoggedIn: boolean = false;
  userConnected: UserInterface|any;
  token: string|any;
  isAccess: boolean = true; /* ETAT PAR DEFAULT */
  currentUrl: string = "/";

  // LIMIT
  fetchLimit:number = 50; // Limit Game in search Game & Page
  modalSearchLimit:number = 6 // Limit Game in modal add Game & Note
  deadlineSearch:number = 300; // Time input searchBar
  deadlineView:number = 2000; // Time added view
  maxSearchProviderByGame:number = 4; // Max Recherche de provider dans gameOne
  maxCopyGame:number = 50;

  // DEFAULT
  colorDefault:string = "#d2001e";
  lang:string = "fr";
  noBoxartImage_default:string = "https://www.giantbomb.com/a/uploads/square_avatar/11/110673/3026329-gb_default-16_9.jpg";
  noBoxartImage:string = "assets/noBoxart.png";

  /******************************************************************************************************************
   *
   * STOCK / CACHE (FOR NO RELOAD)
   *
   * ******************************************************************************************************************/

  // SEARCH GAME
  gameNoReload: GameInterface[] = [];
  usersNoReload: UserInterface[] = [];
  providersNoReload: ProviderInterface[] = [];
  gamesSearchDefault: GameInterface[] = [];
  searchValue: string = '';

  // MYGAME
  userRatingAll: UserRateInterface[] | undefined;
  myGameAll:HistoryMyGameInterface[] | undefined;
          /* select */
  tagsUserNoReload: HmgTagsInterface[] = [];
  buyWhereUserNoReload:BuyWhereInterface[] = [];
  deviseNoReload:DeviseInterface[] = [];
  HmgCopyLanguageNoReload:HmgCopyLanguageInterface[] = [];
  hmgCopyEtatAllNoReload:HmgCopyEtatInterface[] = [];
  hmgCopyFormatAllNoReload:HmgCopyFormatInterface[] = [];
  hmgCopyRegionAllNoReload:HmgCopyRegionInterface[] = [];
  hmgScreenshotCategory: HmgScreenshotCategoryInterface[] = [];


  // USER
  userDefaultNoReload:UserDefaultInterface|undefined;

  /******************************************************************************************************************
   *
   * CONNEXION
   *
   * ******************************************************************************************************************/

  // DECONNEXION
  loggout(){
    this.cookieService.delete('tokenGamenium');
    this.cookieService.delete('userGamenium');

    this.isLoggedIn = false;
    this.token = undefined;
    this.userConnected = undefined;

    this.userRatingAll = undefined;
    this.myGameAll = undefined;
    this.tagsUserNoReload = [];
    this.buyWhereUserNoReload = [];
    this.deviseNoReload = [];
    this.HmgCopyLanguageNoReload = [];
    this.hmgCopyEtatAllNoReload = [];
    this.hmgCopyFormatAllNoReload = [];
    this.hmgCopyRegionAllNoReload = [];
    this.hmgScreenshotCategory = [];
    this.userDefaultNoReload = undefined;

    this.router.navigate(['/account']);
  }

  //LOGIN
  login(email: string, password: string, saveme: boolean) {

    this.getToken(email, password, saveme);

  }


  // Ce connecter et recupere le token
  getToken(email: string, password: string, saveme: boolean){

    let msgToken: ApicallInterface|undefined;

    let bodyNoJson:any;

    bodyNoJson = {
      "email_auth":email,
      "mdp_auth":password
    };

    this.authService.postLoginUser(bodyNoJson, this.setURL()).subscribe(reponseToken => {

      msgToken = reponseToken;

      if (msgToken?.message == "Connected"){

        this.token = msgToken.token

        this.getUserByToken(this.token, saveme);

      } else {

        // console.log(msgToken?.message)
        // GERE LE MSG ERR

        if (msgToken?.message == "bad email"){
          Swal.fire({
            title: 'Erreur!',
            text: 'Aucun compte n\'est associé à cet email',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else if (msgToken?.message == "bad passwd") {
          Swal.fire({
            title: 'Erreur!',
            text: 'Mots de passe incorrect',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: 'Erreur lors de la connexion',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }

      }

    }, (error) => {
      this.erreurSubcribe()
    });

  }

  // Recupere les information grace au token
  getUserByToken(token: string , saveme: boolean){

    let msgUser:ApicallInterface|undefined

    this.authService.postLoginToken(token, this.setURL()).subscribe(reponseUser => {

      msgUser = reponseUser;

      if (msgUser?.message == "Connected"){

        this.userConnected = msgUser.result;
        this.isLoggedIn = true;
        if (saveme){
          this.cookieService.set('tokenGamenium', this.token);
          let userJson = JSON.stringify(this.userConnected);
          this.cookieService.set('userGamenium', userJson);
        }

        // console.log(this.userConnected.userRole)
        if (this.userConnected && this.userConnected.userRole) {

          this.isAccess = true;

          /* VERIFICATION D'UN ROLE */

          // for (const role of this.userConnected.userRole) {
          //   if (role === 'ROLE_BETA') {
          //     this.isAccess = true;
          //     break;
          //   }
          // }
        }

        if (/*this.router.url == "/account" && */this.isAccess){
          this.router.navigate([this.currentUrl]);
        } else if (!this.isAccess){
          this.router.navigate(['/waiting']);
        }

      } else if (msgUser?.message == "user ban") {

        console.log(msgUser?.message)
        // GERE LE MSG ERR
        this.cookieService.delete('tokenGamenium');
        this.cookieService.delete('userGamenium');

        Swal.fire({
          title: 'Ban!',
          text: 'Votre compte à été bannie',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
        })


      } else {

        console.log(msgUser?.message)
        // GERE LE MSG ERR
        this.cookieService.delete('tokenGamenium');
        this.cookieService.delete('userGamenium');
        this.erreurSubcribe()

      }

    }, (error) => {
      this.cookieService.delete('tokenGamenium');
      this.cookieService.delete('userGamenium');
      this.erreurSubcribe()
    });

  }

  //Login Avec le Cookie
  loginWithCookie(cookieToken: string, userCookieJson: string): void {

    this.token = cookieToken;
    this.isLoggedIn = true;

    const userCookie = JSON.parse(userCookieJson);
    this.userConnected = userCookie;

    this.getUserByToken(cookieToken, false);

  }


  // Verif la connexion
  verifToken() {

    if (!this.token){
      this.isLoggedIn = false;
    }

  }

  /*****************************************************************************************************************
   *
   * FUNCTION GLOBAL
   *
   * ******************************************************************************************************************/

  //CORS With TOKEN
  createCorsToken(isFormData: boolean = false): {headers: HttpHeaders} {


    /* CORS ANONYME */
    if (!this.isLoggedIn){

      let headers: HttpHeaders;

      if (!isFormData){
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
      } else {
        headers = new HttpHeaders({
        });


        headers.append('Content-Type', 'multipart/form-data');


      }
      const options: {headers: HttpHeaders}  = { headers: headers };

      return options;



    } else {
      /* CORS LOG*/

      let headers: HttpHeaders;

      if (!isFormData){
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+this.token,
        });
      } else {
        headers = new HttpHeaders({
          'Authorization': 'Bearer '+this.token,
        });


        headers.append('Content-Type', 'multipart/form-data');


      }
      const options: {headers: HttpHeaders}  = { headers: headers };

      return options;

    }

  }

  //SET URL API
  setURL():string {

    if (this.AppEnv == "DEV"){
      return this.urlApiDev;
    } else if (this.AppEnv == "PROD") {
      return this.urlApiProd;
    } else if (this.AppEnv == "PRODMAX") {
      return this.urlApiProdMax;
    } else if (this.AppEnv == "DEVMAX") {
      return this.urlApiDevMax;
    } else if (this.AppEnv == "V1") {
      return this.urlApiV1;
    } else {
      return this.urlApiV1;
    }

  }

  setURLApiOther():string {

    if (this.AppEnvOther == "DEV"){
      return this.urlApiGetGameDev;
    } else if (this.AppEnvOther == "PROD") {
      return this.urlApiGetGameProd;
    } else if (this.AppEnvOther == "V1") {
      return this.urlApiGetGameV1;
    } else {
      return this.urlApiGetGameV1;
    }

  }

  updateComponent() {

    if (!this.isLoggedIn){

      if (this.token){
        return true;
      } else {
        return false
      }

    } else {
      return this.isLoggedIn;
    }

  }

  generatePPUseritium(pp:string|undefined|null, username:string|undefined, colorSelected:string|undefined):string {

    let result:string = this.urlGeneratePP;

    let color = this.colorDefault
    if (colorSelected){
      if (Array.isArray(colorSelected)) {
        color = colorSelected[0];
      } else {
        color = colorSelected;
      }
    }

    if (pp){
      result = pp
    } else if (username) {
      result = this.urlGeneratePP + '?l=' + username[0] + '&c='+ color.substring(1);
    }

    return 'background-image: url(' + result + ')';

  }

  erreurSubcribe(){
    if (this.isLoggedIn && !this.isAccess){
      console.error('ErreurSubcribe');
    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur de notre serveur',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
      })
    }

  }

  bigNombreFormatage(nombreFormatage:number): string {

    if (nombreFormatage >= 1000000) {
      return Math.round(nombreFormatage / 1000000) + "M";
    }

    if (nombreFormatage >= 1000) {
      return Math.round(nombreFormatage / 1000) + "K";
    }

    return nombreFormatage.toString();

  }

  plateformeNameFormatage(plateform:string): string{

    if (plateform == 'Super Nintendo Entertainment System'){
      return 'SNES'
    }

    if (plateform == 'Nintendo Entertainment System'){
      return 'NES'
    }

    if (plateform == 'Genesis'){
      return 'Mega Drive'
    }

    if (plateform == 'Browser'){
      return 'Navigateur'
    }

    if (plateform == 'Other'){
      return 'Autre'
    }

    return plateform;

  }

  publisherNameFormatage(pubName:string):string{

    if (pubName == "Xbox Game Studios"){
      return "Xbox";
    }

    if (pubName == "Sony Interactive Entertainment America"){
      return "Playstation"
    }

    return pubName;

  }

  moisView(moisChiffre: number): string{
    if (moisChiffre == 0) {
      return "janvier";
    } else if (moisChiffre == 1) {
      return "février";
    } else if (moisChiffre == 2) {
      return "mars";
    } else if (moisChiffre == 3) {
      return "avril";
    } else if (moisChiffre == 4) {
      return "mai";
    } else if (moisChiffre == 5) {
      return "juin";
    } else if (moisChiffre == 6) {
      return "juillet";
    } else if (moisChiffre == 7) {
      return "août";
    } else if (moisChiffre == 8) {
      return "septembre";
    } else if (moisChiffre == 9) {
      return "octobre";
    } else if (moisChiffre == 10) {
      return "novembre";
    } else if (moisChiffre == 11) {
      return "décembre";
    }
    return ""
  }

  /*
  * CARD GAME
  * */
  togglePin(myGameHistorique: HistoryMyGameInterface | undefined) {

    if (!myGameHistorique) {
      return;
    }


    myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;

    let message = ""
    if (myGameHistorique.myGame.is_pinned) {
      message = "épinglé";
    } else {
      message = "désépinglé"
    }


    const body = JSON.stringify({
      id_game: myGameHistorique.myGame.game.id,
      is_pinned: myGameHistorique.myGame.is_pinned,
    });

    this.histoireMyGameService.updatePinMyGame(body, this.setURL(), this.createCorsToken())
      .subscribe(response => {
        if (response.message === 'game is pinned') {
          console.log('Statut épinglé mis à jour dans la base de données');
          Swal.fire({
            title: 'Succès!',
            text: myGameHistorique.myGame.game.name + ' a bien été '+message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else {
          myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
          Swal.fire({
            title: 'Echec!',
            text: myGameHistorique.myGame.game.name + ' n\'a pas pu être '+message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }
      }, error => {
        myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
        this.erreurSubcribe()
      });
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 1970;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  }



  selectedGalery:number|undefined;
  clickGalery(index:number){
    this.selectedGalery = index;
  }

  unclickGalery() {
    this.selectedGalery = undefined;
  }


  /*
  *
  * FOR MODAL
  *
  * */

  gameSelected: GameInterface|undefined;
  viewMyGame:HistoryMyGameInterface|undefined;
  noPlateform: { name: string; id: number } = {
    id: 99999,
    name: "Other"
  };
  platformSelected: PlateformInterface|undefined;
  myPlatform: HistoryMyPlatformInterface|undefined;
    // id, nom

  addPlatform(form: NgForm, isMore: boolean = false){

    let buywhere_id = form.value['buyWhere'];
    if (buywhere_id == "") {
      buywhere_id = null;
    }

    let day_buy_date = form.value['day_buy_date']
    if (day_buy_date == "") {
      day_buy_date = null;
    }
    let month_buy_date = form.value['month_buy_date']
    if (month_buy_date == "") {
      month_buy_date = null;
    }
    let year_buy_date = form.value['year_buy_date']
    if (year_buy_date == "") {
      year_buy_date = null;
    }

    if(!this.platformSelected?.id){
      Swal.fire({
        title: 'Attention!',
        text: 'Veuillez choisir une plateforme',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
      })
    } else {
      let bodyNoJsonMyPlatform: any = {
        "id_plateform": this.platformSelected?.id,
        "day_buy_at":day_buy_date,
        "month_buy_at":month_buy_date,
        "year_buy_at":year_buy_date,
        "buywhere_id": buywhere_id
      };
      const bodyMyPlatform = JSON.stringify(bodyNoJsonMyPlatform);

      this.historyMyPlatformService.postMyPlatform(bodyMyPlatform, this.setURL(), this.createCorsToken()).subscribe((responseMyPlatformAdd:{message:string,result:HistoryMyPlatformInterface}) =>{
        if(responseMyPlatformAdd.message = "add plateform is collection"){
          if (isMore){
            this.router.navigate(['/mygame/edit-platform/' + responseMyPlatformAdd.result.id]);
          } else {
            Swal.fire({
              title: 'Succès!',
              text: this.platformSelected?.name + ' à bien été ajouter à votre profil.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
            })

          }
        } else if (responseMyPlatformAdd.message == "has already been added") {
          Swal.fire({
            title: 'Attention!',
            text: 'Le jeux est déjà dans votre collection',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajout d\'un jeux',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
          console.log('erreur lors de l\'ajout de la plateforme');
        }

      });
    }

  }

  addNote(form:NgForm) {

    // console.log(form.value);

    if (form.value['noteGame'] >= 0 && form.value['noteGame'] <= 20){

      let bodyNoJsonMyGameNote: any = ''

      let noteGame = form.value['noteGame'];

      let content = form.value['content'];

      if (content == ''){
        bodyNoJsonMyGameNote = {
          "id_game":this.gameSelected?.id,
          "note":noteGame,
        };
      } else {
        bodyNoJsonMyGameNote = {
          "id_game":this.gameSelected?.id,
          "note":noteGame,
          "content":content
        };
      }

      const bodyMyGameNote = JSON.stringify(bodyNoJsonMyGameNote);

      this.histoireMyGameService.postNoteMyGame(bodyMyGameNote, this.setURL(), this.createCorsToken()).subscribe(reponseMyGameNoteAdd => {

        // console.log(reponseMyGameNoteAdd);
        if (reponseMyGameNoteAdd.message == "add note is game"){

          if (this.userConnected && this.userRatingAll) {
            this.userRatingAll = [reponseMyGameNoteAdd.result, ...(this.userRatingAll || [])];
          }

          if (this.userConnected && this.myGameAll && this.gameSelected){
            const selectedGame = this.myGameAll.find(game => game.myGame.game.id === this.gameSelected?.id);
            if (selectedGame) {
              selectedGame.tempNote = noteGame;
            }
          }


          Swal.fire({
            title: 'Succès!',
            text: 'La note de ' + this.gameSelected?.name + ' a bien été ajoutée',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else if (reponseMyGameNoteAdd.message == "game not in collection"){
          Swal.fire({
            title: 'Attention!',
            text: 'Mettez le jeux dans votre collection pour le noté',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else if (reponseMyGameNoteAdd.message == "note no valide"){
          Swal.fire({
            title: 'Attention!',
            text: 'La note est invalide',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajoute de la note',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }

      }, (error) => { this.erreurSubcribe() });

    } else {
      Swal.fire({
        title: 'Attention!',
        text: 'La note est invalide',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
      })
    }
  }

  addGame(form: NgForm, isMore: boolean = false) {

    // console.log(form.value)

    let is_pinned = form.value['pinnedGame'];
    if (is_pinned == "") {
      is_pinned = false;
    }

    let buywhere_id = form.value['buyWhere'];
    if (buywhere_id == "") {
      buywhere_id = null;
    }

    let day_buy_date = form.value['day_buy_date']
    if (day_buy_date == "") {
      day_buy_date = null;
    }
    let month_buy_date = form.value['month_buy_date']
    if (month_buy_date == "") {
      month_buy_date = null;
    }
    let year_buy_date = form.value['year_buy_date']
    if (year_buy_date == "") {
      year_buy_date = null;
    }

    let plateform_id = form.value['plateform_id'];
    // console.log(plateform_id);
    let noplate:boolean = true;
    if (plateform_id == ""){
      if (this.gameSelected){
        if (this.gameSelected.platforms) {
          if (this.gameSelected.platforms.length == 1) {
            noplate = false;
            plateform_id = this.gameSelected.platforms[0].id;
          }
        } else {
          noplate = false;
          plateform_id = this.noPlateform.id
        }
      }
    } else {
      noplate = false;
    }

    if (noplate){

      Swal.fire({
        title: 'Attention!',
        text: 'Veuillez choisir une plateforme',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
      })

    } else {

      let bodyNoJsonMyGame: any = {
        "id_game": this.gameSelected?.id,
        "id_plateform":plateform_id,
        "is_pinned": is_pinned,
        "buywhere_id": buywhere_id,
        "year_buy_at":year_buy_date,
        "month_buy_at":month_buy_date,
        "day_buy_at":day_buy_date
      };
      const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);
      // console.log(bodyMyGame);

      // return console.log(bodyMyGame);
      this.histoireMyGameService.postMyGame(bodyMyGame, this.setURL(), this.createCorsToken()).subscribe((reponseMyGameAdd:{message:string,result:HistoryMyGameInterface}) => {
        if (reponseMyGameAdd.message == "add game is collection") {

          if (isMore){
            this.router.navigate(['/mygame/edit/' + reponseMyGameAdd.result.id]);
          } else {
            Swal.fire({
              title: 'Succès!',
              text: this.gameSelected?.name + ' à bien été ajouter à votre profil.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
            })
          }


          // Actualiser la liste des jeux après l'ajout
          if (this.userConnected && this.myGameAll) {
            this.myGameAll = [reponseMyGameAdd.result, ...(this.myGameAll || [])];
          }
        } else if (reponseMyGameAdd.message == "has already been added") {
          Swal.fire({
            title: 'Attention!',
            text: 'Le jeux est déjà dans votre collection',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        } else {
          console.error(reponseMyGameAdd);
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajout d\'un jeux',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }
      }, (error) => { this.erreurSubcribe() })

    }
  }

  selectGame(game: GameInterface) {
    this.gameSelected = game;
  }

  unselectGame() {
    this.gameSelected = undefined;
  }

  selectPlatform(plateform: PlateformInterface){
    this.platformSelected = plateform;
  }

  unselectPlatform(){
    this.platformSelected = undefined;
  }

  /*
  *
  * SYSTEME LANG
  *
  * */

  deleteMyPlateform(myPlatform: HistoryMyPlatformInterface|undefined, redirect: Boolean = false){
    if(!myPlatform){
      console.log('pas de hmp');
      return;
    }

    // myPlateform.isDelete = true;
    let idOneMyPlatform = myPlatform.id;

    if(idOneMyPlatform){
      this.historyMyPlatformService.deleteMyPlatform(idOneMyPlatform, this.setURL(), this.createCorsToken()).subscribe(responseDeleteMyPlatform => {
        if(responseDeleteMyPlatform.message == 'delete success'){


          Swal.fire({
            title: 'Succès!',
            text: 'La plateforme a été retiré de votre collection.',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })

          if (redirect){
            this.router.navigateByUrl('/mygame')
          }

        } else {
          // myPlatform.isDelete = false;
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur s\'est produite lors de la suppression du jeu.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }
      }, (error) => {
        // myPlatform.isDelete = false;
        this.erreurSubcribe()
      })
    }
  }

  deleteMyGame(myGameHistorique: HistoryMyGameInterface | undefined, redirect: Boolean = false) {

    if (!myGameHistorique) {
      return;
    }

    myGameHistorique.isDelete = true;
    let idOneMyGame = myGameHistorique.id;

    if (idOneMyGame) {
      this.histoireMyGameService.deleteMyGame(idOneMyGame, this.setURL(), this.createCorsToken()).subscribe(reponseApi => {
        if (reponseApi.message == 'delete success') {

          if (this.userConnected && this.myGameAll) {
            this.myGameAll = this.myGameAll.filter(game => game.id !== idOneMyGame);
          }

          Swal.fire({
            title: 'Succès!',
            text: 'Le jeu a été retiré de votre collection.',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })

          if (redirect){
            this.router.navigateByUrl('/mygame')
          }
        } else {
          myGameHistorique.isDelete = false;
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur s\'est produite lors de la suppression du jeu.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor || this.colorDefault
          })
        }
      }, (error) => {
        myGameHistorique.isDelete = false;
        this.erreurSubcribe()
      })

    }
  }


  getVariableCountryLang(country:CountryInterface|undefined):string {

    if (!country) {
      return "";
    }
    if (this.lang == "fr"){
      return country.name_fr;
    } else {
      return country.name_en;
    }

  }


}
