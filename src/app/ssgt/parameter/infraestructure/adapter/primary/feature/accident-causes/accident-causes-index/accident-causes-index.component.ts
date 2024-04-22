import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { TreeNodeGeneral, BackendNode } from '../../../../../../../../shared/components/tree-table-general/tree/tree.interface';
import { TreeTableGeneralComponent } from '../../../../../../../../shared/components/tree-table-general/tree-table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { AccidentCausesService } from '../../../../../../core/application/accident-causes/accident-causes.service';
import { NewClassCauseModalComponent } from '../modal/new-class-cause-modal/new-class-cause-modal.component';

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


  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private accidentCausesService: AccidentCausesService
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
          if (res.length > 0) {
            this.dataList = res;
            // Convertir datos del backend a TreeNodeGeneral
            this.data = this.convertToTreeNodeGeneral(this.dataList);
          }else{
            this.data = [];
          }
        }
      }
    )
  }

  convertToTreeNodeGeneral(data: BackendNode[]): TreeNodeGeneral[] {
    const nodesById: { [id: number]: any } = {};

    // Mapear nodos por ID
    data.forEach((item) => {
      nodesById[item.id] = {
        data: {
          id: item.id,
          code: item.codigo,
          name: item.nombre,
          level: item.nivel,
          description: item.descripcion,
          active: item.activo,
          isLast: false,
          hiddenButtons: [],
          llave: (item.llave) ? item.llave : null,
        },
        children: [],
      };
    });

    // Construir la estructura del árbol
    const topLevelNodes: TreeNodeGeneral[] = [];

    data.forEach((item) => {
      if (item.nivel === 1) {
        nodesById[item.id]['data']['hiddenButtons'] = ['btn_eliminar'];
        topLevelNodes.push(nodesById[item.id]);
      } else if (item.nivel > 1) {
        const parentNode = item.llave ? nodesById[item.llave!.id]: null;
        if (parentNode) {
          parentNode.children!.push(nodesById[item.id]);
        }
      }
    });

    // Función recursiva para marcar los últimos nodos de cada rama
    function markLastLevel(nodes: TreeNodeGeneral[]): void {
      
      if (nodes.length === 0) return;
      nodes.forEach((node: TreeNodeGeneral) => {
        if (node.children?.length === 0) {
          node.data.isLast = true;
          if (node.data.level != 2 ) {
            node.data.hiddenButtons = ['btn_nuevo'];
          }
         
        } else {
          if(node.data.level == 2){
            node.data.hiddenButtons = ['btn_eliminar'];
          }
          markLastLevel(node.children || []);
        }
      });
    }

    // Marcar los últimos nodos de cada rama
    topLevelNodes.forEach((node) => {
      markLastLevel(node.children || []);
    });
    return topLevelNodes;
  }

  //* Accion Nuevo 
  actionNew() {
    this.level = 0;
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
        console.log(event.data);
        this.level = event.data.level;
        this.fatherId = event.data.id;
        if (this.level == 1) {
          this.fatherName =  event.data.name;
        }else{ 
          this.fatherName =  event.data.llave ? event.data.llave.nombre : '';
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
