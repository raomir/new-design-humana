import { Observable } from "rxjs";
import { ModeloProcessesSubprocessesModel } from '../../../domain/processes-subprocesses/modelo-processes-subprocesses.model';

export interface ProcessesSubprocessesCrudPort {
    finAll(): Observable<ModeloProcessesSubprocessesModel[]>
    findById(id: number): Observable<ModeloProcessesSubprocessesModel>
    save(data: ModeloProcessesSubprocessesModel): Observable<any>
    update(id: number, data: ModeloProcessesSubprocessesModel,): Observable<any>
    delete(id: number): Observable<any>
}
