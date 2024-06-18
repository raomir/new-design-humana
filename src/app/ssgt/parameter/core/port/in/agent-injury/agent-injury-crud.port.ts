import { Observable } from "rxjs";
import { AgentInjuryModelRequest, AgentInjuryModelResponse } from "../../../domain/agent-injury/agent-injury.model";

export interface AgentInjuryCrudPort {
    getListAgentInjury(): Observable<AgentInjuryModelResponse[]>;
    findId(id: Number): Observable<AgentInjuryModelResponse[]>
    save(data: AgentInjuryModelRequest): Observable<any>;
    update(id: Number, data: AgentInjuryModelRequest): Observable<any>;
    delete(id: Number): Observable<any>;
}
