import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MetacricInterface} from "../../-interface/api/metacric.interface";
import {GiantbombInterface} from "../../-interface/api/giantbomb.interface";

@Injectable({
  providedIn: 'root'
})
export class GiantbombService {

  constructor(private http: HttpClient) { }

  getGame(url:string, game_title:string, guid:string): Observable<GiantbombInterface> {
    return this.http.get<GiantbombInterface>(url + "?guid="+ guid +"&game_title=" + encodeURIComponent(game_title));
  }
}
