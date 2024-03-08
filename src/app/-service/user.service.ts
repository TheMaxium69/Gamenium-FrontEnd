import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}


  getThemeColor(userId: number): Observable<string> {
    const url = `${this.apiUrl}/get-theme-color/${userId}`;
    return this.http.get<string>(url);
  }

  updateThemeColor(userId: number, newColor: string): Observable<any> {
    const url = `${this.apiUrl}/update-theme-color/${userId}`;
    const payload = { themeColor: newColor };

    return this.http.post(url, payload);
  }
}
