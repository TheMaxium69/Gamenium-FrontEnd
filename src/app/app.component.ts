import {Component, ViewChild} from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import {UserInterface} from "./-interface/user.interface";
import {AuthService} from "./-service/auth.service";
import {ApicallInterface} from "./-interface/apicall.interface";
import {Router} from "@angular/router";
import {NavbarComponent} from "./-global/navbar/navbar.component";
import {LoginComponent} from "./account/login/login.component";
import {PageAccountComponent} from "./account/page-account/page-account.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}


  /******************************************************************************************************************
   *
   * VARIABLE GLOBAL
   *
   * ******************************************************************************************************************/


  AppEnv: string = "DEV"; // DEV or PROD
  urlApiDev: string = "https://127.0.0.1:8000";
  urlApiProd: string = "http://gamenium.fr:8000";
  isLoggedIn: boolean = false;
  token: string|any;
  userConnected: UserInterface|any;
  curentDate: Date = new Date();


  /******************************************************************************************************************
   *
   * CONNEXION
   *
   * ******************************************************************************************************************/

  // DECONNEXION
  loggout(){

    this.isLoggedIn = false;
    this.token = undefined;
    this.userConnected = undefined;
    this.router.navigate(['/']);

  }

  //LOGIN
  login(email: string, password: string, saveme: boolean) {

    this.getToken(email, password);

  }


  // Ce connecter et recupere le token
  getToken(email: string, password: string){

    let msgToken: ApicallInterface|undefined;

    this.authService.postLoginUser(email, password, this.setURL()).subscribe(reponseToken => {

      msgToken = reponseToken;

      if (msgToken?.message == "Connected"){

        this.token = msgToken.token

        this.getUserByToken(this.token);

      } else {

        console.log(msgToken?.message)
        // GERE LE MSG ERR

      }

    })

  }

  // Recupere les information grace au token
  getUserByToken(token: string){

    let msgUser:ApicallInterface|undefined

    this.authService.postLoginToken(token, this.setURL()).subscribe(reponseUser => {

      msgUser = reponseUser;

      if (msgUser?.message == "Connected"){

        this.userConnected = msgUser.result;
        this.isLoggedIn = true;

        if (this.navbarComponent) {
          this.navbarComponent.updateConnect();
        } else {
          console.error('Le composant navbar n\'a pas été initialisé correctement.');
        }

        this.router.navigate(['/']);

      } else {

        console.log(msgUser?.message)
        // GERE LE MSG ERR

      }

    })

  }

  //Login Avec le Cookie
  loginWithCookie(cookieToken: string){

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
  createCorsToken(): {headers: HttpHeaders} {

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    const options: {headers: HttpHeaders}  = { headers: headers };

    return options;

  }

  //SET URL API
  setURL():string {

    if (this.AppEnv == "DEV"){
      return this.urlApiDev;
    } else {
      return this.urlApiProd;
    }

  }






}
