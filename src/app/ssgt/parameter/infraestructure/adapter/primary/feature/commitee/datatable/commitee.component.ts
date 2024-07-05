import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { TableGeneralComponent } from '../../../../../../../../shared/components/table-general/table-general.component';
import { ReportPreviewerComponent } from '../../../../../../../../shared/components/report-previewer/report-previewer.component';
import { ExportData, ExportDataInterface, Input as InputExport, PrintData, PrintDataInterface } from '../../../../../../../../shared/core/domain/export.models';
import { Column, JsonParams } from '../../../../../../../../shared/components/table-general/col/col';
import { Router } from '@angular/router';
import { RegistroData } from '../../../../../../../../shared/components/buttons-general/actions';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { CommitteeService } from '../../../../../../../../ssgt/parameter/core/application/committee/committee.service';

@Component({
  selector: 'app-commitee',
  templateUrl: './commitee.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableGeneralComponent,
    HeaderCardComponent,
    ReportPreviewerComponent
  ],
})
export class CommiteeComponent implements OnInit {

  @ViewChild('table') table?: TableGeneralComponent;
  @ViewChild('reportPreviewer') reportPreviewer?: ReportPreviewerComponent;

  public title: string = 'Comités';
  public endPoint: string = 'v2/committees';
  public endPointExport: string = ''; // pendiente
  public module: string = ''; // pendiente

  public buttonsGenerals: Array<string> = ['btn_print', 'btn_new'];

  public columnsTable: Column[] = [
    { title: 'Código', data: 'code', sort: 'code' },
    { title: 'Nombre', data: 'name', sort: 'name' },
    { 
      title: 'Fecha Inicial',
      data: 'startDate',
      sort: 'startDate',
      searchable: false,
      render: (startDate: any) => {
        return this.formatDate(startDate);
      } 
    },
    { 
      title: 'Fecha Final',
      data: 'endDate',
      sort: 'endDate',
      searchable: false,
      render: (endDate: any) => {
        return this.formatDate(endDate);
      } 
    },
    { title: 'Objetivo-Observaciones', data: 'description', sort: 'description' },
    { title: 'Activo', data: 'status', orderable: false, searchable: false, classStatus: 'text-center', classTitle: 'text-center', render: (data: Number) => this.helperService.getColumnActive(data) },
    { 
      title: 'Acciones',
      data: 'id',
      classTitle: 'text-center',
      actions: ['btn_editar', 'btn_ver', 'btn_eliminar'],
      searchable: false,
      orderable: false
    }
  ];

  // export | print
  public fileType: string | undefined;
  public displayModalExport: boolean = false;
  public inputExport: InputExport | JsonParams | undefined;
  public values: ExportData | ExportDataInterface = new ExportData(true, {});
  public exportValues: Array<any> = [];
  public printData: PrintData | PrintDataInterface = new PrintData();

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private helperService: HelpersServiceImp,
    private router: Router,
    private committeeService: CommitteeService
  ) {
    // Obtener la ruta actual
    const currentPath = this.router.url;
    // Configurar el breadcrumb con la ruta actual

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: [currentPath] }
    ]);

  }

  ngOnInit() {

  }

  private formatDate(dateArray: number[]): string {
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  print(): void {
    this.reportPreviewer?.showModalDialog();
  }

  export(event: string | any) {
    this.fileType = undefined;
    this.displayModalExport = true;
    this.fileType = event;
  }

  runActions(event: RegistroData) {
    if (event.action == 'btn_editar') {
      this.router.navigateByUrl(`/main/administration/committee/edit/${event.data.id}`)
    }
    if (event.action == 'btn_ver') {
      this.router.navigateByUrl(`/main/administration/committee/show/${event.data.id}`)
    }
    if (event.action == 'btn_eliminar') {
        const itemDataId = event.data.id;
        this.helperService.showConfirmationDelete()
        .then((confirmed: boolean) => {
          if (confirmed) {
            this.committeeService.delete(itemDataId).subscribe(
              (resp: any) => {
                this.helperService.showAlert('success', resp.message);
                this.table?.loadTable(0);
              }
            );
          }
        })
        .catch((error: any) => {
          console.error('Error al mostrar el cuadro de confirmación:', error);
        });
    };
  }

  create() {
    this.router.navigateByUrl(`/main/administration/committee/new`)
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

}
