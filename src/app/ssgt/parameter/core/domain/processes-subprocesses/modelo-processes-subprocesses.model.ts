export interface ModeloProcessesSubprocessesModel {
    id?: number;
    codigo?: any;
    nombre?: any;
    izquierda?: any;
    derecha?: any;
    nivel?: any;
    hijos?: ModeloProcessesSubprocessesModel[];
    padre?: any;
    _proceso?: any;
    _codigo?: any;
    _activo?: any;
    activo?: boolean | number;
    deletedAt?: number | null;
}
