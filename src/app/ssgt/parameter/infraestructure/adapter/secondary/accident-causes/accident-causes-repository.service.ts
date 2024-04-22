import { Injectable } from '@angular/core';
import { AccidentCausesRepositoryPort } from '../../../../core/port/out/accident-causes/accident-causes-repository.port';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from 'src/app/ssgt/parameter/core/domain/accident-causes/accident-causes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';

@Injectable({
  providedIn: 'root'
})
export class AccidentCausesRepositoryService implements AccidentCausesRepositoryPort {

  private apiUrl: string = environment.url + 'causas_accidente/';

  constructor(
      private http: HttpClient
  ) {}
  findID(id: Number): Observable<AccidentCausesModel[]> {
    return this.http.get<AccidentCausesModel[]>(this.apiUrl + id);
  }
  save(data: AccidentCausesModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: AccidentCausesModel): Observable<any> {
    const header = helpers.headersHttp(); 
    return this.http.put<any>(this.apiUrl + id, data, {headers: header});
  }
  delete(id: Number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + id);
  }

  findAll(): Observable<AccidentCausesModel[]> {
    return this.http.get<AccidentCausesModel[]>(this.apiUrl);
  }
}
