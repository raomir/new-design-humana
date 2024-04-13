import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from "@angular/common";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserI } from '../domain/user.interface';
import { AuthI } from '../domain/auth.interface';
import { LocalServiceImp } from './storage/localService.imp';
import * as helpers from '../../../shared/core/application/config/helpers.service.imp';
import { HelpersServiceImp } from '../../../shared/core/application/config/helpers.service.imp';
import { environment } from 'src/environments/environment';
import { AuthService } from '../port/in/auth.service';

const helper = new JwtHelperService();
@Injectable()

export class AuthServiceImp implements AuthService {
  authSubject = new BehaviorSubject(false);
  tokenObserver = this.authSubject.asObservable();
  public API_URL = environment.url_sinergia;
  public token: any;
  
  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private localService: LocalServiceImp,
    public _helpersService: HelpersServiceImp,
    protected localStorage: LocalStorage,
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) { }

  /*
    * Metodo para la captura del token
    */
  set setToken(token: any) {
    this.token = this.getToken();
    this.authSubject.next(token);
    environment.token = this.token;
  }

  set setObservadorToken(token: any) {
    this.authSubject.next(token);
  }

  login(user: UserI): Promise<any> {
    return new Promise((resolve)=>{
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<AuthI>(`${this.API_URL}authenticate`, user, { headers: headers }).subscribe(
        async (res: AuthI) => {
          if (res) {
            this.setToken = res.access_token;
            await this.saveToken(res.access_token, '')
            const promise = this.postAuthenticate(res.sedes, res.access_token)
            promise.then(()=>{
              this.obtenerUsuario(res);
              resolve(0);
            });
          }
        }
      );
    });
  }

  loginToken(user: { token: string, prv_empresa_id : string}): Promise<any> {
    return new Promise((resolve) => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<AuthI>(`${this.API_URL}authenticate_token`, user, { headers: headers }).subscribe(
        async (res: AuthI) => {
          if (res) {
            this.setToken = res.access_token;
            await this.saveToken(res.access_token, '')
            const promise = this.postAuthenticate(res.sedes, res.access_token)
            promise.then(() => {
              this.obtenerUsuario(res);
              resolve(0);
            });
          }
        },
        (error) => {
          location.href = '/login'
        }
      );
    });
  }

  get empresasLogin() {
    return this.localStorage.getItem('empresas').pipe(
      map((resp: any) => resp)
    );
  }


  postAuthenticate(sedes: any, token: any): Promise<any>{
    return new Promise(async(resolve)=>{
      let sedePrincipal = sedes.filter((e: any) => e.es_principal === 1);
      if (sedePrincipal.length) {
        let data = { "com_sede_id": sedePrincipal[0].id }
        const header = helpers.headersHttp('application/x-www-form-urlencoded', token);
        this.httpClient.post<any>(`${this.API_URL}post_authenticate`, 'json=' + JSON.stringify(data), { headers: header }).subscribe(res => {
          this.setPerfiles(res);
          //this._helpersService.mensajeAlerta('error', res.message);
          resolve(0);
        });
      } else {
        //this._helpersService.mensajeAlerta('error', 'No se encontró ninguna sede principal');
        resolve(0);
        setTimeout(() => this.logout(), 3000)
      }
    });

  }

  obtenerUsuario(res: any) {
    this.localService.setJsonValue('ACCESS_USER_ID', res.user['com_tercero_id']);
    this.localService.setJsonValue('ACCESS_USER_NAME', res.user['first_name'] + ' ' + res.user['last_name']);
    this.localService.setJsonValue('ACCESS_USUARIO_ID', res.user['id']);
    this.localService.setJsonValue('ACCESS_TERCERO', res.user['tercero']['tipo_con_numero_documento_nombre_completo']);

  }

  validarToken(token: string): any {
    try {
      const expirationDate = helper.getTokenExpirationDate(token);
      let fecha = new Date(String(expirationDate));
      this.datePipe.transform(fecha, "yyyy-MM-dd"); //whatever format you need.
      localStorage.setItem("EXPIRES_IN", String(this.datePipe.transform(fecha, "yyyy-MM-dd HH:mm:ss")));
      //AQUÍ VA EL SERVICIO DE VALIDAR TOKEN AL BACK
    } catch (error) {
      ///this.logout();
    }
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.removeItem("perfiles");
    location.reload();
    this.localService.clearToken();
  }

  setValidacionesLogout(status: any, message: any) {
    if ((status === 401 || status === 0) &&
      (message === 'Token has expired' ||
        message === 'Unable to authenticate with invalid token.' ||
        message === 'Wrong number of segments' ||
        message === 'Token not provided' ||
        message === null)
    ) {
      ///this.logout();
      return true;
    } else {
      return false;
    }
  }

  public saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  obtenerTraduccionesLogin() {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get<any>(this.API_URL + 'translate_login', { headers: headers });
  }

  verificationIp(ip: string | any = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(this.API_URL + 'verification_ip/' + ip, { headers: headers });
  }

  verificationCode(email: string) {
    let body = new HttpParams();
    this.router.url
    body = body.set('email', email);
    body = body.set('dominio', location.origin);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.post<any>(`${this.API_URL}verification_code`, body, { headers: headers });
  }

  setPerfiles(data: any){
    const perfiles = JSON.stringify(data);
    localStorage.setItem('perfiles',  perfiles);
    this.loadPermissions(data.permissions)
  }  


  loadPermissions(perm: any) {
    return new Promise<void>((resolve, reject): void => {
      const permissions: any = [];
      environment.onlyPermissions.forEach((k: any) => {
        if (perm.hasOwnProperty(k)) {
          const permission = Object.keys(perm[k]);
          permission.forEach((p) => {
            const action = Object.keys(perm[k][p]);
            action.forEach((a) => {
              const check = perm[k][p][a];
              if (check === 1) {
                permissions.push(`${k}.${p}.${a}`);
              }
            });
          });
        }
      });
      this.permissionsService.loadPermissions(permissions);
      resolve();
    });
  }

  async loadPermissionsStorage(){
    const perfilesString = localStorage.getItem('perfiles');
    if (perfilesString !== null) {
      const data = JSON.parse(perfilesString);
      if (data) {
        await this.loadPermissions(data.permissions);
      }
    }
  }

  obtenerLogo(): Promise<any>{
    return new Promise(async(resolve)=>{
      const headers = helpers.headersHttp('application/x-www-form-urlencoded', this.setToken);
      this.httpClient.get(`${this.API_URL}prvempresa/empresa/obtenerLogo/`, { 
        responseType: 'arraybuffer', 
        headers: headers 
      }).subscribe(res => {
        resolve(res);
      });
    });
  }
}
