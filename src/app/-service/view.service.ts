import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(
    private http:HttpClient,
  ) { }

  addActuView(body:string, url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + `/view-actu-add`, body, options);
  }

  addProviderView(body:string, url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + `/view-provider-add`, body, options);
  }

  addGameView(body:string, url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + `/view-game-add`, body, options )
  }

  addProfileView(body:string, url:string, options: { headers: HttpHeaders}): Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + `/view-profile-add`, body, options)
  }
}
