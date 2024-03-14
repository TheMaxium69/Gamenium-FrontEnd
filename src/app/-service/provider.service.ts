import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderInterface } from '../-interface/provider.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class ProviderService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getProviderById(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/provider/' + id);
  }

  getAllProviders(url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/providers');
  }

  searchProviders(searchValue: string, limit:number, url:string): Observable<ProviderInterface[]> {
    return this.http.post<ProviderInterface[]>(url + `/providers/search`, { searchValue, limit});
  }

}
