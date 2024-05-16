export interface TypeEventModel {
    activo: number;
    codigo: string;
    comFormulario: any;
    createdAt: Date | null;
    deletedAt: Date | null;
    descripcion: string;
    favorito: number;
    id: number;
    nivel: number;
    nombre: string;
    padre: TypeEventModel | null;
    updateAt: number;    
}
