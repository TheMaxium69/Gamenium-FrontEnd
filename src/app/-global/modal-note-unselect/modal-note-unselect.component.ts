import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from "rxjs/operators";
import {of, Subject} from "rxjs";
import Swal from "sweetalert2";
import {GameInterface} from "../../-interface/game.interface";
import {GameService} from "../../-service/game.service";

@Component({
  selector: 'modal-note-unselect',
  templateUrl: './modal-note-unselect.component.html',
  styleUrls: ['./modal-note-unselect.component.css']
})
export class ModalNoteUnselectComponent implements OnInit, OnDestroy {

  constructor(protected app:AppComponent,
              private gameService: GameService) {}

  searchResults: GameInterface[] = [];

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
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

}
