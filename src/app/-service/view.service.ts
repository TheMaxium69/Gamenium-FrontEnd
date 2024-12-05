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

}
