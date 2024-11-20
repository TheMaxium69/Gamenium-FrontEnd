import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgCopyEtatService {

  constructor(private http: HttpClient) {}

  getAllHmgCopyEtat(url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyEtatAll");
  }

  getOneHmgCopyEtat(id: number, url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyEtat/"+id);
  }

}
