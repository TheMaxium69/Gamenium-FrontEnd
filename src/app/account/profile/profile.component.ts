import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {UserInterface} from "../../-interface/user.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  userConnected:UserInterface|undefined;

  constructor(private app: AppComponent) { }


  ngOnInit() {

    this.userConnected = this.app.userConnected;

  }


}
