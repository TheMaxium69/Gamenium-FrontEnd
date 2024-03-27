import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from "../../app.component";
import { HistoryMyGameService } from "../../-service/history-my-game.service";
import { UserInterface } from "../../-interface/user.interface";
import { HistoryMyGameInterface } from "../../-interface/history-my-game.interface";
import { UserRateService } from "../../-service/user-rate.service";
import { UserRateInterface } from "../../-interface/user-rate.interface";
import { ActivatedRoute } from "@angular/router";
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
  searchResults: GameInterface[] | undefined; // Propriété pour stocker les résultats de la recherche de jeux
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
              private renderer: Renderer2) { }

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

  existingPinned(): boolean {
    if (this.myGameHistoriqueAll) {
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

  gameSelected: GameInterface | undefined;

  selectGame(game: GameInterface) {
    this.gameSelected = game;
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
        console.log(this.gameSelected?.name, " à été ajouter");
      } else {
        console.log(reponseMyGameAdd);
      }
    })
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
        } else {
          console.log(reponseMyGameNoteAdd);
        }
      });
    } else {
      console.log("note invalide");
    }
  }

  pinnedGame(game: GameInterface) {
    // Logique pour épingler un jeu, si nécessaire
  }

  unpinnedGame(game: GameInterface) {
    // Logique pour désépingler un jeu, si nécessaire
  }

  getInfoProfile(id: number) {
    this.profileService.getProfilByUserId(id, this.app.setURL()).subscribe(responseProfil => {
      if (responseProfil.message == "good") {
        this.profilSelected = responseProfil.result;
        if (this.profilSelected?.themeColor) {
          this.isColor = this.profilSelected.themeColor;
        }
        if (this.profilSelected?.picture) {
          this.isPp = this.profilSelected.picture.url;
        }
      } else {
        console.log("err user not existing");
      }
    });
  }

  // Méthode pour effectuer la recherche de jeux
  searchGames(searchValue: string, limit: number, url: string): void {
    this.myGameService.searchGames(searchValue, limit, url).subscribe(
      (results: GameInterface[]) => {
        this.searchResults = results;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
      }
    );

  }

  // Méthode appelée lors de la soumission du formulaire de recherche
  onSubmitSearch(form: NgForm) {
    const searchValue = form.value['searchValue'];
    const limit = 5;
    const url = 'https://127.0.0.1:8000';
    this.searchGames(searchValue, limit, url);
  }
}
