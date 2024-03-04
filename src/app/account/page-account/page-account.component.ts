import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.css']
})
export class PageAccountComponent implements OnInit {

  isLoggedIn:boolean|undefined;

  constructor( private app: AppComponent, private router: Router) { }

  ngOnInit() {

    this.isLoggedIn = this.app.isLoggedIn;

  }

  loggoutTest(){
    this.app.loggout();
  }


}
