import { Observable } from 'rxjs';
import { CommitteeModel } from '../../../domain/committee/committee.model';
import { CommitteesDetailsModel } from '../../../domain/committee/ommitteesDetails.model';

export interface CommitteeRepositoryPort {
    getLists(): Observable<CommitteeModel[]>;
    save(data: CommitteeModel): Observable<any>;
    update(id: Number, data: CommitteeModel): Observable<any>;
    delete(id: Number): Observable<any>;
    findID(id: Number): Observable<CommitteeModel[]>;
    findDetailsID(id: Number): Observable<CommitteesDetailsModel[]>;
    saveDetails(data: CommitteesDetailsModel): Observable<any>;
    updateDetails(id: Number, data: CommitteesDetailsModel): Observable<any>;
    deleteDetails(id: Number): Observable<any>;
}