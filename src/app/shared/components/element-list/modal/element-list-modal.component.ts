import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalGeneralComponent } from '../../modal-general/modal-general.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../core/application/config/helpers.service.imp';
import { ListService } from '../../../core/application/list.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { AdvancedSearchFormsComponent } from '../../advanced-search-forms/advanced-search-forms.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';

@Component({
  selector: 'app-element-list-modal',
  templateUrl: './element-list-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ModalGeneralComponent,
    InputSwitchModule,
    DropdownModule,
    AutocompleteComponent,
    AdvancedSearchFormsComponent,
    ValidationMessageComponent
  ]
})
export class ElementListModalComponent {

  @Input() listName: string = '';
  @Input() id: Number | null = null;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];

  @Output() modalResponse = new EventEmitter<boolean>();

  public isLoading: boolean = true;

  public title: string = '';

  public frm!: FormGroup;

  public hideFavorite: boolean = false;
  public labelDescription: string = 'Descripción';

  public codePatterns = { '0': { pattern: new RegExp('[a-zA-Z0-9-]') } }

  // extras
  // agentes de lesión
  public tipoPeligro: Array<any> = [];

  // objetos de inspección
  public endPointForm: string = 'buscadores/formularios/busqueda-por-id';
  public endPointAutocompleteForms: string = 'buscadores/formularios/busqueda-por-input';
  public formTxt: any;
  public displayModalAdvancedForms: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
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
      ])],
      descripcion: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
      favorito: [false],
    })
    this.validationsComponent();
  }


  validationsComponent() {
    switch (this.endPoint) {
      case 'agentelesion':
        this.isLoading = true;
        this.listService.getHazardClassList().subscribe(resp => {
          this.tipoPeligro = resp;
          this.isLoading = false;
        })
        this.frm.addControl('tipoPeligro', new FormControl(null, Validators.required))
        break;
      case 'objectoInpeccion':
        this.hideFavorite = true;
        this.frm.addControl('formulario', new FormControl(null, Validators.required))
        break;
      case 'nivelexposicion':
      case 'niveldeficiencia':
      case 'nivelconsecuencia':
        this.labelDescription = 'Significado';
        this.frm.addControl('valor', new FormControl(null, Validators.required))
        break;
      case 'nivelriesgo':
      case 'nivelprobabilidad':
        this.labelDescription = 'Significado';
        this.frm.addControl('maximo', new FormControl(null, [Validators.required, Validators.pattern('[0-9]+')]))
        this.frm.addControl('minimo', new FormControl(null, [Validators.required, Validators.pattern('[0-9]+')]))
        break;
      default:
        break;
    }
    if (!this.id) {
      this.isLoading = false;
    }
  }

  validateMax() {
    let valorMax = this.frm.controls['maximo'].value;
    this.frm.controls['minimo'].setValidators(Validators.max(valorMax));
  }

  loadData(id: Number) {
    this.listService.findById(id, this.endPoint).subscribe({
      next: resp => {
        this.frm.patchValue({
          activo: resp.activo === 1,
          favorito: resp.favorito === 1,
          codigo: resp.codigo,
          nombre: resp.nombre,
          descripcion: resp.descripcion
        })
        this.validationsLoadData(resp)
      },
      error: error => {
        this.modalResponse.emit(false)
      }
    })
  }

  validationsLoadData(resp: any) {
    switch (this.endPoint) {
      case 'agentelesion':
        this.frm.get('tipoPeligro')?.setValue(resp.listaPeligro);
        break;

      case 'objectoInpeccion':
        this.frm.get('formulario')?.setValue(resp.metadatos.formulario);
        this.loadFormField(resp.metadatos.formulario)
        break;

      case 'niveldeficiencia':
      case 'nivelexposicion':
      case 'nivelconsecuencia':
        this.frm.get('valor')?.setValue(resp.metadatos.valor);
        break;
      case 'nivelriesgo':
      case 'nivelprobabilidad':
        this.frm.get('maximo')?.setValue(resp.metadatos.maximo);
        this.frm.get('minimo')?.setValue(resp.metadatos.minimo);
        break;

      default:
        break;
    }
    this.isLoading = false;
  }

  loadFormField(idForm: Number) {
    this.listService.findById(idForm, this.endPointForm).subscribe({
      next: resp => {
        this.formTxt = {
          id: resp.id,
          valor_montar: resp.codigo + ' - ' + resp.nombre
        }
      }
    })
  }

  closeModal(event: boolean) {
    if (event) {
      this.frm.markAllAsTouched();
      if (this.frm.valid) {
        this.save();
      }
    } else {
      this.modalResponse.emit(false)
    }
  }

  async save(): Promise<void> {
    this.frm.markAllAsTouched();
    let data: any = {
      codigo: this.frm.value.codigo,
      nombre: this.frm.value.nombre,
      descripcion: this.frm.value.descripcion,
      favorito: this.frm.value.favorito ? 1 : 2,
      activo: this.frm.value.activo ? 1 : 2
    }
    data = await this.validationsSave(data);

    if (this.id) {
      data.id = this.id
      this.listService.update(data, this.endPoint, this.id).subscribe({
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
      this.listService.save(data, this.endPoint).subscribe({
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

  validationsSave(data: any) {
    switch (this.endPoint) {
      case 'agentelesion':
        data.listaPeligro = { id: this.frm.value.tipoPeligro.id }
        break;
      case 'objectoInpeccion':
        data.metadatos = { formulario: this.frm.controls['formulario'].value }
        break;
      case 'niveldeficiencia':
      case 'nivelexposicion':
      case 'nivelconsecuencia':
        data.metadatos = { valor: this.frm.controls['valor'].value }
        break;
      case 'nivelriesgo':
      case 'nivelprobabilidad':
        data.metadatos = { maximo: this.frm.controls['maximo'].value, minimo: this.frm.controls['minimo'].value }
        break;
      default:
        break;
    }
    return data;
  }

  openModalAdvancedForm(open: boolean) {
    this.displayModalAdvancedForms = open;
  }

  formSelected(info: any) {
    this.displayModalAdvancedForms = false;
    if (info) {
      this.formTxt = {
        id: info.id,
        valor_montar: info.codigo + ' - ' + info.nombre
      }
      this.frm.controls['formulario'].setValue(info.id);
    }
  }

  clearSelectedForm() {
    this.formTxt = null;
    this.frm.controls['formulario'].setValue(null);
  }

}
