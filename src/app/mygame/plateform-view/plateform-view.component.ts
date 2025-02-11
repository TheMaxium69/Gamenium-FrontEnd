import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import { HistoryMyPlateformService } from 'src/app/-service/history-my-plateform.service';
import { HistoryMyPlatformInterface } from 'src/app/-interface/history-my-platform.interface';

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

  // Pour la recherche
  searchResults: GameInterface[] | undefined;
  searchValue: string = '';
  searchQuery: string = '';
  filteredGames: HistoryMyGameInterface[] = []; // liste des jeux filtré
  sortOption: string = ''; // Tri par défaut
  isFilterDropdownOpen: boolean = false; // Control la visibilité du dropdown

  isLoading:boolean = true;


  foundPlatform: PlateformInterface | undefined;
  foundHmp: HistoryMyPlatformInterface | undefined;

  constructor(protected app:AppComponent,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private plateformService: PlateformService,
              private myGameService: GameService,
              private userRateService: UserRateService,
              private historyMyPlatformService: HistoryMyPlateformService) {}

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

    if (this.app.userConnected) {
      if (this.task == "all"){
        this.myGameByUser(this.app.userConnected.id);
        this.btnPlatform = 'all';
      } else {
        this.myGameByUserWithPlateform(this.app.userConnected.id, this.plateformeId);
        this.getOneMyHmpByUserByPlatform(this.app.userConnected.id, this.plateformeId);
      }
      this.getUserRate(this.app.userConnected.id)
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.load()
    }
  }

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

  myGameByUserWithPlateform(id_user: number, id_plateform:number): void {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL(), this.app.createCorsToken()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        // this.HistoireMyGameByUserByPlateform = responseMyGame.result || [];
        this.HistoireMyGameByUserByPlateform = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime()) || [];
        this.filterGames();
        this.isLoading = false;
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

  myGameByUser(id_user: number): void {

    if (this.app.myGameAll){
      this.HistoireMyGameByUserByPlateform = this.app.myGameAll;
    } else {
      this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL(), this.app.createCorsToken()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
        if (responseMyGame.message == "good") {
          this.HistoireMyGameByUserByPlateform = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime()) || [];
          this.app.myGameAll = this.HistoireMyGameByUserByPlateform;
          this.filterGames();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          console.log("pas de jeux trouvé pour l'utilisateur")
        }
      });
    }

  }

  /* OBTENIR LES NOTES DE JEU */
  getUserRate(id_user: number){
    if (this.app.userRatingAll){
      this.userRatingAll = this.app.userRatingAll;
    } else {
      this.userRateService.getRateByUser(id_user, this.app.setURL(), this.app.createCorsToken()).subscribe(responseRates => {
        if (responseRates.message == "good") {
          this.userRatingAll = responseRates.result;
        }
      });
    }
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




  /* GESTION DU HMP */
  btnPlatform: string|null = null;
  getOneMyHmpByUserByPlatform(id_user: number, id_plateform: number){
    	this.historyMyPlatformService.getOneMyHmpByUserByPlatform(id_user, id_plateform, this.app.setURL(), this.app.createCorsToken()).subscribe((responseMyPlateform: {message: string, result: HistoryMyPlatformInterface, result2: PlateformInterface}) => {

        if(responseMyPlateform.message == "good"){
          this.foundHmp = responseMyPlateform.result;
          this.foundPlatform = this.foundHmp.myPlateform.plateform;
          this.btnPlatform = 'edit';
        } else if (responseMyPlateform.message == "hmp not found") {
          this.btnPlatform = 'add';
          this.foundHmp = undefined;
          this.foundPlatform = responseMyPlateform.result2;
        }
      })
  }

}
