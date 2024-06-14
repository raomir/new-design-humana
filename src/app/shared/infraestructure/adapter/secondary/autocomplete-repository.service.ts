import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AutocompleteRepositoryPort } from '../../../core/port/out/autocomplete-repository.port';
import * as helpers from 'src/app/shared/core/application/config/helpers.service.imp';

@Injectable({ providedIn: 'root' })
export class AutocompleteRepositoryService implements AutocompleteRepositoryPort {

    public _url: string = 'url'

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

    private apiUrl: string = environment.url;
    public headers = helpers.headersHttp('application/json');

    constructor(
        private http: HttpClient
    ) {
    }

    searchByGet(endPoint: string, search: string): Observable<any> {
        this.setUrl();
        return this.http.get<any>(this.apiUrl + `${endPoint}/${search}`);
    }

    searchByPost(endPoint: string, data: any, type: string = 'application/json'): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(type);
        return this.http.post<any>(this.apiUrl + endPoint, data, { headers: this.headers });
    }

    setUrl(): void {
        if (this.url =='url') {
            this.apiUrl = environment.url;
        }
        if (this.url =='url2') {
            this.apiUrl = environment.url_sinergia;
        }
    } 

}
