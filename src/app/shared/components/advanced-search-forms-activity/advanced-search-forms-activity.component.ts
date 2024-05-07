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
import { RegistroData } from '../buttons-general/actions';

@Component({
  selector: 'app-advanced-search-forms-activity',
  templateUrl: './advanced-search-forms-activity.component.html',
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
export class AdvancedSearchFormsActivityComponent {
  @Input() displayModal: boolean = false;
  @Output() modalResponse = new EventEmitter<any | null>();

  @ViewChild('table') table?: TableGeneralComponent;

  public buttons: Array<string> = [];
  public buttonsForm: Array<string> = ['btn_clean', 'btn_search'];

  public frm!: FormGroup;

  public title: string = 'Buscador de Subprocesos';

  public endPointDatatable: string = 'procesos/busquedaAvanzada/page';

  public dataForm = {
    codigo: null,
    tipoFormularioId: 0,
    nombre: null,
    descripcion: null,
  }

  public columns: Array<Column> = [
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    { title: "Padre", data: "nombrePadre" }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      codigo: [null],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
      ])]
    })
  }

  async searchForms() {
    this.dataForm = this.frm.getRawValue();
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  cleanForm() {
    this.frm.reset();
    this.dataForm = this.frm.getRawValue();
    if (this.table) this.table.parameters = this.dataForm;
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  selectElement(info: RegistroData) {
    const dataProceso = {
        'id': info.data.id,
        'valorMontar': `${info.data.codigo} - ${info.data.nombre}`,
        'valor_montar': `${info.data.codigo} - ${info.data.nombre}`,
        'valorMontarPadre': info.data.nombrePadre
    };
    this.modalResponse.emit(dataProceso)
  }

  closeModal() {
    this.modalResponse.emit(null)
  }

}
