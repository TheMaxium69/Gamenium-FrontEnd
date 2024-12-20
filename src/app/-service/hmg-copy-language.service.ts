import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApicallInterface } from '../-interface/apicall.interface';

@Injectable({
  providedIn: 'root'
})
export class HmgCopyLanguageService {

  constructor(private http: HttpClient) {}

  getAllHmgCopyLanguage(url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/hmgCopyLanguageAll", option);
  }

}
