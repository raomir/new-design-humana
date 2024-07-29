import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import * as helpers from 'src/app/shared/core/application/config/helpers.service.imp';
import { ProductSearchRepositoryPort } from 'src/app/shared/core/port/out/product-search-repository.port';

@Injectable({ providedIn: 'root' })
export class ProductSearchRepositoryService implements ProductSearchRepositoryPort {

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
        return this.http.get(`${this.apiUrl}comproductos/buscador/listas`, { headers: this.headers });
    }

    /**
     * Makes an HTTP request to the backend to retrieve filtered product information
     */
    search(data: any): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        return this.http.post(`${this.apiUrl}comproductos/buscador/data`, `json=${JSON.stringify(data)}`, { headers: this.headers });
    }

    /**
     * Retrieves brands by brand group
     * @param id
     */
    getBrands(id: null | undefined): Observable<any> | null {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        if (id !== null && id !== undefined) {
            return this.http.get(`${this.apiUrl}comproductos/obtenermarcas/${id}`, { headers: this.headers });
        } else {
            return null;
        }
    }

    /**
     * Makes an HTTP request to retrieve category information
     */
    searchCategories(id: any): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        return this.http.post(`${this.apiUrl}comcategoria/data`, `json=${JSON.stringify(id)}`, { headers: this.headers });
    }

    getVariant(id: string, idLocation: string, idWarehouse: string, idHeader: string): Observable<any> {
        this.setUrl();
        this.headers = helpers.headersHttp(this.type);
        return this.http.get(`${this.apiUrl}comproductos/nombre/` + id + ` ` + idLocation + '/' + idWarehouse + '/' + idHeader, { headers: this.headers });
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
