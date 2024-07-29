export class AgentInjuryModelResponse {
    id?:          number;
    active?:      number | boolean;
    code?:        string;
    name?:        string;
    description?: string;
    dangersList?: DangersList;
}

export class DangersList {
    id?:          number;
    active?:      number | boolean;
    code?:        string;
    name?:        string;
    description?: string;
}


export class AgentInjuryModelRequest {
    active?:      number | boolean;
    code?:        string;
    name?:        string;
    description?: string;
    dangerId?: number;
}

