import {Component, Input, OnInit} from '@angular/core';
import {GameInterface} from "../../-interface/game.interface";
import {AppComponent} from "../../app.component";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {UserRateService} from "../../-service/user-rate.service";

@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.css']
})
export class CardGameComponent implements OnInit {

  @Input()
  public game: GameInterface|null = null;

  @Input()
  public Hmg: HistoryMyGameInterface|null = null;

  userRatingAll: UserRateInterface[] | undefined;

  constructor(protected app:AppComponent,
              private userRateService:UserRateService) { }

  ngOnInit() {
    if (this.app.isLoggedIn) {
      this.getUserRate(this.app.userConnected.id)
    }
  }

  getUserRate(id_user: number){
    this.userRateService.getRateByUser(id_user, this.app.setURL()).subscribe(responseRates => {
      if (responseRates.message == "good") {
        this.userRatingAll = responseRates.result;
      }
    });
  }

  hasUserRatings(game_id: any): boolean {
    if (this.userRatingAll) {
      for (let userRating of this.userRatingAll) {
        if (userRating.game.id === game_id) {
          return true;
        }
      }
      return false;
    } else {
      return false
    }
  }

  /* FOR MODAL */
  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
  }
  setModal(game: GameInterface){
    this.app.gameSelected = game;
  }

}
