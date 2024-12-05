import { Component, OnInit } from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";
import { UserRateService } from 'src/app/-service/user-rate.service';
import { UserRateInterface } from 'src/app/-interface/user-rate.interface';
import { ProfilService } from 'src/app/-service/profil.service';
import { ProfilInterface } from 'src/app/-interface/profil.interface';
import { UserInterface } from 'src/app/-interface/user.interface';
import { UserService } from 'src/app/-service/user.service';
import { ProviderService } from 'src/app/-service/provider.service';
import { ProviderInterface } from 'src/app/-interface/provider.interface';


@Component({
  selector: 'app-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent implements OnInit{

  isLoggedIn:boolean|undefined;

  games: GameInterface[] = [];
  users: UserInterface[] = [];
  providers: ProviderInterface[] = [];
  searchValue: string = '';
  userRatingAll: UserRateInterface[] | undefined;
  fakeRates: number[] = [8, 14, 19, 13];
  userColor: string | undefined;
  profilSelected: ProfilInterface | undefined;
  nbMoreGame:number = 1;

  providerExact: ProviderInterface | null = null;

  constructor (
    private userRateService: UserRateService,
    private gameService: GameService,
    private userService: UserService,
    private providerService: ProviderService,
    protected app: AppComponent,
    private profileService: ProfilService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn) {
      this.updateConnect()
    }

    this.gameService.searchGames(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
      this.games = results;

      let element = document.getElementById("moreGameBTN");
      if (this.games.length == this.app.fetchLimit){
        if (element){
          element.style.display = "block";
        }
      } else {
        if (element){
          element.style.display = "none";
        }
      }
    });


  }

  updateConnect(): void {
    const userId = this.app.userConnected?.id;
    if (userId) {
      this.profileService.getProfilByUserId(userId, this.app.setURL()).subscribe(responseProfil => {
        if (responseProfil.message === "good") {
          this.profilSelected = responseProfil.result;
          if (this.profilSelected?.themeColor) {
            this.userColor = this.profilSelected.themeColor;
          }
        } else {
          console.error("Error: User profile not found");
        }
      });
    }
  }



  onSearch(): void {
    if (this.searchValue.trim() !== '') {
      this.router.navigate(['/search/game/' + this.searchValue.trim()]);
    } else {
      this.router.navigate(['/search/game/-']);
    }
  }

  onSearchTap(value:string): void {

    this.searchValue == value;
    this.nbMoreGame = 1;
    this.providerExact = null;

    this.gameService.searchGames(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
      this.games = results;

      let providersFetchLimit = this.app.fetchLimit - this.games.length;


      let element = document.getElementById("moreGameBTN");
      let provideUser = document.getElementById("provider-user");

      if (this.games.length >= this.app.fetchLimit) {
        if (element && provideUser){
          element.style.display = "block";
          provideUser.style.display = "none";
        }
      } else {
        if (element && provideUser){
          element.style.display = "none";
          provideUser.style.display = "block";

          this.providerService.searchProviders(this.searchValue, providersFetchLimit, this.app.setURL()).subscribe((results) => {
            this.providers = results;

            let userFetchLimit = providersFetchLimit - this.providers.length;

            // affiche les users si la limite de 50 objects (games + providers) n'a pas été atteinte et va jusqu'à 50 objects en tout (games + providers + users)
            this.userService.searchUsers(this.searchValue, userFetchLimit, this.app.setURL()).subscribe((results) => {
              this.users = results;
            });

          });
        }
      }
      
    });

    // ressort le provider avec le nom seulement identique
    this.providerService.searchProviders(this.searchValue, 1, this.app.setURL()).subscribe((responseProviders) => {
      responseProviders.forEach((responseProvider) => {
        if (responseProvider.tagName === this.searchValue) {
          this.providerExact = responseProvider;
        } 
      })
    });
    
  }

  // LIKE CARD ACTU SYSTEM

  // GESTION MOYENNE DES NOTES CARTES JEUX

  // getRatesByGame(id_game: number){
  //   this.userRateService.getRateByGame(id_game, this.app.setURL()).subscribe(responseRates => {
  //     if (responseRates.message == "good") {
  //       this.userRatingAll = responseRates.result;
  //     }
  //   })
  //   console.log(`Jeux: ${id_game}, Note: ${this.userRatingAll}`)
  // }

  rateAverage(tab: number[]): number{
    if(tab.length === 0){
      return 0;
    }
    const sum = tab.reduce((acc, val) => acc + val, 0);
    const result = sum / tab.length // -> average fake rates 13.5

    if (result - Math.round(result) >= 0.5) {
      return Math.round(sum) + 1
    } else {
      return Math.round(result)
    }
  }

  //Je pense qu'on peut faire une fonction avec comme param l'id du jeu. Dans cette fonction on récupère d'abord le tableau de note avec getRatesByGame() et ensuite on passe ce tableau de note dans rateAverage().


  moreGame(){

    this.nbMoreGame++
    let limit = this.nbMoreGame * this.app.fetchLimit;
    console.log(limit)

    this.gameService.searchGames(this.searchValue, limit, this.app.setURL()).subscribe((results) => {
      this.games = results;
      console.log(this.games.length)

      let element = document.getElementById("moreGameBTN");
      if (this.games.length == limit){
        if (element){
          element.style.display = "block";
        }
      } else {
        if (element){
          element.style.display = "none";
        }
      }

    });

  }

}
