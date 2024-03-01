import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRateInterface } from '../-interface/user-rate.interface';

@Injectable({
  providedIn: 'root',
})
export class UserRateService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) { }

  getUserRate(id: number): Observable<UserRateInterface> {
    return this.http.get<UserRateInterface>(`${this.apiUrl}/userRate/${id}`);
  }

  getAllUserRates(): Observable<UserRateInterface[]> {
    return this.http.get<UserRateInterface[]>(`${this.apiUrl}/userRates`);
  }


}