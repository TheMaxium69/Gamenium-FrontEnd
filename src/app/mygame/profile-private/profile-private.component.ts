import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {UserRateService} from "../../-service/user-rate.service";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile-private',
  templateUrl: './profile-private.component.html',
  styleUrls: ['./profile-private.component.css']
})
export class ProfilePrivateComponent implements OnInit {

  userConnected: UserInterface | undefined;
  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  userRatingAll:UserRateInterface[]|undefined;
  task:string|any

  constructor(private app:AppComponent,
              private myGameService:HistoryMyGameService,
              private userRateService:UserRateService,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {


    this.task = this.route.snapshot.paramMap.get('task');

    this.userConnected = this.app.userConnected;
    if (this.userConnected){
      this.myGameByUser(this.userConnected.id);
    }

  }

  myGameByUser(id_user:number){

    this.myGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe(responseMyGame => {

      if (responseMyGame.message == "good"){
        this.myGameHistoriqueAll = responseMyGame.result;
      } else {
        console.log("pas de jeux")
      }

    });

    this.userRateService.getRateByUser(id_user, this.app.setURL()).subscribe(responseRates => {

      if (responseRates.message == "good"){
        this.userRatingAll = responseRates.result;
      }

    });

  }

  hasUserRatings(game_id: any):boolean {
    if (this.userRatingAll){
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

  existingPinned():boolean{
    if (this.myGameHistoriqueAll){
      for (let myGame of this.myGameHistoriqueAll) {
        if (myGame.is_pinned) {
          return true;
        }
      }
      return false;
    } else {
      return false
    }


  }

  addGame(){
    console.log("Un jeux doit être ajouter")
  }


}
