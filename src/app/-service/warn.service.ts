import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class WarnService {

  constructor(
    private http:HttpClient,
  ) { }


  getWarnType(url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.get<ApicallInterface>(url + `/warntype`, options);
  }


  addWarn(body:string, url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + `/addwarn`, body, options);
  }




}
