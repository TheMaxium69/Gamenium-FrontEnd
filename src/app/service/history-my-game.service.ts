import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryMyGameInterface } from '../-interface/history-my-game.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoryMyGameService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getHistoryMyGame(id: number): Observable<HistoryMyGameInterface> {
    return this.http.get<HistoryMyGameInterface>(`${this.apiUrl}/history-my-game/${id}`);
  }

  getAllHistoryMyGames(): Observable<HistoryMyGameInterface[]> {
    return this.http.get<HistoryMyGameInterface[]>(`${this.apiUrl}/history-my-games`);
  }


}
