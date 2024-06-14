import { Observable } from 'rxjs';
import { TypeEventModel } from '../../../domain/type-event/type-event.model';

export interface TypeEventRepositoryPort {
    getLists(): Observable<TypeEventModel[]>;
    save(data: TypeEventModel): Observable<any>;
    update(id: Number, data: TypeEventModel): Observable<any>;
    delete(id: Number): Observable<any>;
    findID(id: Number): Observable<TypeEventModel[]>;
}