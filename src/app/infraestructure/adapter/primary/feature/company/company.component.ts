import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { AppBreadcrumbService } from '../../root/breadcrumb/app.breadcrumb.service'

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './company.component.html',
})
export class CompanyComponent {
    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Home', routerLink: ['/'] },
            { label: 'Empresas', routerLink: ['/administration/company'] },
        ])
    }
}
