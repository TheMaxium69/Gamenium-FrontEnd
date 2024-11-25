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

    })

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

  /*
  *
  * FOR MODAL
  *
  * */

  gameSelected: GameInterface|undefined;
  viewMyGame:HistoryMyGameInterface|undefined;
  searchResults: GameInterface[] | undefined;


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

    console.log(form.value)

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

    let bodyNoJsonMyGame: any = {
      "id_game": this.gameSelected?.id,
      "is_pinned": is_pinned,
      "is_wishlist": is_wishlist,
      "buywhere_id": buywhere_id,
      "buy_at": buy_at
    };
    const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);
    console.log(bodyMyGame);

    // this.histoireMyGameService.postMyGame(bodyMyGame, this.setURL(), this.createCorsToken()).subscribe(reponseMyGameAdd => {
    //   if (reponseMyGameAdd.message == "add game is collection") {
    //
    //     Swal.fire({
    //       title: 'Succès!',
    //       text: this.gameSelected?.name + ' à bien été ajouter à votre profil.',
    //       icon: 'success',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.userConnected?.themeColor
    //     })
    //
    //     // Actualiser la liste des jeux après l'ajout
    //     if (this.userConnected) {
    //       // this.profilePrivateComponet.myGameByUserAfterAddGame(this.userConnected.id);
    //     }
    //   } else if (reponseMyGameAdd.message == "has already been added") {
    //     Swal.fire({
    //       title: 'Attention!',
    //       text: 'Le jeux est déjà dans votre collection',
    //       icon: 'warning',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.userConnected?.themeColor
    //     })
    //   } else {
    //     console.error(reponseMyGameAdd);
    //     Swal.fire({
    //       title: 'Erreur!',
    //       text: 'Échec de la mise à jour de la photo de profil',
    //       icon: 'error',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.userConnected?.themeColor
    //     })
    //   }
    // }, (error) => { this.erreurSubcribe() })
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
  }




}
