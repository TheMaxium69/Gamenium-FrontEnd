import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from "rxjs/operators";
import {of, Subject} from "rxjs";
import Swal from "sweetalert2";
import {GameInterface} from "../../-interface/game.interface";
import {GameService} from "../../-service/game.service";

@Component({
  selector: 'modal-note',
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.css']
})
export class ModalNoteComponent implements OnInit, OnDestroy {

  constructor(protected app:AppComponent,
              private gameService: GameService) {}

  searchResults: GameInterface[] = [];
  searchValue: string = '';
  isFirstSearch: boolean = false;
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
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
              confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
            });
            return of([]);
          })
        );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe((results: GameInterface[]) => {
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

}

