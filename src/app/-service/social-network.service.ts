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

  SocialNetworkAlreadyExist(link: string): Observable<boolean> {
    return this.http.get<boolean>('/socialnetworkbyuser/exists?link=' + encodeURIComponent(link));
  }

  getSocialNetworkUserLink(linkData: any): Observable<any> {

    this.SocialNetworkAlreadyExist(linkData.link).subscribe(exists => {
      if (exists) {
        this.http.put<any>('/socialnetworkbyuser/' + linkData.id, linkData).subscribe(response => {
          console.log('Updated link:', response);
        });
      } else {
        this.http.post<any>('/socialnetworkbyuser/', linkData).subscribe(response => {
          console.log('Created link:', response);
        });
      }
    });

    return new Observable<any>();
  }

}
