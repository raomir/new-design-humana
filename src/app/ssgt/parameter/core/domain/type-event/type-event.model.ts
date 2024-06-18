export interface TypeEventModel {
    active: number | boolean | 1 | 2;
    code: string;
    form: any; 
    createdAt?: Date | null;
    deletedAt?: Date | null;
    description: string;
    favorite?: number | boolean | 1 | 2;
    id?: number;
    level: number;
    name: string;
    typeEvent?: TypeEventModel | null; 
    updateAt?: Date | null;    
}
