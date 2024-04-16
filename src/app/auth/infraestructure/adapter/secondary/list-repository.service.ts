import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { List } from 'src/app/shared/core/domain/list.model'
import { ListRepositoryPort } from 'src/app/shared/core/port/out/list-repository.port'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })
export class ListRepositoryService implements ListRepositoryPort {

    private apiUrl: string = environment.url;

    constructor(
        private http: HttpClient
    ) {}
    findById(id: Number, endPoint: string): Observable<List> {
        throw new Error('Method not implemented.')
    }
    save(data: List, endPoint: string): Observable<any> {
        throw new Error('Method not implemented.')
    }
    update(data: List, endPoint: string, id: Number): Observable<any> {
        throw new Error('Method not implemented.')
    }
    delete(endPoint: string, id: Number): Observable<any> {
        throw new Error('Method not implemented.')
    }

    findByAll(): Observable<List[]> {
        return this.http.get<List[]>(this.apiUrl);
    }
}
