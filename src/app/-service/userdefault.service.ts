import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class UserdefaultService {

  constructor(private http:HttpClient) { }


  getAllDefault(url:string, options: { headers: HttpHeaders }):Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+'/user-default', options);
  }

  updateUserDefault(body:string, url:string,options: { headers: HttpHeaders }):Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url+'/user-default/set', body, options);
  }


}
