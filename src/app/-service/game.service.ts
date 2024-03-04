// game.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameInterface } from '../-interface/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) {}

  getGame(id: number): Observable<GameInterface> {
    return this.http.get<GameInterface>(`${this.apiUrl}/game/${id}`);
  }

  getAllGames(): Observable<GameInterface[]> {
    return this.http.get<GameInterface[]>(`${this.apiUrl}/games`);
  }

  searchGames(searchValue: string): Observable<GameInterface[]> {
    return this.http.post<GameInterface[]>(`${this.apiUrl}/games/search`, { searchValue });
  }
}
