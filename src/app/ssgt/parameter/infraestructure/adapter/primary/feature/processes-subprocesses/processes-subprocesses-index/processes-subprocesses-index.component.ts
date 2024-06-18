import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { TreeTableGeneralComponent } from '../../../../../../../../shared/components/tree-table-general/tree-table-general.component';
import { ProcessesSubprocessesService } from '../../../../../../core/application/processes-subprocesses/processes-subprocesses.service';
import { BackendNodeProces } from '../../../../../../../../shared/components/tree-table-general/tree/tree.interface';
import { NewProcessesSubprocessesModalComponent } from '../modal/new-processes-subprocesses-modal/new-processes-subprocesses-modal.component';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-processes-subprocesses-index',
  standalone: true,
  imports: [CommonModule,
            HeaderCardComponent, 
            TreeTableGeneralComponent, 
            NewProcessesSubprocessesModalComponent
          ],
  templateUrl: './processes-subprocesses-index.component.html',
  styles: [
  ]
})
export class ProcessesSubprocessesIndexComponent implements OnInit {

  public buttonsGenerals: any[] = ["btn_print","btn_new"];
  public buttonsDatatable = ["btn_nuevo", "btn_editar", "btn_eliminar"];
  public data: any[] = [];
  public dataList: BackendNodeProces[] = [];
  public colums: any[] = [];
  public displayModal: boolean = false;
  public idEdit?: number;
  public action: string = '';
  public title: string = '';
  public level: number = 0;
  public padreId?: number;
  public dataId?: number;
  public loading: boolean = true;
  

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private processesSubprocessesService: ProcessesSubprocessesService,
    private helperService: HelpersServiceImp
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Causas accidentes', routerLink: ['/administration/processes-subprocesses'] },
    ])
    this.colums = [
      { field: 'code', header: 'Código' },
      { field: 'name', header: 'Nombre' },
      { field: 'active', header: 'Activo' },
    ];
  }
  ngOnInit(): void {
    this.getData()
  }


  getData() {
    this.processesSubprocessesService.finAll().subscribe(
      (res: any) => {
        if(res != null && res != undefined){
          if (res.data.length > 0) {
            this.dataList = res.data;
            // Convertir datos del backend a TreeNodeGeneralProce
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
       // Lógica para ocultar botones según el nivel del nodo
        if (node.data.level === 2) {
          node.data.hiddenButtons.push('btn_nuevo');
        } else if (node.data.level < 2) {
          if (!this.hasChildren(node)) {
            node.data.hiddenButtons.push('btn_eliminar');
          }
        }

        // Procesar los nodos hijos si existen
        if (node.children && node.children.length > 0) {
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
    this.action = 'btn_nuevo';
    this.level = 0;
    this.displayModal = true;
    this.title = 'Proceso';
  }

  //* Accion Imprimir
  actionPrint(event: any) {
  }

    //* Acciones de datatable
  onAction(event: any) {
    switch (event.action) {
      case 'btn_nuevo': 
      this.action = 'btn_nuevo';
      this.level = 1;
      this.title = 'Subproceso';
      this.padreId = event.data.id;
      this.displayModal = true;
        break;
      case 'btn_editar':
        this.displayModal = true;
        this.level = event.data.level;
        this.title = this.level === 1 ? 'Proceso' : 'Subproceso';
        this.action = 'btn_editar';
        this.idEdit = event.data.id;
        this.dataId = event.data.id; // id del proceso
        this.padreId = event.data.padre?.id;
        break;
      case 'btn_eliminar':
        const itemDataId = event.data.id;
        this.helperService.showConfirmationDelete()
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.processesSubprocessesService.delete(itemDataId).subscribe(
              (resp: any) => {
                this.loading = true;
                this.helperService.showAlert('success', resp.message);
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
