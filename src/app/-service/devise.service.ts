import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class DeviseService {

  constructor(private http: HttpClient) {}

  getAllDevise(url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/devises", option);
  }

  // getOneDevise(id: number, url: string): Observable<ApicallInterface> {
  //   return this.http.get<ApicallInterface>(url+"/devise/"+id);
  // }

}
