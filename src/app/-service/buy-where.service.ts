import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuyWhereInterface } from '../-interface/buy-where.interface';

@Injectable({
  providedIn: 'root',
})
export class BuyWhereService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getBuyWhere(id: number): Observable<BuyWhereInterface> {
    return this.http.get<BuyWhereInterface>(`${this.apiUrl}/buywhere/${id}`);
  }

  getAllBuyWheres(): Observable<BuyWhereInterface[]> {
    return this.http.get<BuyWhereInterface[]>(`${this.apiUrl}/buywheres`);
  }

}
