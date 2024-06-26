import { Observable } from 'rxjs';
import { CommitteeModel } from '../../../domain/committee/committee.model';

export interface CommitteeRepositoryPort {
    getLists(): Observable<CommitteeModel[]>;
    save(data: CommitteeModel): Observable<any>;
    update(id: Number, data: CommitteeModel): Observable<any>;
    delete(id: Number): Observable<any>;
    findID(id: Number): Observable<CommitteeModel[]>;
}