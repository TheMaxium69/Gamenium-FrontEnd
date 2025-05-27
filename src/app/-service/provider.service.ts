import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderInterface } from '../-interface/provider.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class ProviderService {

  constructor(private http: HttpClient) {}

  getProviderById(id: number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/provider/' + id, option);
  }

  getAllProviders(url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/providerall', option);
  }

  searchProviders(searchValue: string, limit:number, url:string, option: {headers: HttpHeaders}): Observable<ProviderInterface[]> {
    return this.http.post<ProviderInterface[]>(url + `/providers/search`, { searchValue, limit}, option);
  }

}
