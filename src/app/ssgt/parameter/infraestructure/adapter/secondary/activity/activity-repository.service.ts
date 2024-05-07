import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from 'src/app/ssgt/parameter/core/domain/accident-causes/accident-causes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { ActivityRepositoryPort } from 'src/app/ssgt/parameter/core/port/out/activity/activity-repository.port';

@Injectable({
  providedIn: 'root'
})
export class ActivityRepositoryService implements ActivityRepositoryPort {

  private apiUrl: string = environment.url + 'actividad/';

  constructor(
      private http: HttpClient
  ) {}
  getLists(): Observable<AccidentCausesModel[]> {
    throw new Error('Method not implemented.');
  }
  findID(id: Number): Observable<AccidentCausesModel[]> {
    return this.http.get<AccidentCausesModel[]>(this.apiUrl + id);
  }
  save(data: AccidentCausesModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: AccidentCausesModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put<any>(this.apiUrl + id, data, {headers: header});
  }
  delete(id: Number): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.delete<any>(this.apiUrl + id, {headers: header});
  }

  findAll(): Observable<AccidentCausesModel[]> {
    return this.http.get<AccidentCausesModel[]>(this.apiUrl);
  }
}
