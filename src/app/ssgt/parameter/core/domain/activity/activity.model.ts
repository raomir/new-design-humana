export interface ActivityModel {
    id?: number;
    codigo: string;
    nombre: string;
    izquierda: number;
    derecha: number;
    nivel: number;
    actividadId: ActivityModel | null | any;
    procesoId: Object;
    activoActividad: boolean | number;
}
