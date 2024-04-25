import { Component, ViewChild } from '@angular/core';
import { AppBreadcrumbService } from '../../../../ssgt/parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../header-card/header-card.component';
import { TableGeneralComponent } from '../../table-general/table-general.component';
import { Column, JsonParams } from '../../table-general/col/col';
import { ActivatedRoute } from '@angular/router';
import { ElementListModalComponent } from '../modal/element-list-modal.component';
import { HelpersServiceImp } from '../../../core/application/config/helpers.service.imp';
import { RegistroData } from '../../buttons-general/actions';
import { CommonModule } from '@angular/common';
import { ListService } from '../../../core/application/list.service';
import { ExporterErpComponent } from '../../exporter-erp/exporter-erp.component';
import { ExporterComponent } from '../../exporter/exporter.component';
import { ExportData, ExportDataInterface, Input as InputExport } from 'src/app/shared/core/domain/export.models';
import { ReportPreviewerComponent } from '../../report-previewer/report-previewer.component';
import { PrintData, PrintDataInterface } from '../../../core/domain/export.models';

@Component({
  selector: 'app-element-list',
  templateUrl: './element-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HeaderCardComponent,
    TableGeneralComponent,
    ElementListModalComponent,
    ExporterComponent,
    ReportPreviewerComponent
  ]
})
export class ElementListComponent {

  @ViewChild('table') table?: TableGeneralComponent;
  @ViewChild('reportPreviewer') reportPreviewer?: ReportPreviewerComponent;

  public title: string;
  public endPoint: string;
  public endPointExport: string;
  public module: string;

  public buttons: Array<string> = ['btn_print', 'btn_new'];
  public fileType: string | undefined;

  public loading: boolean = true;

  public columnsTable: Array<Column> = []

  public idEdit: number | null = null;
  public displayModal: boolean = false;
  public displayModalExport: boolean = false;
  public inputExport: InputExport | JsonParams | undefined;
  public values: ExportData | ExportDataInterface = new ExportData(true, {});
  public exportValues: Array<any> = [];
  public printData: PrintData | PrintDataInterface = new PrintData();

  constructor(private breadcrumbService: AppBreadcrumbService, private activatedRoute: ActivatedRoute, private helperService: HelpersServiceImp,
    private listService: ListService) {
    this.title = this.activatedRoute.snapshot.data['title'];
    this.endPoint = this.activatedRoute.snapshot.data['endpoint'];
    this.endPointExport = this.activatedRoute.snapshot.data['endpointExport'];
    this.module = this.activatedRoute.snapshot.data['module'];
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/administration/danger-class'] }, // pendiente
    ])

  }

  ngOnInit(): void {
    this.validationsComponent();
  }

  validationsComponent() {
    this.columnsTable = [
      { title: 'Código', data: 'codigo', sort: 'codigo' },
      { title: 'Nombre', data: 'nombre', sort: 'nombre' }
    ];
    switch (this.endPoint) {
      case 'objectoInpeccion':
        this.columnsTable = this.columnsTable.concat([
          { title: 'Descripción', data: 'descripcion', sort: 'descripcion' },
          { title: 'Formulario específico', data: 'metadatos', sort: 'metadatos.formularioNombre', render: (data: any) => data?.formularioNombre },
        ])
        break;

      case 'niveldeficiencia':
        this.columnsTable = this.columnsTable.concat([
          { title: 'Valor', data: 'metadatos', sort: 'metadatos.valor', render: (data: any) => data?.valor },
          { title: 'Significado', data: 'descripcion', sort: 'descripcion' },
        ])
        break;

      default:
        this.columnsTable = this.columnsTable.concat([
          { title: 'Descripción', data: 'descripcion', sort: 'descripcion' },
          { title: 'Favorito', data: 'favorito', sort: 'favorito', classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnFavorite(data) },
        ])
        break;
    }
    this.columnsTable = this.columnsTable.concat([
      { title: 'Activo', data: 'activo', sort: 'activo', classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnActive(data) },
      { title: 'Acciones', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar'] }
    ])
    this.loading = false;
  }

  create() {
    this.displayModal = true;
  }

  setExportDataInput(event: InputExport | JsonParams) {
    this.inputExport = event;
    if (this.inputExport.order && this.inputExport.order.length > 0) {
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
    this.printData.location = "archivo.pdf";
    this.printData.valores = {
      exportar: false,
      input: this.inputExport
    };
  }


  export(event: string | any) {
    this.fileType = undefined;
    this.displayModalExport = true;
    this.fileType = event;
  }

  modalResponse(event: boolean): void {
    this.displayModal = false;
    if (event) {
      this.table?.loadTable(0);
    }
    this.idEdit = null;
  }

  modalExportResponse(event: boolean): void {
    this.displayModalExport = false;
    if (event) {
    }
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
          this.listService.delete(this.endPoint, id).subscribe(
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
    this.reportPreviewer?.showModalDialog();
  }

}
