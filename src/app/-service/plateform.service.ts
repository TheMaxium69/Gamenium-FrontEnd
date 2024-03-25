import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlateformInterface } from '../-interface/plateform.interface';
import {ApicallInterface} from "../-interface/apicall.interface";

@Injectable({
  providedIn: 'root',
})
export class PlateformService {

  constructor(private http: HttpClient) {}

  getAllPlateforms(url:string): Observable<ApicallInterface[]> {
    return this.http.get<ApicallInterface[]>(url + `/plateforms`);
  }

}
