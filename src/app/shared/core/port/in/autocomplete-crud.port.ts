import { Observable } from 'rxjs';

export interface AutocompleteCrudPort {
    url: string;
    searchByGet(endPoint: string, search: string): Observable<any>;
    searchByPost(endPoint: string, data: any): Observable<any>;
}