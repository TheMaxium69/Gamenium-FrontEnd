// game.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameInterface } from '../-interface/game.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private http: HttpClient) {}


  getGamesWithLimit(page:number, limit:number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/games/' + page + "/" + limit);
  }

  getGameById(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url +'/game/' + id);
  }

  searchGames(searchValue: string, limit:number, url:string): Observable<GameInterface[]> {
    return this.http.post<GameInterface[]>(url + `/games/search`, { searchValue, limit});
  }

}
