import { Observable } from "rxjs";
import { FirstAidModelResponse, FirstAidModelRequest } from '../../../domain/first-aid/first-aid.model';

export interface FirstAidRepositoryPort {
    findAll(): Observable<FirstAidModelResponse[]>;
    findID(id: Number): Observable<FirstAidModelResponse[]>;
    save(data: FirstAidModelRequest): Observable<any>;
    update(id: Number, data: FirstAidModelRequest): Observable<any>;
    delete(id: Number): Observable<any>;
}
