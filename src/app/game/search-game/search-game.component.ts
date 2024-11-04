import { Component, OnInit } from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";
import { UserRateService } from 'src/app/-service/user-rate.service';
import { UserRateInterface } from 'src/app/-interface/user-rate.interface';


@Component({
  selector: 'app-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent implements OnInit{

  games: GameInterface[] = [];
  searchValue: string = '';
  userRatingAll: UserRateInterface[] | undefined;

  constructor (
    private userRateService: UserRateService,
    private gameService: GameService,
    private app: AppComponent,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.games = results;
    });
  }

  onSearch(): void {

    if (this.searchValue.trim() !== '') {

      this.router.navigate(['/search/game/' + this.searchValue.trim()]);

    }
  }

  onSearchTap(value:string): void {

    this.searchValue == value;

    this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.games = results;
    });

  }

  // LIKE CARD ACTU SYSTEM

  // GESTION MOYENNE DES NOTES CARTES JEUX

  // getRatesByGame(id_game: number){
  //   this.userRateService.getRateByGame(id_game, this.app.setURL()).subscribe(responseRates => {
  //     if (responseRates.message == "good") {
  //       this.userRatingAll = responseRates.result;
  //     }
  //   })
  //   console.log(`Jeux: ${id_game}, Note: ${this.userRatingAll}`)
  // }
}
