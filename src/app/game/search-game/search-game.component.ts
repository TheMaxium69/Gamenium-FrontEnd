import { Component, OnInit } from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';


@Component({
  selector: 'app-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent implements OnInit {
  games: GameInterface[] = [];
  searchValue: string = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {

  }



  onSearch(): void {
    if (this.searchValue.trim() !== '') {
      this.gameService.searchGames(this.searchValue).subscribe((results) => {
        this.games = results;
      });
    } else {

    }
  }
}