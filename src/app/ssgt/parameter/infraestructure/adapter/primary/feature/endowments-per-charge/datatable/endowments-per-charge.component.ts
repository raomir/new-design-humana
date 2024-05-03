import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { TableGeneralComponent } from '../../../../../../../../shared/components/table-general/table-general.component';
import { ReportPreviewerComponent } from '../../../../../../../../shared/components/report-previewer/report-previewer.component';
import { ExportData, ExportDataInterface, Input as InputExport, PrintData, PrintDataInterface } from '../../../../../../../../shared/core/domain/export.models';
import { JsonParams } from '../../../../../../../../shared/components/table-general/col/col';
import { Router } from '@angular/router';
import { RegistroData } from '../../../../../../../../shared/components/buttons-general/actions';

@Component({
  selector: 'app-endowments-per-charge',
  templateUrl: './endowments-per-charge.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableGeneralComponent,
    HeaderCardComponent,
    ReportPreviewerComponent
  ],
})
export class EndowmentsPerChargeComponent implements OnInit {

  @ViewChild('table') table?: TableGeneralComponent;
  @ViewChild('reportPreviewer') reportPreviewer?: ReportPreviewerComponent;

  public title: string = 'Dotaciones por cargo';
  public endPoint: string = 'cargo';
  public endPointExport: string = ''; // pendiente
  public module: string = ''; // pendiente

  public buttonsGenerals: Array<string> = ['btn_print'];

  public columnsTable: any[] = [
    { title: 'Código', data: 'codigo', sort: 'codigo' },
    { title: 'Cargo', data: 'cargo_nivel_grado', sort: 'cargo_nivel_grado' },
    { title: 'Descripción', data: 'descripcion', sort: 'descripcion' },
    { title: 'Acciones', data: 'id', classTitle: 'text-center', actions: ['btn_editar'] }
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
      this.router.navigateByUrl(`/main/administration/endowments-per-charge/edit/${event.data.id}`)
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
