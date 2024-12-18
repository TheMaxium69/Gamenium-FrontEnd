import {Component, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
import { ViewService } from 'src/app/-service/view.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';

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

  //Pour les jeux communs
  userConnected: UserInterface | undefined;
  userConnectedGame: HistoryMyGameInterface[] | undefined ;
  commonGame : HistoryMyGameInterface [] | undefined;
  originalGameHistoriqueAll : HistoryMyGameInterface[] | undefined;
  isCommonView:boolean = false;

  // Pour la recherche
  searchQuery: string = '';
  filteredGames: HistoryMyGameInterface[] = []; // liste des jeux filtré
  sortOption: string = ''; // Tri par défaut
  isFilterDropdownOpen: boolean = false; // Control la visibilité du dropdown

  isLoading:boolean = true;

  // Pour le responsive de la tabGame
  innerWidth: number = window.innerWidth;
  classContainer: string = "container";

  constructor(protected app:AppComponent,
              private myGameService:HistoryMyGameService,
              private userRateService:UserRateService,
              private route: ActivatedRoute,
              private viewService: ViewService,
              private profileService:ProfilService,
              private histoireMyGameService:HistoryMyGameService
  ) {
  }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');
    this.userConnected = this.app.userConnected;


    this.myGameByUser(this.profileId);

    if(this.userConnected) {
      this.myGameByUser(this.userConnected.id);
    }

    this.route.paramMap.subscribe(params => {
      const newTask = params.get('task');
      if (newTask !== this.plateformeId) {
        this.plateformeId = newTask;
        this.task = this.plateformeId;
        this.loadProfil();
      }
    });

     // initialisation de la valeur classContainer pour responsive TabMyGame
     if (this.innerWidth <= 991) {
      this.classContainer = "container-fluid"
    } else {
      this.classContainer = "container"
    }

  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.loadProfil()
    }
  }

  // responsive de tabMyGame
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 991) {
          this.classContainer = "container-fluid"
      } else {
          this.classContainer = "container"
        }
  }


  loadProfil(){

    this.getInfoProfile(this.profileId);


  }

  

  load(){
    this.isCommonView = false;
    if (this.profilSelected) {

      // Set la color
      if (this.profilSelected.themeColor){
        this.isColor = this.profilSelected.themeColor;
      }
      if (this.task === "common-games") {
        this.isCommonView = true;



        //
        // this.filteredGames = this.commonGame || [];
        // console.log("JEUX FILTRER EN BAS ")
        // console.log(this.filteredGames);
        //
        // console.log(this.originalGameHistoriqueAll)
      }
      // Set la recher
      else if (this.task){
        this.myGameByUserWithPlateform(this.profilSelected.id, this.plateformeId);

      }

    }
  }


  myGameByUserWithPlateform(id_user: number, id_plateform:number): void {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        // this.HistoireMyGameByUserByPlateform = responseMyGame.result || [];
        this.myGameHistoriqueAll = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime()) || [];
        this.filterGames();
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

  myGameByUser(id_user:number): void {

      this.myGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
        if (responseMyGame.message === "good") {
          if (id_user === this.userConnected?.id) {
            // on save les jeux de l'user connecté
            this.userConnectedGame = responseMyGame.result || [];
            // console.log("Jeux de l'user connecter", this.userConnectedGame);
          } else {
            // on save les jeux lié au profil
            this.myGameHistoriqueAll = responseMyGame.result?.sort((a, b) =>
              new Date(b.myGame.added_at).getTime() - new Date(a.myGame.added_at).getTime()
            ) || [];
            // on save une copie de ce tableau
            this.originalGameHistoriqueAll = [...this.myGameHistoriqueAll];
            // console.log("Jeux lié a ce profil", this.myGameHistoriqueAll);
          }


          if(this.userConnected?.id != id_user){
            this.addViewProfile(this.profileId);
          }
        } else {
          console.log("Pas de jeux pour l'utilisateur courrant", id_user);
        }

        this.isLoading = false;
        this.findCommonGames();

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

  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
    if (this.profilSelected?.themeColor){
      document.documentElement.style.setProperty('--color-variable', this.profilSelected.themeColor);
    }
  }


  // recup les jeux pin
getPinnedGames(): HistoryMyGameInterface[] {
    if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
      return [];
    }
    if (this.isCommonView){
      return this.commonGame?.filter(game => game.myGame.is_pinned) ?? [];
    } else {
      return this.myGameHistoriqueAll?.filter(game => game.myGame.is_pinned) ?? [];
    }
}

