import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostActuInterface } from '../-interface/post-actu.interface';

@Injectable({
  providedIn: 'root',
})
export class PostActuService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}






  getPostActu(id: number): Observable<PostActuInterface> {
    return this.http.get<PostActuInterface>(`${this.apiUrl}/postactu/${id}`);
  }

  getAllPostActus(): Observable<PostActuInterface[]> {
    return this.http.get<PostActuInterface[]>(`${this.apiUrl}/postactus`);
  }


}
