import { Observable } from 'rxjs';

export interface AutocompleteRepositoryPort {

  searchByGet(endPoint: string, search: string): Observable<any[]>;
  searchByPost(endPoint: string, params: any): Observable<any[]>;

}