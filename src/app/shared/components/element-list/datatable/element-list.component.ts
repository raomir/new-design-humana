import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../../ssgt/parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../header-card/header-card.component';
import { TableGeneralComponent } from '../../table-general/table-general.component';
import { Column } from '../../table-general/col/col';
import { ActivatedRoute } from '@angular/router';
import { ElementListModalComponent } from '../modal/element-list-modal.component';
import { HelpersServiceImp } from '../../../core/application/config/helpers.service.imp';
import { List } from '../../../core/domain/list.model';
import { RegistroData } from '../../buttons-general/actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-list',
  templateUrl: './element-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HeaderCardComponent,
    TableGeneralComponent,
    ElementListModalComponent
  ]
})
export class ElementListComponent {

  public title: string;
  public endPoint: string;

  public buttons: Array<string> = ['btn_print', 'btn_new'];

  public columnsTable: Array<Column> = [
    { title: 'Código', data: 'codigo', sort: 'codigo' },
    { title: 'Nombre', data: 'nombre', sort: 'nombre' },
    { title: 'Descripción', data: 'descripcion', sort: 'descripcion' },
    { title: 'Favorito', data: 'favorito', sort: 'favorito', classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnFavorite(data) },
    { title: 'Activo', data: 'activo', sort: 'activo', classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnActive(data) },
    {
      title: 'Acciones', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar']
    }
  ]

  public idEdit: number | null = null;
  public displayModal: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private activatedRoute: ActivatedRoute, private helperService: HelpersServiceImp) {
    this.title = this.activatedRoute.snapshot.data['title'];
    this.endPoint = this.activatedRoute.snapshot.data['endpoint'];

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/administration/danger-class'] }, // pendiente
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
      // refrescar tabla
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

  }

  print(): void {

  }

}
