import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommitteeCrudPort } from '../../port/in/committee/committee-crud.port';
import { CommitteeRepositoryService } from '../../../infraestructure/adapter/secondary/committee/committee-epository.service';
import { CommitteeModel } from '../../domain/committee/committee.model';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService implements CommitteeCrudPort {

  private committeeRepositoryService = inject(CommitteeRepositoryService)

  constructor() { }
  findID(id: Number): Observable<CommitteeModel[]> {
    return this.committeeRepositoryService.findID(id);
  }
  save(data: CommitteeModel): Observable<any> {
    return this.committeeRepositoryService.save(data);
  }
  update(id: Number, data: CommitteeModel): Observable<any> {
    return this.committeeRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.committeeRepositoryService.delete(id);
  }
  getLists(): Observable<CommitteeModel[]> {
    return this.committeeRepositoryService.findAll();
  }

}
