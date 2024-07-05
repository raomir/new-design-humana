import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalGeneralComponent } from '../modal-general/modal-general.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { List } from '../../core/domain/list.model';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { TableGeneralComponent } from '../table-general/table-general.component';
import { Column } from '../table-general/col/col';
import { RegistroData } from '../buttons-general/actions';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../core/application/config/helpers.service.imp';
import { ThirdSearchService } from '../../core/application/third-search.service';

@Component({
  selector: 'app-advanced-search-employe',
  templateUrl: './advanced-search-employe.component.html',
  styleUrls: ['./advanced-search-employe.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    DividerModule,
    InputTextModule,
    AccordionModule,
    MultiSelectModule,
    TreeModule,
    AutocompleteComponent,
    ModalGeneralComponent,
    ButtonsGeneralComponent,
    TableGeneralComponent,
    ProgressSpinnerModule,
    InputSwitchModule
  ]
})
export class AdvancedSearchEmployeComponent {

  @Input() displayModal: boolean = false;
  @Input() usageIds: Array<any> = [];
  @Input() typeProductId = null;
  @Input() data = {
      'tiposTerceros': [1679]
  };
  @Input() paramsSearch = {
      'tiposTerceros': [1679]
  };
  @Output() modalResponse = new EventEmitter<any | null>();

  @ViewChild('table') table?: TableGeneralComponent;

  public buttons: Array<string> = [];
  public buttonsForm: Array<string> = ['btn_clean', 'btn_search'];

  public frm!: FormGroup;

  public title: string = 'Buscador avanzado de productos';

  public endPointDatatable: string = 'comtercero/advance_searching';
  public productTxt: any;
  public paramsAutocomplete: any = { 
    grupo: null,
    validaciones_extras: null,
    dataBusqueda: null,
    vinculacion_id: null,
    tipo_concepto: null
  }
  public proveedorTxt: any;
  public paramsAutocompleteProveedor: any = { 
    grupo: ['proveedor'],
    validaciones_extras: null,
    dataBusqueda: null,
    vinculacion_id: null,
    tipo_concepto: null,
    noBuscar: []
  }
  public valueProduct: any;
  public selectedCategoryTree: Array<TreeNode> = [];
  public treeVisible: boolean = false;
  public selectedCategory: TreeNode | null = null;

  public typeThird: Array<any> = [];
  public typeDocs: Array<any> = [];
  public brandList: Array<any> = [];
  public typeTaxpayer: Array<any> = [];
  public economicActivities: Array<any> = [];
  public usageList: Array<any> = [];

  public loadingBrand: boolean = false;

  public dataForm: any =  {
      "actividad_economica_id": null,
      "apellido1": null,
      "apellido2": null,
      "buscar_avanzado": 1,
      "codigo": null,
      "elementosNoBuscar": [],
      "noBuscar": [],
      "nombre1": null,
      "nombre2": null,
      "numero_documento": null,
      "omitir_grupos": null,
      "razon_comercial": null,
      "razon_social": null,
      "tipoTerceros": [1679],
      "tipo_contribuyente_id": null,
      "tipo_documento_id": null,
      "tipo_tercero_id": 1679
  };

  public columns: Array<Column> = [
      {
          title: 'Código',
          width: '100px',
          data: 'codigo'
      },
      {
          title: 'Documento',
          width: '300px',
          data: 'documento'
      },
      {
          title: 'Nombre',
          width: '300px',
          data: 'nombre_completo'
      },
      {
          title: 'Tipo tercero',
          width: '300px',
          data: 'tipo_tercero'
      },
      {
          title: 'Tipo Contribuyente',
          width: '300px',
          data: 'tipo_contribuyente'
      },
      {
          title: 'Razón social',
          width: '300px',
          data: 'razon_social'
      },
      {
          title: 'Actividades económicas',
          width: '300px',
          data: 'actividades_economicas'
      },
      {
          title: 'Nombre comercial',
          width: '300px',
          data: 'nombre_comercial'
      }
  ];
  

  constructor(
    private formBuilder: FormBuilder,
    private thirdSearchService: ThirdSearchService,
    private helperService: HelpersServiceImp
  ) {

  }

  ngOnInit(): void {
    this.loadForm();
  }

  /**
   * Method to initialize the form
   */
  public loadForm() {
      this.frm = new FormGroup({
            tipoTerceros: new FormControl(1679, Validators.required),
            tipo_documento_id: new FormControl(null),
            numero_documento: new FormControl(null),
            codigo: new FormControl(null),
            nombre1: new FormControl(null),
            nombre2: new FormControl(null),
            apellido1: new FormControl(null), 
            apellido2: new FormControl(null),
            razon_social: new FormControl(null),
            razon_comercial: new FormControl(null),
            tipo_contribuyente_id: new FormControl(null),
            actividad_economica_id: new FormControl(null)
      });
      this.frm.get('tipoTerceros')?.disable();
      this.prepareForm();
  }


  /**
   * Method that loads the variables with their corresponding values
   * obtained from the API.
   */
  private prepareForm() {
    this.dataForm = this.frm.getRawValue();
    this.dataForm.tipoTerceros = [this.frm.getRawValue().tipoTerceros];
    this.thirdSearchService.getInitialData().subscribe(
        async (res: any) => {
            this.typeThird = res.listas.tipos_terceros;
            this.typeDocs = res.listas.tipos_documentos;
            this.typeTaxpayer = res.listas.tipos_contribuyentes;
            this.economicActivities = res.listas.actividades_economicas;
        }
    );
  }

  /**
   * Gets the system lists and stores them in a variable
   * @param lists
   */
  public loadLists(lists: any): Promise<void> {
      return new Promise<void>(resolve => {
          this.typeDocs = lists.grupos_marcas;
          this.brandList = lists.marcas;
          this.typeThird = lists.tipos_productos;
          this.typeTaxpayer = lists.unidades_compras;
          this.economicActivities = lists.unidades_distribucion;
          this.usageList = lists.usos;          

          resolve();
      });
  }

  toggleTree() {
    this.treeVisible = !this.treeVisible;
  }

  async searchForms() {
    this.dataForm = this.frm.getRawValue();
    this.dataForm.tipoTerceros = [this.frm.getRawValue().tipoTerceros];
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  cleanForm() {
    this.frm.reset();
    this.dataForm = this.frm.getRawValue();
    this.dataForm.tipoTerceros = [this.frm.getRawValue().tipoTerceros];
    if (this.table) this.table.parameters = this.dataForm;
    this.table?.loadTable(0, this.table?.pageNumber, '', this.dataForm);
  }

  selectElement(info: RegistroData | any) {
    const dataProceso = {
        'id': info.data.id,
        'valor_montar': info.data.valor_montar
    };
    this.modalResponse.emit(dataProceso)
  }

  closeModal() {
    this.modalResponse.emit(null)
  }

}
