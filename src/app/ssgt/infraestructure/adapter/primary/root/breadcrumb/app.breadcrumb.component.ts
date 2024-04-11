import { CommonModule } from '@angular/common'
import { Component, OnDestroy } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { Subscription } from 'rxjs'
import { AppMainComponent } from '../main/app.main.component'
import { AppBreadcrumbService } from './app.breadcrumb.service'

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html',
    standalone: true,
    imports: [BreadcrumbModule, CommonModule, FormsModule],
})
export class AppBreadcrumbComponent implements OnDestroy {
    subscription: Subscription

    items: MenuItem[] = []

    home: MenuItem

    search: string = ''

    constructor(
        public breadcrumbService: AppBreadcrumbService,
        public appMain: AppMainComponent
    ) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(
            (response) => {
                this.items = response
            }
        )

        this.home = { icon: 'pi pi-home', routerLink: '/' }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }
}
