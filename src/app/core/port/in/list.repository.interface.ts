import { Observable } from 'rxjs';

import { List } from '../../domain/list.model';

export abstract class ListRepository {
 abstract getLists(): Observable<List[]>;
}