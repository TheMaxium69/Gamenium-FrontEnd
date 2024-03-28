import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeInterface } from '../-interface/like.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class LikeService {

  constructor(private http: HttpClient) {}
  createPostActuLike(url: string, postId: number, userId: number, ip: string): Observable<ApicallInterface> {
    const body = { user_id: userId, ip, post_id: postId };
    return this.http.post<ApicallInterface>(url + '/like', body);
  }

  createCommentLike(url: string, idComment: number, userId: number, ip: string): Observable<ApicallInterface> {
    const body = { user_id: userId, ip, comment_id: idComment };
    return this.http.post<ApicallInterface>(url + '/like', body);
  }

  deletePostActuLike(url: string, postId: number, userId: number): Observable<ApicallInterface> {
    const options = { body: { user_id: userId } };
    return this.http.delete<ApicallInterface>(url + '/like/post-actu/${postId}', options);
  }

  deleteCommentLike(url: string, idComment: number, userId: number): Observable<ApicallInterface> {
    const options = { body: { user_id: userId } };
    return this.http.delete<ApicallInterface>(url + '/like/comment/' + idComment, options);
  }

  getPostActuLikes(url: string, idPost: number): Observable<LikeInterface[]> {
    return this.http.get<LikeInterface[]>(url + '/like/post-actu/' + idPost);
  }

  getCommentLikes(url: string, idComment: number): Observable<LikeInterface[]> {
    return this.http.get<LikeInterface[]>(url + '/like/comment/' + idComment);
  }

}
