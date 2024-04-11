import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from '../../../../../app.component'

@Component({
    selector: 'app-error',
    templateUrl: './app.error.component.html',
    standalone: true,
    imports: [RouterModule],
})
export class AppErrorComponent {
    constructor(public app: AppComponent) {}
}
