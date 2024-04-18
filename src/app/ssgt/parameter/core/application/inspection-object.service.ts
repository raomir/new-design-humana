import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InspecionObjectCrudPort } from '../port/in/inspection-object-crud.port';
import { InspecionObject } from '../domain/inspection-object.model';
import { InspectionObjectRepositoryService } from '../../infraestructure/adapter/secondary/inspection-object-repository.service';

@Injectable({ providedIn: 'root' })
export class InspecionObjectService implements InspecionObjectCrudPort {

  private repository = inject(InspectionObjectRepositoryService)

  findById(id: Number): Observable<InspecionObject> {
    return this.repository.findById(id);
  }

  save(data: InspecionObject): Observable<any> {
    return this.repository.save(data);
  }

  update(data: InspecionObject, id: Number): Observable<any> {
    return this.repository.update(data, id);
  }

  delete(id: Number): Observable<any> {
    return this.repository.delete(id);
  }

}
