import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http:HttpClient) { }

  getFollowByProvider(id_provider: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/followByProvider/' + id_provider);
  }

  getFollowByGameProfil(id_gameprofil: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/followByGameProfil/' + id_gameprofil);
  }

  getMyFollowByUser(id_user: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/myFollowByUser/' + id_user);
  }

  postFollowProvider(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/followProvider', body, option);
  }

  postFollowGameProfil(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/followGameProfil', body, option);
  }

  deleteFollowProvider(id_provider: number, url: string): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/unfollowProvider/' + id_provider);
  }

}
