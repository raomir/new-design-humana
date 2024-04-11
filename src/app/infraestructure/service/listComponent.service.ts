import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ListRepository } from 'src/app/core/port/in/list.repository.interface'

import { AppBreadcrumbService } from '../adapter/primary/root/breadcrumb/app.breadcrumb.service'

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [CommonModule],
})
export class CompanyComponent {

    constructor(
        private breadcrumbService: AppBreadcrumbService,
        private repository: ListRepository
    ) {
        this.breadcrumbService.setItems([
            { label: 'Home', routerLink: ['/'] },
            { label: 'Empresas', routerLink: ['/administration/company'] },
        ])
    }

    private getLists() {
        this.repository.getLists()
    }
}
