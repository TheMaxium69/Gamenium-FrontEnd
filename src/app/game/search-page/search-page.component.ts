import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
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
import {catchError, forkJoin, of, Subject} from 'rxjs';
import { BadgeService } from 'src/app/-service/badge.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';
import {debounceTime, switchMap, takeUntil} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit, OnDestroy{

  /* USER*/
  isLoggedIn:boolean|undefined;
  userColor: string | undefined;

  /*search*/
  private unsubscribe$ = new Subject<void>();
  searchValue: string = '';
  searchType: string | null = '';

  /*GAME*/
  private searchGameSubject = new Subject<string>();
  games: GameInterface[] = [];
  nbMoreGame:number = 1;
  isGameLoading:boolean = true;
  /*PROFIL*/
  private searchProfilSubject = new Subject<string>();
  users: UserInterface[] = [];
  isProfilLoading:boolean = true;
  /*ACTU*/
  private searchActuSubject = new Subject<string>();
  postactus: PostActuInterface[] = [];
  isActuLoading:boolean = true;
  /*PROVIDER*/
  private searchProviderSubject = new Subject<string>();
  providers: ProviderInterface[] = [];
  isProviderLoading:boolean = true;


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
    this.userColor = this.app.userConnected?.themeColor || this.app.colorDefault;

    let searchValueTemp = this.route.snapshot.paramMap.get('value');
    if (searchValueTemp && searchValueTemp !== '-'){
      this.searchValue = searchValueTemp;
    } else if (searchValueTemp == '-'){
      this.searchValue = '';
    }
    // this.app.searchValue = this.searchValue;
    this.searchType = this.route.snapshot.paramMap.get('type');

    this.updateAll();

    /* SET SEARCH GAME */
    this.searchGameSubject.pipe(
      debounceTime(this.app.deadlineSearch),
      // distinctUntilChanged(),
      switchMap((searchValue) => {
        if (!searchValue.trim()) {
          return of(this.app.gamesSearchDefault);
        }
        return this.gameService.searchGames(searchValue, this.app.fetchLimit, this.app.setURL()).pipe(
          catchError((error) => {
            this.isGameLoading = true;
            console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
            Swal.fire({
              title: 'Erreur!',
              text: 'Une erreur s\'est produite lors de la recherche',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
            });
            return of([]);
          })
        );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe((results: GameInterface[]) => {

      this.games = results;

      this.app.searchValue = this.searchValue;
      this.app.gameNoReload = results;

      this.isGameLoading = false;

      this.calcBtnMore();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /*
  *
  * GLOBAL
  *
  * */
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

  updateValue(value: string) {
    this.searchValue = value;

    this.router.navigate(['/search/'+ this.searchType +'/-']);

    this.updateAll();
  }


  /*
  *
  * GAME
  *
  * */

  searchGame(): void {
    this.nbMoreGame = 1;
    this.isGameLoading = true;
    this.games = [];

    if (this.app.gameNoReload.length == 0){

      this.gameService.searchGames(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
        this.app.gameNoReload = results;

        this.games = this.app.gameNoReload;
        this.app.gamesSearchDefault = this.app.gameNoReload;
        this.app.searchValue = this.searchValue

        this.isGameLoading = false;

        this.calcBtnMore();
      });

    } else if (this.app.gameNoReload.length > 0 && this.app.searchValue == this.searchValue) {

      this.games = this.app.gameNoReload;
      this.isGameLoading = false;
      setTimeout(() => this.calcBtnMore(), 200);

    } else {

      this.searchGameSubject.next(this.searchValue);

    }
  }

  calcBtnMore(){
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
  }

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

  /*
  *
  * USER
  *
  * */

  searchUser(): void {
    this.userService.searchUsers(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe(
      (results) => {

        const connectedUserId = this.app.userConnected?.id;
        this.users = results.filter((user) => user.id !== connectedUserId);
        console.log("Fetched Users:", this.users);

        // récupère les badge pour chaque utilisateur
        const badgeRequests = this.users.map(user =>
          this.badgeService.getBadgeByUser(user.id, this.app.setURL()).pipe(
            catchError(error => {
              console.error(`Error fetching badges for user ${user.id}:`, error);
              // retourn un observable avec les badge vide pour eviter une erreur
              return of({ message: 'error', result: [] } as ApicallInterface);
            })
          )
        );

        // execute la recherche de badge
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

  /*
  *
  * ACTU
  *
  * */
  searchPostActu(): void {

    this.postactuService.searchPostActus(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
      this.postactus = results;
      this.isProviderLoading = false;
    });

  }

  /*
  *
  * PROVIDER
  *
  * */

  searchProvider(): void {

    this.providerService.searchProviders(this.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
      this.providers = results;
    });

  }

  handleFollowed(providerId: number): void {
    const provider = this.providers.find((p) => p.id === providerId);
  }

  handleUnfollowed(providerId: number): void {
    const provider = this.providers.find((p) => p.id === providerId);
  }

}
