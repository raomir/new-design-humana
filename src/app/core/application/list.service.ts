import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListRepository } from '../port/in/list.repository.interface';
import { List } from '../domain/list.model';
import { ListComponentService } from 'src/app/infraestructure/service/listComponent.service';

@Injectable({
  providedIn: 'root'
})
export class ListService implements ListRepository{

    constructor(private service: ListComponentService){}

    getLists(): Observable<List[]> {
        return this.service.getData();
    }


}
