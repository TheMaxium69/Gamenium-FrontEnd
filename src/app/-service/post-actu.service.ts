import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApicallInterface} from "../-interface/apicall.interface";
import { PostActuInterface } from '../-interface/post-actu.interface';

@Injectable({
  providedIn: 'root',
})
export class PostActuService {
  constructor(private http: HttpClient) {}

  getActuAll(url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactus/', option);
  }
  getPostActuById(id: number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactu/' + id, option);
  }

  searchPostActus(searchValue: string, limit:number, url:string, option: {headers: HttpHeaders}): Observable<PostActuInterface[]> {
    return this.http.post<PostActuInterface[]>(url + `/postactus/search`, { searchValue, limit}, option);
  }

  getLatestPostActus(id: number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + `/latestactubyprovider/` + id, option);
  }

  getPostByProvider(id:number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postByProvider/' + id, option)
  }

}
