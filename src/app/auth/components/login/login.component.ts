import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthServiceImp } from '../../core/application/auth.service.imp';
import { HelpersServiceImp } from '../../../shared/core/application/config/helpers.service.imp';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPermissionsModule, NgxPermissionsService, NgxPermissionsStore, USE_PERMISSIONS_STORE } from 'ngx-permissions';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, NgxPermissionsModule, DatePipe, ReactiveFormsModule, DropdownModule, ButtonModule, TooltipModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [AuthServiceImp, DatePipe, NgxPermissionsService, NgxPermissionsStore, { provide: USE_PERMISSIONS_STORE, useValue: 'local' }]
})
export class LoginComponent implements OnInit {
    
    public loginForm: FormGroup | any;
    public companies: Array<any> | any = [];
    submit = false;
    currentYear: number = new Date().getFullYear()
    public isGeneralHidden = false;
    public isRecoverPasswordHidden = true;
    public recoverPasswordButtonText = 'Send';
    public clock = 10;
    public clockDisabled = false;
    userIP: any = ''
    
    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthServiceImp, private httpClient: HttpClient, private helperService: HelpersServiceImp) { }
    
    ngOnInit() {
        this.authService.getLoginTranslations().subscribe(res => {
            this.companies = res.empresas;
        })
        
        this.loginForm = this.formBuilder.group({
            'email': [null, Validators.compose([
                Validators.required,
                Validators.maxLength(100),
                Validators.email
            ])],
            'password': [null, Validators.required],
            'prv_empresa_id': [ null, Validators.required ],
        });
    }

    /**
     * Loads the user's IP address.
     * Carga la dirección IP del usuario.
     */
    async loadIp() {
        this.userIP = localStorage.getItem('ip');
            await this.httpClient.get('https://api64.ipify.org?format=json').subscribe(
                (value: any) => {
                    this.userIP = value.ip;
                    this.authService.verifyIp(this.userIP).subscribe(() => { });
                }
            );
    }
    
    /**
     * Handles the login action.
     * Maneja la acción de inicio de sesión.
     */
    login(): void {
        this.submit = true;
        if (this.companies.length === 1) {
            this.loginForm.controls['prv_empresa_id'].setValue(this.companies[0].id)
        }
        const data = this.loginForm.value;
        if ( this.loginForm.valid ) {
            this.authService.login(data).then((res: any) => {
                this.router.navigateByUrl('/main');
            },
            (error: any) => {
                this.submit = false;
                this.helperService.showAlert('info', error.error.message);
            });
        }
    }

    /**
     * Toggles the visibility of the password recovery section.
     * Alterna la visibilidad de la sección de recuperación de contraseña.
     */
    showRecoverPassword(){
        this.isGeneralHidden = !this.isGeneralHidden;
        this.isRecoverPasswordHidden = !this.isRecoverPasswordHidden;

        if (this.isRecoverPasswordHidden){
            this.loginForm.get('password').setValidators([Validators.required]);
            this.loginForm.get('password').updateValueAndValidity();
        }else{
            this.loginForm.get('password').clearValidators();
            this.loginForm.get('password').updateValueAndValidity();
        }
    }

    /**
     * Sends a verification code for password recovery.
     * Envía un código de verificación para recuperación de contraseña.
     */
    sendVerificationCode(){
        const data = this.loginForm.value;
        this.clockDisabled = true;
        this.authService.verifyCode(data.email)
            .subscribe(
                async (res: any) => {
                    this.helperService.showAlert('info', res.message);
                    this.timeStartSend();
                },
                error => {
                    this.clockDisabled = false;
                    this.helperService.showAlert('info', error.error.message);
                }
            );
        
    }

    /**
     * Initiates a countdown for resending the verification code.
     * Inicia una cuenta regresiva para reenviar el código de verificación.
     */
    timeStartSend(){
        const that = this;
        let interval = setInterval(() => {
            --that.clock
            that.recoverPasswordButtonText = 'Resend in ' + this.clock + ' seconds';
            if (that.clock < 1) {
                clearInterval(interval)
                that.recoverPasswordButtonText = 'Resend';
                that.clock = 10;
                that.clockDisabled = false;
            };
        }, 1000);
    }
    
}
