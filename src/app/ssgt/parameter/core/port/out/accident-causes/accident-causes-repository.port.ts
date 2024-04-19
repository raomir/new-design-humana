import { Observable } from "rxjs";
import { AccidentCausesModel } from '../../../domain/accident-causes/accident-causes.model';

export interface AccidentCausesRepositoryPort {
    findAll(): Observable<AccidentCausesModel[]>;
}
