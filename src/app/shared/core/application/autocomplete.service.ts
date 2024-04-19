import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AutocompleteCrudPort } from '../port/in/autocomplete-crud.port';
import { AutocompleteRepositoryService } from '../../infraestructure/adapter/secondary/autocomplete-repository.service';

@Injectable({ providedIn: 'root' })
export class AutocompleteService implements AutocompleteCrudPort {

  private repository = inject(AutocompleteRepositoryService)

  searchByGet(endPoint: string, search: string): Observable<any> {
    return this.repository.searchByGet(endPoint, search);
  }

  searchByPost(endPoint: string, data: any): Observable<any> {
    return this.repository.searchByPost(endPoint, data);
  }

}
