import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  uploadProfilePicture(userId: number, file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post<any>(`${this.baseUrl}/upload-profile-picture/${userId}`, formData);
  }
}
