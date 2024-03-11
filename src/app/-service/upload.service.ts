import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  uploadProfilePicture(userId: number, imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post<any>(`${this.apiUrl}/upload-profile-picture/${userId}`, formData);
  }
}