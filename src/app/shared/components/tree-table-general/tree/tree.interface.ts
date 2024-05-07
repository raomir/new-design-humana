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
    llave?: TreeNodeGeneral | null;
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
  llave?: BackendNode | null;
  activo: number;
}

//* Modelo general para Procesos y subprocesos
export interface BackendNodeProces {
  modificadoEn: any;
  eliminadoEn: any;
  id: number;
  codigo: string;
  nombre: string;
  nivel: number;
  padre?: BackendNodeProces | null;
  activo: number;
}

export interface TreeNodeGeneralProce {
  data: {
    id: number;
    code?: string;
    name?: string;
    level: number;
    active?: number;
    favorite?: number | null;
    isLast?: boolean;
    hiddenButtons?: string[];
    padre?: TreeNodeGeneralProce | null;
  };
  children?: TreeNodeGeneralProce[];
}
