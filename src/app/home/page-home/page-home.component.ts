import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private app:AppComponent,
              private router:Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.app.isLoggedIn
    this.app.currentUrl = this.router.url;

    if (!this.app.isLoggedIn){
      this.router.navigate(['/account']);
    }

    if (!this.app.isAccess){
      this.router.navigate(['/waiting']);
    }
  }

}
