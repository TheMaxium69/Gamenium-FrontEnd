import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformInterface } from '../-interface/platform.interface';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getPlatform(id: number): Observable<PlatformInterface> {
    return this.http.get<PlatformInterface>(`${this.apiUrl}/platform/${id}`);
  }

  getAllPlatforms(): Observable<PlatformInterface[]> {
    return this.http.get<PlatformInterface[]>(`${this.apiUrl}/platforms`);
  }

}
