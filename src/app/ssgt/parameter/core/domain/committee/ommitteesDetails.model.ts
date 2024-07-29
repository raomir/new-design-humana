import { RequestList, response } from "../../../../../shared/core/domain/list.model";
import { CommitteeModel } from "./committee.model";

export interface CommitteeInterface {
    id: number;
    committee: CommitteeModel;
    rolCommittee: RequestList | response | any;
    employee: any;
    position: any;
}

export class CommitteesDetailsModel implements CommitteeInterface {
    id: number;
    committee: CommitteeModel;
    rolCommittee: RequestList | response | any;
    employee: any;
    position: any;

    constructor(data: CommitteesDetailsModel | any) {
        this.id = data.id;
        this.committee = new CommitteeModel(data.committee);
        this.rolCommittee = data.rolCommittee;
        this.employee = data.employee;
        this.position = data.position;
    }
}