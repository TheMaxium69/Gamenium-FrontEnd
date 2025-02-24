import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadUserPhoto(photo: File, url:string, option: {headers: HttpHeaders}):Observable<ApicallInterface> {

    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.post<ApicallInterface>(url + '/upload/pp/', formData, option);
  }

  uploadScreenshot(screenshot: File, id_category:number, id_mygame:number, url:string, option: {headers: HttpHeaders}):Observable<ApicallInterface> {
    const formData = new FormData();
    formData.append('picture', screenshot);
    formData.append('id_category', id_category.toString());
    formData.append('id_mygame', id_mygame.toString());
    return this.http.post<ApicallInterface>(url + '/upload/screenshot/', formData, option);
  }




}
