export class AccidentCausesModel {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    nivel?: number;
    llave?: AccidentCausesModel | null | undefined;
    activo?: number | boolean;
}
