import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderInterface } from '../-interface/provider.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(private http: HttpClient) {}

  getProviderById(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/provider/' + id);
  }

  getAllProviders(url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/providers');
  }

}
