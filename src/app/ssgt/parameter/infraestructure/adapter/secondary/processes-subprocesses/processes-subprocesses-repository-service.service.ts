import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ModeloProcessesSubprocessesModel } from '../../../../core/domain/processes-subprocesses/modelo-processes-subprocesses.model';
import { Observable } from 'rxjs';
import { ProcessesSubprocessesRepositoryPort } from '../../../../core/port/out/processes-subprocesses/processes-subprocesses-repository.port';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';

@Injectable({
  providedIn: 'root',
})
export class ProcessesSubprocessesRepositoryServiceService implements ProcessesSubprocessesRepositoryPort{

  private apiUrl: string = environment.url + 'procesos/';


  constructor( 
    private http: HttpClient) { }
 
  findById(id: number): Observable<ModeloProcessesSubprocessesModel> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.get<ModeloProcessesSubprocessesModel>(this.apiUrl + id, {headers: header});
  }

  findAll(): Observable<ModeloProcessesSubprocessesModel[]> {
    return this.http.get<ModeloProcessesSubprocessesModel[]>(this.apiUrl);
  }

  save(data: ModeloProcessesSubprocessesModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.post(this.apiUrl, data,{headers: header});
  }

  update(id: number, data: ModeloProcessesSubprocessesModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put(this.apiUrl + id, data,{headers: header});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + id);
  }

}
