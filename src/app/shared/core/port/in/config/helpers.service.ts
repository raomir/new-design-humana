import { Message } from "primeng/api";
import { Observable } from "rxjs";

export interface HelpersService {
  token_erp: string;
  prmDataTableSearch: number;
  maxCode: number;
  maxDescription: number;
  maxName: number;
  API_URL_ERP: string;
  API_URL: string;

  autocomplete(route: string, term: any, groups?: any, noSearch?: any, link?: any, costCenters?: any, conceptTypes?: any, searchData?: any, frequency?: any, validations?: any, productSearch?: any, contract?: any, thirdPartyTypes?: any, costCenterTypeId?: any): Observable<any>;
  exportDataTable(action: any, exportType: any, input?: any, route?: string): Observable<any>;
  export(action: any, exportType: any, pInput?: any, model?: any, validity?: any, institution?: any, order?: any, listType?: any, module?: any, route?: string, filters?: any, extraData?: any[]): Observable<any>;
  checkIfDataExistsInExporter(title: string, url: any): boolean;
  openPDF(title: string, url: any, viewer: boolean, values:any): void;
  openPDFJsonDataAdapter(title: string,json: any, url: any, viewer: boolean): void;
  openXLSJsonDataAdapter(title: string,json: any, url: any ): any;
  openCSVJsonDataAdapter(title: string,json: any, url: any ): any;
  openXLS(title: string, url: any, values: Array<any> | any[] | any): any;
  openCSV(title: string, url: any, values: Array<any> | any[] | any): any;

  showAlert(type: string, message: string): void;
  showConfirmation(title: string, message: string): Promise<any>;
  showConfirmationDelete(): Promise<boolean>;
  isset(variable: any): boolean;
  showSuccess(message: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showInfo(message: string): void;
  showCustom(title: string, message: string, type: string): void;

  getCurrentDate(): Date;
  getMonthName(month: number): string;
  getDayOfWeekName(day: number): string;
  getFormattedDate(date: Date, format: string): string;
  getFormattedDateTime(date: Date, format: string): string;
  getCurrentFormattedDate(format: string): string;
  getCurrentFormattedDateTime(format: string): string;
  getTimeElapsed(date: Date): string;
  redirectTo(url: string): void;
  generateUniqueId(): string;
  getProfilesJson(): any;
}