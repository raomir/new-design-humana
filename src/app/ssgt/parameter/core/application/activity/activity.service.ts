import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityRepositoryService } from '../../../infraestructure/adapter/secondary/activity/activity-repository.service';
import { ActivityCrudPort } from '../../port/in/activity/activity-crud.port';
import { ActivityModel } from '../../domain/activity/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService implements ActivityCrudPort {

  private activityRepositoryService = inject(ActivityRepositoryService)

  constructor() { }
  findID(id: Number): Observable<ActivityModel[]> {
    return this.activityRepositoryService.findID(id);
  }
  save(data: ActivityModel): Observable<any> {
    return this.activityRepositoryService.save(data);
  }
  update(id: Number, data: ActivityModel): Observable<any> {
    return this.activityRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.activityRepositoryService.delete(id);
  }
  getLists(): Observable<ActivityModel[]> {
    return this.activityRepositoryService.findAll();
  }

}
