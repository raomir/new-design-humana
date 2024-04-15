import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import * as helpers from './helpers.service.imp';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApisServiceInterface } from '../../port/in/config/apis-services.services';
import { JsonParams } from '../../../../shared/components/table-general/col/col';

@Injectable({
  providedIn: 'root',
})
export class ApisServicesServiceImp implements ApisServiceInterface {

  // Estado actual de los tickets
  private datoEstadoTickets = new BehaviorSubject<any>('');
  datoObservable = this.datoEstadoTickets.asObservable();

  // Datos de la tabla
  private datosDatatable = new BehaviorSubject<any>('');
  datosDatatableObservable = this.datosDatatable.asObservable();

  // Punto final de la API
  public endPoint: string = '';
  // URL base de la API
  public urlBase: string = `${environment.url}`;
  // URL base del ERP
  public urlBaseErp: string = `${environment.url_sinergia}`;
  // Indicador de si se está utilizando el ERP
  public erp: boolean = false;

  // Encabezados de las solicitudes HTTP
  public headers = helpers.headersHttp('application/json');

  constructor(
    private http: HttpClient
  ) {
  }

  // Renderiza la URL base según el estado del ERP
  render(): void {
    this.urlBase = this.erp ? this.urlBaseErp : this.urlBase;
  }

  /**
   * Realiza una solicitud GET a la API.
   * @param path Ruta de la solicitud.
   * @param params Parámetros de la solicitud.
   * @param separador Separador de la ruta.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public get(path: any = '', params: any = {}, separador: string = '/'): Observable<any> {
    const pathFormat: any = path !== '' ? separador + path : path;
    return this.http.get<any>(`${this.urlBase}${this.endPoint}${pathFormat}`);
  }

  /**
   * Realiza una solicitud GET completa a la API.
   * @param path Ruta de la solicitud.
   * @param params Parámetros de la solicitud.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public getFull(path: string, params: any): Observable<any> {
    return this.http.get<any>(`${path}`, { headers: this.headers });
  }

  /**
   * Realiza una solicitud PUT a la API.
   * @param body Cuerpo de la solicitud.
   * @param path Ruta de la solicitud.
   * @param connection Conexión.
   * @param cliente Cliente.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public put(
    body: any,
    path: any = '',
    connection: boolean = false,
    cliente: boolean = false
  ): Observable<any> {
    return this.http.put<any>(
      `${this.urlBase}${this.endPoint}/${path}`,
      body,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Realiza una solicitud POST a la API.
   * @param body Cuerpo de la solicitud.
   * @param path Ruta de la solicitud.
   * @param responseType Tipo de respuesta.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public post(body: any, path: any = '', responseType: string = 'json'): Observable<any> {
    if (path !== '' && path !== '') {
      path = `/${path}`;
    }
    return this.http.post<any>(`${this.urlBase}${this.endPoint}${path}`, body, {
      headers: this.headers,
    });
  }

  /**
   * Realiza una solicitud PUT de archivo a la API.
   * @param body Cuerpo de la solicitud (FormData).
   * @param path Ruta de la solicitud.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public putFile(body: FormData, path: any = ''): Observable<any> {
    if (path !== '' && path !== '') {
      path = `/${path}`;
    }
    const req = new HttpRequest(
      'PUT',
      `${this.urlBase}${this.endPoint}${path}`,
      body
    );
    return this.http.request(req);
  }

  /**
   * Realiza una solicitud POST de archivo a la API.
   * @param body Cuerpo de la solicitud (FormData).
   * @param path Ruta de la solicitud.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public postFile(body: FormData, path: any = ''): Observable<any> {
    if (path !== '' && path !== '') {
      path = `/${path}`;
    }
    const req = new HttpRequest(
      'POST',
      `${this.urlBase}${this.endPoint}${path}`,
      body
    );
    return this.http.request(req);
  }

  /**
   * Realiza una solicitud DELETE a la API.
   * @param id ID de la entidad a eliminar.
   * @param params Parámetros de la solicitud.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public delete(id: any = '', params: any = {}): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}${this.endPoint}/${id}`, {
      headers: this.headers,
    });
  }

  /**
   * Obtiene datos de la API con parámetros JSON.
   * @param jsonParams Parámetros de la solicitud en formato JSON.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public getDataJsonParams(jsonParams: JsonParams): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('json', JSON.stringify(jsonParams));
    const url = `${this.urlBase}${this.endPoint}/${jsonParams.pageCurrent}?${queryParams.toString()}`;

    return this.http.get<any>(url, { headers: this.headers });
  }

  /**
   * Realiza una solicitud POST a la API.
   * @param body Cuerpo de la solicitud.
   * @param path Ruta de la solicitud.
   * @param responseType Tipo de respuesta.
   * @returns Observable<any> que representa la respuesta de la solicitud.
   */
  public postData(body: any, path: any = '', responseType: string = 'json'): Observable<any> {
    if (path !== '' && path !== '') {
      path = `/${path}`;
    }
    console.log(this.endPoint);
    return this.http.post<any>(`${this.urlBase}${this.endPoint}${path}`, body, {
      headers: this.headers,
    });
  }
}
