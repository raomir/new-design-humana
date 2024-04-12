export interface LocalService {

  setJsonValue(key: string, value: any): void;
  getJsonValue(key: string): void | any;
  clearToken(): void;

}