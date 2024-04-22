export class AccidentCausesModel {
    id?: number;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
    nivel?: number;
    llave?: AccidentCausesModel | null;
    activo?: number | boolean;
}
