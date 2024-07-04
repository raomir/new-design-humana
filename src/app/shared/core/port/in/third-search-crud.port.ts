import { Observable } from 'rxjs';

export interface ThirdSearchCrudPort {
    getInitialData(): Observable<any>;
    search(data: any): Observable<any>;
}