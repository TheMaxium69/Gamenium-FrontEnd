import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class PostActuService {
  constructor(private http: HttpClient) {}

  getActuAll(url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactus/');
  }
  getPostActuById(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactu/' + id);
  }


}
