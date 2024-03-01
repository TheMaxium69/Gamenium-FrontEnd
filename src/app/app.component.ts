import { Component } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {



  /******************************************************************************************************************
   *
   * VARIABLE GLOBAL
   *
   * ******************************************************************************************************************/


  AppEnv: string = "DEV"; // DEV or PROD
  urlApiDev: string = "http://127.0.0.1:8000";
  urlApiProd: string = "http://gamenium.fr:8000";
  isLoggedIn: boolean = false;
  token: string|any;
  userConnected: any;
  curentDate: Date = new Date();


  /******************************************************************************************************************
   *
   * CONNEXION
   *
   * ******************************************************************************************************************/

  // DECONNEXION
  loggout(){

  }

  //LOGIN
  login(email: string, password: string, saveme: boolean){
    console.log(email, password, saveme)

  }

  // Ce connecter et recupere le token
  getToken(){

  }

  // Recupere les information grace au token
  getUserByToken(){

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
