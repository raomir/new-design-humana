import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { ActivityRepositoryPort } from '../../../../../parameter/core/port/out/activity/activity-repository.port';
import { ActivityModel } from '../../../../../parameter/core/domain/activity/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityRepositoryService implements ActivityRepositoryPort {

  private apiUrl: string = environment.url + 'v2/activity/';

  constructor(
      private http: HttpClient
  ) {}
  getLists(): Observable<ActivityModel[]> {
    throw new Error('Method not implemented.');
  }
  findID(id: Number): Observable<ActivityModel[]> {
    return this.http.get<ActivityModel[]>(this.apiUrl + id);
  }
  save(data: ActivityModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: ActivityModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put<any>(this.apiUrl + id, data, {headers: header});
  }
  delete(id: Number): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.delete<any>(this.apiUrl + id, {headers: header});
  }

  findAll(): Observable<ActivityModel[]> {
    return this.http.get<ActivityModel[]>(this.apiUrl);
  }
}
