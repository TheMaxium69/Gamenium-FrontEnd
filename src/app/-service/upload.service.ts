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

    console.log(photo);

    const formData = new FormData();
    formData.append('photo', photo);

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    //
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data; charset=utf-8; boundary=' + Math.random().toString().substr(2),
    //   'Accept': '*/*',
    //   'Accept-Encoding': 'gzip, deflate, br',
    //   'Connection': 'keep-alive',
    //   'User-Agent': 'PostmanRuntime/7.37.0',
    // });


    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<ApicallInterface>(url + '/upload/pp/', formData, { headers: headers });
  }




}
