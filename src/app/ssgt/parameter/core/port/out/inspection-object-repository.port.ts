import { Observable } from 'rxjs';
import { InspecionObject } from '../../domain/inspection-object.model';

export interface InspectionObjectRepositoryPort {
  findById(id: Number): Observable<InspecionObject>;
  save(data: InspecionObject): Observable<any>;
  update(data: InspecionObject, id: Number): Observable<any>;
  delete(id: Number): Observable<any>;
}