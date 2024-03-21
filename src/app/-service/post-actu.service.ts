import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApicallInterface} from "../-interface/apicall.interface";
import { PostActuInterface } from '../-interface/post-actu.interface';

@Injectable({
  providedIn: 'root',
})
export class PostActuService {
  constructor(private http: HttpClient) {}

  getActuAll(url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactus/');
  }
  getPostActuById(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/postactu/' + id);
  }

  searchPostActus(searchValue: string, limit:number, url:string): Observable<PostActuInterface[]> {
    return this.http.post<PostActuInterface[]>(url + `/postactus/search`, { searchValue, limit});
  }

  getLatestPostActus(id: number, url:string): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + `/latestactubyprovider/` + id );
  }

}
