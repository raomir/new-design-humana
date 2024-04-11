import { Observable } from 'rxjs';
import { List } from '../../domain/list.model';

export interface ListRepositoryPort {
  findByAll(): Observable<List[]>;
}