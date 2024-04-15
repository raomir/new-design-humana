import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
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
import { environment } from '../../../../environments/environment';
import { AuthService } from '../port/in/auth.service';

const helper = new JwtHelperService();

@Injectable()
export class AuthServiceImp implements AuthService {
  // Subject for authentication state changes.
  authSubject = new BehaviorSubject(false);
  // Observable for authentication token.
  tokenObserver = this.authSubject.asObservable();
  // API URL for authentication requests.
  public API_URL = environment.url_sinergia;
  // Authentication token.
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
    * Method for setting the token
    */
  // Setter method for the authentication token.
  set setToken(token: any) {
    this.token = this.getToken();
    this.authSubject.next(token);
    environment.token = this.token;
  }

  // Setter method for the token observer.
  set setTokenObserver(token: any) {
    this.authSubject.next(token);
  }

  // Method for user login.
  /**
   * Logs in the user using the provided credentials.
   * Inicia sesión del usuario utilizando las credenciales proporcionadas.
   * @param user User credentials.
   * @returns Promise indicating the login result.
   */
  login(user: UserI): Promise<any> {
    return new Promise((resolve) => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<AuthI>(`${this.API_URL}authenticate`, user, { headers: headers }).subscribe(
        async (res: AuthI) => {
          if (res) {
            this.setToken = res.access_token;
            await this.saveToken(res.access_token, '')
            const promise = this.postAuthenticate(res.sedes, res.access_token)
            promise.then(() => {
              this.getUserInfo(res);
              resolve(0);
            });
          }
        },
        (error: any) => {
            this._helpersService.showAlert('info', error.error.message);
        }
      );
    });
  }

  // Method for user login using token.
  /**
   * Logs in the user using the provided token.
   * Inicia sesión del usuario utilizando el token proporcionado.
   * @param user User token and company ID.
   * @returns Promise indicating the login result.
   */
  loginToken(user: { token: string, prv_empresa_id: string }): Promise<any> {
    return new Promise((resolve) => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<AuthI>(`${this.API_URL}authenticate_token`, user, { headers: headers }).subscribe(
        async (res: AuthI) => {
          if (res) {
            this.setToken = res.access_token;
            await this.saveToken(res.access_token, '')
            const promise = this.postAuthenticate(res.sedes, res.access_token)
            promise.then(() => {
              this.getUserInfo(res);
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

  // Method for getting companies available for login.
  /**
   * Retrieves the list of companies available for login.
   * Obtiene la lista de empresas disponibles para iniciar sesión.
   * @returns Observable containing the list of companies.
   */
  getLoginCompanies() {
    return this.localStorage.getItem('companies').pipe(
      map((resp: any) => resp)
    );
  }

  // Method for post-authentication tasks.
  /**
   * Performs post-authentication tasks.
   * Realiza tareas posteriores a la autenticación.
   * @param sedes Company branches.
   * @param token Authentication token.
   * @returns Promise indicating the result of the tasks.
   */
  postAuthenticate(sedes: any, token: any): Promise<any> {
    return new Promise(async (resolve) => {
      let mainBranch = sedes.filter((e: any) => e.is_main === 1);
      if (mainBranch.length) {
        let data = { "branch_id": mainBranch[0].id }
        const header = helpers.headersHttp('application/x-www-form-urlencoded', token);
        this.httpClient.post<any>(`${this.API_URL}post_authenticate`, 'json=' + JSON.stringify(data), { headers: header }).subscribe(res => {
          this.setProfiles(res);
          resolve(0);
        });
      } else {
        resolve(0);
        /* setTimeout(() => this.logout(), 3000) */
      }
    });

  }

  // Method for retrieving user information after login.
  /**
   * Retrieves user information after successful login.
   * Obtiene la información del usuario después de iniciar sesión correctamente.
   * @param res Authentication response.
   */
  getUserInfo(res: any) {
    this.localService.setJsonValue('ACCESS_USER_ID', res.user['branch_tercero_id']);
    this.localService.setJsonValue('ACCESS_USER_NAME', res.user['first_name'] + ' ' + res.user['last_name']);
    this.localService.setJsonValue('ACCESS_USER_ID', res.user['id']);
    this.localService.setJsonValue('ACCESS_TERCERO', res.user['tercero']['tipo_con_numero_documento_nombre_completo']);

  }

  // Method for validating the authentication token.
  /**
   * Validates the authentication token.
   * Valida el token de autenticación.
   * @param token Authentication token to validate.
   */
  validateToken(token: string): any {
    try {
      const expirationDate = helper.getTokenExpirationDate(token);
      let date = new Date(String(expirationDate));
      this.datePipe.transform(date, "yyyy-MM-dd");
      localStorage.setItem("EXPIRES_IN", String(this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss")));
    } catch (error) {
      // Handle error
    }
  }

  // Method for user logout.
  /**
   * Logs out the user.
   * Cierra sesión del usuario.
   */
  logout(): void {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.removeItem("profiles");
    location.reload();
    this.localService.clearToken();
  }

  // Method for setting logout validations.
  /**
   * Sets the validations for user logout.
   * Establece las validaciones para cerrar sesión del usuario.
   * @param status Status code.
   * @param message Error message.
   * @returns Boolean indicating if logout is valid.
   */
  setLogoutValidations(status: any, message: any) {
    if ((status === 401 || status === 0) &&
      (message === 'Token has expired' ||
        message === 'Unable to authenticate with invalid token.' ||
        message === 'Wrong number of segments' ||
        message === 'Token not provided' ||
        message === null)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Method for saving the authentication token.
  /**
   * Saves the authentication token.
   * Guarda el token de autenticación.
   * @param token Authentication token.
   * @param expiresIn Token expiration time.
   */
  public saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    this.token = token;
  }

  // Method for retrieving the authentication token.
  /**
   * Retrieves the authentication token.
   * Obtiene el token de autenticación.
   * @returns Authentication token.
   */
  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  // Method for getting login translations.
  /**
   * Retrieves translations for login page.
   * Obtiene las traducciones para la página de inicio de sesión.
   * @returns Observable containing login translations.
   */
  getLoginTranslations() {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get<any>(this.API_URL + 'translate_login', { headers: headers });
  }

  // Method for verifying IP address.
  /**
   * Verifies the user IP address.
   * Verifica la dirección IP del usuario.
   * @param ip IP address to verify.
   * @returns Observable containing the verification result.
   */
  verifyIp(ip: string | any = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(this.API_URL + 'verification_ip/' + ip, { headers: headers });
  }

  // Method for verifying code.
  /**
   * Verifies the verification code.
   * Verifica el código de verificación.
   * @param email Email address.
   * @returns Observable containing the verification result.
   */
  verifyCode(email: string) {
    let body = new HttpParams();
    this.router.url
    body = body.set('email', email);
    body = body.set('domain', location.origin);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.post<any>(`${this.API_URL}verification_code`, body, { headers: headers });
  }

  // Method for setting user profiles.
  /**
   * Sets the user profiles.
   * Establece los perfiles de usuario.
   * @param data User profile data.
   */
  setProfiles(data: any) {
    const profiles = JSON.stringify(data);
    localStorage.setItem('profiles', profiles);
    this.loadPermissions(data.permissions)
  }

  // Method for loading user permissions.
  /**
   * Loads user permissions.
   * Carga los permisos del usuario.
   * @param perm User permissions.
   * @returns Promise indicating the result of loading permissions.
   */
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

  // Method for loading user permissions from storage.
  /**
   * Loads user permissions from storage.
   * Carga los permisos del usuario desde el almacenamiento.
   * @returns Promise indicating the result of loading permissions.
   */
  async loadPermissionsFromStorage() {
    const profilesString = localStorage.getItem('profiles');
    if (profilesString !== null) {
      const data = JSON.parse(profilesString);
      if (data) {
        await this.loadPermissions(data.permissions);
      }
    }
  }

  // Method for retrieving company logo.
  /**
   * Retrieves the company logo.
   * Obtiene el logotipo de la empresa.
   * @returns Promise containing the company logo.
   */
  getLogo(): Promise<any> {
    return new Promise(async (resolve) => {
      const headers = helpers.headersHttp('application/x-www-form-urlencoded', this.setToken);
      this.httpClient.get(`${this.API_URL}company/obtainLogo/`, {
        responseType: 'arraybuffer',
        headers: headers
      }).subscribe(res => {
        resolve(res);
      });
    });
  }
}
