import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryMyGameInterface } from '../-interface/history-my-game.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class HistoryMyGameService {
  constructor(private http: HttpClient) { }

  getMyGameByUser(idUser: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/MyGameByUser/' + idUser);
  }

}
