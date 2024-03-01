import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:boolean|undefined;

  constructor( private app: AppComponent ) { }

  ngOnInit() {

    this.isLoggedIn = this.app.isLoggedIn;

  }

  updateConnect() {

    this.isLoggedIn = this.app.isLoggedIn;

  }

}
