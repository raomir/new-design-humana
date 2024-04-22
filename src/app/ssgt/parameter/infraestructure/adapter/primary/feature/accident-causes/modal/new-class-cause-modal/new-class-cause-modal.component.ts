import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccidentCausesService } from '../../../../../../../core/application/accident-causes/accident-causes.service';
import { AccidentCausesModel } from '../../../../../../../core/domain/accident-causes/accident-causes.model';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';

@Component({
  selector: 'app-new-class-cause-modal',
  standalone: true,
  imports: [CommonModule, 
          ModalGeneralComponent, 
          FormsModule,
          ReactiveFormsModule,
          InputTextModule,
          InputSwitchModule
        ],
  templateUrl: './new-class-cause-modal.component.html'
})
export class NewClassCauseModalComponent implements OnInit {

  @Input() listName: string = '';
  @Input() id?: Number;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save'];
  @Input() level: number = 1;
  @Input() action: string = '';
  @Input() fatherName: string = '';
  @Input() sonName: string = '';
  @Input() fatherId: Number | null = null;

  @Output() modalResponse = new EventEmitter<boolean>();

  public title: string = '';
  public frm!: FormGroup;
  public llave? : any;
  public nivel? : any;

  constructor( 
      private formBuilder: FormBuilder,
      private accidentCausesService: AccidentCausesService,
      private helperService: HelpersServiceImp
    ) {
  
  }


  ngOnInit(): void {
    console.log(this.level)
    this.loadForm()
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData(this.id);
    } else {
      this.llave = {id: this.fatherId}
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
      ])],
      descripcion: [null, Validators.compose([
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
    this.accidentCausesService.findID(id).subscribe(
      (res: AccidentCausesModel | any) => {
        this.frm.patchValue({
          activo: res.activo === 1,
          codigo: res.codigo,
          nombre: res.nombre,
          descripcion: res.descripcion,
          id: res.id,
          grupo_clase: res.llave?.llave?.codigo + ' - ' + res.llave?.llave?.nombre,
          clase_causa: res.llave?.codigo + ' - ' + res.llave?.nombre
        })
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
      codigo: this.frm.value.codigo,
      nombre: this.frm.value.nombre,
      descripcion: this.frm.value.descripcion,
      nivel: this.level + 1,
      activo: this.helperService.getSwitch(this.frm.value.activo, false),
      llave: (this.id !== null && this.id !== undefined) ? {id:this.fatherId} as AccidentCausesModel : null,
    };

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
