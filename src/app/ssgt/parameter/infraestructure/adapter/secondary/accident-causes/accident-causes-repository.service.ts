import { Injectable } from '@angular/core';
import { AccidentCausesRepositoryPort } from '../../../../core/port/out/accident-causes/accident-causes-repository.port';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from 'src/app/ssgt/parameter/core/domain/accident-causes/accident-causes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccidentCausesRepositoryService implements AccidentCausesRepositoryPort {

  private apiUrl: string = environment.url;

  constructor(
      private http: HttpClient
  ) {}
  

  findAll(): Observable<AccidentCausesModel[]> {
    return this.http.get<AccidentCausesModel[]>(this.apiUrl + 'causas_accidente');
  }
}
