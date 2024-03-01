import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeVersUserInterface } from '../-interface/badge-vers-user.interface';

@Injectable({
  providedIn: 'root',
})
export class BadgeVersUserService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getBadgeVersUser(id: number): Observable<BadgeVersUserInterface> {
    return this.http.get<BadgeVersUserInterface>(`${this.apiUrl}/badgeversuser/${id}`);
  }

  getAllBadgeVersUsers(): Observable<BadgeVersUserInterface[]> {
    return this.http.get<BadgeVersUserInterface[]>(`${this.apiUrl}/badgeversusers`);
  }

}
