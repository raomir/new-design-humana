import { JsonParams } from "../../components/table-general/col/col";

interface Column {
    data: string;
    name: string;
    searchable: boolean;
    orderable: boolean;
    search: {
        value: string;
        regex: boolean;
    };
}

export interface Input {
    draw?: number;
    columns?: Column[];
    order?: {
        column: number;
        dir: string;
    }[];
    start?: number;
    length?: number;
    search?: {
        value: string;
        regex: boolean;
    };
    pageCurrent?: number;
    params?: any[];
    totalRows?: number;
    pages?: number;
}

export interface Exportadores {
  registrosPorPagina: number;
  paginas: number;
  paginaActual: number;
  tipoArchivo: string | String | undefined;
  rango: string;
  orderBy: string;
}

export interface ExportDataInterface {
    exportar?: boolean;
    input?: Input | JsonParams | undefined;
    tipoExportacion?: any;
    exportadores?: Exportadores;
}

export class ExportData implements ExportDataInterface {
    constructor(
        public exportar?: boolean,
        public input?: Input | JsonParams | undefined,
        public tipoExportacion?: any,
        public exportadores?: any
    ) {}
}