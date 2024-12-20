import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRateInterface } from '../-interface/user-rate.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class UserRateService {
  constructor(private http: HttpClient) { }

  getRateByUser(id_user: number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/RatingByUser/' + id_user, option);
  }

  // getRateByGame(id_game: number, url:string): Observable<ApicallInterface> {
  //   return this.http.get<ApicallInterface>(url + '/RatingByGame/' + id_game)
  // }

}
