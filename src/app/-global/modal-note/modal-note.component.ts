import { Component } from '@angular/core';
import {DetailGameComponent} from "../../game/detail-game/detail-game.component";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-modal-note',
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.css']
})
export class ModalNoteComponent {

  constructor(
    protected detailGame: DetailGameComponent,
    protected app:AppComponent,
  ) {
  }

}
