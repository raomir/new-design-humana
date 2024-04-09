import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from '../../../../../app.component'

@Component({
    selector: 'app-notfound',
    templateUrl: './app.notfound.component.html',
    standalone: true,
    imports: [RouterModule],
})
export class AppNotfoundComponent {
    constructor(public app: AppComponent) {}
}
