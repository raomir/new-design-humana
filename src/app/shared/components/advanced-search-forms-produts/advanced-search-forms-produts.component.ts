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
import { ProductSearchService } from '../../core/application/product-search.service';
import { TreeNode } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-advanced-search-forms-produts',
  templateUrl: './advanced-search-forms-produts.component.html',
  styleUrls: ['./advanced-search-forms-produts.component.css'],
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
    ProgressSpinnerModule
  ]
})
export class AdvancedSearchFormsProdutsComponent {

  @Input() displayModal: boolean = false;
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

  public endPointDatatable: string = 'procesos/busquedaAvanzada/page';
  public endPointAutocomplete: string = 'comproductos/autocompleta/false';
  public productTxt: any;
    public paramsAutocomplete: any = { 
    grupo: null,
    validaciones_extras: null,
    dataBusqueda: null,
    vinculacion_id: null,
    tipo_concepto: null
  }

  public valueProduct: any;
  public selectedCategoryTree: Array<TreeNode> = [];
  public treeVisible: boolean = false;
  public selectedCategory: TreeNode | null = null;

  public productTypeList: Array<any> = [];
  public brandGroupList: Array<any> = [];
  public brandList: Array<any> = [];
  public purchaseUnitList: Array<any> = [];
  public distributionUnitList: Array<any> = [];
  public usageList: Array<any> = [];

  public loadingBrand: boolean = false;

  public dataForm = {
    com_producto_id: null,
    com_categoria_id: null,
    tipo_producto_id: null,
    usos_ids: null
  }

  public columns: Array<Column> = [
    { title: "Código", data: "codigo" },
    { title: "Nombre", data: "nombre" },
    { title: "Padre", data: "nombrePadre" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productSearchService: ProductSearchService
  ) {

  }

  ngOnInit(): void {
    this.productSearchService.searchCategories({ tipo_producto_id: this.typeProductId }).subscribe(
        (result) => {
          console.log(result);
          this.selectedCategoryTree = this.createClassTree(result.categorias);
          console.log(this.selectedCategoryTree);
        }
    );
    this.loadForm();
  }

  /**
   * Method to initialize the form
   */
  public loadForm() {
      this.frm = new FormGroup({
            com_producto_id: new FormControl(null, Validators.required),
            tipo_producto_id: new FormControl(null, Validators.required),
            usos_ids: new FormControl(null, Validators.required),
            con_variantes: new FormControl(null, Validators.required),
            grupo_marca_id: new FormControl(null, Validators.required),
            inv_marca_id: new FormControl(null, Validators.required),
            unidad_compra_id: new FormControl(null, Validators.required),
            unidad_distribucion_id: new FormControl(null, Validators.required),
            com_tercero_id: new FormControl(null, Validators.required),
            con_compuestos: new FormControl(null, Validators.required),
            con_existencias: new FormControl(null, Validators.required),
            maneja_lotes: new FormControl(null, Validators.required),
            con_tarifas: new FormControl(null, Validators.required)
      });
      this.prepareForm();
  }

  /**
   * Method that loads the variables with their corresponding values
   * obtained from the API.
   */
  private prepareForm() {
      this.productSearchService.getInitialData().subscribe(
          async (res: any) => {
              res = res.data;
              this.loadLists(res.listas).then(() => {
                  this.loadData(res);
              });
          }
      );
  }

  /**
   * Gets the system lists and stores them in a variable
   * @param lists
   */
  public loadLists(lists: any): Promise<void> {
      return new Promise<void>(resolve => {
          this.brandGroupList = lists.grupos_marcas;
          this.brandList = lists.marcas;
          this.productTypeList = lists.tipos_productos;
          this.purchaseUnitList = lists.unidades_compras;
          this.distributionUnitList = lists.unidades_distribucion;
          this.usageList = lists.usos;          

          resolve();
      });
  }

  /**
   * Method that loads default values into the form
   */
  public loadData(res: any) {
    console.log(res);
      /* if (res != null) {
          this.frm.get(com_producto_id).setValue(res.com_producto_id);
          this.frm.get('tipo_producto_id').setValue(res.product_type_id);
          this.frm.controls['com_categoria_id'].setValue(res.com_category_id);
      } */
  }

  toggleTree() {
    this.treeVisible = !this.treeVisible;
  }

  private createClassTree(tree: any): TreeNode[] {
    const returnArray: TreeNode[] = [];
    const types = Object.assign([], tree);
    console.log(types);
    for (let index = 0; index < types.length; index++) {
      // Validate parent
      //console.log(types[index]);
      if (types[index].com_categoria_id === null) {
        console.log('ENTRA');
        const type: TreeNode = {
          label: types[index].codigo_con_nombre,
          data: types[index].id,
          children: []
        };
        console.log(type);
        this.buildClassSevenChildren(type, 1, tree);
        type.expanded = true;
        returnArray.push(type);
      }
    }
    console.log(returnArray);
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
    console.log(brandGroup);
    if (brandGroup !== null && brandGroup !== undefined && brandGroup.value !== null && brandGroup.value !== undefined) {
      if (brandGroup.value.id != 0) {
        this.loadingBrand = true;
        this.productSearchService.getBrands(brandGroup.value.id)?.subscribe(
          (res: any) => {
            this.loadingBrand = false;
            let marcasFinal: any[] = [{ id: 0, nombre: 'Todas' }];
            let marcasTemp = res.marcas;
            marcasTemp.forEach((element: any) => {
              marcasFinal.push(element);
            });

            this.brandList = marcasFinal;
            this.frm.controls['inv_marca_id'].setValue(0);
            this.frm.controls['inv_marca_id'].updateValueAndValidity();
          },
          () => {
            this.loadingBrand = false;
            this.brandList = [];
            this.frm.get('inv_marca_id')?.setValue(null);
          }
        );
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
      console.log(value);
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
