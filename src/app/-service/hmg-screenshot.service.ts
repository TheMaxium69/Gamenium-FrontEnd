import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgScreenshotService {

  constructor(private http: HttpClient) { }

  getAllScreenshotCategory(url:string, option: {headers: HttpHeaders}):Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/screenshot-categories", option);
  }

  deleteScreenshot(id:number, url:string,  options: {headers: HttpHeaders}):Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url+"/delete-screenshot/"+id, options);
  }
}
