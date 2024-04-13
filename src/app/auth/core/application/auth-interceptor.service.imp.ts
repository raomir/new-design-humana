import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { headersHttp, HelpersServiceImp } from '../../../shared/core/application/config/helpers.service.imp';
import { AuthInterceptorService } from '../port/in/auth-interceptor.service';
import { AuthServiceImp } from './auth.service.imp';

@Injectable()
export class AuthInterceptorServiceImp implements HttpInterceptor, AuthInterceptorService {

    constructor(private authSvc: AuthServiceImp,
                private helpersSvc: HelpersServiceImp) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {  
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401){
                    //this.helpersSvc.mensajeAlerta("warning", "Por favor inicie sesión de nuevo");
                    //this.authSvc.logout();
                }
                return throwError(err);
            })
        );
    }
}
