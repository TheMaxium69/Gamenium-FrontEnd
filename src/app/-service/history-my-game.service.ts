import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class HistoryMyGameService {
  searchGames(searchValue: string, limit: number, url: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }

  getMyGameByUser(idUser: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/MyGameByUser/' + idUser);
  }

  postMyGame(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/addMyGame/', body, option);
  }

  postNoteMyGame(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/addNoteMyGame/', body, option);
  }

}
