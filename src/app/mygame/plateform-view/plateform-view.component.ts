import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ActivatedRoute} from "@angular/router";
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {PlateformInterface} from "../../-interface/plateform.interface";
import {PlateformService} from "../../-service/plateform.service";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {UserRateService} from "../../-service/user-rate.service";
import {GameInterface} from "../../-interface/game.interface";

@Component({
  selector: 'app-plateform-view',
  templateUrl: './plateform-view.component.html',
  styleUrls: ['./plateform-view.component.css']
})
export class PlateformViewComponent implements OnInit, OnChanges {

  userConnected: UserInterface | undefined;
  plateformeId: number | any;
  task:any;
  HistoireMyGameByUserByPlateform: HistoryMyGameInterface[] | undefined;
  userRatingAll: UserRateInterface[] | undefined;
  isColor: string = this.app.colorDefault;
  plateformsUser: PlateformInterface[] | undefined;

  constructor(private app:AppComponent,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private plateformService: PlateformService,
              private userRateService: UserRateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newTask = params.get('task');
      if (newTask !== this.plateformeId) {
        this.plateformeId = newTask;
        this.task = this.plateformeId;
        this.load();
        if (this.task == 'recent'){
          console.log("RECENT")
        }
      }
    });

  }

  load(){
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.isColor = this.userConnected.themeColor;
      this.myGameByUserWithPlateform(this.userConnected.id, this.plateformeId);
      this.myPlateforme(this.userConnected.id);
      this.getUserRate(this.userConnected.id)
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.load()
    }
  }

  /* OBTENIR TOUTE LES CONSOLE */
  myPlateforme(id:number){
    this.plateformService.getPlateformWithUser(id, this.app.setURL()).subscribe((reponsePlateformUser: {message:string, result:PlateformInterface[]}) => {
      if (reponsePlateformUser.message == "good") {
        this.plateformsUser = reponsePlateformUser.result;
      }
    })
  }

  /* OBTENIR LES JEUX PAR PLATEFORME */
  myGameByUserWithPlateform(id_user: number, id_plateform:number) {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.HistoireMyGameByUserByPlateform = responseMyGame.result;
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

  /* METHOD DU TOGGLE SUR BUTTON EPINGLE */
  togglePin(myGameHistorique: HistoryMyGameInterface) {
    // maj du pin localement
    myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;

    // Préparer le corps de la requête
    const body = JSON.stringify({
      id_game: myGameHistorique.myGame.game.id,
      is_pinned: myGameHistorique.myGame.is_pinned,
    });

    // Envoyer la requête au backend pour mettre à jour le statut is_pinned
    this.histoireMyGameService.updatePinMyGame(body, this.app.setURL(), this.app.createCorsToken())
      .subscribe(response => {
        if (response.message === 'game is pinned') {
          console.log('Statut épinglé mis à jour dans la base de données');
        } else {
          console.error('Échec de la mise à jour du statut épinglé :', response.message);
          // En cas d'erreur, on rétablit l'ancien statut
          myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
        }
      }, error => {
        console.error('Erreur lors de la mise à jour du statut épinglé :', error);
        // En cas d'erreur, on rétablit l'ancien statut
        myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
      });
  }


  /* OBTENIR LES JEUX EPINGLES */
  getPinnedGames(): HistoryMyGameInterface[] {
    return this.HistoireMyGameByUserByPlateform?.filter(game => game.myGame.is_pinned) ?? [];
  }

  /* OBTENIR LES JEUX NON EPINGLES */
  getUnpinnedGames(): HistoryMyGameInterface[] {
    return this.HistoireMyGameByUserByPlateform?.filter(game => !game.myGame.is_pinned) ?? [];
  }

  /* FOR MODAL */
  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
  }
  setModal(game: GameInterface){
    this.app.gameSelected = game;
  }

}
