import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductSearchCrudPort } from '../port/in/product-search-crud.port';
import { ProductSearchRepositoryService } from '../../infraestructure/adapter/secondary/product-search-repository.service';

@Injectable({ providedIn: 'root' })
export class ProductSearchService implements ProductSearchCrudPort {

  private repository: ProductSearchRepositoryService = inject(ProductSearchRepositoryService);
  public url: string = 'url2';

  getInitialData(): Observable<any> {
    this.repository.url = this.url;
    return this.repository.getInitialData();
  }
  search(data: any): Observable<any> {
    this.repository.url = this.url;
    return this.repository.search(data);
  }
  getBrands(id: null | undefined): Observable<any> | null {
    this.repository.url = this.url;
    return this.repository.getBrands(id);
  }
  searchCategories(id: any): Observable<any> {
    this.repository.url = this.url;
    return this.repository.searchCategories(id);
  }
  getVariant(id: any, idLocation: any, idWarehouse: any, idHeader: any): Observable<any> {
    this.repository.url = this.url;
    return this.repository.getVariant(id, idLocation, idWarehouse, idHeader);
  }
}
