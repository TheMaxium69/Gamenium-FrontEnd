import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureService {

  constructor(private http: HttpClient) { }

  uploadProfilePicture(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post<any>('http://localhost:8000/upload-profile-picture', formData);
  }
}
