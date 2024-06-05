import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ListCrudPort } from '../port/in/list-crud.port';
import { List, RequestList } from '../domain/list.model';
import { ListRepositoryService } from '../../infraestructure/adapter/secondary/list-repository.service';

@Injectable({ providedIn: 'root' })
export class ListService implements ListCrudPort {

  private repository = inject(ListRepositoryService)
  
  findAll(endPoint: string): Observable<List[]> {
    return this.repository.findAll(endPoint);
  }

  findAllTree(endPoint: string): Observable<List[]> {
    return this.repository.findAllTree(endPoint);
  }

  findById(id: Number, endPoint: string): Observable<List> {
    return this.repository.findById(id, endPoint);
  }

  save(data: RequestList, endPoint: string): Observable<any> {
    return this.repository.save(data, endPoint);
  }

  update(data: RequestList, endPoint: string, id: Number): Observable<any> {
    return this.repository.update(data, endPoint, id);
  }

  delete(endPoint: string, id: Number): Observable<any> {
    return this.repository.delete(endPoint, id);
  }

  getHazardClassList(): Observable<any[]> {
    return this.repository.getHazardClassList();
  }

}
