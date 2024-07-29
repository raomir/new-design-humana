import { Observable } from 'rxjs';

export interface ProductSearchCrudPort {
    getInitialData(): Observable<any>;
    search(data: any): Observable<any>;
    getBrands(id: null | undefined): Observable<any> | null;
    searchCategories(id: any): Observable<any>;
    getVariant(id: any, idLocation: any, idWarehouse: any, idHeader: any): Observable<any>
}