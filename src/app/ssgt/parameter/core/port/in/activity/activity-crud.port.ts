import { Observable } from 'rxjs';
import { ActivityModel } from '../../../domain/activity/activity.model';

export interface ActivityCrudPort {
    getLists(): Observable<ActivityModel[]>;
    save(data: ActivityModel): Observable<any>;
    update(id: Number, data: ActivityModel): Observable<any>;
    delete(id: Number): Observable<any>;
    findID(id: Number): Observable<ActivityModel[]>;
}