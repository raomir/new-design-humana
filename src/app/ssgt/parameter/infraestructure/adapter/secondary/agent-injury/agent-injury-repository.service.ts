import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentInjuryModelRequest, AgentInjuryModelResponse } from 'src/app/ssgt/parameter/core/domain/agent-injury/agent-injury.model';
import { AgentInjuryRepositoryPort } from 'src/app/ssgt/parameter/core/port/out/agent-injury/agent-injury-repository.port';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentInjuryRepositoryService implements AgentInjuryRepositoryPort {

  private apiUrl: string = environment.url + 'v2/agentInjury';

  constructor( private http: HttpClient ) { }

  findAll(): Observable<AgentInjuryModelResponse[]> {
     return this.http.get<AgentInjuryModelResponse[]>(this.apiUrl);
  }
  findID(id: Number): Observable<AgentInjuryModelResponse[]> {
    return this.http.get<AgentInjuryModelResponse[]>(this.apiUrl +"/"+ id);
  }
  save(data: AgentInjuryModelRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  update(id: Number, data: AgentInjuryModelRequest): Observable<any> {
    return this.http.put(this.apiUrl +"/"+ id, data);
  }
  delete(id: Number): Observable<any> {
    return this.http.delete(this.apiUrl +"/"+ id);
  }

}
