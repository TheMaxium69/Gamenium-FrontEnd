import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgScreenshotService {

  constructor(private http: HttpClient) { }

  getAllScreenshotCategory(url:string):Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/screenshot-categories");
  }
}
