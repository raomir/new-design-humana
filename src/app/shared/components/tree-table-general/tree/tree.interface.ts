export interface ColumnGeneral {
  field?: string;
  header?: string;
}

export enum ActivoIcon {
  check = 'pi pi-check',
  times = 'pi pi-times'
}

export interface TreeNodeGeneral {
  data: {
    id: number;
    code?: string;
    name?: string;
    level: number;
    active?: number;
    favorite?: number | null;
    isLast?: boolean;
    hiddenButtons?: string[];
    description?: string;
  };
  children?: TreeNodeGeneral[];
}



export interface ItemData {
  id: number;
  code: string;
  name: string;
  level: number;
  active: number;
  favorite: number | null;
  description: string;
}

export interface BackendNode {
  creadoEn: any;
  modificadoEn: any;
  eliminadoEn: any;
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  izquierda: number;
  derecha: number;
  nivel: number;
  llave?: BackendNode;
  activo: number;
}

export interface TreeTableData {

}