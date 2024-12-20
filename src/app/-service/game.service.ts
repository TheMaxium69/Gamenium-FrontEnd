import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryMyGameInterface } from '../-interface/history-my-game.interface';
import { ApicallInterface } from '../-interface/apicall.interface';
import { GameInterface } from '../-interface/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private http: HttpClient) {}

  // getMyGameByUser(id_user: number, url: string): Observable<{ message: string; result: HistoryMyGameInterface[] | undefined }> {
  //   return this.http.get<{ message: string; result: HistoryMyGameInterface[] | undefined }>(url + `/games/user/${id_user}`);
  // }

  getGameById(id: number, url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url +'/game/' + id, option);
  }

  searchGames(searchValue: string, limit: number, url: string, option: {headers: HttpHeaders}): Observable<GameInterface[]> {
    return this.http.post<GameInterface[]>(url + `/games/search`, { searchValue, limit}, option);
  }

  getLatestGames(body: string, url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>( url + `/latest-games`, body, option);
  }
}
