import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../../ssgt/parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../header-card/header-card.component';
import { TableGeneralComponent } from '../../table-general/table-general.component';
import { Column } from '../../table-general/col/col';
import { ActivatedRoute } from '@angular/router';
import { ElementListModalComponent } from '../modal/element-list-modal.component';

@Component({
  selector: 'app-element-list',
  templateUrl: './element-list.component.html',
  standalone: true,
  imports: [
    HeaderCardComponent,
    TableGeneralComponent,
    ElementListModalComponent
  ]
})
export class ElementListComponent {

  public title: string;
  public endPoint: string;

  public buttons: Array<string> = ['btn_nuevo', 'btn_imprimir'];

  public columnsTable: Array<Column> = [
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    { title: "Descripción", data: "descripcion" },
    { title: "Favorito", data: "favorito" },
    { title: "Activo", data: "activo" },
  ]

  public idEdit: number | null = null;
  public displayModal: boolean = true;

  constructor(private breadcrumbService: AppBreadcrumbService, private activatedRoute: ActivatedRoute) {
    this.title = this.activatedRoute.snapshot.data['title'];
    this.endPoint = this.activatedRoute.snapshot.data['endpoint'];

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/administration/danger-class'] },
    ])


  }

  ngOnInit(): void {
  }

  create() {
    this.displayModal = true;
  }

  modalResponse(event: boolean) {
    this.displayModal = false;
    if (event) {
      // refrescar tabla
    }
    this.idEdit = null;
  }

  print() {

  }

}
