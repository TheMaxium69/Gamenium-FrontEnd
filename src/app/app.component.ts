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
    private ipService: IpService
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


  AppEnv: string = "DEVMAX"; // DEV or PROD or PRODMAX
  urlApiDev: string = "http://127.0.0.1:8000";
  urlApiDevMax: string = "https://127.0.0.1:8000";
  urlApiProd: string = "http://vps216.tyrolium.fr:8000";
  urlApiProdMax: string = "http://home.vps216.tyrolium.fr:8000";
  urlIp:string = "https://tyrolium.fr/Contenu/Php/ip.php?api=json"
  Debug:Boolean = true; // Active la view Serv and Local
  isLoggedIn: boolean = false;
  token: string|any;
  userConnected: UserInterface|any;
  curentDate: Date = new Date();

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






}
