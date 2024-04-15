import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { headersHttp, HelpersServiceImp } from '../../../shared/core/application/config/helpers.service.imp';
import { AuthInterceptorService } from '../port/in/auth-interceptor.service';
import { AuthServiceImp } from './auth.service.imp';

@Injectable()
export class AuthInterceptorServiceImp implements HttpInterceptor, AuthInterceptorService {
    /**
     * Constructor for AuthInterceptorServiceImp.
     * Constructor para AuthInterceptorServiceImp.
     * @param authSvc Instance of AuthServiceImp.
     * @param helpersSvc Instance of HelpersServiceImp.
     */
    constructor(private authSvc: AuthServiceImp,
                private helpersSvc: HelpersServiceImp) { }

    /**
     * Intercepts HTTP requests and handles authentication errors.
     * Interceptra las peticiones HTTP y maneja los errores de autenticación.
     * @param req HTTP request object.
     * @param next HTTP handler.
     * @returns Observable of HTTP events.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {  
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401){
                    // Uncomment the following lines to show alert message and logout user
                    // Descomenta las siguientes líneas para mostrar un mensaje de alerta y cerrar la sesión del usuario
                    this.helpersSvc.showAlert("warning", "Por favor inicie sesión de nuevo");
                    this.authSvc.logout();
                }
                return throwError(err);
            })
        );
    }
}
