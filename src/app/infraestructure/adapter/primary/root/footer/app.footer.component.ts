import { Component } from '@angular/core'
import { AppComponent } from '../../../../../app.component'

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <span class="app-name">HIS</span>
            </div>
            <span class="copyright"
                >&#169; Tecnologías Sinergia SAS - {{ actualDate }}</span
            >
        </div>
    `,
    standalone: true,
})
export class AppFooterComponent {
    actualDate: Date = new Date()
    constructor(public app: AppComponent) {}
}
