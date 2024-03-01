import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.css']
})
export class PageAccountComponent implements OnInit {

  isLoggedIn:boolean|undefined;

  constructor( private app: AppComponent ) { }

  ngOnInit() {

    this.isLoggedIn = this.app.isLoggedIn;

  }


}
