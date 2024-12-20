import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgCopyRegionService {

  constructor(private http: HttpClient) {}

  getAllHmgCopyRegion(url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyRegionAll", option);
  }

  // getOneHmgCopyRegion(id: number, url: string): Observable<ApicallInterface> {
  //   return this.http.get<ApicallInterface>(url+"/hmgCopyRegion/"+id);
  // }

}
