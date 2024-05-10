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
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';
import { ProductSearchService } from '../../core/application/product-search.service';
import { TreeNode } from 'primeng/api';

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
    TreeModule,
    AutocompleteComponent,
    ModalGeneralComponent,
    ButtonsGeneralComponent,
    TableGeneralComponent
  ]
})
export class AdvancedSearchFormsProdutsComponent {

  @Input() displayModal: boolean = false;
  @Input() typeProductId = null;
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

  public dataForm = {
    producto: null,
    codigo: null,
    tipoFormularioId: 0,
    nombre: null,
    descripcion: null,
    com_categoria_id: null
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

  loadForm() {
    this.frm = this.formBuilder.group({
      producto: [null],
      com_categoria_id: [null],
      codigo: [null],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
      ])]
    })
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
   * Method that resets data based on the product type of the category
   */
  getCuentaC(value: TreeNodeSelectEvent | any) {
    if (value && value.node.children.length === 0) {
      console.log(value);
      this.selectedCategory = value.node.label;
      this.frm.controls['com_categoria_id'].setValue(value.node.data);
    }
  }

  productSelected(info: any) {
    if (info) {
      this.productTxt = {
        id: info.id,
        valor_montar: info.codigoUnspsc + ' - ' + info.nombre
      }
      this.frm.controls['producto'].setValue(info.id);
    }
  }

  clearSelectedProduct() {
    this.productTxt = null;
    this.frm.controls['producto'].setValue(null);
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
