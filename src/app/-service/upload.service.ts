import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureService {

  constructor(private http: HttpClient) { }

  uploadUserPhoto(photo: File, url:string, option: {headers: HttpHeaders}):Observable<ApicallInterface> {

    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.post<ApicallInterface>(url + '/upload/pp/', formData, option);
  }




}
