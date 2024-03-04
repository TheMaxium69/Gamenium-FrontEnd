import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeInterface } from '../-interface/badge.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  constructor(private http: HttpClient) {}

  getBadgeByUser(id: number | undefined, url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url+"/badges/user/"+id);
  }


}
