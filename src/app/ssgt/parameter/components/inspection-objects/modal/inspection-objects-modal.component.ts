import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ModalGeneralComponent } from '../../../../../shared/components/modal-general/modal-general.component';
import { InspecionObjectService } from '../../../core/application/inspection-object.service';
import { HelpersServiceImp } from '../../../../../shared/core/application/config/helpers.service.imp';
import { AutocompleteComponent } from '../../../../../shared/components/autocomplete/autocomplete.component';
import { AdvancedSearchFormsComponent } from '../../../../../shared/components/advanced-search-forms/advanced-search-forms.component';
import { ListService } from '../../../../../shared/core/application/list.service';

@Component({
  selector: 'app-inspection-objects-modal',
  templateUrl: './inspection-objects-modal.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ModalGeneralComponent,
    InputSwitchModule,
    AutocompleteComponent,
    AdvancedSearchFormsComponent
  ]
})
export class InspectionObjectsModalComponent {

  @Input() id: Number | null = null;
  @Input() displayModal: boolean = false;
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];
  
  @Output() modalResponse = new EventEmitter<boolean>();
  
  public titleComponent: string = 'Objetos de inspección';
  
  public titleModal: string = '';
  
  public frm!: FormGroup;
  public endPointForm: string = 'buscadores/formularios/busqueda-por-id';

  public endPointAutocomplete: string = 'buscadores/formularios/busqueda-por-input';
  public formularioTxt: any;
  public displayModalAdvanced: boolean = false;

  public codePatterns = { '0': { pattern: new RegExp('[a-zA-Z0-9-]') } }

  constructor(
    private formBuilder: FormBuilder,
    private inspecionObjectService: InspecionObjectService,
    private listService: ListService,
    private helperService: HelpersServiceImp
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
    if (this.id) {
      this.titleModal = 'Editar: ' + this.titleComponent;
      this.loadData(this.id);
    } else {
      this.titleModal = 'Nuevo: ' + this.titleComponent;
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
      formulario: [null, Validators.required]
    })
  }

  loadData(id: Number) {
    this.inspecionObjectService.findById(id).subscribe({
      next: resp => {
        this.frm.patchValue({
          activo: resp.activo === 1,
          codigo: resp.codigo,
          nombre: resp.nombre,
          descripcion: resp.descripcion,
          formulario: resp.metadatos.formulario
        })
        this.loadFormList(resp.metadatos.formulario)
      },
      error: error => {
        this.modalResponse.emit(false)
      }
    })
  }

  loadFormList(idForm: Number) {
    this.listService.findById(idForm, this.endPointForm).subscribe({
      next: resp => {
        this.formularioTxt = {
          id: resp.id,
          valor_montar: resp.codigo + ' - ' + resp.nombre
        }
      }
    })
  }

  closeModal(event: boolean) {
    if (event) {
      if (this.frm.valid) {
        this.save();
      }
    } else {
      this.modalResponse.emit(false)
    }
  }

  async save(): Promise<void> {
    const data = {
      codigo: this.frm.value.codigo,
      nombre: this.frm.value.nombre,
      descripcion: this.frm.value.descripcion,
      favorito: 2,
      activo: this.frm.value.activo ? 1 : 2,
      metadatos: { "formulario": this.frm.controls['formulario'].value }
    }

    if (this.id) {
      this.inspecionObjectService.update(data, this.id).subscribe({
        next: resp => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          console.log(error)
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    } else {
      this.inspecionObjectService.save(data).subscribe({
        next: resp => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          console.log(error)
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    }
  }

  openModalAdvanced(open: boolean) {
    this.displayModalAdvanced = open;
  }

  itemSelected(info: any) {
    this.displayModalAdvanced = false;
    if (info) {
      this.formularioTxt = {
        id: info.id,
        valor_montar: info.codigo + ' - ' + info.nombre
      }
      this.frm.controls['formulario'].setValue(info.id);
    }
  }

  clearSelectedItem() {
    this.formularioTxt = null;
    this.frm.controls['formulario'].setValue(null);
  }

}
