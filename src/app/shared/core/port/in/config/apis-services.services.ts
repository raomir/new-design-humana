import { Observable } from "rxjs";
import { JsonParams } from "../../../../../shared/components/table-general/col/col";

export interface ApisServiceInterface {
  render(): void;
  get(path: any, params: any, separador: string): Observable<any>;
  getFull(path: string, params: any): Observable<any>;
  put(body: any, path: any, connection: boolean, cliente: boolean): Observable<any>;
  post(body: any, path: any, responseType: string): Observable<any>;
  putFile(body: FormData, path: any): Observable<any>;
  postFile(body: FormData, path: any): Observable<any>;
  delete(id: any, params: any): Observable<any>;
  getDataJsonParams(jsonParams: JsonParams): Observable<any>;
  postData(body: any, path: any, responseType: string): Observable<any>;
}
