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
      active: [true],
      code: [null, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])],
      name: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      subProcess: [{value: this.sonName, disabled: true}], 
      process: [{value: this.fatherName, disabled: true}],
      level: [this.level ? this.level : 1],
      activity: [this.fatherId],
      id: [null]
    })
  }

  loadData(id: Number) {
    this.isLoading = true;
    this.activityService.findID(id).subscribe(
      (res: ActivityModel | any) => {
        this.frm.patchValue({
          active: res.data.active === 1,
          code: res.data.code,
          name: res.data.name,
          level: res.data.level,
          id: res.data.id
        })
        if (res.data.activity != null) {
          this.frm.controls['activity'].setValue(res.data.activity.id);
        }
        if(this.fatherId === null || this.fatherId === undefined){
          this.fatherId = res.data.activity?.id 
        }
        if (res.data.process != null) {
          const dataProceso =
          {
            'id': res.data.process.id,
            'valorMontar': `${res.data.process.code} ${res.data.process.name}`,
            'valor_montar': `${res.data.process.code} ${res.data.process.name}`,
            'valorMontarPadre': `${res.data.process.father?.code ?? ''} ${res.data.process.father?.name ?? ''}`
          };
          this.subprocessResponse(dataProceso);
          this.isLoading = false;;
        }
    })
  }

  public subprocessResponse(event: any) {
    this.displayModalAdvancedForms = false;
    this.formTxt = event;
    let idSubProcess: number = Number(event.id);
    this.frm.controls['subProcess'].setValue(idSubProcess);
    this.frm.controls['process'].setValue(event.valorMontarPadre);
  }

  public openModalAdvancedForm(open: boolean) {
    this.displayModalAdvancedForms = open;
  }

  clearSelectedForm() {
    this.formTxt = null;
    this.frm.controls['subProcess'].setValue(null);
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

    const actividadPadre: ActivityModel | null = this.frm.value.activity;

    const data: ActivityModel | any = 
    {
      id: this.frm.getRawValue().id,
      code: this.frm.getRawValue().code,
      name: this.frm.getRawValue().name,
      process: { 'id': this.frm.getRawValue().subProcess },
      active: this.helperService.getSwitch(this.frm.getRawValue().active, false),
      level: this.frm.getRawValue().level,
      activity: (actividadPadre != null) ? { id: actividadPadre } as ActivityModel | any : null,
    };
    if(data.level === 1){
      data.activity = null
    }
    if(data.level && data.level > 1 && this.fatherId !== null && this.fatherId !== undefined){
      data.activity = { id: this.fatherId } as ActivityModel
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
