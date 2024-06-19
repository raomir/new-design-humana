export interface ModeloProcessesSubprocessesModel {
    id?: number;
    code?: any;
    name?: any;
    level?: any;
    father?: ModeloProcessesSubprocessesModel | null;
    active?: boolean | number;
}
