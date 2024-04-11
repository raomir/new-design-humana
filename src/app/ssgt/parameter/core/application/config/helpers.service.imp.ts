import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HelpersService } from '../../port/in/config/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class HelpersServiceImp implements HelpersService {
  token_erp: string;
  prmDataTableSearch: number;
  maxCode: number;
  maxDescription: number;
  maxName: number;
  API_URL_ERP = ""; //GLOBAL.url_sinergia;
  API_URL = "";//GLOBAL.url;
  perfiles: any;

  constructor(
    private http: HttpClient,
  ) {
    this.token_erp = localStorage.getItem('ACCESS_TOKEN') || '';
    this.prmDataTableSearch = 50;
    this.maxCode = 20;
    this.maxDescription = 500;
    this.maxName = 150;
  }

  autocomplete(route: string, term: any, groups?: any, noSearch?: any, link?: any, costCenters?: any, conceptTypes?: any, searchData?: any, frequency?: any, validations?: any, productSearch?: any, contract?: any, thirdPartyTypes?: any, costCenterTypeId?: any): Observable<any> {
    const expression = new RegExp(/^[A-Za-z0-9-/ñÑáéíóúüÁÉÍÓÚÜ\s+]+$/, 'g');
    const isTermValid = expression.test(term);
    if (!isTermValid) {
      term = '';
    }
    const headersERP = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.token_erp}`
    });
    const data = {
      term: term,
      tipo_concepto: conceptTypes,
      vinculacion_id: link,
      noBuscar: noSearch,
      dataBusqueda: searchData,
      validaciones_extras: validations,
      grupo: groups
    };
    return this.http.post(this.API_URL_ERP + route, data, { headers: headersERP })
      .pipe(
        map((response: any) => {
            return Object.keys(response['data']).map((key: string) => {
              return {
                id: response['data'][key].id,
                name: response['data'][key].value_to_display,
                data: response['data'][key]
              };
            });
          }
        )
      );
  }

  exportDataTable(action: any, exportType: any, input?: any, route?: string): Observable<any> {
      input['accion'] = action;
      input['tipo_exportacion'] = exportType;
      const headers = headersHttp('application/json'); 
      return this.http.post(this.API_URL_ERP + route, input, { headers: headers });
  }

  export(action: any, exportType: any, pInput?: any, model?: any, validity?: any, institution?: any, order?: any, listType?: any, module?: any, route?: string, filters?: any, extraData?: any[]): Observable<any> {
        const input = JSON.stringify(pInput);
        let data = {
            accion: action,
            tipo_exportacion: exportType,
            input: input,
            paginas: pInput.input,
            modelo: model,
            com_vigencia_id: validity,
            prv_empresa_id: institution,
            prv_lista_tipo_id: listType,
            prv_modulo_id: module
        };
        if (extraData != null && extraData !== undefined) {
            data = Object.assign({}, data, extraData);
        }
        const datosCompletos = Object.assign({}, data, filters);
        const headers = headersHttp(); 
        return this.http.post(this.API_URL + route, 'json=' + JSON.stringify(datosCompletos), { headers: headers });
  }

  showAlert(type: string, message: string): void {
    // Implementa la lógica del método showAlert aquí
  }

  showConfirmation(title: string, message: string): Promise<any> | any {
    return '';
  }

  showSuccess(message: string): void {
    // Implementa la lógica del método showSuccess aquí
  }

  showError(message: string): void {
    // Implementa la lógica del método showError aquí
  }

  showWarning(message: string): void {
    // Implementa la lógica del método showWarning aquí
  }

  showInfo(message: string): void {
    // Implementa la lógica del método showInfo aquí
  }

  showCustom(title: string, message: string, type: string): void {
    // Implementa la lógica del método showCustom aquí
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getMonthName(month: number): string {
    return '';
  }

  getDayOfWeekName(day: number): string {
    return '';
  }

  getFormattedDate(date: Date, format: string): string {
    return '';
  }

  getFormattedDateTime(date: Date, format: string): string {
    return '';
  }

  getCurrentFormattedDate(format: string): string {
    return '';
  }

  getCurrentFormattedDateTime(format: string): string {
    return '';
  }

  getTimeElapsed(date: Date): string {
    return '';
  }

  redirectTo(url: string): void {
    // Implementa la lógica del método redirectTo aquí
  }

  generateUniqueId(): string {
    return '';
  }

  getProfilesJson(): any {
    return this.perfiles;
  }
}

export function headersHttp(type = 'application/x-www-form-urlencoded', tokenService = null) {
    let token = tokenService ? tokenService : ""; //GLOBAL.token;
    return new HttpHeaders({
        'X-localization': 'es',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization',
        'Content-Type': type,
        'Authorization': `Bearer ${token}`
    });
}