// recup jeux unpin
getUnpinnedGames(): HistoryMyGameInterface[] {
    if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
      return [];
    }
    if (this.isCommonView){
        return this.commonGame?.filter(game => !game.myGame.is_pinned) ?? [];
    } else {
      return this.myGameHistoriqueAll?.filter(game => !game.myGame.is_pinned) ?? [];
    }
}


// recupere tout les jeux quand un filtre ou une recherche est effectué
getAllGamesToDisplay(): HistoryMyGameInterface[] {
  if (this.searchQuery.trim() !== '' || this.isFilterApplied()) {
    return this.filteredGames ?? [];
  }
  return [];
}

filterGames(): void {
  if (this.isCommonView) {
    if (!this.commonGame) return;

    // console.log("COUCOU JE FILTRE BIEN")

    const query = this.searchQuery ? this.searchQuery.toLowerCase() : '';

    if (query) {
      this.filteredGames = this.commonGame.filter(game => {
        const gameName = game.myGame?.game?.name?.toLowerCase() || '';
        const platforms = game.myGame?.plateform?.name?.toLowerCase() || '';
        const year = game.myGame?.game?.expectedReleaseYear?.toString() || '';

        return (
          gameName.includes(query) ||
          platforms.includes(query) ||
          year.includes(query)
        );
      });
    } else {
      this.filteredGames = [...this.commonGame];
    }
  } else if (this.myGameHistoriqueAll) {

    const query = this.searchQuery ? this.searchQuery.toLowerCase() : '';

    if (query) {
      this.filteredGames = this.myGameHistoriqueAll.filter(game => {
        const gameName = game.myGame?.game?.name?.toLowerCase() || '';
        const platforms = game.myGame?.plateform?.name?.toLowerCase() || '';
        const year = game.myGame?.game?.expectedReleaseYear?.toString() || '';

        return (
          gameName.includes(query) ||
          platforms.includes(query) ||
          year.includes(query)
        );
      });
    } else {
      this.filteredGames = [...this.myGameHistoriqueAll];
    }
  }

  this.applySorting();
}




  // Toogle le dropdown
  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  // change le filtre de tri
  setSortOption(option: string): void {
    this.sortOption = option;
    this.filterGames();
    this.isFilterDropdownOpen = false;
  }

  //check si un filtre autre que celui par default est appliqué
  isFilterApplied(): boolean {
    return this.sortOption !== '';
  }

  // different filtre de tri
  applySorting(): void {
    if (!this.filteredGames) return;

    switch (this.sortOption) {
      case 'name-asc':
        this.filteredGames.sort((a, b) =>
          a.myGame?.game?.name?.localeCompare(b.myGame?.game?.name || '') || 0
        );
        break;

      case 'name-desc':
        this.filteredGames.sort((a, b) =>
          b.myGame?.game?.name?.localeCompare(a.myGame?.game?.name || '') || 0
        );
        break;

      case 'year-asc':
        this.filteredGames.sort((a, b) => {
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
        this.filteredGames.sort((a, b) => {
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
          this.filteredGames.sort((a, b) => new Date(a.myGame?.added_at).getTime() - new Date(b.myGame?.added_at).getTime());
          break;
        case 'added-desc':
          this.filteredGames.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime());
          break;

      default:
        break;
    }
  }

  // JEUX EN COMMUNS

  findCommonGames(): void {
    if (!this.originalGameHistoriqueAll || !this.userConnectedGame) {
      // console.log("Un des utilisateurs n'a pas de jeux");
      return;
    }

    this.commonGame = this.originalGameHistoriqueAll.filter(connectedGame =>
      this.userConnectedGame?.some(
        secondUserGame => secondUserGame.myGame.game.id === connectedGame.myGame.game.id && secondUserGame.myGame.plateform.id == connectedGame.myGame.plateform.id
      )
    );

    // console.log('Common games:', this.commonGame);
    // console.log("********************************************")


  }

  addViewProfile(id:number){
    setTimeout(() => {

      let bodyNoJson = {
        "id": id
      }

      let body = JSON.stringify(bodyNoJson);

      this.viewService.addProfileView(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseAddViewActu:ApicallInterface) => {
        if (reponseAddViewActu.message == "good"){
          console.log("+1 vue");
        }
      })

    }, this.app.deadlineView)
  }


}

