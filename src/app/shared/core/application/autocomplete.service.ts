import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AutocompleteCrudPort } from '../port/in/autocomplete-crud.port';
import { AutocompleteRepositoryService } from '../../infraestructure/adapter/secondary/autocomplete-repository.service';

@Injectable({ providedIn: 'root' })
export class AutocompleteService implements AutocompleteCrudPort {

  private repository: AutocompleteRepositoryService = inject(AutocompleteRepositoryService);
  public url: string = 'url';

  searchByGet(endPoint: string, search: string): Observable<any> {
    this.repository.url = this.url;
    return this.repository.searchByGet(endPoint, search);
  }

  searchByPost(endPoint: string, data: any, type: string = 'application/json'): Observable<any> {
    this.repository.url = this.url;
    return this.repository.searchByPost(endPoint, data, type);
  }

}
