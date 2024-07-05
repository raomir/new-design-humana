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
      'com_tercero_id': null,
      'inv_bodega1_id': null,
      'inv_bodega2_id': null,
      'inv_ubicacion1_id': null,
      'inv_ubicacion2_id': null,
      'tipo_comprobante_id': null,
      'categoria': null,
      'tipo_clase': [43364, 43365]
  };
  @Input() paramsSearch = {
      'con_variante': null,
      'con_exigencia': null,
      'maneja_lotes': null,
      'compuestos': null,
      'exigencias': null,
      'tarifas': null,
      'tipo_clase': [43364, 43365]
  };
  @Output() modalResponse = new EventEmitter<any | null>();

  @ViewChild('table') table?: TableGeneralComponent;

  public buttons: Array<string> = [];
  public buttonsForm: Array<string> = ['btn_clean', 'btn_search'];

  public frm!: FormGroup;

  public title: string = 'Buscador avanzado de productos';

  public endPointDatatable: string = 'comproductos/buscador/data';
  public endPointAutocomplete: string = 'comproductos/autocompleta/false';
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
      "producto": "",
      "categoria": "",
      "tipo_producto": null,
      "usos": null,
      "grupo_marca": "",
      "marca": "",
      "unidad_compra": "",
      "unidad_distribucion": "",
      "con_variantes": 2,
      "proveedor": "",
      "tipo_clase": [43364, 43365]
  };

  public columns: Array<Column> = [
      {
          title: 'Categoria',
          width: '100px',
          data: 'categoria'
      },
      {
          title: 'Codigo UNSPSC',
          width: '300px',
          data: 'codigo_unspsc'
      },
      {
          title: 'Nombre',
          width: '300px',
          data: 'nombre'
      },
      {
          title: 'Unidad de compra',
          width: '300px',
          data: 'unidad_compra'
      },
      {
          title: 'Contenido',
          width: '300px',
          data: 'contenido'
      },
      {
          title: 'Unidad de distribucion',
          width: '300px',
          data: 'unidad_distribucion'
      },
      {
          title: 'Grupo de marca',
          width: '300px',
          data: 'grupo_marca'
      },
      {
          title: 'Marca',
          width: '300px',
          data: 'marca'
      },
      {
          title: 'Forma farmaceutica',
          width: '300px',
          data: 'forma_farmaceutica'
      },
      {
          title: 'Concentración',
          width: '300px',
          data: 'concentracion_medicamento'
      },
      {
          title: 'Via Adm',
          width: '300px',
          data: 'via_administracion'
      },
      {
          title: 'Finalidad consulta',
          width: '300px',
          data: 'finalidad_consulta'
      },
      {
          title: 'Finalidad procedimiento',
          width: '300px',
          data: 'finalidad_procedimiento'
      },
      {
          title: 'Valor',
          width: '300px',
          data: 'contenido'
      }
  ];
  

  constructor(
    private formBuilder: FormBuilder,
    private thirdSearchService: ThirdSearchService,
    private helperService: HelpersServiceImp
  ) {

  }

  ngOnInit(): void {
   /*  this.thirdSearchService.searchCategories({ tipo_producto_id: this.typeProductId }).subscribe(
        (result) => {
          this.selectedCategoryTree = this.createClassTree(result.categorias);
        }
    ); */
    this.loadForm();
  }

  /**
   * Method to initialize the form
   */
  public loadForm() {
      this.frm = new FormGroup({
            tipoTerceros: new FormControl(null, Validators.required),
            tipo_documento_id: new FormControl(null, Validators.required),
            numero_documento: new FormControl(null, Validators.required),
            codigo: new FormControl(null, Validators.required),
            nombre1: new FormControl(null, Validators.required),
            nombre2: new FormControl(null, Validators.required),
            apellido1: new FormControl(null, Validators.required), 
            apellido2: new FormControl(null, Validators.required),
            razon_social: new FormControl(null, Validators.required),
            razon_comercial: new FormControl(null, Validators.required),
            tipo_contribuyente_id: new FormControl(null, Validators.required),
            actividad_economica_id: new FormControl(null, Validators.required),        
            usos_ids: new FormControl(null, Validators.required),
            con_variantes: new FormControl(2, Validators.required),
            grupo_marca_id: new FormControl(null, Validators.required),
            inv_marca_id: new FormControl(null, Validators.required),
            unidad_compra_id: new FormControl(null, Validators.required),
            unidad_distribucion_id: new FormControl(null, Validators.required),
            com_tercero_id: new FormControl(null, Validators.required),
            con_compuestos: new FormControl(null, Validators.required),
            con_existencias: new FormControl(null, Validators.required),
            maneja_lotes: new FormControl(null, Validators.required),
            con_tarifas: new FormControl(null, Validators.required),
            com_categoria_id: new FormControl('')
      });
      this.prepareForm();
      //this.validateForm();
  }

  public validateForm(): Promise<void> {
      return new Promise<void>(resolve => {
          this.frm = new FormGroup({
              com_producto_id: new FormControl(''),
              com_categoria_id: new FormControl(''),
              tipo_producto_id: new FormControl({
                  value: (this.typeThird.length > 0) ? this.typeThird[0].id : this.typeProductId,
                  disabled: (this.typeThird.length == 1) ? true : (this.typeThird.length > 1) ? false : this.helperService.isset(this.typeProductId)
              }),
              grupo_marca_id: new FormControl(''),
              inv_marca_id: new FormControl(''),
              usos_ids: new FormControl({ value: null, disabled: (this.usageIds.length > 0) }),
              unidad_compra_id: new FormControl(''),
              unidad_distribucion_id: new FormControl(''),
              com_tercero_id: new FormControl(''),
              con_variantes: new FormControl(this.paramsSearch.con_variante),
              con_compuestos: new FormControl(this.paramsSearch.compuestos),
              con_existencias: new FormControl(this.paramsSearch.con_exigencia),
              con_tarifas: new FormControl(this.paramsSearch.tarifas),
              maneja_lotes: new FormControl(this.paramsSearch.maneja_lotes),
          });

          this.prepareForm();
          resolve();
      });
  }


  /**
   * Method that loads the variables with their corresponding values
   * obtained from the API.
   */
  private prepareForm() {
      /* this.dataForm = {
        "producto": this.frm.controls['com_producto_id'].value,
        "categoria": this.frm.controls['com_categoria_id'].value,
        "tipo_producto": this.frm.controls['tipo_producto_id'].value,
        "usos": this.frm.controls['usos_ids'].value,
        "grupo_marca": this.frm.controls['grupo_marca_id'].value,
        "marca": this.frm.controls['inv_marca_id'].value,
        "unidad_compra": this.frm.controls['unidad_compra_id'].value,
        "unidad_distribucion": this.frm.controls['unidad_distribucion_id'].value,
        "con_variantes": this.helperService.getSwitch(this.frm.controls['con_variantes'].value, false),
        "proveedor": this.frm.controls['com_tercero_id'].value,
        "tipo_clase": [43364, 43365]
    }; */
    this.thirdSearchService.getInitialData().subscribe(
        async (res: any) => {
          console.log(res);
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

  /**
   * Method that loads default values into the form
   */
  public loadData(res: any) {
      if (res != null) {
          this.frm?.get('com_producto_id')?.setValue(res.com_producto_id);
          this.frm?.get('tipo_producto_id')?.setValue(res.product_type_id);
          this.frm.controls['com_categoria_id'].setValue(res.com_category_id);
      }
  }

  toggleTree() {
    this.treeVisible = !this.treeVisible;
  }

  private createClassTree(tree: any): TreeNode[] {
    const returnArray: TreeNode[] = [];
    const types = Object.assign([], tree);
    for (let index = 0; index < types.length; index++) {
      // Validate parent
      if (types[index].com_categoria_id === null) {
        const type: TreeNode = {
          label: types[index].codigo_con_nombre,
          data: types[index].id,
          children: []
        };
        this.buildClassSevenChildren(type, 1, tree);
        type.expanded = true;
        returnArray.push(type);
      }
    }
    return returnArray;
  }

  private buildClassSevenChildren(item: TreeNode, origin: number, tree: any) {
    const children: TreeNode[] = [];
    const types = Object.assign([], tree);
    for (let index = 0; index < types.length; index++) {
      if (types[index].com_categoria_id === item.data) {
        const type: TreeNode = {
          label: types[index].codigo_con_nombre,
          data: types[index].id,
          children: []
        };
        if (origin === 1) {
          this.buildClassSevenChildren(type, origin, tree);
        }
        children.push(type);
      }
    }
    if (children.length > 0) {
      item.children = children;
    }
  }

  /**
   * Carga las marcas segun el grupo de marca seleccionado
   * @param brandGroup
   */
  getBrands(brandGroup: DropdownChangeEvent | any) {
    if (brandGroup !== null && brandGroup !== undefined && brandGroup.value !== null && brandGroup.value !== undefined) {
      if (brandGroup.value.id != 0) {
        this.loadingBrand = true;
      } else {
        this.brandList = [];
        this.frm.get('inv_marca_id')?.setValue(null);
        this.frm.controls['inv_marca_id'].updateValueAndValidity();
      }
    } else {
      this.loadingBrand = false;
    }
  }

  /**
   * Method that resets data based on the product type of the category
   */
  getCuentaC(value: TreeNodeSelectEvent | any) {
    if (value && value.node.children.length === 0) {
      this.selectedCategory = value.node.label;
      this.frm.controls['com_categoria_id'].setValue(value.node.data);
      this.treeVisible = false;
    }
  }

  productSelected(info: any) {
    if (info) {
      this.productTxt = {
        id: info.id,
        valor_montar: info.codigoUnspsc + ' - ' + info.nombre
      }
      this.frm.controls['com_producto_id'].setValue(info.id);
    }
  }

  clearSelectedProduct() {
    this.productTxt = null;
    this.frm.controls['com_producto_id'].setValue(null);
  }

  proveedorSelected(info: any) {
    if (info) {
      this.proveedorTxt = {
        id: info.id,
        valor_montar: info.valor_montar
      }
      this.frm.controls['com_tercero_id'].setValue(info.id);
    }
  }

  clearSelectedProveedor() {
    this.proveedorTxt = null;
    this.frm.controls['com_tercero_id'].setValue(null);
  }

  async searchForms() {
    this.dataForm = {
        "producto": this.frm.controls['com_producto_id'].value,
        "categoria": this.frm.controls['com_categoria_id'].value,
        "tipo_producto": this.frm.controls['tipo_producto_id'].value,
        "usos": this.frm.controls['usos_ids'].value,
        "grupo_marca": this.frm.controls['grupo_marca_id'].value?.id,
        "marca": this.frm.controls['inv_marca_id'].value?.id,
        "unidad_compra": this.frm.controls['unidad_compra_id'].value?.id,
        "unidad_distribucion": this.frm.controls['unidad_distribucion_id'].value?.id,
        "con_variantes": this.helperService.getSwitch(this.frm.controls['con_variantes'].value, false),
        "proveedor": this.frm.controls['com_tercero_id'].value,
        "tipo_clase": [43364, 43365]
    };
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