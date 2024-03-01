import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderInterface } from '../-interface/provider.interface';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getProvider(id: number): Observable<ProviderInterface> {
    return this.http.get<ProviderInterface>(`${this.apiUrl}/provider/${id}`);
  }

  getAllProviders(): Observable<ProviderInterface[]> {
    return this.http.get<ProviderInterface[]>(`${this.apiUrl}/providers`);
  }

}
