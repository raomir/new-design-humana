import { Injectable, inject } from '@angular/core';
import { ProcessesSubprocessesCrudPort } from '../../port/in/processes-subprocesses/processes-subprocesses-crud.port';
import { Observable } from 'rxjs';
import { ModeloProcessesSubprocessesModel } from '../../domain/processes-subprocesses/modelo-processes-subprocesses.model';
import { ProcessesSubprocessesRepositoryServiceService } from '../../../infraestructure/adapter/secondary/processes-subprocesses/processes-subprocesses-repository-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessesSubprocessesService implements ProcessesSubprocessesCrudPort {
 
  private processesSubprocessesRepositoryServiceService = inject(ProcessesSubprocessesRepositoryServiceService);

  finAll(): Observable<ModeloProcessesSubprocessesModel[]> {
    return this.processesSubprocessesRepositoryServiceService.findAll();
  }

  findById(id: number): Observable<ModeloProcessesSubprocessesModel> {
    return this.processesSubprocessesRepositoryServiceService.findById(id);
  }

  save(data: ModeloProcessesSubprocessesModel): Observable<any> {
    return this.processesSubprocessesRepositoryServiceService.save(data);
  }

  update(id: number, data: ModeloProcessesSubprocessesModel): Observable<any> {
    return this.processesSubprocessesRepositoryServiceService.update(id, data);
  }

  delete(id: number): Observable<any> {
    return this.processesSubprocessesRepositoryServiceService.delete(id);
  }
  
}
