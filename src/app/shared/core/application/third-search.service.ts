import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdSearchCrudPort } from '../port/in/third-search-crud.port';
import { ThirdSearchRepositoryService } from '../../infraestructure/adapter/secondary/third-search-repository.service';

@Injectable({ providedIn: 'root' })
export class ThirdSearchService implements ThirdSearchCrudPort {

  private repository: ThirdSearchRepositoryService = inject(ThirdSearchRepositoryService);
  public url: string = 'url2';

  getInitialData(): Observable<any> {
    this.repository.url = this.url;
    return this.repository.getInitialData();
  }
  search(data: any): Observable<any> {
    this.repository.url = this.url;
    return this.repository.search(data);
  }
}
