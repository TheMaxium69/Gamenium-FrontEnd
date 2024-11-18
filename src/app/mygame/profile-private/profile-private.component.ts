import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from "../../app.component";
import { HistoryMyGameService } from "../../-service/history-my-game.service";
import { UserInterface } from "../../-interface/user.interface";
import { HistoryMyGameInterface } from "../../-interface/history-my-game.interface";
import { UserRateService } from "../../-service/user-rate.service";
import { UserRateInterface } from "../../-interface/user-rate.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { GameInterface } from "../../-interface/game.interface";
import { ProfilInterface } from "../../-interface/profil.interface";
import { ProfilService } from "../../-service/profil.service";
import { GameService } from 'src/app/-service/game.service';

@Component({
  selector: 'app-profile-private',
  templateUrl: './profile-private.component.html',
  styleUrls: ['./profile-private.component.css']
})
export class ProfilePrivateComponent implements OnInit {

  userConnected: UserInterface | undefined;
  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  userRatingAll: UserRateInterface[] | undefined;
  task: string | any;
  searchResults: GameInterface[] | undefined;
  searchValue: string = '';
  isColor: string = this.app.colorDefault;
  isPp: string | undefined;
  profilSelected: ProfilInterface | undefined;

  constructor(private app: AppComponent,
              private myGameService: GameService,
              private userRateService: UserRateService,
              private profileService: ProfilService,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private renderer: Renderer2,
              private router: Router) { }


  ngOnInit(): void {
    this.task = this.route.snapshot.paramMap.get('task');
    this.userConnected = this.app.userConnected;
    if (this.userConnected) {
      this.myGameByUser(this.userConnected.id);
      this.getInfoProfile(this.userConnected.id);
    }
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      console.log(responseMyGame);
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
      } else {
        console.log("pas de jeux")
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

  /* VERIF SI IL Y A DES JEUX EPINGLES */
  hasPinnedGames(): boolean {
    return this.myGameHistoriqueAll?.some(game => game.myGame.is_pinned) ?? false;
  }

  /* OBTENIR LES JEUX EPINGLES */
  getPinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => game.myGame.is_pinned) ?? [];
  }

  /* OBTENIR LES JEUX NON EPINGLES */
  getUnpinnedGames(): HistoryMyGameInterface[] {
    return this.myGameHistoriqueAll?.filter(game => !game.myGame.is_pinned) ?? [];
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
    this.histoireMyGameService.updateMyGame(body, this.app.setURL(), this.app.createCorsToken())
      .subscribe(response => {
        if (response.message === 'Jeu mis à jour') {
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

  existingPinned(): boolean {
    if (this.myGameHistoriqueAll) {
      for (let myGame of this.myGameHistoriqueAll) {
        if (myGame.myGame.is_pinned) {
          return true;
        }
      }
      return false;
    } else {
      return false
    }
  }

  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
    console.log("MyGame sélectionné avec l'ID :", historyMyGameInterface.id);
  }

  unselectViewMyGame() {
    this.app.viewMyGame = undefined;
  }


  gameSelected: GameInterface | undefined;

  selectGame(game: GameInterface) {
    this.gameSelected = game;
    console.log("Jeu sélectionné avec l'ID :", game.id);
  }

  unselectGame() {
    this.gameSelected = undefined;
  }

  addGame(form: NgForm) {
    let is_pinned = form.value['pinnedGame'];
    if (is_pinned == "") {
      is_pinned = false;
    }
    let bodyNoJsonMyGame: any = {
      "id_game": this.gameSelected?.id,
      "is_pinned": is_pinned,
    };
    const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);
    this.histoireMyGameService.postMyGame(bodyMyGame, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameAdd => {
      if (reponseMyGameAdd.message == "add game is collection") {
        console.log(this.gameSelected?.name, " a été ajouté");
        // Actualiser la liste des jeux après l'ajout
        if (this.userConnected) {
          this.myGameByUser(this.userConnected.id);
        }
      } else {
        console.log(reponseMyGameAdd);
      }
    })
  }

  deleteFromMyGame(gameId: number) {
    console.log(gameId)
  }

  addNote(form: NgForm) {
    console.log(form.value);
    if (form.value['noteGame'] >= 0 && form.value['noteGame'] <= 20) {
      let noteGame = form.value['noteGame'];
      let bodyNoJsonMyGameNote: any = {
        "id_game": this.gameSelected?.id,
        "note": noteGame,
      };
      const bodyMyGameNote = JSON.stringify(bodyNoJsonMyGameNote);
      this.histoireMyGameService.postNoteMyGame(bodyMyGameNote, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameNoteAdd => {
        if (reponseMyGameNoteAdd.message == "add note is game") {
          console.log("note ajoutée")
          let noteSpanGame = document.getElementById("noteGame" + this.gameSelected?.id)
          if (noteSpanGame) {
            noteSpanGame.innerHTML = noteGame;
          }
          const inputNote: HTMLElement | null = document.getElementById('inputNote');
          if (inputNote) {
            this.renderer.setProperty(inputNote, 'value', '');
          }
          // Actualiser la liste des notes après l'ajout
          if (this.userConnected) {
            this.myGameByUser(this.userConnected.id);
          }
        } else {
          console.log(reponseMyGameNoteAdd);
        }
      });
    } else {
      console.log("note invalide");
    }
  }

  getInfoProfile(id: number) {
    this.profileService.getProfilByUserId(id, this.app.setURL()).subscribe(responseProfil => {
      if (responseProfil.message == "good") {
        this.profilSelected = responseProfil.result;
        if (this.profilSelected?.themeColor) {
          this.isColor = this.profilSelected.themeColor;
        }
        if (this.profilSelected?.picture) {
          this.isPp = this.profilSelected.picture;
        }
      } else {
        console.log("err user not existing");
      }
    });
  }

  // Méthode pour effectuer la recherche de jeux
  onSubmitSearch(form: NgForm): void {
    const searchValue = form.value['searchValue'];
    this.myGameService.searchGames(searchValue, 5, this.app.setURL()).subscribe(
      (results: GameInterface[]) => {
        this.searchResults = results;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
      }
    );
  }

  goToGame(gameId: number): void {
    this.router.navigate(['/game', gameId]);
  }
}

