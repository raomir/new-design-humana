import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() modalResponse = new EventEmitter<Number | null>();

  public buttons: Array<string> = [];
  public buttonsForm: Array<string> = ['btn_clean', 'btn_search'];

  public frm!: FormGroup;

  public title: string = 'Buscador avanzado formularios';
  public elementId: Number | null = null;

  public typesForms: Array<List> = [];

  public columns: Array<Column> = [
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    { title: "Descripción", data: "descripcion" },
    { title: "Formulario específico", data: "formulario_especifico" }
  ];

  constructor(
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      codigo: [null],
      tipo_formulario_id: [null],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
      ])],
      descripcion: [null, Validators.compose([
        Validators.maxLength(150),
      ])]
    })
  }

  searchForms() {

  }

  cleanForm() {
    this.frm.reset()
  }

  closeModal(event: boolean) {
    if (event) {
      if (this.frm.valid) {
        this.modalResponse.emit(this.elementId)
      }
    } else {
      this.modalResponse.emit(null)
    }
  }

}
