import { Observable } from 'rxjs';
import { List } from '../../domain/list.model';

export interface ListRepositoryPort {
  findAll(endPoint: string): Observable<List[]>;
  findById(id: Number, endPoint: string): Observable<List>;
  save(data: List, endPoint: string): Observable<any>;
  update(data: List, endPoint: string, id: Number): Observable<any>;
  delete(endPoint: string, id: Number): Observable<any>;
  getHazardClassList(): Observable<any[]>;
}