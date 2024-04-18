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
        ButtonModule
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {


    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Home' },
            { label: 'Dashboard', routerLink: ['/'] },
        ])
    }

    ngOnInit() { }

    ngOnDestroy() { }

}
