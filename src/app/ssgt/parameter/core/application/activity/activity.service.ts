import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from '../../domain/accident-causes/accident-causes.model';
import { ActivityRepositoryService } from '../../../infraestructure/adapter/secondary/activity/activity-repository.service';
import { ActivityCrudPort } from '../../port/in/activity/activity-crud.port';

@Injectable({
  providedIn: 'root'
})
export class ActivityService implements ActivityCrudPort {

  private activityRepositoryService = inject(ActivityRepositoryService)

  constructor() { }
  findID(id: Number): Observable<AccidentCausesModel[]> {
    return this.activityRepositoryService.findID(id);
  }
  save(data: AccidentCausesModel): Observable<any> {
    return this.activityRepositoryService.save(data);
  }
  update(id: Number, data: AccidentCausesModel): Observable<any> {
    return this.activityRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.activityRepositoryService.delete(id);
  }
  getLists(): Observable<AccidentCausesModel[]> {
    return this.activityRepositoryService.findAll();
  }

}
