import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeInterface } from '../-interface/like.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class LikeService {

  constructor(private http: HttpClient) {}

  getPostActuLikes(idPost: number, url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/like/post-actu/' + idPost);
  }

  getCommentLikes(idComment: number, url: string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/like/comment/' + idComment);
  }

  addLikePostActu(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/like/post-actu/', body, option);
  }

  addLikeComment(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/like/comment/', body, option);
  }

  getLikesByUser(url: string, option: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/likes/me', option);
  }



}
