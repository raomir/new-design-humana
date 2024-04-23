import { Observable } from "rxjs";
import { AccidentCausesModel } from '../../../domain/accident-causes/accident-causes.model';

export interface AccidentCausesRepositoryPort {
    findAll(): Observable<AccidentCausesModel[]>;
    findID(id: Number): Observable<AccidentCausesModel[]>;
    save(data: AccidentCausesModel): Observable<any>;
    update(id: Number, data: AccidentCausesModel): Observable<any>;
    delete(id: Number): Observable<any>
}
