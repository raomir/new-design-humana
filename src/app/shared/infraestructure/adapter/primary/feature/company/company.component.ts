import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
// import { ListService } from 'src/app/ssgt/core/application/list.service';
import { AppBreadcrumbService } from '../../root/breadcrumb/app.breadcrumb.service'

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './company.component.html',
})
export class CompanyComponent {

    // private service = inject(ListService);
    // products$ = this.service.getLists();

    constructor(
        private breadcrumbService: AppBreadcrumbService,
        
    ) {
        this.breadcrumbService.setItems([
            { label: 'Home', routerLink: ['/'] },
            { label: 'Empresas', routerLink: ['/administration/company'] },
        ])
    }

    
    // getList() {
    //     this.service.getLists().subscribe(res => {
    //         var list = res;
    //     });
    // }
}
