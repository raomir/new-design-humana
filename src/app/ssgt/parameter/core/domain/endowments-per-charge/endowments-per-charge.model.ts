import { List } from '../../../../../shared/core/domain/list.model';
import { ChargeModel } from './charge.model';
export class EndowmentsPerChargeModel {

    constructor(
        public cantidad: Number,
        public frecuencia: Number,
        public cargo: ChargeModel,
        public producto: any,
        public unidadTiempo: List,
        public id?: Number
    ) { }

}
