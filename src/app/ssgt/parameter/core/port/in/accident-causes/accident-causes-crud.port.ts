import { Observable } from 'rxjs';
import { AccidentCausesModel } from '../../../domain/accident-causes/accident-causes.model';

export interface AccidentCausesCrudPort {
    getLists(): Observable<AccidentCausesModel[]>;
}