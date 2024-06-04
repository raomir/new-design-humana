export interface ActivityModel {
    id?: number;
    code: string;
    name: string;
    level: number;
    activity?: ActivityModel | null;
    process: ProcessDto;
    active: boolean | number;
}
export interface ProcessDto {
    id: number;
    name: string;
    code: string;
}
