import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from '../../../../../app.component'

@Component({
    selector: 'app-accessdenied',
    templateUrl: './app.accessdenied.component.html',
    standalone: true,
    imports: [RouterModule],
})
export class AppAccessdeniedComponent {
    constructor(public app: AppComponent) {}
}
