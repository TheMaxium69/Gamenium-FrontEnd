import { Component, OnInit } from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.interface.component.html',
  styleUrls: ['./game.interface.component.css'],
})
export class GameInterfaceComponent implements OnInit {
  games: GameInterface[] = [];
  searchValue: string = '';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames(): void {
    this.gameService.getAllGames().subscribe((games) => {
      this.games = games;
    });
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
