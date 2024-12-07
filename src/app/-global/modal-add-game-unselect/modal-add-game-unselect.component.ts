import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppComponent} from "../../app.component";
import {DeviseService} from "../../-service/devise.service";
import {BuyWhereService} from "../../-service/buy-where.service";
import {DeviseInterface} from "../../-interface/devise.interface";
import {BuyWhereInterface} from "../../-interface/buy-where.interface";
import {GameInterface} from "../../-interface/game.interface";
import {of, Subject} from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import Swal from "sweetalert2";
import {GameService} from "../../-service/game.service";

@Component({
  selector: 'modal-add-game-unselect',
  templateUrl: './modal-add-game-unselect.component.html',
  styleUrls: ['./modal-add-game-unselect.component.css']
})
export class ModalAddGameUnselectComponent implements OnInit, OnDestroy {

  constructor(protected app:AppComponent,
              private deviseService:DeviseService,
              private buyWhereService:BuyWhereService,
              private gameService:GameService) {}

  searchResults: GameInterface[] = [];

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  deviseAll:DeviseInterface[]|undefined;
  buyWhereAll:BuyWhereInterface[]|undefined;

  ngOnInit() {
    this.getAllInfo();

    this.searchSubject.pipe(
      debounceTime(this.app.deadlineSearch),
      distinctUntilChanged(),
      switchMap((searchValue) => {
        if (!searchValue.trim()) {
          return of([]);
        }
        return this.gameService.searchGames(searchValue, this.app.modalSearchLimit, this.app.setURL()).pipe(
          catchError((error) => {
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
      this.searchResults = results;
      console.log(results)
    });
  }

  onSearchValueChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value;
    this.searchSubject.next(searchValue);
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

  moreCompletion(){
    console.log('more complter');
  }

}
