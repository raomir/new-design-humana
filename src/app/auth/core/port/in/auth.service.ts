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
  obtenerUsuario(res: any): any;
  validarToken(token: string): any;
  logout(): void;
  setValidacionesLogout(status: any, message: any): any;
  saveToken(token: string, expiresIn: string): void;
  getToken(): string;
  obtenerTraduccionesLogin(): any;
  verificationIp(ip: string): any;
  verificationCode(email: string): any;
  setPerfiles(data: any): any;
  loadPermissions(perm: any): any;
  loadPermissionsStorage(): any;
  obtenerLogo(): Promise<any>;
}
