import { Component } from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'modal-add-game-unselect',
  templateUrl: './modal-add-game-unselect.component.html',
  styleUrls: ['./modal-add-game-unselect.component.css']
})
export class ModalAddGameUnselectComponent {

  constructor(
    protected app:AppComponent,
  ) {
  }

}
