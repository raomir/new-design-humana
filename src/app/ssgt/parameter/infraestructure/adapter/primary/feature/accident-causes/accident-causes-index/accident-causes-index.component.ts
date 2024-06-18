import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { TreeNodeGeneral, BackendNode } from '../../../../../../../../shared/components/tree-table-general/tree/tree.interface';
import { TreeTableGeneralComponent } from '../../../../../../../../shared/components/tree-table-general/tree-table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { AccidentCausesService } from '../../../../../../core/application/accident-causes/accident-causes.service';
import { NewClassCauseModalComponent } from '../modal/new-class-cause-modal/new-class-cause-modal.component';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-accident-causes-index',
  standalone: true,
  imports: [CommonModule, TreeTableGeneralComponent, HeaderCardComponent,NewClassCauseModalComponent],
  templateUrl: './accident-causes-index.component.html'
})
export class AccidentCausesIndexComponent implements OnInit {

  //variables
  public dataList: BackendNode[] = [];
  public colums: any[] = [];
  public data: any[] = [];
  public buttonsGenerals: any[] = ["btn_print","btn_new"];
  public buttonsDatatable = ["btn_nuevo", "btn_editar", "btn_eliminar"];
  public displayModal: boolean = false;
  public idEdit?: Number;
  public title: string = '';
  public endPoint?: string;
  public level: number = 1;
  public action: string = '';
  public fatherName: string = '';
  public sonName: string = '';
  public fatherId: Number | null = null;
  public loading: boolean = true;


  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private accidentCausesService: AccidentCausesService,
    private helperService: HelpersServiceImp
  ) {

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Causas accidentes', routerLink: ['/administration/accident-causes'] },
    ])

    this.colums = [
      { field: 'code', header: 'Código' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' },
      { field: 'active', header: 'Activo' },
    ];

  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.accidentCausesService.getLists().subscribe(
      (res: any) => {
        if(res != null && res != undefined){
          if (res.data.length > 0) {
            this.dataList = res.data;
            // Convertir datos del backend a TreeNodeGeneral
            this.data = this.convertToTreeNodeGeneral(this.dataList);
          }else{
            this.data = [];
          }
        }
      }
    )
  }

  convertToTreeNodeGeneral(dataList: TreeNode[] | any[]): TreeNode[] | any[] {
    // Función recursiva para mapear nodos y ajustar los botones ocultos
    const mapNodes = (nodes: TreeNode[]): void => {
      nodes.forEach((node: TreeNode | any) => {
        node.data.hiddenButtons = [];
        if (node.data.level < 3) {
          if (this.hasChildren(node)) {
            node.data.hiddenButtons = [];
          } else {
            node.data.hiddenButtons = ['btn_eliminar'];
          }
        } else if (node.data.level === 3) {
          node.data.hiddenButtons = ['btn_nuevo'];
        }
        if (node.children.length > 0) {
          mapNodes(node.children);
        }
      });
    };

    // Mapear nodos y ajustar los botones ocultos
    mapNodes(dataList);
    this.loading = false;
    return dataList;
  }

  private hasChildren(node: TreeNode): boolean {
    if (node.children?.length == 0) {
      return true;
    }
    return false;
  }

  //* Accion Nuevo 
  actionNew() {
    this.level = 0;
    this.fatherId = null
    if (this.level == 0) {
      this.displayModal = true;
      this.title = 'Clase causa del accidente';
    }
  }

  //* Accion Imprimir
  actionPrint(event: any) {
  }

  //* Acciones de datatable
  onAction(event: any) {
    switch (event.action) {
      case 'btn_nuevo': 
        this.displayModal = true;
 
        this.level = event.data.level;
        this.fatherId = event.data.id;
        if (this.level == 1) {
          this.fatherName =  event.data.name;
        }else{ 
          this.fatherName =  event.data.accidentCauses ? event.data.accidentCauses.name : '';
          this.sonName = event.data.name;
        }
        this.action = 'btn_nuevo';
        this.title = this.level === 1 ? 'Grupo clase causa del accidente' : 'Subgrupo clase causa del accidente';
        break;
      case 'btn_editar':
        this.displayModal = true;
        this.level = event.data.level;
        this.title = this.level === 1 ? 'Grupo clase causa del accidente' : 'Subgrupo clase causa del accidente';
        this.action = 'btn_editar';
        this.idEdit = event.data.id;
        break;
      case 'btn_eliminar':
        const itemDataId = event.data.id;
        this.helperService.showConfirmationDelete()
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.accidentCausesService.delete(itemDataId).subscribe(
              (resp: any) => {
                this.loading = true;
                this.helperService.showAlert('success', resp.mensaje);
                this.getData();
              }
            );
          }
        })
        .catch((error: any) => {
          console.error('Error al mostrar el cuadro de confirmación:', error);
        });
        break;
    }
  }

  modalResponse(event: boolean): void {
    this.displayModal = false;
    if (event) {
      this.getData();
    }
    this.idEdit = undefined;
  }


}
