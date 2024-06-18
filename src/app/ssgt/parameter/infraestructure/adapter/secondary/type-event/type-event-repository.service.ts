import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { TypeEventRepositoryPort } from '../../../../../parameter/core/port/out/type-event/type-event-repository.port';
import { TypeEventModel } from '../../../../../parameter/core/domain/type-event/type-event.model';

@Injectable({
  providedIn: 'root'
})
export class TypeEventRepositoryService implements TypeEventRepositoryPort {

  private apiUrl: string = environment.url + 'v2/type_event/';

  constructor(
      private http: HttpClient
  ) {}
  getLists(): Observable<TypeEventModel[]> {
    throw new Error('Method not implemented.');
  }
  findID(id: Number): Observable<TypeEventModel[]> {
    return this.http.get<TypeEventModel[]>(this.apiUrl + id);
  }
  save(data: TypeEventModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: TypeEventModel): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.put<any>(this.apiUrl + id, data, {headers: header});
  }
  delete(id: Number): Observable<any> {
    const header = helpers.headersHttp('application/json'); 
    return this.http.delete<any>(this.apiUrl + id, {headers: header});
  }

  findAll(): Observable<TypeEventModel[]> {
    return this.http.get<TypeEventModel[]>(this.apiUrl);
  }
}
