import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuyWhereInterface } from '../-interface/buy-where.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class BuyWhereService {

  constructor(private http: HttpClient) {}

  // getAllBuyWheres(url:string): Observable<ApicallInterface> {
  //   return this.http.get<ApicallInterface>(url + '/buywheres');
  // }

  getAllBuyWheresByUser(url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/buywherebyuser/', option);
  }

  createBuyWhere(body:string, url:string, options:{headers:HttpHeaders}):Observable<ApicallInterface>{
    return this.http.post<ApicallInterface>(url + '/createbuywhere/', body, options);
  }

  deleteBuyWhere(id:number, url:string, options:{headers:HttpHeaders}):Observable<ApicallInterface> {
    return this.http.delete<ApicallInterface>(url + '/deletebuywhere/' + id, options);
  }

}
