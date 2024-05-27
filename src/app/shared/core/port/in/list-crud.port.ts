import { Observable } from 'rxjs';
import { List, RequestList } from '../../domain/list.model';

export interface ListCrudPort {
    findAll(endPoint: string): Observable<List[]>;
    findById(id: Number, endPoint: string): Observable<List>;
    save(data: RequestList, endPoint: string): Observable<any>;
    update(data: RequestList, endPoint: string, id: Number): Observable<any>;
    delete(endPoint: string, id: Number): Observable<any>;
}