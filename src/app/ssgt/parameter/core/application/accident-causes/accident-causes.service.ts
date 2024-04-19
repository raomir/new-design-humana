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
  getLists(): Observable<AccidentCausesModel[]> {
    return this.accidentCausesRepositoryService.findAll();
  }

}
