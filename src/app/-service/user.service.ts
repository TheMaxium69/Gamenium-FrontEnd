import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../-interface/user.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // getThemeColor(userId: number, url:string): Observable<string> {
  //   return this.http.get<string>(url + '/get-theme-color/'+ userId);
  // }

  updateThemeColor(userId: number, newColor: string, url:string, option: {headers: HttpHeaders}): Observable<any> {
    const url_requete = url + '/update-theme-color/' + userId;
    const payload = { themeColor: newColor };

    return this.http.post(url_requete, payload, option);
  }

  searchUsers(searchValue: string, limit:number, url:string, option: {headers: HttpHeaders}): Observable<UserInterface[]> {
    return this.http.post<UserInterface[]>(url + `/users/search`, { searchValue, limit}, option);
  }

  deleleProfilPicture(url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/delete/pp/', options);
  }
}
