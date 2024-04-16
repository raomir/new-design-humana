import { Observable } from 'rxjs';
import { List } from '../../domain/list.model';

export interface ListRepositoryPort {
  findByAll(): Observable<List[]>;
  findById(id: Number, endPoint: string): Observable<List>;
  save(data: List, endPoint: string): Observable<any>;
  update(data: List, endPoint: string, id: Number): Observable<any>;
}