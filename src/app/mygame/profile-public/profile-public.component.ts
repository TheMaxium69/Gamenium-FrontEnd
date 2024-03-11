import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {UserRateService} from "../../-service/user-rate.service";
import {ActivatedRoute} from "@angular/router";
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  profileId: number|any;
  profilSelected: ProfilInterface | undefined;
  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  userRatingAll:UserRateInterface[]|undefined;

  constructor(private app:AppComponent,
              private myGameService:HistoryMyGameService,
              private userRateService:UserRateService,
              private route: ActivatedRoute,
              private profileService:ProfilService,
  ) {
  }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    this.myGameByUser(this.profileId);
    this.getInfoProfile(this.profileId);

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

  getInfoProfile(id:number){

    this.profileService.getProfilByUserId(id,this.app.setURL()).subscribe(responseProfil => {

      if (responseProfil.message == "good"){

        this.profilSelected = responseProfil.result;

      } else {

        console.log("err user not existing");

      }

    });

  }


}

