import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root'
})
export class HmgTagsService {

  constructor(private http: HttpClient) { }

  getTagsAllByUser(url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.get<ApicallInterface>(url + '/tagsbyuser' , options)
  }

  deleteTag(id: number, url:string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/deletetag/' + id, options)
  }

}
