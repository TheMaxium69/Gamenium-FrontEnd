import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyAccountExterneInterface } from '../-interface/my-account-externe.interface';

@Injectable({
  providedIn: 'root',
})
export class MyAccountExterneService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getMyAccountExterne(id: number): Observable<MyAccountExterneInterface> {
    return this.http.get<MyAccountExterneInterface>(`${this.apiUrl}/myaccountexterne/${id}`);
  }

  getAllMyAccountsExterne(): Observable<MyAccountExterneInterface[]> {
    return this.http.get<MyAccountExterneInterface[]>(`${this.apiUrl}/myaccountexternes`);
  }

}
