import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TyroipInterface} from "../-interface/tyroip-interface";

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private http: HttpClient) { }

  getMyIp(url:string):Observable<TyroipInterface>{
    return this.http.get<TyroipInterface>(url);
  }

}
