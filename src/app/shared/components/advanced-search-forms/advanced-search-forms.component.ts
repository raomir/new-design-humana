import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalGeneralComponent } from '../modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { List } from '../../core/domain/list.model';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { TableGeneralComponent } from '../table-general/table-general.component';
import { Column } from '../table-general/col/col';
import { ListService } from '../../core/application/list.service';
import { RegistroData } from '../buttons-general/actions';

@Component({
  selector: 'app-advanced-search-forms',
  templateUrl: './advanced-search-forms.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    DividerModule,
    InputTextModule,
    AccordionModule,
    ModalGeneralComponent,
    ButtonsGeneralComponent,
    TableGeneralComponent
  ]
})
export class AdvancedSearchFormsComponent {
  @Input() displayModal: boolean = false;
  @Output() modalResponse = new EventEmitter<List | null>();

  @ViewChild('table') table?: TableGeneralComponent;

  public buttons: Array<string> = [];
  public buttonsForm: Array<string> = ['btn_clean', 'btn_search'];

  public frm!: FormGroup;

  public title: string = 'Buscador avanzado formularios';

  public typesForms: Array<List> = [];

  public endPointTypesForms: string = 'formulario/tipoformularios';

  public endPointDatatable: string = 'buscadores/formularios/busqueda-por-formulario';

  public dataForm = {
    codigo: null,
    tipoFormularioId: 0,
    nombre: null,
    descripcion: null,
  }

  public columns: Array<Column> = [
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    { title: "Descripción", data: "descripcion" },
    { title: "Formulario específico", data: "tipoFormulario" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService
  ) {

  }

  ngOnInit(): void {
    this.loadLists();
    this.loadForm()
  }

  loadLists() {
    this.listService.findAll(this.endPointTypesForms).subscribe({
      next: resp => {
        this.typesForms = resp;
      }
    })
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      codigo: [null],
      tipoFormularioId: [null],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
      ])],
      descripcion: [null, Validators.compose([
        Validators.maxLength(150),
      ])]
    })
  }

  async searchForms() {
    this.dataForm = this.frm.getRawValue();
    this.dataForm.tipoFormularioId = this.dataForm.tipoFormularioId || 0;
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  cleanForm() {
    this.frm.reset();
    this.dataForm = this.frm.getRawValue();
    this.dataForm.tipoFormularioId = 0;
    if (this.table) this.table.parameters = this.dataForm;
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  selectElement(info: RegistroData) {
    this.modalResponse.emit(info.data)
  }

  closeModal() {
    this.modalResponse.emit(null)
  }

}
