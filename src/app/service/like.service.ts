import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeInterface } from '../-interface/like.interface';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API
  constructor(private http: HttpClient) {}

  getLike(id: number): Observable<LikeInterface> {
    return this.http.get<LikeInterface>(`${this.apiUrl}/like/${id}`);
  }

  getAllLikes(): Observable<LikeInterface[]> {
    return this.http.get<LikeInterface[]>(`${this.apiUrl}/likes`);
  }

}
