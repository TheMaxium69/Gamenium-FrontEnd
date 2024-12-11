import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentInterface } from '../-interface/comment.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getCommentWithActu(id_actu: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/getCommentByActu/' + id_actu);
  }

  postCommentInActu(body: string, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/commentInActu/', body, option);
  }

  deleteCommentInActu(id: number, url:string, option: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url+ '/comment/'+id, option);
  }

  getCommentsByUser(url: string, option: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/comments/me', option);
  }

  getCountByActu(id_actu: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/countCommentByActu/'+id_actu);
  }

  deleteCommentReply(id: number, url: string, option: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/deleteReply/'+id, option);
  }
}
