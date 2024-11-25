import { Component } from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'modal-add-game',
  templateUrl: './modal-add-game.component.html',
  styleUrls: ['./modal-add-game.component.css']
})
export class ModalAddGameComponent {

  constructor(protected app:AppComponent) {
  }

}
