import {Component, Input, OnInit} from '@angular/core';
import {GameInterface} from "../../-interface/game.interface";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-card-game-sub',
  templateUrl: './card-game-sub.component.html',
  styleUrls: ['./card-game-sub.component.css']
})
export class CardGameSubComponent implements OnInit{

  @Input()
  public game: GameInterface|null = null;

  constructor(protected app:AppComponent) { }

  ngOnInit() { }

}
