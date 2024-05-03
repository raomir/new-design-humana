import { Observable } from "rxjs";
import { ChargeModel } from "../../../domain/endowments-per-charge/charge.model";
import { EndowmentsPerChargeModel } from "../../../domain/endowments-per-charge/endowments-per-charge.model";

export interface EndowmentsPerChargeRepositoryPort {
    findChargeById(id: Number): Observable<ChargeModel>;
    findById(id: Number): Observable<EndowmentsPerChargeModel>;
}
