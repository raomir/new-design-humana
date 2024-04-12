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

    findByAll(): Observable<List[]> {
        return this.http.get<List[]>(this.apiUrl);
    }
}