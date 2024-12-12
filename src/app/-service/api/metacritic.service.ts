import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MetacricInterface} from "../../-interface/api/metacric.interface";

@Injectable({
  providedIn: 'root'
})
export class MetacriticService {

  constructor(private http: HttpClient) { }

  getGame(url:string, game_title:string): Observable<MetacricInterface> {
    return this.http.get<MetacricInterface>(url + "?game_title=" + encodeURIComponent(game_title));
  }
}
