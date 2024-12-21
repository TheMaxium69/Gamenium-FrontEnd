import { Component } from '@angular/core';
import {AppComponent} from "../../app.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent {

  constructor(protected app: AppComponent) { }

}
