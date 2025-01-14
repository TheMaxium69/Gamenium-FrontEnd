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

  constructor( protected app: AppComponent, private router: Router) { }

  ngOnInit(): void {
    // this.app.currentUrl = this.router.url;
  }
}
