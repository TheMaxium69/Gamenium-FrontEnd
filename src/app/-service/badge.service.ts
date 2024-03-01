import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeInterface } from '../-interface/badge.interface';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getBadge(id: number): Observable<BadgeInterface> {
    return this.http.get<BadgeInterface>(`${this.apiUrl}/badge/${id}`);
  }

  getAllBadges(): Observable<BadgeInterface[]> {
    return this.http.get<BadgeInterface[]>(`${this.apiUrl}/badges`);
  }


}