import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ProcessesSubprocessesService } from '../../../../../../../core/application/processes-subprocesses/processes-subprocesses.service';
import { ModeloProcessesSubprocessesModel } from '../../../../../../../core/domain/processes-subprocesses/modelo-processes-subprocesses.model';

@Component({
  selector: 'app-new-processes-subprocesses-modal',
  standalone: true,
  imports: [CommonModule,
            ModalGeneralComponent, 
            FormsModule,
            ReactiveFormsModule,
            InputTextModule,
            InputSwitchModule
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
      activo: [true],
      codigo: [null, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])]
    })
  }

  loadData(id: any) {
    this.processesSubprocessesService.findById(id).subscribe(
      (res: ModeloProcessesSubprocessesModel | any) => {
        this.frm.patchValue({
          activo: res.activo === 1,
          codigo: res.codigo,
          nombre: res.nombre,
          id: res.id,
          nivel: res.nivel,
          padre: res.padre
        })
    })
  }
  save(): void {


      this.data = {
        activo: this.helperService.getSwitch(this.frm.value.activo, false),
        codigo: this.frm.value.codigo,
        nombre: this.frm.value.nombre,
        padre: this.level === 1 ? null : { "id": this.padreId },
        nivel: this.level,
        id: this.dataId
      };
    
   
    if (this.level ===  0 && this.action === 'btn_nuevo') {
      this.data = {
        activo: this.helperService.getSwitch(this.frm.value.activo, false),
        codigo: this.frm.value.codigo,
        nombre: this.frm.value.nombre,
        nivel: 1,
      };
    } else if (this.level === 1 && this.action === 'btn_nuevo') {
      this.data = {
        nombre: this.frm.value.nombre,
        codigo: this.frm.value.codigo,
        activo: this.helperService.getSwitch(this.frm.value.activo, false),
        padre: { "id": this.padreId },
        nivel: 2,
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

}
