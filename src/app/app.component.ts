import {Component, ViewChild} from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import {UserInterface} from "./-interface/user.interface";
import {AuthService} from "./-service/auth.service";
import {ApicallInterface} from "./-interface/apicall.interface";
import {Router} from "@angular/router";
import {NavbarComponent} from "./-global/navbar/navbar.component";
import { CookieService } from 'ngx-cookie-service';
import {PageAccountComponent} from "./account/page-account/page-account.component";
import {IpService} from "./-service/ip.service";
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
    private ipService: IpService,
    private histoireMyGameService: HistoryMyGameService,
    private gameService: GameService
  ) {
    const cookieToken:string = this.cookieService.get('tokenGamenium');
    const cookieUser:string = this.cookieService.get('userGamenium');

    if (cookieToken && cookieUser){
      this.loginWithCookie(cookieToken, cookieUser);
    }
  }


  /******************************************************************************************************************
   *
   * VARIABLE GLOBAL
   *
   * ******************************************************************************************************************/


  AppEnv: string = "PROD"; // DEV or PROD or PRODMAX
  urlApiDev: string = "http://127.0.0.1:8000";
  urlApiDevMax: string = "https://127.0.0.1:8000";
  urlApiProd: string = "http://vps216.tyrolium.fr:8000";
  urlApiProdMax: string = "http://home.vps216.tyrolium.fr:8000";
  urlIp:string = "https://tyrolium.fr/Contenu/Php/ip.php?api=json"
  urlGeneratePP:string = "https://tyrolium.fr/generate-pp/"
  Debug:Boolean = true; // Active la view Serv and Local
  isLoggedIn: boolean = false;
  token: string|any;
  userConnected: UserInterface|any;
  currentDate: Date = new Date();

  // DEFAULT
  colorDefault = "#FF0000";

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

    this.router.navigate(['/']);

    if (this.navbarComponent) {
      this.navbarComponent.updateConnect();
    } else {
      console.error('Le composant navbar n\'a pas été initialisé correctement.');
    }
  }

  //LOGIN
  login(email: string, password: string, saveme: boolean) {

    this.getToken(email, password, saveme);

  }


  // Ce connecter et recupere le token
  getToken(email: string, password: string, saveme: boolean){

    let msgToken: ApicallInterface|undefined;

    let bodyNoJson:any;

    this.ipService.getMyIp(this.urlIp).subscribe(reponseTyroIp => {


        bodyNoJson = {
          "email_auth":email,
          "mdp_auth":password,
          "ip":reponseTyroIp.ip
        };

        this.authService.postLoginUser(bodyNoJson, this.setURL()).subscribe(reponseToken => {

          msgToken = reponseToken;

          if (msgToken?.message == "Connected"){

            this.token = msgToken.token

            this.getUserByToken(this.token, saveme);

          } else {

            console.log(msgToken?.message)
            // GERE LE MSG ERR

          }

        })

      },
      (error) => {

        console.error("TyroIp : ", error);

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

            console.log(msgToken?.message)
            // GERE LE MSG ERR

          }

        })



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

        if (this.navbarComponent) {
          this.navbarComponent.updateConnect();
        } else {
          console.error('Le composant navbar n\'a pas été initialisé correctement.');
        }

        if (this.router.url == "/account"){
          this.router.navigate(['/']);
        }

        // this.router.navigate(['/']);


      } else {

        console.log(msgUser?.message)
        // GERE LE MSG ERR

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

  //SET URL API
  setURL():string {

    if (this.AppEnv == "DEV"){
      return this.urlApiDev;
    } else if (this.AppEnv == "PROD") {
      return this.urlApiProd;
    } else if (this.AppEnv == "PRODMAX") {
      return this.urlApiProdMax;
    } else {
      return this.urlApiDevMax;
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

  getYourIp(){

    this.ipService.getMyIp(this.urlIp).subscribe(reponseTyroIp => {

      return reponseTyroIp.ip;

    });

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
    if ( this.userConnected?.themeColor){
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur de notre serveur',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected.themeColor
      })
    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur de notre serveur',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: this.colorDefault
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
  togglePin(myGameHistorique: HistoryMyGameInterface) {

    myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;

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
            text: this.gameSelected?.name + ' a bien été épinglé',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        } else {
          myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
          Swal.fire({
            title: 'Echec!',
            text: this.gameSelected?.name + ' n\'a pas pu être épinglé',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        }
      }, error => {
        myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
        this.erreurSubcribe()
      });
  }

  /*
  *
  * FOR MODAL
  *
  * */

  gameSelected: GameInterface|undefined;
  viewMyGame:HistoryMyGameInterface|undefined;
  searchResults: GameInterface[] | undefined;
  noPlateform: { name: string; id: number } = {
    id: 99999,
    name: "Other"
  }


  addNote(form:NgForm) {

    // console.log(form.value);

    if (form.value['noteGame'] >= 0 && form.value['noteGame'] <= 20){

      let noteGame = form.value['noteGame'];

      let bodyNoJsonMyGameNote: any = {
        "id_game":this.gameSelected?.id,
        "note":noteGame,
      };

      const bodyMyGameNote = JSON.stringify(bodyNoJsonMyGameNote);

      this.histoireMyGameService.postNoteMyGame(bodyMyGameNote, this.setURL(), this.createCorsToken()).subscribe(reponseMyGameNoteAdd => {

        // console.log(reponseMyGameNoteAdd);
        if (reponseMyGameNoteAdd.message == "add note is game"){
          Swal.fire({
            title: 'Succès!',
            text: 'La note de ' + this.gameSelected?.name + ' a bien été ajoutée',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        } else if (reponseMyGameNoteAdd.message == "game not in collection"){
          Swal.fire({
            title: 'Attention!',
            text: 'Mettez le jeux dans votre collection pour le noté',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        } else if (reponseMyGameNoteAdd.message == "note no valide"){
          Swal.fire({
            title: 'Attention!',
            text: 'La note est invalide',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajoute de la note',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        }

      }, (error) => { this.erreurSubcribe() });

    } else {
      Swal.fire({
        title: 'Attention!',
        text: 'La note est invalide',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.userConnected?.themeColor
      })
    }
  }

  addGame(form: NgForm) {

    // console.log(form.value)

    let is_pinned = form.value['pinnedGame'];
    if (is_pinned == "") {
      is_pinned = false;
    }

    let is_wishlist = form.value['whishListGame']
    if (is_wishlist == "") {
      is_wishlist = false;
    }

    let buywhere_id = form.value['buyWhere'];
    if (buywhere_id == "") {
      buywhere_id = undefined;
    }

    let buy_at = form.value['buyAt']
    if (buy_at == "") {
      buy_at = undefined;
    }

    let plateform_id = form.value['plateform_id'];
    console.log(plateform_id);
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
        confirmButtonColor: this.userConnected?.themeColor
      })

    } else {

      let bodyNoJsonMyGame: any = {
        "id_game": this.gameSelected?.id,
        "is_pinned": is_pinned,
        "is_wishlist": is_wishlist,
        "buywhere_id": buywhere_id,
        "buy_at": buy_at,
        "id_plateform":plateform_id
      };
      const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);
      // console.log(bodyMyGame);

      this.histoireMyGameService.postMyGame(bodyMyGame, this.setURL(), this.createCorsToken()).subscribe(reponseMyGameAdd => {
        if (reponseMyGameAdd.message == "add game is collection") {

          Swal.fire({
            title: 'Succès!',
            text: this.gameSelected?.name + ' à bien été ajouter à votre profil.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })

          // Actualiser la liste des jeux après l'ajout
          if (this.userConnected) {
            // this.profilePrivateComponet.myGameByUserAfterAddGame(this.userConnected.id);
          }
        } else if (reponseMyGameAdd.message == "has already been added") {
          Swal.fire({
            title: 'Attention!',
            text: 'Le jeux est déjà dans votre collection',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        } else {
          console.error(reponseMyGameAdd);
          Swal.fire({
            title: 'Erreur!',
            text: 'Échec de l\'ajout d\'un jeux',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.userConnected?.themeColor
          })
        }
      }, (error) => { this.erreurSubcribe() })

    }
  }

  onSubmitSearch(form: NgForm): void {
    const searchValue = form.value['searchValue'];
    this.gameService.searchGames(searchValue, 5, this.setURL()).subscribe(
      (results: GameInterface[]) => {
        this.searchResults = results;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur s\'est produite lors de la recherche',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.userConnected?.themeColor
        })

      }
    );
  }

  selectGame(game: GameInterface) {
    this.gameSelected = game;
    console.log(this.gameSelected);
  }

  deleteMyGame(idOneMyGame:number) {
    if (idOneMyGame) {
      this.histoireMyGameService.deleteMyGame(idOneMyGame, this.setURL(), this.createCorsToken()).subscribe(reponseApi => {
        if (reponseApi.message == 'delete success') {

          Swal.fire({
            title: 'Succès!',
            text: 'Le jeu a été retiré de votre collection.',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor
          })

          this.router.navigateByUrl('/mygame')
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur s\'est produite lors de la suppression du jeu.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.userConnected?.themeColor
          })
        }
      }, (error) => this.erreurSubcribe())

    }
  }


  /*
  *
  * SYSTEME LANG
  *
  * */

  lang:string = "fr";

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
