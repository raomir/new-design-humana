import { Injectable, inject } from '@angular/core';
import { AccidentCausesCrudPort } from '../../port/in/accident-causes/accident-causes-crud.port';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from '../../domain/accident-causes/accident-causes.model';
import { AccidentCausesRepositoryService } from '../../../infraestructure/adapter/secondary/accident-causes/accident-causes-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AccidentCausesService implements AccidentCausesCrudPort{

  private accidentCausesRepositoryService = inject(AccidentCausesRepositoryService)

  constructor() { }
  findID(id: Number): Observable<AccidentCausesModel[]> {
    return this.accidentCausesRepositoryService.findID(id);
  }
  save(data: AccidentCausesModel): Observable<any> {
    return this.accidentCausesRepositoryService.save(data);
  }
  update(id: Number, data: AccidentCausesModel): Observable<any> {
    return this.accidentCausesRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.accidentCausesRepositoryService.delete(id);
  }
  getLists(): Observable<AccidentCausesModel[]> {
    return this.accidentCausesRepositoryService.findAll();
  }

}
