import { Observable } from 'rxjs';

export interface ThirdSearchRepositoryPort {

  getInitialData(): Observable<any>;
  search(data: any): Observable<any>;
}