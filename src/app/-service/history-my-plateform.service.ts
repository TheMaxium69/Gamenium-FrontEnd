import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApicallInterface } from '../-interface/apicall.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryMyPlateformService {

  constructor(private http: HttpClient) { }

  getOneMyHmpByUserByPlatform(idUser:number, idPlatform: number, url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface>
  {
    return this.http.get<ApicallInterface>(url + '/OneMyPlateformByUserWithPlatform/' + idUser + '/' + idPlatform, option);
  }

  getOneMyHmpById(idMyPlatform: number, url:string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/OneMyPlatform/' + idMyPlatform, option);
  }

  postMyPlatform(body: string, url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/addHmp', body, option);
  }

  getAllMyHmpByUser(url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface>{
    return this.http.get<ApicallInterface>(url + '/allMyPlatform/', option);
  }

  updateMyPlatform(body: string, url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface>{
    return this.http.put<ApicallInterface>(url + '/updateMyPlateform', body, options);
  }
}
