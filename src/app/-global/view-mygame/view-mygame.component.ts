import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'modal-view-mygame',
  templateUrl: './view-mygame.component.html',
  styleUrls: ['./view-mygame.component.css']
})
export class ViewMygameComponent implements OnInit {

  constructor(
    protected app:AppComponent,) {}


  ngOnInit() {

  }

  deleteGame(gameId: string | undefined) {
    console.log('delete game: ' + gameId)
  }
}
