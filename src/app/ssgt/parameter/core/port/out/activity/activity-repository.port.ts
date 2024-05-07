import { Observable } from 'rxjs';
import { AccidentCausesModel } from '../../../domain/accident-causes/accident-causes.model';

export interface ActivityRepositoryPort {
    getLists(): Observable<AccidentCausesModel[]>;
    save(data: AccidentCausesModel): Observable<any>;
    update(id: Number, data: AccidentCausesModel): Observable<any>;
    delete(id: Number): Observable<any>;
    findID(id: Number): Observable<AccidentCausesModel[]>;
}