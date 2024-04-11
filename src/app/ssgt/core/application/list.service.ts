import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListCrudPort } from '../port/in/list-crud.port';
import { List } from '../domain/list.model';
import { ListRepositoryPort } from '../port/out/list-repository.port';

@Injectable({ providedIn: 'root' })
export class ListService implements ListCrudPort{

  constructor(private repository: ListRepositoryPort){}

  getLists(): Observable<List[]> {
    return this.repository.findByAll();
  }

}
