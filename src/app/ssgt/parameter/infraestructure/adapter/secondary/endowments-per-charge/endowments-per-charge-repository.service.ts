import { Injectable } from '@angular/core';
import { EndowmentsPerChargeRepositoryPort } from '../../../../core/port/out/endowments-per-charge/endowments-per-charge-repository.port';
import { Observable } from 'rxjs';
import { AccidentCausesModel } from 'src/app/ssgt/parameter/core/domain/accident-causes/accident-causes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import * as helpers from '../../../../../../shared/core/application/config/helpers.service.imp';
import { ChargeModel } from '../../../../core/domain/endowments-per-charge/charge.model';
import { EndowmentsPerChargeModel } from '../../../../core/domain/endowments-per-charge/endowments-per-charge.model';

@Injectable({
  providedIn: 'root'
})
export class EndowmentsPerChargeRepositoryService implements EndowmentsPerChargeRepositoryPort {

  private apiUrlEndowmentsPerCharge: string = environment.url + 'dotacioncargo/';
  private apiUrlCharge: string = environment.url + 'cargo/';

  constructor(
    private http: HttpClient
  ) { }

  findChargeById(id: Number): Observable<ChargeModel> {
    return this.http.get<ChargeModel>(this.apiUrlCharge + id);
  }

  findById(id: Number): Observable<EndowmentsPerChargeModel> {
    return this.http.get<EndowmentsPerChargeModel>(this.apiUrlEndowmentsPerCharge + id);
  }

  save(data: EndowmentsPerChargeModel): Observable<any> {
    return this.http.post<any>(this.apiUrlEndowmentsPerCharge, data);
  }

  update(data: EndowmentsPerChargeModel, id: Number): Observable<any> {
    return this.http.put<any>(this.apiUrlEndowmentsPerCharge + id, data);
  }

  delete(id: Number): Observable<any> {
    return this.http.delete<any>(this.apiUrlEndowmentsPerCharge + id);
  }
}
