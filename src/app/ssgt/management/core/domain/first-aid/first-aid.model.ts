export interface FirstAidModelResponse {
    readonly status?:  number;
    readonly message?: null;
    readonly data?:    Datum[];
    readonly error?:   boolean;
}

export interface FirstAidModelRequest {
    readonly id?:          number;
    readonly date?:        Date | null | undefined | string | number[];
    readonly injury?:      string;
    readonly usedItem?:    string;
    readonly description?: string;
    readonly employee?:    number;
    readonly bonding?:     number;
    readonly inCharge?:    number;
}

export interface Datum {
    readonly id?:          number;
    readonly date?:        number[];
    readonly injury?:      string;
    readonly usedItem?:    string;
    readonly description?: string;
    readonly employee?:    Employee;
    readonly bonding?:     Bonding;
    readonly inCharge?:    Employee;
}

export interface Bonding {
    readonly id?:            number;
    readonly active?:        number | boolean;
    readonly code?:          string;
    readonly charge?:        string;
    readonly positionLevel?: PositionLevel;
    readonly basicWage?:     number;
    readonly minimumWage?:   number;
    readonly description?:   string;
    readonly wageAnalysis?:  string;
    readonly createdAt?:     number[];
    readonly updatedAt?:     number[];
    readonly deletedAt?:     null;
}

export interface PositionLevel {
    readonly id?:            number;
    readonly active?:        number | boolean;
    readonly code?:          string;
    readonly name?:          string;
    readonly description?:   string;
    readonly metadata?:      null | string;
    readonly typeListId?:    number;
    readonly listElementId?: null;
    readonly favorite?:      number;
    readonly createdAt?:     number[];
    readonly updatedAt?:     number[];
    readonly deletedAt?:     null;
}

export interface Employee {
    readonly id?:                     number;
    readonly documentType?:           PositionLevel;
    readonly evaluatorType?:          null;
    readonly documentNumber?:         string;
    readonly name1?:                  string;
    readonly name2?:                  null | string;
    readonly lastName1?:              string;
    readonly lastName2?:              string;
    readonly typeNumberNameLastName?: string;
}

export interface ChargeModelResponse{
    chargeId: number;
    fullNameCharge: string;
}