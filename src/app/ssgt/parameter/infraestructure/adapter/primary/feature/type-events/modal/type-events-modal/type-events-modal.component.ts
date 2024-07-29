import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../../../../../../../shared/core/application/config/helpers.service.imp';
import { AutocompleteComponent } from '../../../../../../../../../shared/components/autocomplete/autocomplete.component';
import { ValidationMessageComponent } from '../../../../../../../../../shared/components/validation-message/validation-message.component';
import { AdvancedSearchFormsComponent } from '../../../../../../../../../shared/components/advanced-search-forms/advanced-search-forms.component';
import { TypeEventService } from '../../../../../../../core/application/type-event/type-event.service';
import { TypeEventModel } from 'src/app/ssgt/parameter/core/domain/type-event/type-event.model';

@Component({
  selector: 'type-events-modal',
  standalone: true,
  imports: [CommonModule, 
          ModalGeneralComponent, 
          FormsModule,
          ReactiveFormsModule,
          InputTextModule,
          InputSwitchModule,
          AutocompleteComponent,
          ValidationMessageComponent,
          AdvancedSearchFormsComponent
        ],
  templateUrl: './type-events-modal.component.html'
})
export class TypeEventsModalComponent implements OnInit {

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
      private typeEventService: TypeEventService,
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
      activo: [true],
      favorito: [false],
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
      frmGeneral: [null], 
      descripcion: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
      nivel: [this.level ? this.level : 1],
      izquierda: [1],
      derecha: [0],
      padre: [this.fatherId],
      id: [null]
    })
  }

  loadData(id: Number) {
    this.isLoading = true;
    this.typeEventService.findID(id).subscribe(
      (res: TypeEventModel | any) => {
        this.frm.patchValue({
          activo: res?.data.active === 1,
          codigo: res?.data.code,
          nombre: res?.data.name,
          descripcion: res?.data.description,
          nivel: res?.data.level,
          favorito: res?.data.favorite === 1,
          id: res?.data.id
        })
        if (this.fatherId === null || this.fatherId === undefined) {
          this.fatherId = res?.data.typeEvent?.id 
        }
        if (res?.data.form) {
          const dataFrm =
          {
            'id': res.data.form.id,
            'valorMontar': `${res.data.form.codigo} - ${res.data.form.nombre}`,
            'valor_montar': `${res.data.form.codigo} - ${res.data.form.nombre}`
          };
          this.frmResponse(dataFrm);
        }
        this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
    })
  }

  public frmResponse(event: any) {
    if (!this.helperService.isset(event.valorMontar) && !this.helperService.isset(event.valor_montar)) {
      event.valorMontar = `${event.codigo} - ${event.nombre}`;
      event.valor_montar = `${event.codigo} - ${event.nombre}`;
    }
    this.displayModalAdvancedForms = false;
    this.formTxt = event;
    let idFrmGeneral: number = Number(event.id);
    this.frm.controls['frmGeneral'].setValue(idFrmGeneral);
  }

  public openModalAdvancedForm(open: boolean) {
    this.displayModalAdvancedForms = open;
  }

  clearSelectedForm() {
    this.formTxt = null;
    this.frm.controls['frmGeneral'].setValue(null);
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

    const padre: TypeEventModel | null = this.frm.value.padre;

    const data: TypeEventModel = 
    {
      active: this.helperService.getSwitch(this.frm.controls['activo'].value, false),
      code: this.frm.controls['codigo'].value,
      description: this.frm.controls['descripcion'].value,
      name: this.frm.controls['nombre'].value,
      level: this.frm.getRawValue().nivel,
      favorite: this.helperService.getSwitch(this.frm.controls['favorito'].value, false),
      form: this.frm.controls['frmGeneral'].value != null ? { id: this.frm.controls['frmGeneral'].value } : null,
      typeEvent: null
    }
    if(data.level === 1){
      data.typeEvent = null
    }
    if(data.level && data.level > 1 && this.fatherId !== null && this.fatherId !== undefined){
      data.typeEvent = { id: this.fatherId } as TypeEventModel
    }

    if(this.id){

      this.typeEventService.update(this.id, data).subscribe(
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
      this.typeEventService.save(data).subscribe(
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
