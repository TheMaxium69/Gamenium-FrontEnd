import {Component, Input, OnInit} from '@angular/core';
import {GameInterface} from "../../-interface/game.interface";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.css']
})
export class CardGameComponent implements OnInit {

  @Input()
  public game: GameInterface|null = null;

  @Input()
  public userColor: string|null = null;

  constructor(protected app:AppComponent) { }

  ngOnInit() {

  }

}
