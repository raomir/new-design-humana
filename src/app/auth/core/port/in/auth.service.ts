import { JwtHelperService } from "@auth0/angular-jwt";
import { UserI } from "../../domain/user.interface";

const helper = new JwtHelperService();

export interface AuthService {
  authSubject: any;
  tokenObserver: any;
  API_URL: string;
  token: any;

  login(user: UserI): Promise<any>;
  loginToken(user: { token: string, prv_empresa_id : string}): Promise<any>;
  postAuthenticate(sedes: any, token: any): Promise<any>;
  getUserInfo(res: any): any;
  validateToken(token: string): any;
  logout(): void;
  setLogoutValidations(status: any, message: any): any;
  saveToken(token: string, expiresIn: string): void;
  getToken(): string;
  getLoginTranslations(): any;
  verifyIp(ip: string): any;
  verifyCode(email: string): any;
  setProfiles(data: any): any;
  loadPermissions(perm: any): any;
  loadPermissionsFromStorage(): any;
  getLogo(): Promise<any>;
}
