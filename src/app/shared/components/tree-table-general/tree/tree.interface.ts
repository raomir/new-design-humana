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
        code: string;
        name: string;
        level: number;
        active: number;
        createdAt: number | null;
        updatedAt: number | null;
        deletedAt: number | null;
    };
    children?: TreeNodeGeneral[];
  }

  export interface ItemData {
        id: number;
        code: string;
        name: string;
        level: number;
        active: number;
        createdAt: number | null;
        updatedAt: number | null;
        deletedAt: number | null;
  }