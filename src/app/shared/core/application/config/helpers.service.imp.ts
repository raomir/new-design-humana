import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HelpersService } from '../../port/in/config/helpers.service';
import { environment } from '../../../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { saveAs } from "file-saver";
import { ExportDataInterface } from '../../domain/export.models';
import { FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root',
})
export class HelpersServiceImp implements HelpersService {
  token_erp: string;
  prmDataTableSearch: number;
  maxCode: number;
  maxDescription: number;
  maxName: number;
  API_URL_ERP = environment.url_sinergia;
  API_URL = environment.url;
  perfiles: any;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  checkIfDataExistsInExporter(title: string, url: any): boolean {
    var mediaType = "text/csv";
    this.http
      .post(
        this.API_URL + url,
        { location: "archivo.csv" },
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob: Blob | any = new Blob([response], { type: mediaType });
          let size = blob.size; 
          blob = null;
          if(size > 0){ 
            return true;
          }else{ 
            this.showAlert('warning','No hay datos para exportar e imprimir!');
            return false;
          }
        },
        (e) => { 
          return false; 
        }
      );
      return false;
  }

  openPDF(title: string, url: any, viewer: boolean, values: ExportDataInterface | any = {}): void {
    
    var mediaType = "application/pdf";
    var blob: Blob;
    this.http
      .post(
        this.API_URL + url,
        { location: "archivo.pdf", valores: values },
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            if (viewer == true) {
              /* this.openModalImprimir(blob); */
              this.showAlert('info','Reporte generado exitosamente!');
            } else {
              saveAs(blob, title + ".pdf");
              this.showAlert('info','Documento exportado exitosamente!');
            } 
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
          }
        },
        (e) => {
        }
      );
  }

  openPDFJsonDataAdapter(title: string,json: any, url: any, viewer: boolean): void {
    var mediaType = "application/pdf";
    var blob: Blob; 
    this.http
      .post(
        environment.url + url, json,
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            if (viewer == true) {
              //this.openModalImprimir(blob);
              this.showAlert('info','Reporte generado exitosamente!');
            } else {
              saveAs(blob, title + ".pdf");
              this.showAlert('info','Documento exportado exitosamente!');
            }
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
          }
        },
        (e) => {
        }
      );
  }

  openXLSJsonDataAdapter(title: string,json: any, url: any ): any {
    var mediaType = "application/vnd.ms-excel";
    this.http
      .post(
        environment.url + url, json,
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            saveAs(blob, title + ".xls");
            this.showAlert('info','Documento exportado exitosamente!');
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
          }
        },
        (e) => {}
      );
  }

  openCSVJsonDataAdapter(title: string,json: any, url: any ): any {
    var mediaType = "text/csv";
    this.http
      .post(
        environment.url + url, json,
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            saveAs(blob, title + ".csv");
            this.showAlert('info','Documento exportado exitosamente!');
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
          }
        },
        (e) => {}
      );
  }

  public openXLS(title: string, url: any, values: ExportDataInterface | any = []): any {
    var mediaType = "application/vnd.ms-excel";
    this.http
      .post(
        this.API_URL + url,
        { location: "archivo.xls", valores: values },
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            saveAs(blob, title + ".xls");
            this.showAlert('info','Documento exportado exitosamente!');
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
            
          }
        },
        (e) => {}
      );
  }

  public openCSV(title: string, url: any, values: ExportDataInterface | any = []): any {
    var mediaType = "text/csv";
    this.http
      .post(
        this.API_URL + url,
        { location: "archivo.csv", valores: values },
        { responseType: "blob" }
      )
      .subscribe(
        (response) => {
          var blob = new Blob([response], { type: mediaType });
          if(blob.size > 0){
            saveAs(blob, title + ".csv");
            this.showAlert('info','Documento exportado exitosamente!');
          }else{
            this.showAlert('warning','No hay datos para exportar e imprimir!');
          }
        },
        (e) => {}
      );
  }

  validateDescription(control: FormControl) {
    const value = control.value;
    if (value && value.trim().split(/\s+/).length < 2) {
      return { invalidDescription: true };
    }
    return null;
  }

  showAlert(type: string, message: string): void {
    this.messageService.add({ severity: type, summary: 'Alerta', detail: message });
  }

  showConfirmation(title: string, message: string): Promise<any> | any {
    return '';
  }

  showConfirmationDelete(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.confirmationService.confirm({
        header: 'Confirmación de Eliminación',
        message: `
          <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <i class="pi pi-exclamation-circle icon-red text-6xl text-primary-500" style="font-size: 3em; color: #f44336;"></i>
            <p style="margin-top: 10px; font-weight: bold; font: bold;">¿Está seguro que quieres eliminar este registro?</p>
          </div>
        `,
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'btn-accept',
        rejectButtonStyleClass: 'btn-reject',
        accept: () => {
          resolve(true); // Resuelve la promesa con true si el usuario acepta
        },
        reject: () => {
          resolve(false); // Resuelve la promesa con false si el usuario rechaza
        }
      });
    });
  }

  isset(variable: any): boolean {
    try {
      if (typeof variable !== 'undefined' && variable !== null) {
        return true;
      }
    } catch (e) {
    }
    return false;
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

  getColumnActive(data: Number): string {
    if (data === 1) {
      return `<i class="pi text-green-500 pi-check-circle"></i>`;
    } else if (data === 2) {
      return `<i class="pi text-pink-500 pi-times-circle"></i>`;
    } else {
      return '';
    }
  }

  getColumnFavorite(data: Number): string {
    if (data === 1) {
      return `<i class="pi text-pink-500 pi-star"></i>`;
    } else {
      return '';
    }
  }

  getSwitch(status: any, boolean = true) {
    if (boolean) {
        return status == 1 ? true : false;
    } else {
        return status ? 1 : 2;
    }
}
}

export function headersHttp(type = 'application/x-www-form-urlencoded', tokenService = null): HttpHeaders {
  environment.token = localStorage.getItem('ACCESS_TOKEN') || '';
  let token = tokenService ? tokenService : environment.token;
  return new HttpHeaders({
    'X-localization': 'es',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization',
    'Content-Type': type,
    'Authorization': `Bearer ${token}`
  });
}