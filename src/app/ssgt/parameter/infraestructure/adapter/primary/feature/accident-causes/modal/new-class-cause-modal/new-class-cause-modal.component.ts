import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccidentCausesService } from '../../../../../../../core/application/accident-causes/accident-causes.service';
import { AccidentCausesModel } from '../../../../../../../core/domain/accident-causes/accident-causes.model';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ValidationMessageComponent } from 'src/app/shared/components/validation-message/validation-message.component';

@Component({
  selector: 'app-new-class-cause-modal',
  standalone: true,
  imports: [CommonModule, 
          ModalGeneralComponent, 
          FormsModule,
          ReactiveFormsModule,
          InputTextModule,
          InputSwitchModule,
          ValidationMessageComponent
        ],
  templateUrl: './new-class-cause-modal.component.html'
})
export class NewClassCauseModalComponent implements OnInit {

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
  public nivel? : any;
  public isLoading: boolean = false;

  constructor( 
      private formBuilder: FormBuilder,
      private accidentCausesService: AccidentCausesService,
      private helperService: HelpersServiceImp
    ) {
  
  }


  ngOnInit(): void {
    this.loadForm() 
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData(this.id);
    } else {
      this.title = 'Nuevo: ' + this.listName;
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
      description: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      grupo_clase: [{value: this.sonName, disabled: true}], 
      clase_causa: [{value: this.fatherName, disabled: true}],
      id: [null]
    })
  }

  loadData(id: Number) {
    this.isLoading = true;
    this.accidentCausesService.findID(id).subscribe(
      (res: AccidentCausesModel | any) => {
        this.frm.patchValue({
          active: res.data.active === 1,
          code: res.data.code,
          name: res.data.name,
          description: res.data.description,
          id: res.data.id,
          grupo_clase: res.data.accidentCauses?.accidentCauses?.code + ' - ' + res.data.accidentCauses?.accidentCauses?.name,
          clase_causa: res.data.accidentCauses?.code + ' - ' + res.data.accidentCauses?.name
        })
        if(this.fatherId === null || this.fatherId === undefined){
          this.fatherId = res.data.accidentCauses?.id 
        }
        this.isLoading = false;
    })
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

    const data: AccidentCausesModel = {
      id: this.frm.value.id,
      code: this.frm.value.code,
      name: this.frm.value.name,
      description: this.frm.value.description,
      level: this.action === 'btn_nuevo' ? this.level + 1 : this.level,
      active: this.helperService.getSwitch(this.frm.value.active, false),
      accidentCauses: (this.fatherId !== null && this.fatherId !== undefined) ? { id: this.fatherId } as AccidentCausesModel : null,
    };
    
    if(data.level === 1){
      data.accidentCauses = null
    }
    if(data.level && data.level > 1 && this.fatherId !== null && this.fatherId !== undefined){
      data.accidentCauses = { id: this.fatherId } as AccidentCausesModel
    }  

    if(this.id){

      this.accidentCausesService.update(this.id, data).subscribe(
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
      this.accidentCausesService.save(data).subscribe(
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
