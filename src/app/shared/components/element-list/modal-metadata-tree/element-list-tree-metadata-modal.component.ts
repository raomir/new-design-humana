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
import { RequestList } from 'src/app/shared/core/domain/list.model';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-element-list-tree-metadata-modal',
  templateUrl: './element-list-tree-metadata-modal.component.html',
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
    DividerModule,
    ValidationMessageComponent
  ]
})
export class ElementListTreeMetadataModalComponent {

  @Input() listName: string = '';
  @Input() id: Number | null = null;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];
  @Input() typeList: number = 0;
  @Input() fatherName: string = '';
  @Input() fatherId: number | Number | null = null;

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
  public measurementUnitsList: Array<any> = [
    {
      id: 1,
      nombre: "Porcentaje"
    },
    {
      id: 2,
      nombre: "Valor absoluto"
    }
  ];
  public measurementVariablesList: Array<any> = [];

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
      this.isLoading = false;
      this.title = 'Nuevo: ' + this.listName;
    }
        this.listService.findAllByTypeListId(this.endPoint, 51).subscribe({
      next: (resp: any) => {
        this.measurementVariablesList = resp.data;
        this.isLoading = false;
      },
      error: error => {
        this.modalResponse.emit(false)
      }
    })
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
        Validators.minLength(1),
        Validators.required
      ])],
      descripcion: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
      favorito: [false],
      proposito: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
      medicion: new FormControl("", Validators.required),
      unidadmedida: new FormControl(1),
      interpretacion: new FormControl(""),
      padre: new FormControl(this.fatherName, Validators.required)
    })
  }

  public addOperador(operador: any) {
    this.frm.controls['medicion'].setValue(`${this.frm.value.medicion} ${operador}`);
    this.frm.controls['interpretacion'].setValue(`${this.frm.value.interpretacion} ${operador}`);
  }

  public addVariable(variable: any) {
    this.frm.controls['medicion'].setValue(`${this.frm.value.medicion} {${variable.code}}`);
    this.frm.controls['interpretacion'].setValue(`${this.frm.value.interpretacion} ${variable.name}`);
  }

public calculateInterpretation(): void {
  this.frm.controls['interpretacion'].setValue("");
  let measurementVariables = this.frm.controls['medicion'].value.trim().split(/{(.*?)}/g);
  measurementVariables.forEach((element: any) => {
    let measurementVariable = this.measurementVariablesList.find(el => el.codigo === element);
    if (measurementVariable) {
      // Agrega el nombre de measurementVariable si se encuentra
      this.frm.controls['interpretacion'].setValue(this.frm.controls['interpretacion'].value + " " + measurementVariable.nombre);
    } else {
      // Si no se encuentra, agrega el propio 'element'
      this.frm.controls['interpretacion'].setValue(this.frm.controls['interpretacion'].value + " " + element);
    }
  });
}


  loadData(id: Number) {
    this.listService.findById(id, this.endPoint).subscribe({
      next: (resp: any) => {
        this.frm.patchValue({
          activo: resp.data.active === 1,
          favorito: resp.data.favorite === 1,
          codigo: resp.data.code,
          nombre: resp.data.name,
          descripcion: resp.data.description,
          medicion: resp.data.metadata.medicion,
          proposito: resp.data.metadata.proposito
        });
        setTimeout(() => {
          this.calculateInterpretation();
        }, 500);
        this.isLoading = false;
      },
      error: error => {
        this.modalResponse.emit(false)
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
    let data: RequestList | any = {
      code: this.frm.value.codigo,
      name: this.frm.value.nombre,
      description: this.frm.value.descripcion,
      favorite: this.frm.value.favorito ? 1 : 2,
      active: this.frm.value.activo ? 1 : 2,
      sst: 2,
      typeListId: this.typeList,
      listElementId: this.fatherId,
      metadata: {
        proposito: this.frm.controls['proposito'].value,
        medicion: this.frm.controls['medicion'].value.trim(),
        unidadMedidaIndicador: parseInt(this.frm.controls['unidadmedida'].value)
      }
    }
    data = await this.validationsSave(data);

    if (this.id) {
      this.listService.update(data, this.endPoint, this.id).subscribe({
        next: resp => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
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
