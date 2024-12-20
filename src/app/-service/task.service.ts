import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApicallInterface } from '../-interface/apicall.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  // Récuperer toute les tâches
  getAllTasks(url: string, option: {headers: HttpHeaders}): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/task-user/view', option);
  }

  // recuperer les tache completé
  getCompletedTasks(url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.get<ApicallInterface>(url + '/task-user-completed/view', options);
  }

  // Marquer une tache complété
  postCompleteTask(body: string, url: string, options: { headers: HttpHeaders }): Observable<ApicallInterface> {
    return this.http.post<ApicallInterface>(url + '/task-user-completed/complete-task', body, options);
  }
}
