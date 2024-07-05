import { Injectable, inject } from '@angular/core';
import { FirstAidCrudPort } from '../../port/in/first-aid/first-aid-crud.port';
import { Observable } from 'rxjs';
import { FirstAidModelResponse, FirstAidModelRequest, ChargeModelResponse } from '../../domain/first-aid/first-aid.model';
import { FirstAidRepositoryService } from '../../../infraestructure/adapter/secondary/first-aid/first-aid-repository.service';

@Injectable({
  providedIn: 'root'
})
export class FirstAidService implements FirstAidCrudPort {

  private firstAidRepositoryService = inject(FirstAidRepositoryService)

  constructor() { }
  
  findAll(): Observable<FirstAidModelResponse[]> {
    return this.firstAidRepositoryService.findAll();
  }
  findID(id: Number): Observable<FirstAidModelResponse[]> {
    return this.firstAidRepositoryService.findID(id);
  }
  save(data: FirstAidModelRequest): Observable<any> {
    return this.firstAidRepositoryService.save(data);
  }
  update(id: Number, data: FirstAidModelRequest): Observable<any> {
    return this.firstAidRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.firstAidRepositoryService.delete(id);
  }

  findChargeByEmployeeId(id: Number): Observable<ChargeModelResponse[]> {
    return this.firstAidRepositoryService.findChargeByEmployeeId(id);
  }
}
