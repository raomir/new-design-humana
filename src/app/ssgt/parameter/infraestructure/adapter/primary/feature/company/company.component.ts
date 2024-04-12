import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ButtonsGeneralComponent } from '../../../../../../../shared/components/buttons-general/buttons-general.component';
import { TableGeneralComponent } from '../../../../../../../shared/components/table-general/table-general.component';
import { AppBreadcrumbService } from '../../root/breadcrumb/app.breadcrumb.service';
import { Column } from '../../../../../../../shared/components/table-general/col/col';
import { RegistroData } from 'src/app/shared/components/buttons-general/actions';


@Component({
    selector: 'app-company',
    standalone: true,
    imports: [CommonModule, ButtonsGeneralComponent, TableGeneralComponent],
    templateUrl: './company.component.html',
})
export class CompanyComponent {

    public columns: Array<Column>;
    
    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Home', routerLink: ['/'] },
            { label: 'Empresas', routerLink: ['/administration/company'] },
        ])
        this.columns = this.retornaColumnas();
    }


    public retornaColumnas(): Array<Column> {
        return [
            {
                title: 'Codigo',
                data: 'codigo',
                sort: 'codigo',
                width: '10%'
            },
            {
                title: 'Nombre',
                data: 'nombre',
                sort: 'nombre',
                width: '20%'
            },
            {
                title: 'Descripcion',
                data: 'descripcion',
                sort: 'descripcion',
                width: '40%',
            },
            {
                title: 'Favorito',
                data: 'favorito',
                sort: 'favorito',
                width: '10%',
                classTitle: 'text-center',
                classCode: 'text-center',
                classStatus: 'text-center',
                render: (favorito: any) => {
                    if (favorito == 1) {
                        return '<i class="pi pi-star text-red-500"></i>'
                    }
                return
                }
            },
            {
                title: 'Activo',
                data: 'activo',
                sort: 'activo',
                width: '10%',
                classTitle: 'text-center',
                classCode: 'text-center',
                classStatus: 'text-center',
                render: (activo: any) => {
                    if (activo == 1) {
                        return '<i class="pi pi-check-circle text-green-500"></i>'
                    }
                    if (activo == 2) {
                        return '<i class="pi pi-times-circle text-red-500"></i>'
                    }
                    return
                }
            },
            {
                title: 'Acciones',
                data: '',
                sort: '',
                width: '10%',
                classTitle: 'text-center no-pointer',
                actions: ['btn_eliminar', 'btn_editar'],
            },
        ];
    }

    runActions(event: RegistroData) {
        console.log(event);
    }

    exportAction(event: any) {
        console.log(event);
    }
}
