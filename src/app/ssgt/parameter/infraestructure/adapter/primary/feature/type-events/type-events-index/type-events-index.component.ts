import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { TreeNodeGeneral, BackendNode } from '../../../../../../../../shared/components/tree-table-general/tree/tree.interface';
import { TreeTableGeneralComponent } from '../../../../../../../../shared/components/tree-table-general/tree-table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { TreeNode } from 'primeng/api';
import { ExportData, ExportDataInterface, PrintData, PrintDataInterface, Input as InputExport } from '../../../../../../../../shared/core/domain/export.models';
import { ActivatedRoute } from '@angular/router';
import { ReportPreviewerComponent } from '../../../../../../../../shared/components/report-previewer/report-previewer.component';
import { JsonParams } from '../../../../../../../../shared/components/table-general/col/col';
import { ExporterComponent } from '../../../../../../../../shared/components/exporter/exporter.component';
import { TypeEventsModalComponent } from '../modal/type-events-modal/type-events-modal.component';
import { TypeEventService } from '../../../../../../core/application/type-event/type-event.service';

@Component({
  selector: 'app-type-events-index',
  standalone: true,
  imports: [
    CommonModule,
    TreeTableGeneralComponent,
    HeaderCardComponent,
    TypeEventsModalComponent,
    ExporterComponent,
    ReportPreviewerComponent
  ],
  templateUrl: './type-events-index.component.html'
})
export class TypeEventsIndexComponent implements OnInit {

  @ViewChild('reportPreviewer') reportPreviewer?: ReportPreviewerComponent;

  //variables
  public dataList: BackendNode[] | Array<any> = [];
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

    public loading: boolean = true;


  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private typeEventService: TypeEventService,
    private helperService: HelpersServiceImp,
    private activatedRoute: ActivatedRoute
  ) {

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Tipos De Evento', routerLink: ['/administration/type-events'] },
    ])

    this.colums = [
      { field: 'code', header: 'Código' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' },
      { field: 'type', header: 'Tipo' },
      { field: 'formG', header: 'Formulario General' },
      { field: 'formE', header: 'Formulario Específico' },
      { field: 'favorite', header: 'Favorito' },
      { field: 'active', header: 'Activo' }
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
    this.typeEventService.getLists().subscribe(
      (res: any) => {
        if(res != null && res != undefined){
          if (res.data.length > 0) {
            this.dataList = res.data;
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
        } else {
          this.data = [];
        }
      }
    )
  }

  convertToTreeNodeGeneral(dataList: TreeNode[] | any[]): TreeNode[] | any[] {
    // Función recursiva para mapear nodos y ajustar los botones ocultos
    const mapNodes = (nodes: TreeNode[]): void => {
      nodes.forEach((node: TreeNode | any) => {
        node.data.hiddenButtons = [];
        node.data.type = this.helperService.isset(node.data.typeEvent) ? `${node.data.typeEvent.code} - ${node.data.typeEvent.name}` : 'No aplica',
        node.data.formG = node.data.level == 1 && this.helperService.isset(node.data.form) ? `${node.data.form.codigo} - ${node.data.form.nombre}` : 'No aplica',
        node.data.formE = node.data.level == 2 && this.helperService.isset(node.data.form) ? `${node.data.form.codigo} - ${node.data.form.nombre}` : 'No aplica'
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
      this.level = 0;
      this.title = 'Tipos De Eventos';
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
        break;
      case 'btn_editar':
        this.displayModal = true;
        this.level = event.data.level;
        this.action = 'btn_editar';
        this.idEdit = event.data.id;
        break;
      case 'btn_eliminar':
        const itemDataId = event.data.id;
        this.helperService.showConfirmationDelete()
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.typeEventService.delete(itemDataId).subscribe(
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