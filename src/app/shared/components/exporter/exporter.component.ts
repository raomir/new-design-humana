/** Modulos de Angular */
import {Component, EventEmitter, Input, OnInit, Output, forwardRef} from '@angular/core';
import {FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators} from '@angular/forms';
/** Angular Modules */
import { FileSaverService } from 'ngx-filesaver';
import { HelpersServiceImp } from '../../core/application/config/helpers.service.imp';
import { InputTextModule } from 'primeng/inputtext';
import { ModalGeneralComponent } from '../modal-general/modal-general.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ExportData, ExportDataInterface, Input as InputExport } from '../../core/domain/export.models';
import { JsonParams } from '../table-general/col/col';

declare let Stimulsoft: any;

@Component({
    selector: 'app-exporter',
    templateUrl: './exporter.component.html',
    styleUrls: ['./exporter.component.css'],
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
        DropdownModule
    ]
})
export class ExporterComponent implements OnInit {

    @Input() public exportAllOption: boolean = true;
    @Input() public exportCurrentOption: boolean = true;
    @Input() public exportRangeOption: boolean = true;
    @Input() public displayModal: boolean = false;
    @Input() public values: ExportData | ExportDataInterface = new ExportData(false, {});
    @Input() public module: string = '';
    @Input() public report: string | undefined;
    @Input() public parameter1: number | undefined;
    @Input() public parameter2: number | undefined;
    @Input() public parameter3: number | undefined;
    @Input() public parameter4: number | undefined;
    @Input() public fileType: String | undefined = '';
    @Input() public pageList: Array<any> = [];
    @Input() public reportForm: FormGroup | any;
    @Input() public form: FormGroup | any;
    @Input() public pages: number = 0;
    @Input() public recordsPerPage: number = 0;
    @Input() public currentPage: number = 0;
    @Input() public fieldToSortBy: string = '';
    @Input() public exportValues = [];
    @Input() public selection: any;
    @Input() public range: any;
    @Input() public pdfFile: any;
    @Input() public viewer: boolean = false;
    @Input() public visualize: boolean = true;
    @Input() public url: string = '';
    @Input() public title: string = 'report';
    @Input() public validatingReport: boolean = false;
    @Input() public jsonDataAdapter: any = '';
    @Input() public check = 1;
    @Input() public frmValidation = false;
    @Input() public notificationMessage = '';
    @Input() public notification: any = false;
    @Input() public isDisabled = false;
    @Input() public validationForm: boolean = false;
    @Input() public inputExport: InputExport | JsonParams | undefined;
    @Output() public modalExportResponse = new EventEmitter<boolean>();

    constructor(
        private helpersService: HelpersServiceImp
    ) { }

