import { Component, OnInit } from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';
import {AppComponent} from "../../app.component";


@Component({
  selector: 'app-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent {
  games: GameInterface[] = [];
  searchValue: string = '';

  constructor(private gameService: GameService,
              private app: AppComponent) {}

  onSearch(): void {
    if (this.searchValue.trim() !== '') {
      this.gameService.searchGames(this.searchValue, this.app.setURL()).subscribe((results) => {
        this.games = results;
      });
    } else {

    }
  }

  onSearchTap(value:string): void {

    this.searchValue == value;

    console.log(this.searchValue)

      this.gameService.searchGames(this.searchValue, this.app.setURL()).subscribe((results) => {
        this.games = results;
      });

  }
}
