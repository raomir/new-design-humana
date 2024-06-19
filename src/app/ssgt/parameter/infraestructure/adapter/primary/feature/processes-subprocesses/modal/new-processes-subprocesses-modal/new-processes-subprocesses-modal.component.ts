import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ProcessesSubprocessesService } from '../../../../../../../core/application/processes-subprocesses/processes-subprocesses.service';
import { ModeloProcessesSubprocessesModel } from '../../../../../../../core/domain/processes-subprocesses/modelo-processes-subprocesses.model';
import { ValidationMessageComponent } from '../../../../../../../../../shared/components/validation-message/validation-message.component';

@Component({
  selector: 'app-new-processes-subprocesses-modal',
  standalone: true,
  imports: [CommonModule,
            ModalGeneralComponent, 
            FormsModule,
            ReactiveFormsModule,
            InputTextModule,
            InputSwitchModule,
            ValidationMessageComponent
  ],
  templateUrl: './new-processes-subprocesses-modal.component.html',
  styles: [
  ]
})
export class NewProcessesSubprocessesModalComponent implements OnInit {

  @Output() modalResponse = new EventEmitter<boolean>();
  @Input() listName: string = '';
  @Input() id?: Number;
  @Input() buttons: Array<string> = ['btn_save'];
  @Input() displayModal: boolean = false;
  @Input() action: string = '';
  @Input() level: number  = 0;
  @Input() padreId?: number;
  @Input() dataId?: number; // id del proceso

  public title: string = '';
  public frm!: FormGroup;
  public data?: ModeloProcessesSubprocessesModel;
  public isLoading: boolean = false;

  constructor( 
    private formBuilder: FormBuilder,
    private processesSubprocessesService: ProcessesSubprocessesService,
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
      ])]
    })
  }

  loadData(id: any) {
    this.isLoading = true;
    this.processesSubprocessesService.findById(id).subscribe(
      (res: ModeloProcessesSubprocessesModel | any) => {
        this.frm.patchValue({
          active: res.data.active === 1,
          code: res.data.code,
          name: res.data.name,
          id: res.data.id,
          level: res.data.level,
          father: res.data.father
        })
        this.isLoading = false;
    })
  }
  save(): void {


      this.data = {
        active: this.helperService.getSwitch(this.frm.value.active, false),
        code: this.frm.value.code,
        name: this.frm.value.name,
        father: this.level === 1 ? null : { "id": this.padreId },
        level: this.level,
        id: this.dataId
      };
    
   
    if (this.level ===  0 && this.action === 'btn_nuevo') {
      this.data = {
        active: this.helperService.getSwitch(this.frm.value.active, false),
        code: this.frm.value.code,
        name: this.frm.value.name,
        level: 1,
      };
    } else if (this.level === 1 && this.action === 'btn_nuevo') {
      this.data = {
        name: this.frm.value.name,
        code: this.frm.value.code,
        active: this.helperService.getSwitch(this.frm.value.active, false),
        father: { "id": this.padreId },
        level: 2,
      };
    }    
    if(this.id){
      const idNumber = Number(this.id);
      this.processesSubprocessesService.update(idNumber, this.data).subscribe(
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
      this.processesSubprocessesService.save(this.data).subscribe(
        (res: any) => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.modalResponse.emit(true)
        },
        error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      )
    }
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

  toUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    input.value = value;
    this.frm.get('code')?.setValue(value, { emitEvent: false });
  }

}