    ngOnInit(): void {
        // this.visualize ? $('#form').show() : $('#form').hide();
        this.loadPagination();

        this.form = new FormGroup({
            export: new FormControl('1', Validators.required),
            range: new FormControl(null)
        });

        this.form.controls.range.disable();
        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];
        this.values.input = this.inputExport;
    }

    validateReportHasData() {
        if (this.url == "") {
        return;
        }

        if (this.validatingReport == false) {
        this.validatingReport = true;
        } else {
        return;
        }
        // $('#form').hide();
        let hasData: boolean = this.helpersService.checkIfDataExistsInExporter("testData", this.url + '/csv' + "/all/10/1/1");

        if (!this.helpersService.checkIfDataExistsInExporter("testData", this.url + '/csv' + "/all/10/1/1")) {
        
        }
        //this.visualize ? $('#form').show() : $('#form').hide();
    }

    customValidation() {
        clearTimeout(this.notification); // If the timer was active, reset it to its set value.
        this.isDisabled = false; // Remove disabling as the initial value. It will be enabled if restrictions are activated.
        this.validationForm = false; // The warning does not appear by default. It will be enabled if restrictions are activated.

        /* Variables */
        let string;
        let lastValue;
        let commaSeparator;
        let dashSeparator;
        const specialCharacters: any = [];

        /* Assignment of values */
        string = this.form.controls['range'].value;
        lastValue = string[string.length - 1];
        commaSeparator = string.split(','); // Split the string by each comma found.
        dashSeparator = string.split('-'); // Split the string by each dash found.

        /** Validate that the user cannot write pages such as 1-0 or more, or 1-01 or more.*/
        if (string != '') {
            let stringArray = string.split('-');
            if (stringArray.length == 2) {
                if (parseFloat(stringArray[1]) == 0) {
                    this.isDisabled = true;
                    return;
                }
            }
            stringArray = string.split(',');
            if (stringArray.length == 2) {
                if (parseFloat(stringArray[1]) == 0) {
                    this.isDisabled = true;
                    return;
                }
            }
        }

        /** Validate last character*/
        if (lastValue == '-' || lastValue == ',') {
            this.isDisabled = true;
            this.notification = setTimeout(() => {
                this.validationForm = true;
                this.notificationMessage = 'Rango de página no válido, use por ejemplo 1-7, 9, 13-15';
            }, 1200);
        }

        for (let index = 0; index < string.length; index++) {
            /** Validate if there are 2 consecutive special characters */
            if ((string[index] == '-' && string[index - 1] == ',') || (string[index] == ',' && string[index - 1] == '-')) {
                this.isDisabled = true;
                this.notification = setTimeout(() => {
                    this.validationForm = true;
                    this.notificationMessage = 'Rango de página no válido, use por ejemplo 1-7, 9, 13-15';
                }, 1200);
            }
            /** Validate if the character is a number */
            if (!isNaN(string[index])) {
                for (const number of dashSeparator) {
                    /** Validate if the number is greater than the total number of pages */
                    if (number > this.pages) {
                        this.isDisabled = true;
                        this.notification = setTimeout(() => {
                            this.validationForm = true;
                            this.notificationMessage = 'El número de página está fuera de los límites, el límite es ' + this.pages;
                        }, 1200);
                    }
                } 
                for (const number of commaSeparator) {
                    /** Validate if the number is greater than the total number of pages */
                    if (number > this.pages) {
                        this.isDisabled = true;
                        this.notification = setTimeout(() => {
                            this.validationForm = true;
                            this.notificationMessage = 'El número de página está fuera de los límites, el límite es ' + this.pages;
                        }, 1200);
                    }
                }
            }

            if (string[index] == ',' || string[index] == '-') {
                specialCharacters.push(string[index]);
            }
            for (let i = 0; i < specialCharacters.length; i++) {
                /** Validate if there are 2 dashes in a row */
                if ((specialCharacters[i] == '-' && specialCharacters[i - 1] == '-')) {
                    this.isDisabled = true;
                    this.notification = setTimeout(() => {
                        this.validationForm = true;
                        this.notificationMessage = 'Rango de página no válido, use por ejemplo 1-7, 9, 13-15';
                    }, 1200);
                }
            }

            switch (string[index]) {
                case '-':
                    /** Validate if there are 2 dashes in a row in case the mask is crossed */
                    if (string[index] == string[index - 1]) {
                        this.isDisabled = true;
                        this.notification = setTimeout(() => {
                            this.validationForm = true;
                            this.notificationMessage = 'Rango de página no válido, use por ejemplo 1-7, 9, 13-15';
                        }, 1200);
                    }
                    for (const number of dashSeparator) {
                        let temp;
                        temp = number.split(',');
                        for (const cleanedNumber of temp) {
                            /** Validate if the number is greater than the total number of pages if the character is a dash */
                            if (cleanedNumber > this.pages) {
                                this.isDisabled = true;
                                this.notification = setTimeout(() => {
                                    this.validationForm = true;
                                    this.notificationMessage = 'El número de página está fuera de los límites, el límite es ' + this.pages;
                                }, 1200);
                            }
                        }
                    }
                    break;
                case ',':
                    /** Validate if there are 2 consecutive commas in case the mask is crossed */
                    if (string[index] == string[index - 1]) {
                        this.isDisabled = true;
                        this.notification = setTimeout(() => {
                            this.validationForm = true;
                            this.notificationMessage = 'Rango de página no válido, use por ejemplo 1-7, 9, 13-15';
                        }, 1200);
                    }
                    for (const number of commaSeparator) {
                        let temp;
                        temp = number.split('-');
                        for (const cleanedNumber of temp) {
                            /** Validate if the number is greater than the total number of pages if the character is a comma */
                            if (cleanedNumber > this.pages) {
                                this.isDisabled = true;
                                this.notification = setTimeout(() => {
                                    this.validationForm = true;
                                    this.notificationMessage = 'El número de página está fuera de los límites, el límite es ' + this.pages;
                                }, 1200);
                            }
                        }
                    }
                    break;

                default:
                    break;
            }

        }
    }


    public loadPagination() {
        for (var i = 1; i <= this.pages; i++) {
        this.pageList.push(i);
        }
    }

    async openViewer() {   
        this.helpersService.openPDF(this.title, this.url, true);
        this.closeModal(false);
    }

    public export() {
        if ( this.values.exportar ) { 
            if (!this.form.valid) { return; }
            this.values = {...this.values, tipoExportacion: this.form.controls['export'].value} 
        }

        if (this.jsonDataAdapter != "") {
            this.exportJsonDataAdapter(this.jsonDataAdapter);
            return;
        }

        if (this.module == "" || this.module == "autogestion") {
            this.export_autogestion();
        }

        if (this.module == "url" || this.module == "url2") {
            if(this.visualize){ 
                this.selection = this.form.controls["export"].value ? this.form.controls["export"].value: null;
                this.range = this.form.controls["range"].value ? this.form.controls["range"].value : null;

                if (this.selection == 1) { this.range = "all"; }
                if (this.selection == 2) { this.range = "currentList"; }
                if (this.selection != 1 && this.selection != 2 && this.selection != 3) { this.range = "all"; }
            }else{
                this.range = "currentList";
            }

            let fileTypeTmp = this.fileType;
            switch(this.fileType){
                case 'excel':
                fileTypeTmp = 'xls';
                break;
                case 'cvs':
                fileTypeTmp = 'csv';
                break;
                default:
                fileTypeTmp = this.fileType;
                break;
            }

            let exporters ={
                recordsPerPage: this.recordsPerPage,
                pages: this.exportValues[1],
                currentPage: this.exportValues[2],
                fileType: fileTypeTmp,
                range: this.range,
                orderBy: this.exportValues[3],
            }
            if ( this.values.exportar ) { this.values = {...this.values, exportadores: exporters } }


            this.pages = this.exportValues[1];
            this.fieldToSortBy = this.exportValues[3];
            this.controlFileType(this.title, this.url, this.viewer );
        }

        if (this.module == "evd") { this.exportEvd() }
        if (this.module == "sggt") { this.exportSggt() }
        if (this.module == "wellness") { this.exportWellness() }
    }

    public exportJsonDataAdapter(json: any) {
        
        if (json == "" || json == undefined || json == null) {
            this.helpersService.showAlert('info', 'No hay datos para exportar e imprimir!');
            this.closeModal(false);
            return;
        }


        this.selection = this.form ? this.form.get('export').value : null;
        this.range = this.form ? this.form.get('range').value : null;

        if (this.selection == 1) { this.range = "all"; }
        if (this.selection == 2) { this.range = "currentList"; }
        if (this.selection != 1 && this.selection != 2 && this.selection != 3) { this.range = "all"; }

        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];

        if (this.fileType == "pdf") { this.helpersService.openPDFJsonDataAdapter(this.title, json, this.url + '/pdf', this.viewer); }
        if (this.fileType == "excel") { this.helpersService.openXLSJsonDataAdapter(this.title, json, this.url + '/xls'); }
        if (this.fileType == "csv") { this.helpersService.openCSVJsonDataAdapter(this.title, json, this.url + '/csv'); }

        //this.activeModal.close();
    }

    public export_autogestion() {

        this.selection = this.form ? this.form.get('export').value : null;
        this.range = this.form ? this.form.get('range').value : null;

        if (this.selection == 1) { this.range = "all"; }
        if (this.selection == 2) { this.range = "currentList"; }
        if (this.selection != 1 && this.selection != 2 && this.selection != 3) { this.range = "all"; }

        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];

        if (this.fileType == "pdf") {
            this.controlFileType(this.title, this.url + '/pdf', this.viewer);
        }

        if (this.fileType == "excel") {
            this.controlFileType(this.title, this.url + '/xls', this.range);
        }

        if (this.fileType == "csv") {
            this.controlFileType(this.title, this.url + '/csv', this.range);
        }

        this.closeModal(false);
    }

    public exportEvd() {
        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];

        if (this.fileType == "pdf") { this.controlFileType(this.title, this.url + '/pdf', this.viewer); }
        if (this.fileType == "excel") { this.controlFileType(this.title, this.url + '/xls', this.viewer); }
        if (this.fileType == "csv") { this.controlFileType(this.title, this.url + '/csv', this.viewer); }

        this.closeModal(false);
    }

    public exportSggt() {
        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];

        if (this.fileType == "pdf") { this.controlFileType(this.title, this.url + '/pdf', this.viewer); }
        if (this.fileType == "excel") { this.controlFileType(this.title, this.url + '/xls', this.viewer); }
        if (this.fileType == "csv") { this.controlFileType(this.title, this.url + '/csv', this.viewer); }

        this.closeModal(false);
    }

    public exportWellness() {
        this.recordsPerPage = this.exportValues[0];
        this.pages = this.exportValues[1];
        this.currentPage = this.exportValues[2];

        if (this.fileType == "pdf") { this.controlFileType(this.title, this.url + '/pdf', this.viewer); }
        if (this.fileType == "excel") { this.controlFileType(this.title, this.url + '/xls', this.viewer); }
        if (this.fileType == "csv") { this.controlFileType(this.title, this.url + '/csv', this.viewer); }

        this.closeModal(false);
    }

    public controlFileType(fileName: string, url: string, viewer: boolean ) {
        console.log(this.values);
        if ( this.module == "url2") { 
            if (this.fileType == "excel") {  this.helpersService.openXLS(fileName, url, this.values); }
            if (this.fileType == "csv") {    this.helpersService.openCSV(fileName, url, this.values); }
            if (this.fileType == "pdf") {    this.helpersService.openPDF(fileName, url, viewer, this.values); }
        }else{
            if (this.fileType == "excel") { this.openXLS(fileName, url + '/xls'); }
            if (this.fileType == "csv") { this.openCSV(fileName, url + '/csv'); }
            if (this.fileType == "pdf") { this.openPdf(fileName, url + '/pdf', viewer ); }
        }
        this.closeModal(false);
    }

    async openPdf(titulo: string, url: any, viewer: boolean ) { 
        url = url + "/" + this.range + "/" + this.recordsPerPage + "/" + this.pages + "/" + this.currentPage;
        this.helpersService.openPDF(titulo, url, viewer, this.values);
    }

    openXLS(titulo: string, url: any ) {
        url = url + "/" + this.range + "/" + this.recordsPerPage + "/" + this.pages + "/" + this.currentPage;
        this.helpersService.openXLS(titulo, url, this.values);
    }

    openCSV(titulo: string, url: any) {
        url = url + "/" + this.range + "/" + this.recordsPerPage + "/" + this.pages + "/" + this.currentPage;
        this.helpersService.openCSV(titulo, url, this.values);
    }

    closeModal(event: boolean) {
        console.log(event);
        if (event) {
        if (this.form.valid) {
            //this.save();
        } else {
        }
        } else {
            this.modalExportResponse.emit(false)
        }
    }
}