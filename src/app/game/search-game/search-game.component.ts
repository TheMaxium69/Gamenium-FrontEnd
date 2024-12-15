import {Component, OnDestroy, OnInit} from '@angular/core';
import { GameService } from '../../-service/game.service';
import { GameInterface } from '../../-interface/game.interface';
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";
import { UserInterface } from 'src/app/-interface/user.interface';
import { UserService } from 'src/app/-service/user.service';
import { ProviderService } from 'src/app/-service/provider.service';
import { ProviderInterface } from 'src/app/-interface/provider.interface';
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from "rxjs/operators";
import {of, Subject} from "rxjs";
import Swal from "sweetalert2";


@Component({
  selector: 'app-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent implements OnInit, OnDestroy{

  /* GAME & PROVIDER*/
  games: GameInterface[] = [];

  /* MORE GAME */
  nbMoreGame:number = 1;
  users: UserInterface[] = [];
  providers: ProviderInterface[] = [];

  /* searchVariable */
  isLoading: boolean = true;
  searchValue: string = '';

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();


  constructor (
    private gameService: GameService,
    private userService: UserService,
    private providerService: ProviderService,
    protected app: AppComponent,
    private router: Router
  ) {}

  ngOnInit(): void {

    /* FIRST REQUESTE*/
    if (this.app.gameNoReload.length == 0) {
      this.gameService.searchGames(this.app.searchValue, this.app.fetchLimit, this.app.setURL()).subscribe((results) => {
        this.app.gameNoReload = results;
        this.games = this.app.gameNoReload;
        if (this.app.searchValue.trim() == ''){
          this.app.gamesSearchDefault = this.app.gameNoReload;
        }
        this.isLoading = false;

        this.calcMoreBtn(true);
      });
    } else {
      this.searchValue = this.app.searchValue;
      this.games = this.app.gameNoReload;
      this.providers = this.app.providersNoReload;
      this.users = this.app.usersNoReload;
      this.isLoading = false;
      setTimeout(() => this.calcMoreBtn(), 200);
    }

    /* SET SEARCH*/
    this.searchSubject.pipe(
      debounceTime(this.app.deadlineSearch),
      // distinctUntilChanged(),
      switchMap((searchValue) => {
        if (!searchValue.trim() && this.app.gamesSearchDefault.length !== 0) {
          return of(this.app.gamesSearchDefault);
        }
        return this.gameService.searchGames(searchValue, this.app.fetchLimit, this.app.setURL()).pipe(
          catchError((error) => {
            this.isLoading = true;
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
        this.app.gameNoReload = results;
        if (this.searchValue.trim() == ''){
          this.app.gamesSearchDefault = this.app.gameNoReload;
        }
        this.app.searchValue = this.searchValue;

        this.games = this.app.gameNoReload;
        this.isLoading = false;
        this.calcMoreBtn();
    });
  }

  onSearchValueChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    /* VARIABLE*/
    this.searchValue = inputElement.value
    this.isLoading = true;
    this.nbMoreGame = 1;
    this.games = [];
    this.app.providersNoReload = [];
    this.providers = this.app.providersNoReload;
    this.app.usersNoReload = [];
    this.users = this.app.usersNoReload;
    this.resetMoreBtn();

    /* LAUNCH SEARCH*/
    this.searchSubject.next(this.searchValue);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSearch(): void {
    if (this.searchValue.trim() !== '') {
      this.router.navigate(['/search/game/' + this.searchValue.trim()]);
    } else {
      this.router.navigate(['/search/game/-']);
    }
  }

  resetMoreBtn(){
    let morebtn = document.getElementById("moreGameBTN");
    if (morebtn){
      morebtn.style.display = "none";
    }
  }

  /* SET BTN MORE GAME ou PROVIDER ET USER */
  calcMoreBtn(isFirst:boolean = false){

    let morebtn = document.getElementById("moreGameBTN");
    let provideUser = document.getElementById("provider-user");

    if (isFirst) {
      if (this.games.length == this.app.fetchLimit){
        if (morebtn){
          morebtn.style.display = "block";
        }
      } else {
        if (morebtn){
          morebtn.style.display = "none";
        }
      }
    } else {

      if (this.games.length >= this.app.fetchLimit) {
        if (morebtn){
          morebtn.style.display = "block";
        }
        if (provideUser) {
          provideUser.style.display = "none";
        }
      } else if (this.app.searchValue.trim() !== '') {

        if (morebtn){
          morebtn.style.display = "none";
        }

        if (provideUser) {
          provideUser.style.display = "block";
        }

        let providersFetchLimit = this.app.fetchLimit - this.games.length;
        this.providerService.searchProviders(this.app.searchValue, providersFetchLimit, this.app.setURL()).subscribe((results) => {
          this.app.providersNoReload = results;
          this.providers = this.app.providersNoReload;

          let userFetchLimit = providersFetchLimit - this.providers.length;

          // affiche les users si la limite de 50 objects (games + providers) n'a pas été atteinte et va jusqu'à 50 objects en tout (games + providers + users)
          this.userService.searchUsers(this.app.searchValue, userFetchLimit, this.app.setURL()).subscribe((results) => {
            this.app.usersNoReload = results;
            this.users = this.app.usersNoReload;
          });

        });
      }

    }

  }

  /* BUTTOM MORE GAME */
  moreGame(){

    this.nbMoreGame++
    let limit = this.nbMoreGame * this.app.fetchLimit;
    console.log(limit)

    /* TODO : faire un offset*/
    this.gameService.searchGames(this.app.searchValue, limit, this.app.setURL()).subscribe((results) => {
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
