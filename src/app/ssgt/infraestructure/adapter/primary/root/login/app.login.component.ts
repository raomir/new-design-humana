import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { AppComponent } from '../../../../../app.component'

@Component({
    selector: 'app-login',
    templateUrl: './app.login.component.html',
    standalone: true,
    imports: [RouterModule, ButtonModule, InputTextModule],
})
export class AppLoginComponent {
    constructor(public app: AppComponent) {}
}
