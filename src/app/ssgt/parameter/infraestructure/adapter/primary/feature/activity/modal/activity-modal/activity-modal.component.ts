import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ActivityModel } from '../../../../../../../core/domain/activity/activity.model';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ActivityService } from '../../../../../../../core/application/activity/activity.service';
import { AutocompleteComponent } from '../../../../../../../../../shared/components/autocomplete/autocomplete.component';
import { AdvancedSearchFormsActivityComponent } from '../../../../../../../../../shared/components/advanced-search-forms-activity/advanced-search-forms-activity.component';
import { ValidationMessageComponent } from '../../../../../../../../../shared/components/validation-message/validation-message.component';

@Component({
  selector: 'activity-modal',
  standalone: true,
  imports: [CommonModule, 
          ModalGeneralComponent, 
          FormsModule,
          ReactiveFormsModule,
          InputTextModule,
          InputSwitchModule,
          AutocompleteComponent,
          ValidationMessageComponent,
          AdvancedSearchFormsActivityComponent
        ],
  templateUrl: './activity-modal.component.html'
})
export class ActivityModalComponent implements OnInit {

  @Input() listName: string = '';
  @Input() id?: Number;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save'];
  @Input() level: number  = 1;
  @Input() action: string = '';
  @Input() fatherName: string = '';
  @Input() sonName: string = '';
  @Input() fatherId: Number | null = null;

  @Output() modalResponse = new EventEmitter<boolean>();

  public title: string = '';
  public frm!: FormGroup;
  public llave? : any;
  formTxt: any;
  public displayModalAdvancedForms: boolean = false;
  public isLoading: boolean = false;

  constructor( 
      private formBuilder: FormBuilder,
      private activityService: ActivityService,
      private helperService: HelpersServiceImp
    ) {
  
  }


  ngOnInit(): void {
    this.loadForm() 
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData(this.id);
    } else {
      this.title = 'Nueva: ' + this.listName;
    }
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      activoActividad: [true],
      codigo: [null, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      subProceso: [{value: this.sonName, disabled: true}], 
      proceso: [{value: this.fatherName, disabled: true}],
      nivel: [this.level ? this.level : 1],
      izquierda: [1],
      derecha: [0],
      actividadId: [this.fatherId],
      id: [null]
    })
  }

  loadData(id: Number) {
    this.isLoading = true;
    this.activityService.findID(id).subscribe(
      (res: ActivityModel | any) => {
        this.frm.patchValue({
          activoActividad: res.activoActividad === 1,
          codigo: res.codigo,
          nombre: res.nombre,
          izquierda: res.izquierda,
          derecha: res.derecha,
          nivel: res.nivel,
          id: res.id
        })
        if (res.actividadId != null) {
          this.frm.controls['actividadId'].setValue(res.actividadId.id);
        }
        if(this.fatherId === null || this.fatherId === undefined){
          this.fatherId = res.llave?.id 
        }
        if (res.procesoId != null) {
          const dataProceso =
          {
            'id': res.procesoId.id,
            'valorMontar': `${res.procesoId.codigo} ${res.procesoId.nombre}`,
            'valor_montar': `${res.procesoId.codigo} ${res.procesoId.nombre}`,
            'valorMontarPadre': `${res.procesoId.padre.codigo} ${res.procesoId.padre.nombre}`
          };
          this.subprocessResponse(dataProceso);
          this.isLoading = false;;
        }
    })
  }

  public subprocessResponse(event: any) {
    this.displayModalAdvancedForms = false;
    this.formTxt = event;
    let idSubproceso: number = Number(event.id);
    this.frm.controls['subProceso'].setValue(idSubproceso);
    this.frm.controls['proceso'].setValue(event.valorMontarPadre);
  }

  public openModalAdvancedForm(open: boolean) {
    this.displayModalAdvancedForms = open;
  }

  clearSelectedForm() {
    this.formTxt = null;
    this.frm.controls['subProceso'].setValue(null);
  }

  closeModal(event: boolean) {
    if (event) {
      this.frm.markAllAsTouched();
      if (this.frm.valid) {
        this.save();
      } else {
      }
    } else {
      this.modalResponse.emit(false)
    }
  }

  save(): void {

    const actividadPadre: ActivityModel | null = this.frm.value.actividadId;

    const data: ActivityModel = 
    {
      id: this.frm.getRawValue().id,
      codigo: this.frm.getRawValue().codigo,
      nombre: this.frm.getRawValue().nombre,
      procesoId: { 'id': this.frm.getRawValue().subProceso },
      activoActividad: this.helperService.getSwitch(this.frm.getRawValue().activoActividad, false),
      izquierda: this.frm.getRawValue().izquierda,
      derecha: this.frm.getRawValue().derecha,
      nivel: this.frm.getRawValue().nivel,
      actividadId: (actividadPadre != null) ? { id: actividadPadre } as ActivityModel | any : null,
    };
    if(data.nivel === 1){
      data.actividadId = null
    }
    if(data.nivel && data.nivel > 1 && this.fatherId !== null && this.fatherId !== undefined){
      data.actividadId = { id: this.fatherId } as ActivityModel
    }

    if(this.id){

      this.activityService.update(this.id, data).subscribe(
        (res: any) => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      )
    }else{
      this.activityService.save(data).subscribe(
        (res: any) => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.level = 0;
          this.fatherId = null;
          this.modalResponse.emit(true)
        },
        error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      )
    }
  }
}
