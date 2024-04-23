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

declare let Stimulsoft: any;

@Component({
    selector: 'app-exporter-erp',
    templateUrl: './exporter-erp.component.html',
    styleUrls: ['./exporter-erp.component.css'],
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
        TooltipModule
    ]
})
export class ExporterErpComponent implements OnInit {
    /** Global Variables */
    public translations: any;

    /** Form Variables */
    public exportForm: FormGroup = new FormGroup({});

    /** Data Storage Variables */
    @Input() exporterData: any = {};
    @Input() filterData = null;
    @Input() public service: any = null;
    @Input() prv_module_id = null;
    @Input() financialPlan = false;
    @Input() route = 'export';
    @Input() budgetReport: any = false;
    @Input() importReport: any = false;
    @Input() routeController = false;
    @Input() public displayModal: boolean = false;
    @Output() modalExportResponse = new EventEmitter<boolean>();
    public component: any;
    public totalPages: any;
    public validity = null;
    public currentSub: any = null;

    /** View Altering Variables */
    public action: string = '0';
    public formValidation = false;
    public notification: any = false;
    public notificationMessage: any = null;
    public isDisabled = false;
    public processing = false;
    public onlyAll = false;

    /** Stimulsoft implementation for export */
   /*  report: any = new Stimulsoft.Report.StiReport();
    dataSet: any = new Stimulsoft.System.Data.DataSet('Data');
    options: any = new Stimulsoft.Viewer.StiViewerOptions();
    viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false); */

    constructor(
        private _helperService: HelpersServiceImp,
        private _FileSaverService: FileSaverService,
    ) {
        this.translations = [];
    }

    ngOnInit() {
        this.exportForm = new FormGroup({
            exp: new FormControl('0', Validators.required),
            input_custom: new FormControl({ value: '', disabled: true }, Validators.compose([
                Validators.pattern('[0-9"",-]+')
            ]))
        });

        let temp;
        if (this.exporterData.input == undefined) {
            this.exporterData.input = [];
            this.totalPages = 100000;
            this.validity = this.exporterData.validity;
        } else {
            temp = this.exporterData.recordsTotal / this.exporterData.input.length;
            this.totalPages = Math.ceil(temp);
        }
        this.action = '0';

        /** Stimulsoft License */
        /* Stimulsoft.Base.StiLicense.key = 'YOUR_LICENSE_KEY'; */
    }

    exportMask(rawValue: string): RegExp[] {
        const maskAll = /[-,0-9]/;
        const maskNumerOne = /^[1-9][0-9]*$/;
        const intLength = 0;
        const strLength = String(rawValue.toUpperCase()).length;
        const exportMask: RegExp[] = [];

        if (
            (rawValue[rawValue.length - 2] == '-' || rawValue[rawValue.length - 2] == ',') &&
            (rawValue[rawValue.length - 1] == '-' || rawValue[rawValue.length - 1] == ',')
        ) {
            for (let i = 0; i <= rawValue.length - 2; i++) {
                exportMask.push(maskAll);
            }
        } else {
            // Block 0
            for (let i = 0; i <= intLength; i++) {
                exportMask.push(maskNumerOne);
            }

            // Block TWO
            for (let i = 0; i <= strLength; i++) {
                exportMask.push(maskAll);
            }
        }
        return exportMask;
    }

    formValidations() {
        this.exportForm = new FormGroup({
            radio_todo: new FormControl('', Validators.compose([
                Validators.pattern('[A-Za-z0-9." "_-ñá-ź]+')
            ])),
            radio_actual: new FormControl('', Validators.compose([
                Validators.pattern('[A-Za-z0-9." "_-ñá-ź]+')
            ])),
            radio_custom: new FormControl('', Validators.compose([
                Validators.pattern('[A-Za-z0-9." "_-ñá-ź]+')
            ])),
            input_custom: new FormControl({ value: '', disabled: true }, Validators.compose([
                Validators.pattern('[0-9"",-]+')
            ]))
        });
    }

    private loadData() {
        this.exportForm.setValue({
            radio_todo: null,
            radio_actual: null,
            radio_custom: null,
            input_custom: null
        });
    }

    closeModal(event: boolean) {
        if (event) {
        if (this.exportForm.valid) {
            //this.save();
        } else {
        }
        } else {
            this.modalExportResponse.emit(false)
        }
    }

    selectText() {
        // Focus on export input
        //$('#txtInput').trigger('focus')
    }

    disableInput() {
        // Disable input and reset text
        if (!this.onlyAll) {
            this.isDisabled = false
            this.formValidation = false
            this.exportForm.controls['input_custom'].disable()
            this.exportForm.controls['input_custom'].reset()
        }
    }

    enableInput() {
        this.exportForm.controls['input_custom'].enable()
    }

    exportController() {
        // Export controller logic
    }

    exportData() {
        this.exporterData.input.paginas = this.exportForm.controls['input_custom'].value
        // Personalizados
        if (this.action == '2') {
            if (this.exportForm.controls['input_custom'].value === '' || this.exportForm.controls['input_custom'].value === null || this.exportForm.controls['input_custom'].value === undefined) {
                this.exportForm.controls['input_custom'].setValidators([Validators.required])
                this.notification = setTimeout(() => {
                    this.formValidation = true
                    this.notificationMessage = 'pagina 1'
                }, 1200)
                this.processing = false
                return
            }
        }
        this.currentSub = this._helperService.exportDataTable(this.action, this.exporterData.tipo_exportacion, this.exporterData.input, this.route).subscribe(
                (response: any) => {
                    if (response.status === 'success') {
                        window.open(response.url + response.bodega + '/' + response.nombre_archivo + '/' + response.nombre_salida, '_blank')
                        
                        /* if (this.activeModal != null) {
                            this.activeModal.close()
                        } */
                        this.isDisabled = false
                    } else { 
                        //this.activeModal.close()
                    }
                },
                () => {
                    this.isDisabled = false
                    //this.activeModal.close()
                }
        )
    }

    customValidation() {
        // Custom validation logic
    }

    fetchData(data: any, type: any) {
        // Fetch data logic
    }

    saveReport(report: any, type: any) {
        // Save report logic
    }
}