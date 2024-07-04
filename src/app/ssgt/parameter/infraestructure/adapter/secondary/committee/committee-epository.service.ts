import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { CommitteeModel } from '../../../../core/domain/committee/committee.model';
import { CommitteeRepositoryPort } from '../../../../core/port/out/committee/committee-repository.port';
import { CommitteesDetailsModel } from '../../../../core/domain/committee/ommitteesDetails.model';

@Injectable({
  providedIn: 'root'
})
export class CommitteeRepositoryService implements CommitteeRepositoryPort {

  private apiUrl: string = environment.url + 'v2/committees/';
  private apiUrlDetails: string = environment.url + 'v2/committees/details/';

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

  findDetailsID(id: Number): Observable<CommitteesDetailsModel[]> {
    return this.http.get<CommitteesDetailsModel[]>(this.apiUrlDetails + id);
  }
  saveDetails(data: CommitteesDetailsModel): Observable<any> {
    return this.http.post<any>(this.apiUrlDetails, data);
  }
  updateDetails(id: Number, data: CommitteesDetailsModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put<any>(this.apiUrlDetails + id, data, {headers: header});
  }
  deleteDetails(id: Number): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.delete<any>(this.apiUrlDetails + id, {headers: header});
  }
}
