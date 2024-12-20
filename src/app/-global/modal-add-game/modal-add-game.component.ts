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
              private buyWhereService:BuyWhereService,
              private gameService:GameService) {}

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
        return this.gameService.searchGames(searchValue, this.app.modalSearchLimit, this.app.setURL(), this.app.createCorsToken()).pipe(
          catchError((error) => {
            this.isLoading = false;
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

    /* RECUPERE LES BUYWHERE*/
    if (this.app.buyWhereUserNoReload.length == 0) {
      this.buyWhereService.getAllBuyWheresByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseBuyWhere: {
        message: string;
        result: BuyWhereInterface[];
      }) => {
        if (reponseBuyWhere.message == "good") {
          this.app.buyWhereUserNoReload = reponseBuyWhere.result;
        }
      })
    }
  }

  isLoadingMore:boolean = false;
  moreCompletion(){
    this.isLoadingMore = true;
  }

  addGame(form:NgForm){
    this.app.addGame(form, this.isLoadingMore);

  }

}
