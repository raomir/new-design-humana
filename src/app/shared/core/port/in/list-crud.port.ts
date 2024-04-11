import { Observable } from 'rxjs';
import { List } from '../../domain/list.model';

export interface ListCrudPort {
    getLists(): Observable<List[]>;
}