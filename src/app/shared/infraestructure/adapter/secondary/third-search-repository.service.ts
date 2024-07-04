import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import * as helpers from 'src/app/shared/core/application/config/helpers.service.imp';
import { ThirdSearchRepositoryPort } from 'src/app/shared/core/port/out/third-search-repository.port';

@Injectable({ providedIn: 'root' })
export class ThirdSearchRepositoryService implements ThirdSearchRepositoryPort {

    public _url: string = 'url2'
    private type: string = 'application/x-www-form-urlencoded'

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

    private apiUrl: string = environment.url;
    public headers = helpers.headersHttp('application/x-www-form-urlencoded');

    constructor(
        private http: HttpClient
    ) {
    }

    /**
     * Retrieves the initial parameters for the product search
     */
    getInitialData(): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        return this.http.get(`${this.apiUrl}comtercero/create_search/`, { headers: this.headers });
    }

    /**
     * Makes an HTTP request to the backend to retrieve filtered product information
     */
    search(data: any): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        return this.http.post(`${this.apiUrl}comtercero/advance_searching`, data, { headers: this.headers });
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
