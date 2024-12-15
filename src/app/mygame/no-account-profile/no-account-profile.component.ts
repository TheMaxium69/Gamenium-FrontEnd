import { Component } from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-no-account-profile',
  templateUrl: './no-account-profile.component.html',
  styleUrls: ['./no-account-profile.component.css']
})
export class NoAccountProfileComponent {

  constructor(protected app:AppComponent) { }


}
