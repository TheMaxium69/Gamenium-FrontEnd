import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  options = { headers: this.headers };

  postLoginUser(bodyNoJson: any, url: string): Observable<ApicallInterface> {

    const body = JSON.stringify(bodyNoJson);

    return this.http.post<ApicallInterface>(url+"/login_user/", body, this.options);

  }

  postLoginToken(token: string, url: string): Observable<ApicallInterface> {
    let bodyNoJson: any = {
      "token":token,
    };
    const body = JSON.stringify(bodyNoJson);

    return this.http.post<ApicallInterface>(url+"/login_token/", body, this.options);
  }
}
