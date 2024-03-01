import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameInterface } from '../-interface/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getGame(id: number): Observable<GameInterface> {
    return this.http.get<GameInterface>(`${this.apiUrl}/game/${id}`);
  }

  getAllGames(): Observable<GameInterface[]> {
    return this.http.get<GameInterface[]>(`${this.apiUrl}/games`);
  }

}
