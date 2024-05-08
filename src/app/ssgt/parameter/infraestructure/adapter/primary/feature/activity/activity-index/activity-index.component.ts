import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { TreeNodeGeneral, BackendNode } from '../../../../../../../../shared/components/tree-table-general/tree/tree.interface';
import { TreeTableGeneralComponent } from '../../../../../../../../shared/components/tree-table-general/tree-table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ActivityModalComponent } from '../modal/activity-modal/activity-modal.component';
import { ActivityService } from '../../../../../../core/application/activity/activity.service';
import { TreeNode } from 'primeng/api';
import { ExportData, ExportDataInterface, PrintData, PrintDataInterface, Input as InputExport } from '../../../../../../../../shared/core/domain/export.models';
import { ActivatedRoute } from '@angular/router';
import { ReportPreviewerComponent } from '../../../../../../../../shared/components/report-previewer/report-previewer.component';
import { JsonParams } from '../../../../../../../../shared/components/table-general/col/col';
import { ExporterComponent } from '../../../../../../../../shared/components/exporter/exporter.component';

@Component({
  selector: 'app-activity-index',
  standalone: true,
  imports: [
    CommonModule,
    TreeTableGeneralComponent,
    HeaderCardComponent,
    ActivityModalComponent,
    ExporterComponent,
    ReportPreviewerComponent
  ],
  templateUrl: './activity-index.component.html'
})
export class ActivityIndexComponent implements OnInit {

  @ViewChild('reportPreviewer') reportPreviewer?: ReportPreviewerComponent;

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

  public displayModalExport: boolean = false;
  public printData: PrintData | PrintDataInterface = new PrintData();
  public fileType: string | undefined;
  public values: ExportData | ExportDataInterface = new ExportData(true, {});
  public exportValues: Array<any> = [];
  public inputExport: InputExport | JsonParams | undefined;

  public endPointExport: string;
  public module: string;


  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private activityService: ActivityService,
    private helperService: HelpersServiceImp,
    private activatedRoute: ActivatedRoute
  ) {

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Actividad', routerLink: ['/administration/activity'] },
    ])

    this.colums = [
      { field: 'code', header: 'Código' },
      { field: 'name', header: 'Actividad' },
      { field: 'description', header: 'Proceso' },
      { field: 'active', header: 'Activo' },
    ];
    this.title = this.activatedRoute.snapshot.data['title'];
    this.endPoint = this.activatedRoute.snapshot.data['endpoint'];
    this.endPointExport = this.activatedRoute.snapshot.data['endpointExport'];
    this.module = this.activatedRoute.snapshot.data['module'];
  }

  ngOnInit() {
    this.inputExport = {
      "order": [
        {
          "column": 0,
          "dir": "asc"
        }
      ],
      "search": {
        "regex": false,
        "value": ""
      },
      "pageCurrent": 0,
      "length": 10
    }
    this.getData();
  }

  getData() {
    this.activityService.getLists().subscribe(
      (res: any) => {
        if(res != null && res != undefined){
          if (res.length > 0) {
            this.dataList = res;
            // Convertir datos del backend a TreeNodeGeneral
            this.data = this.convertToTreeNodeGeneral(this.dataList);
            this.printData.location = "archivo.pdf";
            this.printData.valores = {
              exportar: false,
              input: this.inputExport
            };
            if (this.inputExport?.order && this.inputExport.order.length > 0) {
              const column = this.inputExport.order[0]?.column || 0;
              const dir = this.inputExport.order[0]?.dir || '';
              const columnData: any = this.inputExport?.columns?.length ? this.inputExport?.columns[column] : {};
              const data = columnData ? columnData.data || '' : '';
              this.exportValues = [
                this.inputExport.length,
                this.inputExport?.pages,
                this.inputExport.pageCurrent,
                `${data} ${dir}`
              ];
            }
          }else{
            this.data = [];
          }
        }
      }
    )
  }

  convertToTreeNodeGeneral(dataList: any[]): TreeNode[] {
    const nodesById: { [id: number]: TreeNode } = {};

    // Mapear nodos por ID
    dataList.forEach((item) => {
      nodesById[item.id] = {
        data: {
          id: item.id,
          code: item.codigo,
          name: item.nombre,
          level: item.nivel,
          description: `${item.procesoId.codigo} ${item.procesoId.nombre}`,
          active: item.activoActividad,
          isLast: false,
          hiddenButtons: [],
          llave: item.procesoId
        },
        children: []
      };
    });

    // Construir la estructura del árbol
    const topLevelNodes: TreeNode[] = [];
    dataList.forEach((item) => {
      if (item.nivel === 1) {
        if (this.hasChildren(nodesById, item.id)) {
          nodesById[item.id].data.hiddenButtons = [];
        } else {
          nodesById[item.id].data.hiddenButtons = ['btn_eliminar'];
        }
        // nodesById[item.id].data.hiddenButtons = ['btn_eliminar'];
        topLevelNodes.push(nodesById[item.id]);
      } else {
        const parentNode: any = nodesById[item.actividadId.id];
        if (parentNode) {
          parentNode.children.push(nodesById[item.id]);
        }
      }
    });

    // Función recursiva para marcar los últimos nodos de cada rama
    function markLastLevel(nodes: TreeNode[]): void {
      if (nodes.length === 0) return;
      nodes.forEach((node: TreeNode | any) => {
        if (node.children.length === 0) {
          node.data.isLast = true;
          if (node.data.level !== 2) {
            node.data.hiddenButtons = ['btn_nuevo'];
          }
        } else {
          if (node.data.level === 2) {
            node.data.hiddenButtons = ['btn_eliminar'];
          }
          markLastLevel(node.children);
        }
      });
    }

    // Marcar los últimos nodos de cada rama
    topLevelNodes.forEach((node: any) => {
      if (!node.children.length) {
        node.data.hiddenButtons = [];
      }
      markLastLevel(node.children);
    });

    return topLevelNodes;
  }

  hasChildren(nodesById: any, id: number): boolean {
    for (const nodeId in nodesById) {
      if (nodesById[nodeId].data.llave.id === id && nodesById[nodeId].children.length > 0) {
        return true;
      }
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
    this.print();
  }

  //* Acciones de datatable
  onAction(event: any) {
    switch (event.action) {
      case 'btn_nuevo':
        this.displayModal = true;
 
        this.level = event.data.level + 1;
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
        this.helperService.showConfirmationDelete()
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.activityService.delete(itemDataId).subscribe(
              (resp: any) => {
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

  valueSearch(value: string) {
    if (this.printData.valores && this.printData.valores.input && this.printData.valores.input.search) {
      this.printData.valores.input.search.value = value;
      this.inputExport = this.printData.valores.input;
      if (this.inputExport?.order && this.inputExport.order.length > 0) {
        const column = this.inputExport.order[0]?.column || 0;
        const dir = this.inputExport.order[0]?.dir || '';
        const columnData: any = this.inputExport?.columns?.length ? this.inputExport?.columns[column] : {};
        const data = columnData ? columnData.data || '' : '';
        this.exportValues = [
          this.inputExport.length,
          this.inputExport?.pages,
          this.inputExport.pageCurrent,
          `${data} ${dir}`
        ];
      }
    }
  }

  print(): void {
    this.reportPreviewer?.showModalDialog();
  }

  modalExportResponse(event: boolean): void {
    this.displayModalExport = false;
    if (event) {
    }
  }

  export(event: string | any) {
    this.fileType = undefined;
    this.displayModalExport = true;
    this.fileType = event;
  }
}