import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameInterface} from "../../-interface/game.interface";
import {GameService} from "../../-service/game.service";
import {UserInterface} from "../../-interface/user.interface";
import {UserService} from "../../-service/user.service";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {PostActuService} from "../../-service/post-actu.service";
import {ProviderInterface} from "../../-interface/provider.interface";
import {ProviderService} from "../../-service/provider.service";
import {AppComponent} from "../../app.component";
import { ProfilService } from 'src/app/-service/profil.service';
import { ProfilInterface } from 'src/app/-interface/profil.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { BadgeService } from 'src/app/-service/badge.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit{

  

  isLoggedIn:boolean|undefined;


  searchValue: string = '';
  searchType: string | null = '';

  games: GameInterface[] = [];
  users: UserInterface[] = [];
  postactus: PostActuInterface[] = [];
  providers: ProviderInterface[] = [];
  profilSelected: ProfilInterface | undefined;
  userColor: string | undefined;
  nbMoreGame:number = 1;

  fakeRates: number[] = [8, 14, 19, 13];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private userService: UserService,
    private postactuService: PostActuService,
    private providerService: ProviderService,
    private profileService: ProfilService,
    private badgeService: BadgeService,
    protected app: AppComponent
  ) {
  }

  ngOnInit(): void {

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn) {
      this.updateConnect()
    }

    let searchValueTemp = this.route.snapshot.paramMap.get('value');
    if (searchValueTemp && searchValueTemp !== '-'){
      this.searchValue = searchValueTemp;
    } else if (searchValueTemp == '-'){
      this.searchValue = '';
    }
    this.searchType = this.route.snapshot.paramMap.get('type');

    this.updateAll();

    console.log()

  }

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

  updateAll(){

    if (this.searchType == 'game'){
      this.searchGame()
    } else if (this.searchType == 'user'){
      this.searchUser()
    } else if (this.searchType == 'postactu'){
      this.searchPostActu()
    } else if (this.searchType == 'provider'){
      this.searchProvider()
    }

  }

  changeType(type:string) {
    this.searchType = type;
    if (!this.searchValue){
      this.router.navigate(['/search/'+ type +'/-']);
    } else {
      this.router.navigate(['/search/'+ type +'/' + this.searchValue]);
    }
    this.updateAll()
  }

  searchGame(): void {
    this.nbMoreGame = 1;
    this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.games = results;

      let element = document.getElementById("moreGameBTN");
      if (this.games.length == 100){
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

  searchUser(): void {
    this.userService.searchUsers(this.searchValue, 100, this.app.setURL()).subscribe(
      (results) => {
        
        const connectedUserId = this.app.userConnected?.id;
        this.users = results.filter((user) => user.id !== connectedUserId);
        console.log("Fetched Users:", this.users);
  
        // Fetch badges for each user with error handling
        const badgeRequests = this.users.map(user => 
          this.badgeService.getBadgeByUser(user.id, this.app.setURL()).pipe(
            catchError(error => {
              console.error(`Error fetching badges for user ${user.id}:`, error);
              // Return an observable with empty badges to prevent forkJoin from failing
              return of({ message: 'error', result: [] } as ApicallInterface);
            })
          )
        );
  
        // Execute all badge requests in parallel
        forkJoin(badgeRequests).subscribe(
          (badgeResponses: ApicallInterface[]) => {
            badgeResponses.forEach((badgeResponse, index) => {
              if (badgeResponse && badgeResponse.result) {
                this.users[index].badges = badgeResponse.result;
                console.log(`User ID ${this.users[index].id} Badges:`, this.users[index].badges);
              } else {
                this.users[index].badges = [];
                console.log(`User ID ${this.users[index].id} has no badges.`);
              }
            });
            console.log("Users after assigning badges:", this.users);
          },
          (error) => {
            console.error("Error fetching badges:", error);
          }
        );
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }


  searchPostActu(): void {

    this.postactuService.searchPostActus(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.postactus = results;
      console.log(this.postactus)
    });

  }

  searchProvider(): void {

    this.providerService.searchProviders(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.providers = results;
      console.log(this.providers)
    });

  }

  updateValue(value: string) {
    this.searchValue = value;

    this.router.navigate(['/search/'+ this.searchType +'/-']);

    this.updateAll();
  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

  moreGame(){

    this.nbMoreGame++
    let limit = this.nbMoreGame * 100;
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
  
  //PROVIDER 
  handleFollowed(providerId: number): void {
    console.log(`Provider followed with ID: ${providerId}`);
    const provider = this.providers.find((p) => p.id === providerId);
  }
  
  handleUnfollowed(providerId: number): void {
    console.log(`Provider unfollowed with ID: ${providerId}`);
    const provider = this.providers.find((p) => p.id === providerId);
  }
  
}
