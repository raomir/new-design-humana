import { Observable } from 'rxjs';
import { ChargeModel } from '../../../domain/endowments-per-charge/charge.model';
import { EndowmentsPerChargeModel } from '../../../domain/endowments-per-charge/endowments-per-charge.model';

export interface EndowmentsPerChargeCrudPort {
    findChargeById(id: Number): Observable<ChargeModel>;

    findById(id: Number): Observable<EndowmentsPerChargeModel>;
    save(data: EndowmentsPerChargeModel): Observable<any>;
    update(data: EndowmentsPerChargeModel, id: Number): Observable<any>;
    delete(id: Number): Observable<any>;
}