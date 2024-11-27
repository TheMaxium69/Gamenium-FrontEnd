import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {UserRateService} from "../../-service/user-rate.service";
import {ActivatedRoute} from "@angular/router";
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";
import {PlateformService} from "../../-service/plateform.service";

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent  implements OnInit, OnChanges {

  profileId: number|any;
  plateformeId: number | any;
  task:any;
  profilSelected: ProfilInterface | undefined;
  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  userRatingAll:UserRateInterface[]|undefined;
  isColor: string = this.app.colorDefault;

  constructor(protected app:AppComponent,
              private myGameService:HistoryMyGameService,
              private userRateService:UserRateService,
              private route: ActivatedRoute,
              private profileService:ProfilService,
              private histoireMyGameService:HistoryMyGameService
  ) {
  }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    this.route.paramMap.subscribe(params => {
      const newTask = params.get('task');
      if (newTask !== this.plateformeId) {
        this.plateformeId = newTask;
        this.task = this.plateformeId;
        this.loadProfil();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.loadProfil()
    }
  }

  loadProfil(){

    this.getInfoProfile(this.profileId);


  }

  load(){
    if (this.profilSelected) {

      // Set la color
      if (this.profilSelected.themeColor){
        this.isColor = this.profilSelected.themeColor;
      }

      // Set la recher
      if (this.task){
        this.myGameByUserWithPlateform(this.profilSelected.id, this.plateformeId);
      } else {
        this.myGameByUser(this.profilSelected.id);
      }

      this.getUserRate(this.profilSelected.id)

    }
  }



  /* OBTENIR LES JEUX PAR PLATEFORME */
  myGameByUserWithPlateform(id_user: number, id_plateform:number) {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
      }
    });
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

        this.load();

      } else {

        console.log("err user not existing");

      }

    });

  }

  /* OBTENIR LES NOTES DE JEU */
  getUserRate(id_user: number){
    this.userRateService.getRateByUser(id_user, this.app.setURL()).subscribe(responseRates => {
      if (responseRates.message == "good") {
        this.userRatingAll = responseRates.result;
      }
    });
  }

  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
    if (this.profilSelected?.themeColor){
      document.documentElement.style.setProperty('--color-variable', this.profilSelected.themeColor);
    }
  }


  /* OBTENIR LES JEUX EPINGLES */
  getPinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => game.myGame.is_pinned) ?? [];
  }

  /* OBTENIR LES JEUX NON EPINGLES */
  getUnpinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => !game.myGame.is_pinned) ?? [];
  }

}

