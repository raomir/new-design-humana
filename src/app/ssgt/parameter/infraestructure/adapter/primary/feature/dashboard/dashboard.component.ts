import { Component, OnDestroy, OnInit } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { ButtonModule } from 'primeng/button'
import { CarouselModule } from 'primeng/carousel'
import { ChartModule } from 'primeng/chart'
import { DropdownModule } from 'primeng/dropdown'
import { ProgressBarModule } from 'primeng/progressbar'
import { TableModule } from 'primeng/table'
import { AppBreadcrumbService } from '../../root/breadcrumb/app.breadcrumb.service'
import { AdvancedSearchFormsComponent } from '../../../../../../../shared/components/advanced-search-forms/advanced-search-forms.component';

@Component({
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [
        DropdownModule,
        CarouselModule,
        ProgressBarModule,
        ChartModule,
        AvatarGroupModule,
        AvatarModule,
        TableModule,
        ButtonModule,
        AdvancedSearchFormsComponent
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {

    public displayModal: boolean = true;

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Home' },
            { label: 'Dashboard', routerLink: ['/'] },
        ])
    }

    ngOnInit() {}

    ngOnDestroy() {}

    openModal() {
        this.displayModal = true;
    }

    closeModal(event: Number | null) {
        this.displayModal = false;
        if (event) {
            console.log('id seleccionado ' + event)
        }
    }
}
