import { Observable } from "rxjs";
import { FirstAidModelRequest, FirstAidModelResponse, ChargeModelResponse } from '../../../domain/first-aid/first-aid.model';

export interface FirstAidCrudPort {

    findAll(): Observable<FirstAidModelResponse[]>;

    findID(id: Number): Observable<FirstAidModelResponse[]>;

    save(data: FirstAidModelRequest): Observable<any>;

    update(id: Number, data: FirstAidModelRequest): Observable<any>;

    delete(id: Number): Observable<any>;

    findChargeByEmployeeId(id: Number): Observable<ChargeModelResponse[]>;
}
