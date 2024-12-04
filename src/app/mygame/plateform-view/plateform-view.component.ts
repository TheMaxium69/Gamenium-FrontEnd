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
import { NgForm } from '@angular/forms';
import { GameService } from 'src/app/-service/game.service';

@Component({
  selector: 'app-plateform-view',
  templateUrl: './plateform-view.component.html',
  styleUrls: ['./plateform-view.component.css']
})
export class PlateformViewComponent implements OnInit, OnChanges {

  userConnected: UserInterface | undefined;
  plateformeId: number | any;
  task:any;
  HistoireMyGameByUserByPlateform: HistoryMyGameInterface[] = [];
  userRatingAll: UserRateInterface[] | undefined;
  isColor: string = this.app.colorDefault;
  plateformsUser: PlateformInterface[] | undefined;

  // Pour la recherche
  searchResults: GameInterface[] | undefined;
  searchValue: string = '';
  searchQuery: string = '';
  filteredGames: HistoryMyGameInterface[] = []; // liste des jeux filtré
  sortOption: string = ''; // Tri par défaut
  isFilterDropdownOpen: boolean = false; // Control la visibilité du dropdown


  constructor(protected app:AppComponent,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private plateformService: PlateformService,
              private myGameService: GameService,
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
      if (this.task == "all"){
        this.myGameByUser(this.userConnected.id);
      } else {
        this.myGameByUserWithPlateform(this.userConnected.id, this.plateformeId);
      }
      this.myPlateforme(this.userConnected.id);
      this.getUserRate(this.userConnected.id)
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.load()
    }
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

  // methode pour filtrer les jeux

  // Toogle le dropdown
  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  // filtre les jeux
  filterGames(): void {
    if (this.searchQuery.trim() !== '') {
      // applique les filtre de recherche
      let gamesToFilter = [...this.HistoireMyGameByUserByPlateform];
      const query = this.searchQuery.toLowerCase();
      gamesToFilter = gamesToFilter.filter(game => {
        const gameName = game.myGame?.game?.name?.toLowerCase() || '';
        const platforms = game.myGame?.plateform?.name?.toLowerCase()  || '';
        const year = game.myGame?.game?.expectedReleaseYear?.toString() || '';
        return gameName.includes(query) || platforms.includes(query) || year.includes(query);
      });
      this.filteredGames = gamesToFilter;
    }

    // applique le tri sur le bon tableau
    this.applySorting();
  }

  // change la methode de filtre
  setSortOption(option: string): void {
    this.sortOption = option;
    this.filterGames();
    this.isFilterDropdownOpen = false;
  }

  // fonction pour appliqué les filtres
  applySorting(): void {
    const arrayToSort = this.searchQuery.trim() !== '' ? this.filteredGames : this.HistoireMyGameByUserByPlateform;

    switch (this.sortOption) {
      case 'name-asc':
        arrayToSort.sort((a, b) => a.myGame?.game?.name?.localeCompare(b.myGame?.game?.name || '') || 0);
        break;
      case 'name-desc':
        arrayToSort.sort((a, b) => b.myGame?.game?.name?.localeCompare(a.myGame?.game?.name || '') || 0);
        break;
      case 'year-asc':
        arrayToSort.sort((a, b) => {
          const dateA = a.myGame?.game?.originalReleaseDate
            ? new Date(a.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          const dateB = b.myGame?.game?.originalReleaseDate
            ? new Date(b.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          return dateA - dateB;
        });
        break;
      case 'year-desc':
        arrayToSort.sort((a, b) => {
          const dateA = a.myGame?.game?.originalReleaseDate
            ? new Date(a.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          const dateB = b.myGame?.game?.originalReleaseDate
            ? new Date(b.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          return dateB - dateA;
        });
        break;
      case 'added-asc':
        arrayToSort.sort((a, b) => new Date(a.myGame?.added_at).getTime() - new Date(b.myGame?.added_at).getTime());
        break;
      case 'added-desc':
        arrayToSort.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime());
        break;
      default:
        break;
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

  // /* OBTENIR LES JEUX PAR PLATEFORME */
  // myGameByUserWithPlateform(id_user: number, id_plateform:number) {
  //   this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL()).subscribe(response => {
  //     if (response.message === "good") {
  //       // this.HistoireMyGameByUserByPlateform = response.result || [];
  //       this.filterGames();

  //     }
  //   });
  // }

  myGameByUserWithPlateform(id_user: number, id_plateform:number): void {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        // this.HistoireMyGameByUserByPlateform = responseMyGame.result || [];
        this.HistoireMyGameByUserByPlateform = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime()) || [];
        this.filterGames();
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        // this.HistoireMyGameByUserByPlateform = responseMyGame.result || [];
        this.HistoireMyGameByUserByPlateform = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime()) || [];
        this.filterGames();
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
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

  //check si un filtre autre que celui par default est appliqué
  isFilterApplied(): boolean {
    return this.sortOption !== '';
  }

  // récup jeu pin
  getPinnedGames(): HistoryMyGameInterface[] {
    // si aucun filtre appliqué et pas de mot de recherche on rend vide le tableau pour ne rien afficher dans la section pinned
    if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
      return [];
    }
    return this.HistoireMyGameByUserByPlateform?.filter(game => game.myGame.is_pinned) ?? [];
  }

  // récup jeu unpin
  getUnpinnedGames(): HistoryMyGameInterface[] {
    // si aucun filtre appliqué et pas de mot de recherche on rend vide le tableau pour ne rien afficher dans la section unpinned
    if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
      return [];
    }
    return this.HistoireMyGameByUserByPlateform?.filter(game => !game.myGame.is_pinned) ?? [];
  }

  // Method pour afficher tout les jeux si une recherche ou un filtre et appliqué
  getAllGamesToDisplay(): HistoryMyGameInterface[] {
    if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
      return this.searchQuery.trim() !== '' ? this.filteredGames : this.HistoireMyGameByUserByPlateform;
    }
    return [];
  }

  /* FOR MODAL */
  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
  }
  setModal(game: GameInterface){
    this.app.gameSelected = game;
  }

}
