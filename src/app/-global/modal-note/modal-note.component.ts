import {Component, OnDestroy} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'modal-note',
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.css']
})
export class ModalNoteComponent implements OnDestroy {

  constructor(
    protected app:AppComponent,
  ) { }

  ngOnDestroy() {
    this.app.gameSelected = undefined;
  }

}
