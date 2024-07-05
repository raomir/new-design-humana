import { Injectable } from '@angular/core';
import { FirstAidRepositoryPort } from '../../../../core/port/out/first-aid/first-aid-repository.port';
import { Observable } from 'rxjs';
import { FirstAidModelResponse, FirstAidModelRequest } from 'src/app/ssgt/management/core/domain/first-aid/first-aid.model';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChargeModelResponse } from '../../../../core/domain/first-aid/first-aid.model';

@Injectable({
  providedIn: 'root'
})
export class FirstAidRepositoryService implements FirstAidRepositoryPort {

  private apiUrl: string = environment.url + 'v2/firstAid'
  private apiUrlCharge: string = environment.url + 'v2/links/filterByEmployee/';

  constructor(private http: HttpClient) { }

  findAll(): Observable<FirstAidModelResponse[]> {
    return this.http.get<FirstAidModelResponse[]>(this.apiUrl);
  }
  findID(id: Number): Observable<FirstAidModelResponse[]> {
    return this.http.get<FirstAidModelResponse[]>(this.apiUrl +"/"+ id);
  }
  save(data: FirstAidModelRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  update(id: Number, data: FirstAidModelRequest): Observable<any> {
    return this.http.put(this.apiUrl +"/"+ id, data);
  }
  delete(id: Number): Observable<any> {
    return this.http.delete(this.apiUrl +"/"+ id);
  }

  findChargeByEmployeeId(id: Number): Observable<ChargeModelResponse[]> {
    return this.http.get<ChargeModelResponse[]>(this.apiUrlCharge + id);
  }
}
