export class AccidentCausesModel {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
    level?: number;
    accidentCauses?: AccidentCausesModel | null;
    active?: number | boolean;
}
