import { Injectable, inject } from '@angular/core';
import { EndowmentsPerChargeCrudPort } from '../../port/in/endowments-per-charge/endowments-per-charge-crud.port';
import { Observable } from 'rxjs';
import { ChargeModel } from '../../domain/endowments-per-charge/charge.model';
import { EndowmentsPerChargeRepositoryService } from '../../../infraestructure/adapter/secondary/endowments-per-charge/endowments-per-charge-repository.service';
import { EndowmentsPerChargeModel } from '../../domain/endowments-per-charge/endowments-per-charge.model';

@Injectable({
  providedIn: 'root'
})
export class EndowmentsPerChargeService implements EndowmentsPerChargeCrudPort {

  private endowmentsPerChargeRepositoryService = inject(EndowmentsPerChargeRepositoryService)

  constructor() { }

  findChargeById(id: Number): Observable<ChargeModel> {
    return this.endowmentsPerChargeRepositoryService.findChargeById(id);
  }

  findById(id: Number): Observable<EndowmentsPerChargeModel> {
    return this.endowmentsPerChargeRepositoryService.findById(id);
  }

  save(data: EndowmentsPerChargeModel): Observable<any> {
    return this.endowmentsPerChargeRepositoryService.save(data);
  }

  update(data: EndowmentsPerChargeModel, id: Number): Observable<any> {
    return this.endowmentsPerChargeRepositoryService.update(data, id);
  }

  delete(id: Number): Observable<any> {
    return this.endowmentsPerChargeRepositoryService.delete(id);
  }

}
