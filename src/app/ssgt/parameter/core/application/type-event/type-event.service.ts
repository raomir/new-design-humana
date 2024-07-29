import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeEventCrudPort } from '../../port/in/type-event/type-event-crud.port';
import { TypeEventRepositoryService } from '../../../infraestructure/adapter/secondary/type-event/type-event-repository.service';
import { TypeEventModel } from '../../domain/type-event/type-event.model';

@Injectable({
  providedIn: 'root'
})
export class TypeEventService implements TypeEventCrudPort {

  private activityRepositoryService = inject(TypeEventRepositoryService)

  constructor() { }
  findID(id: Number): Observable<TypeEventModel[]> {
    return this.activityRepositoryService.findID(id);
  }
  save(data: TypeEventModel): Observable<any> {
    return this.activityRepositoryService.save(data);
  }
  update(id: Number, data: TypeEventModel): Observable<any> {
    return this.activityRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.activityRepositoryService.delete(id);
  }
  getLists(): Observable<TypeEventModel[]> {
    return this.activityRepositoryService.findAll();
  }

}
