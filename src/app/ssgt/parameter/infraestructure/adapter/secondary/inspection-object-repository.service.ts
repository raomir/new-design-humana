import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { List } from 'src/app/shared/core/domain/list.model'
import { environment } from 'src/environments/environment'
import { InspectionObjectRepositoryPort } from '../../../core/port/out/inspection-object-repository.port'

@Injectable({ providedIn: 'root' })
export class InspectionObjectRepositoryService implements InspectionObjectRepositoryPort {

    private apiUrl: string = environment.url + 'objectoInpeccion/';

    constructor(
        private http: HttpClient
    ) {}

    findById(id: Number): Observable<List> {
        return this.http.get<List>(this.apiUrl + id);
    }

    save(data: List): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    update(data: List, id: Number): Observable<any> {
        return this.http.put<any>(this.apiUrl + id, data);
    }

    delete(id: Number): Observable<any> {
        return this.http.delete<any>(this.apiUrl + id);
    }
}
