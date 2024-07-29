import { Injectable, inject } from '@angular/core';
import { AgentInjuryCrudPort } from '../../port/in/agent-injury/agent-injury-crud.port';
import { Observable } from 'rxjs';
import { AgentInjuryModelResponse, AgentInjuryModelRequest } from '../../domain/agent-injury/agent-injury.model';
import { AgentInjuryRepositoryService } from '../../../infraestructure/adapter/secondary/agent-injury/agent-injury-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AgentInjuryService implements AgentInjuryCrudPort {

  private agentInjuryRepositoryService = inject(AgentInjuryRepositoryService);

  constructor() { }
  save(data: AgentInjuryModelRequest): Observable<any> {
    return this.agentInjuryRepositoryService.save(data);
  }
  update(id: Number, data: AgentInjuryModelRequest): Observable<any> {
    return this.agentInjuryRepositoryService.update(id, data);
  }
  delete(id: Number): Observable<any> {
    return this.agentInjuryRepositoryService.delete(id);
  }
  findId(id: Number): Observable<AgentInjuryModelResponse[]> {
    return this.agentInjuryRepositoryService.findID(id);
  }

  getListAgentInjury(): Observable<AgentInjuryModelResponse[]> {
    return this.agentInjuryRepositoryService.findAll();

  }

}
