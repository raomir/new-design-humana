import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AutocompleteRepositoryPort } from '../../../core/port/out/autocomplete-repository.port';

@Injectable({ providedIn: 'root' })
export class AutocompleteRepositoryService implements AutocompleteRepositoryPort {

    private apiUrl: string = environment.url;

    constructor(
        private http: HttpClient
    ) { }

    searchByGet(endPoint: string, search: string): Observable<any> {
        return this.http.get<any>(this.apiUrl + `${endPoint}/${search}`);
    }

    searchByPost(endPoint: string, data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + endPoint, data);
    }

}
