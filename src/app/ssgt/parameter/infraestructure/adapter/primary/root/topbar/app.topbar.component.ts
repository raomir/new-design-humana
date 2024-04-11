import { Component } from '@angular/core'
import { AppComponent } from 'src/app/app.component'
import { AppMainComponent } from '../main/app.main.component'
import { AppMenuComponent } from '../menu/app.menu.component'

@Component({
    selector: 'app-topbar',
    template: './app.topbar.component.html',
    standalone: true,
    imports: [AppMenuComponent],
})
export class AppTopbarComponent {
    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent
    ) {}
}
