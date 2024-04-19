import { Component, ViewChild } from '@angular/core';
import { HeaderCardComponent } from '../../../../../shared/components/header-card/header-card.component';
import { CommonModule } from '@angular/common';
import { TableGeneralComponent } from '../../../../../shared/components/table-general/table-general.component';
import { Column } from '../../../../../shared/components/table-general/col/col';
import { AppBreadcrumbService } from '../../../infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { HelpersServiceImp } from '../../../../../shared/core/application/config/helpers.service.imp';
import { RegistroData } from '../../../../../shared/components/buttons-general/actions';
import { InspecionObjectService } from '../../../core/application/inspection-object.service';
import { InspectionObjectsModalComponent } from '../modal/inspection-objects-modal.component';

@Component({
  selector: 'app-inspection-objects',
  templateUrl: './inspection-objects.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HeaderCardComponent,
    TableGeneralComponent,
    InspectionObjectsModalComponent
  ]
})
export class InspectionObjectsComponent {

  @ViewChild('table') table?: TableGeneralComponent;

  public title: string = 'Objetos de inspección';
  public endPoint: string = 'objectoInpeccion';
  public buttons: Array<string> = ['btn_print', 'btn_new'];

  public columnsTable: Array<Column> = [
    { title: 'Código', data: 'codigo', sort: 'codigo' },
    { title: 'Nombre', data: 'nombre', sort: 'nombre' },
    { title: 'Descripción', data: 'descripcion', sort: 'descripcion' },
    { title: 'Formulario específico', data: 'metadatos', sort: 'metadatos.formularioNombre', render: (data: any) => data?.formularioNombre },
    { title: 'Activo', data: 'activo', sort: 'activo', classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnActive(data) },
    { title: 'Acciones', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar'] }
  ]

  public idEdit: number | null = null;
  public displayModal: boolean = true;

  constructor(private breadcrumbService: AppBreadcrumbService, private helperService: HelpersServiceImp, private inspecionObjectService: InspecionObjectService) {
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/administration/inspection-object'] },
    ])
  }

  ngOnInit(): void {
  }

  create() {
    this.displayModal = true;
  }

  modalResponse(event: boolean): void {
    this.displayModal = false;
    if (event) {
      this.table?.loadTable(0);
    }
    this.idEdit = null;
  }

  runActions(info: RegistroData): void {
    if (info.action === 'btn_editar') {
      this.idEdit = info.data.id;
      this.displayModal = true;
    } else {
      this.delete(info.data.id)
    }
  }

  delete(id: Number): void {
    this.helperService.showConfirmationDelete()
      .then((confirmed: boolean) => {
        if (confirmed) {
          this.inspecionObjectService.delete(id).subscribe(
            (resp: any) => {
              this.helperService.showAlert('success', resp.mensaje);
              this.table?.loadTable(0);
            }
          );
        }
      })
      .catch((error: any) => {
        console.error('Error al mostrar el cuadro de confirmación:', error);
      });
  }

  print(): void {

  }

}
