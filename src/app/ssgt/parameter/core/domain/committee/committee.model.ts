export interface CommitteeInterface {
    id: number;
    code: string;
    name: string;
    startDate: Date;
    endDate: Date;
    description: string;
    status: number;
}

export class CommitteeModel implements CommitteeInterface {
    id: number;
    code: string;
    name: string;
    startDate: Date;
    endDate: Date;
    description: string;
    status: number;

    constructor(data: any) {
            this.id = data.id;
            this.code = data.code;
            this.name = data.name;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.description = data.description;
            this.status = data.status;
    }
}