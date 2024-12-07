import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppComponent} from "../app.component";
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {GameService} from "../-service/game.service";
import {GameInterface} from "../-interface/game.interface";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnDestroy {

  constructor(protected app:AppComponent,
              private gameService: GameService) { }

  searchResults: GameInterface[] = [];

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300), // Ajoute un délai pour réduire les requêtes
      distinctUntilChanged(), // Ignore les mêmes valeurs
      switchMap((searchValue) => {
        if (!searchValue.trim()) {
          return of([]); // Retourne un observable vide si la chaîne est vide
        }
        return this.gameService.searchGames(searchValue, 6, this.app.setURL()).pipe(
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

  debug(){
    console.log(this.searchResults)
  }

}
