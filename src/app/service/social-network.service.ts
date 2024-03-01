import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialNetworkInterface } from '../-interface/social-network.interface';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getSocialNetwork(id: number): Observable<SocialNetworkInterface> {
    return this.http.get<SocialNetworkInterface>(`${this.apiUrl}/social-network/${id}`);
  }

  getAllSocialNetworks(): Observable<SocialNetworkInterface[]> {
    return this.http.get<SocialNetworkInterface[]>(`${this.apiUrl}/social-networks`);
  }


}
