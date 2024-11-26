import {Component, OnInit} from '@angular/core';
import {PlateformInterface} from "../../-interface/plateform.interface";
import {PlateformService} from "../../-service/plateform.service";
import {AppComponent} from "../../app.component";
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {UserRateInterface} from "../../-interface/user-rate.interface";
import {UserRateService} from "../../-service/user-rate.service";
import {GameInterface} from "../../-interface/game.interface";

@Component({
  selector: 'app-recent-view',
  templateUrl: './recent-view.component.html',
  styleUrls: ['./recent-view.component.css']
})
export class RecentViewComponent implements OnInit {

  constructor(private plateformService: PlateformService,
              private histoireMyGameService: HistoryMyGameService,
              private userRateService: UserRateService,
              private app:AppComponent) {}

  plateformsUser: PlateformInterface[] | undefined;
  userConnected: UserInterface | undefined;
  isColor: string = this.app.colorDefault;

  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  userRatingAll: UserRateInterface[] | undefined;

  ngOnInit(){
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.isColor = this.userConnected.themeColor;
      this.myPlateforme(this.userConnected.id);
      this.myGameByUser(this.userConnected.id);
    }

  }

  myPlateforme(id:number){
    this.plateformService.getPlateformWithUser(id, this.app.setURL()).subscribe((reponsePlateformUser: {message:string, result:PlateformInterface[]}) => {
      if (reponsePlateformUser.message == "good") {
        this.plateformsUser = reponsePlateformUser.result;
      }
    })
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
        console.log(this.myGameHistoriqueAll);
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });

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

  getPinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => game.myGame.is_pinned) ?? [];
  }

  getUnpinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => !game.myGame.is_pinned) ?? [];
  }

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

  /* FOR MODAL */
  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
  }
  setModal(game: GameInterface){
    this.app.gameSelected = game;
  }

}
