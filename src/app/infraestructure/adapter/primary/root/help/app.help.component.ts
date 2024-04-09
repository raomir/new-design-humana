import { Component } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { AppBreadcrumbService } from '../breadcrumb/app.breadcrumb.service'

@Component({
    templateUrl: './app.help.component.html',
    standalone: true,
    imports: [AccordionModule],
})
export class AppHelpComponent {
    text: any

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Pages' },
            { label: 'Help', routerLink: ['/pages/help'] },
        ])
    }
}
