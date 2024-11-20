import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgCopyFormatService {

  constructor(private http: HttpClient) {}

  getAllHmgCopyFormat(url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyFormatAll");
  }

  getOneHmgCopyFormat(id: number, url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyFormat/"+id);
  }

}
