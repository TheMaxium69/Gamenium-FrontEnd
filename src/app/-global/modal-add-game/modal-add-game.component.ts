import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {DeviseInterface} from "../../-interface/devise.interface";
import {BuyWhereInterface} from "../../-interface/buy-where.interface";
import {DeviseService} from "../../-service/devise.service";
import {BuyWhereService} from "../../-service/buy-where.service";
import {GameService} from "../../-service/game.service";
import {GameInterface} from "../../-interface/game.interface";
import {of, Subject} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from "rxjs/operators";
import Swal from "sweetalert2";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'modal-add-game',
  templateUrl: './modal-add-game.component.html',
  styleUrls: ['./modal-add-game.component.css']
})
export class ModalAddGameComponent implements OnInit, OnDestroy {

  constructor(protected app:AppComponent,
              private deviseService:DeviseService,
              private buyWhereService:BuyWhereService,
              private gameService:GameService) {}

  deviseAll:DeviseInterface[]|undefined;
  buyWhereAll:BuyWhereInterface[]|undefined;
  searchResults: GameInterface[] = [];
  searchValue: string = '';
  isFirstSearch: boolean = false;
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.getAllInfo();

    this.searchSubject.pipe(
      debounceTime(this.app.deadlineSearch),
      // distinctUntilChanged(),
      switchMap((searchValue) => {
        if (!searchValue.trim()) {
          return of([]);
        }
        return this.gameService.searchGames(searchValue, this.app.modalSearchLimit, this.app.setURL()).pipe(
          catchError((error) => {
            this.isLoading = false;
            console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
            Swal.fire({
              title: 'Erreur!',
              text: 'Une erreur s\'est produite lors de la recherche',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: this.app.userConnected?.themeColor
            });
            return of([]);
          })
        );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe((results: GameInterface[]) => {
      console.log('results valide');
      this.isLoading = false;
      this.searchResults = results;
    });
  }

  onSearchValueChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    this.isFirstSearch = true;
    this.isLoading = true;
    this.searchSubject.next(this.searchValue);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllInfo(){

    /* RECUPERE LES DEVISE */
    this.deviseService.getAllDevise(this.app.setURL()).subscribe((reponseDevise: { message: string; result: DeviseInterface[] | undefined; }) => {
      if (reponseDevise.message == "good") {
        this.deviseAll = reponseDevise.result;
      }
    })

    /* RECUPERE LES BUYWHERE*/
    this.buyWhereService.getAllBuyWheres(this.app.setURL()).subscribe((reponseBuyWhere: { message: string; result: BuyWhereInterface[] | undefined; }) => {
      if (reponseBuyWhere.message == "good") {
        this.buyWhereAll = reponseBuyWhere.result;
      }
    })

  }

  isLoadingMore:boolean = false;
  moreCompletion(){
    this.isLoadingMore = true;
  }

  addGame(form:NgForm){
    this.app.addGame(form, this.isLoadingMore);

  }

}
