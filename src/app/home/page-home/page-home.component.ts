import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private app:AppComponent) { }

  ngOnInit(): void {
    this.isLoggedIn = this.app.isLoggedIn
  }

}
