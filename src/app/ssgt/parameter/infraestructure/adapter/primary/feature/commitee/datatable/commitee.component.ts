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
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/administration/endowments-per-charge'] },
    ])

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
