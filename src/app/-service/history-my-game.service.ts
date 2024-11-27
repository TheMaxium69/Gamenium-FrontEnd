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

  getMyGameByUserWithPlateform(idUser: number, idPlateform:number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/MyGameByUserWithPlateforme/' + idUser + '/' + idPlateform);
  }

  getOneMyGame(idMyGame: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/OneMyGame/' + idMyGame);
  }

  postMyGame(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/addMyGame/', body, option);
  }

  postNoteMyGame(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/addNoteMyGame/', body, option);
  }

  updateMyGame(body: string, url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.put<ApicallInterface>(url + '/updateMyGame/', body, options);
  }

  updatePinMyGame(body: string, url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.put<ApicallInterface>(url + '/updatePinMyGame/', body, options);
  }

  deleteMyGame(myGameId: number, url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/deleteMyGame/' + myGameId, options);
  }
}
