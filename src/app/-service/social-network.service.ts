import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  
  constructor(private http: HttpClient) {}

  getAllSocialNetwork(url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/social-networks');
  }

  getSocialNetworkByUser(id:number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/socialnetworkbyuser/' + id);
  }

  // post


}
