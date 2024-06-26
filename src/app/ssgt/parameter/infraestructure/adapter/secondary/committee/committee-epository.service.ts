import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { ActivityRepositoryPort } from '../../../../core/port/out/activity/activity-repository.port';
import { CommitteeModel } from '../../../../core/domain/committee/committee.model';
import { CommitteeRepositoryPort } from '../../../../core/port/out/committee/committee-repository.port';

@Injectable({
  providedIn: 'root'
})
export class CommitteeRepositoryService implements CommitteeRepositoryPort {

  private apiUrl: string = environment.url + 'v2/committees/';

  constructor(
      private http: HttpClient
  ) {}
  getLists(): Observable<CommitteeModel[]> {
    throw new Error('Method not implemented.');
  }
  findID(id: Number): Observable<CommitteeModel[]> {
    return this.http.get<CommitteeModel[]>(this.apiUrl + id);
  }
  save(data: CommitteeModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: CommitteeModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put<any>(this.apiUrl + id, data, {headers: header});
  }
  delete(id: Number): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.delete<any>(this.apiUrl + id, {headers: header});
  }

  findAll(): Observable<CommitteeModel[]> {
    return this.http.get<CommitteeModel[]>(this.apiUrl);
  }
}
