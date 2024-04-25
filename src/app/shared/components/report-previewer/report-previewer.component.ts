import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PDFDocumentProxy, PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../../../environments/environment';
import { ModalGeneralComponent } from '../modal-general/modal-general.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrintData, PrintDataInterface } from '../../core/domain/export.models';

interface EnvironmentKeys {
  url: string;
  url_sinergia: string;
}

@Component({
    selector: 'app-report-previewer',
    templateUrl: './report-previewer.component.html',
    styleUrls: ['./report-previewer.component.scss'],
    standalone: true,
    providers: [
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ModalGeneralComponent,
        InputSwitchModule,
        ButtonModule,
        ProgressSpinnerModule,
        CommonModule, 
        RadioButtonModule,
        TooltipModule,
        DropdownModule,
        PdfViewerModule,
        DialogModule,
        SkeletonModule
    ]
})
export class ReportPreviewerComponent {
  displayModal: boolean = false;
  displayViewer: boolean = false;
  loading = true;
  @Input() endpoint = '';
  @Input() title = '';
  @Input() disabled = false;
  @Input() isButton = true;
  @Input() individualReportTitle = '';
  @Input() public printData: PrintData | PrintDataInterface = new PrintData();
  @Input() public enviromenKey: keyof EnvironmentKeys = 'url';
  API_URL = environment[this.enviromenKey];
  src: any = {}
  zoomSize = 1
  page = 1
  maxPages = 0
  pdf!: PDFDocumentProxy

  downloadFileName: string = 'document'; 

  @ViewChild(PdfViewerComponent) private pdfComponent!: PdfViewerComponent

  constructor(private http: HttpClient) { }

  showModalDialog() {
    this.displayModal = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    });

    // Realizar la solicitud POST al servidor para obtener el PDF
    this.http.post(this.API_URL + this.endpoint, this.printData, { headers, responseType: 'blob' }).subscribe(
      (data: Blob | any) => {
        // Crear una URL válida para el Blob
        const pdfBlob = new Blob([data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Asignar la URL al src del pdf-viewer
        this.src = { url: pdfUrl };
        this.displayViewer = true;

        // Establecer el nombre del archivo al descargarlo
        this.downloadFileName = this.title || 'document';
      },
      (error) => {
        console.error('Error al cargar el PDF:', error);
      }
    );
  }

  pageLoadComplete(pdf: PDFDocumentProxy) {
    this.maxPages = pdf._pdfInfo.numPages
    this.pdf = pdf
    this.loading = false
  }

  pageRendered($event: { pageNumber: number } | any) {
    this.page = $event.pageNumber
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const stringToSearch = inputElement.value;
    this.pdfComponent.eventBus.dispatch('find', {
      query: stringToSearch,
      type: 'again',
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true
    })
  }

  zoom(value: number) {
    this.zoomSize = value == 0 ? 1 : value
  }

  download() {
    this.pdf.getData().then((u8) => {
      const blob = new Blob([u8.buffer], {
        type: 'application/pdf'
      })
      // Chrome, Safari, Firefox, Opera
      const url = URL.createObjectURL(blob)
      this.openLink(url, this.downloadFileName);
      // Remove the link when done
      setTimeout(function () {
        window.URL.revokeObjectURL(url)
      }, 5000)
    })
  }

  openLink(url: string, fileName: string) {
    const a = document.createElement('a')
    // Firefox requires the link to be in the body
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    a.download = this.getRandomFileName(fileName) + '.pdf'
    a.click()
    // Remove the link when done
    document.body.removeChild(a)
  }

getRandomFileName(fileName: string) {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = ('' + Math.random()).substring(2, 8);
  const random_number = timestamp + random;

  // Reemplazar espacios en blanco por guiones bajos (_)
  const modifiedFileName = fileName.replace(/\s/g, '_');

  return modifiedFileName + '_' + random_number;
}

  hideModal() {
    this.displayModal = false
    this.displayViewer = false;
    this.loading = true
    this.zoomSize = 1
  }
}
