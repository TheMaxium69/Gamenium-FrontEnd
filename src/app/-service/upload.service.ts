import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureService {

  constructor(private http: HttpClient) { }

  uploadProfilePicture(userId: number, imageFile: File) {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('image', imageFile);

    return this.http.post<any>('https://localhost:8000/upload-profile-picture/' + userId, formData);
  }
}
