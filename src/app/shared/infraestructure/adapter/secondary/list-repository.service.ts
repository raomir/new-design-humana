import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { List, RequestList } from 'src/app/shared/core/domain/list.model'
import { ListRepositoryPort } from 'src/app/shared/core/port/out/list-repository.port'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })
export class ListRepositoryService implements ListRepositoryPort {

    private apiUrl: string = environment.url;

    constructor(
        private http: HttpClient
    ) { }

    findAll(endPoint: string): Observable<List[]> {
        return this.http.get<List[]>(this.apiUrl + endPoint);
    }

    findAllTree(endPoint: string): Observable<List[]> {
        return this.http.get<List[]>(this.apiUrl + endPoint);
    }

    findById(id: Number, endPoint: string): Observable<List> {
        return this.http.get<List>(this.apiUrl + `${endPoint}/${id}`);
    }

    save(data: RequestList, endPoint: string): Observable<any> {
        return this.http.post<any>(this.apiUrl + endPoint, data);
    }

    update(data: RequestList, endPoint: string, id: Number): Observable<any> {
        return this.http.put<any>(this.apiUrl + `${endPoint}/${id}`, data);
    }

    delete(endPoint: string, id: Number): Observable<any> {
        return this.http.delete<any>(this.apiUrl + `${endPoint}/${id}`);
    }

    getHazardClassList(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'clasepeligro');
    }
}
