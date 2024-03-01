import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentInterface } from '../-interface/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getComment(id: number): Observable<CommentInterface> {
    return this.http.get<CommentInterface>(`${this.apiUrl}/comment/${id}`);
  }

  getAllComments(): Observable<CommentInterface[]> {
    return this.http.get<CommentInterface[]>(`${this.apiUrl}/comments`);
  }


}
