import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameProfileInterface } from '../-interface/game-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class GameProfileService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getGameProfile(id: number): Observable<GameProfileInterface> {
    return this.http.get<GameProfileInterface>(`${this.apiUrl}/game-profile/${id}`);
  }

  getAllGameProfiles(): Observable<GameProfileInterface[]> {
    return this.http.get<GameProfileInterface[]>(`${this.apiUrl}/game-profiles`);
  }


}