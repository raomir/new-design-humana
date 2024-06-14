export interface TypeEventModel {
    activo: number | boolean | 1 | 2;
    codigo: string;
    comFormulario: any;
    createdAt?: Date | null;
    deletedAt?: Date | null;
    descripcion: string;
    favorito?: number | boolean | 1 | 2;
    id?: number;
    nivel: number;
    nombre: string;
    padre?: TypeEventModel | null;
    updateAt?: number;    
}
