import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PictureInterface } from '../-interface/picture.interface';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  private apiUrl = 'http://localhost:8000/'; // A REMPLACER AVEC L'URL DE L'API

  constructor(private http: HttpClient) {}

  getPicture(id: number): Observable<PictureInterface> {
    return this.http.get<PictureInterface>(`${this.apiUrl}/picture/${id}`);
  }

  getAllPictures(): Observable<PictureInterface[]> {
    return this.http.get<PictureInterface[]>(`${this.apiUrl}/pictures`);
  }


}
