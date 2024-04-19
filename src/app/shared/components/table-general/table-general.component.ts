import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, Column, DatatableSort, ExtendedPostData, JsonParams, PostData } from './col/col';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { DividerModule } from 'primeng/divider';
import { RegistroData } from '../buttons-general/actions';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ApisServicesServiceImp } from '../../core/application/config/apis-services.service.imp';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-table-general',
  standalone: true,
  imports: [ButtonModule, TooltipModule, CommonModule, DialogModule, FormsModule, ReactiveFormsModule, TableModule, PaginatorModule, DividerModule, ButtonsGeneralComponent],
  templateUrl: './table-general.component.html',
  styleUrls: ['./table-general.component.css']
})
export class TableGeneralComponent implements OnInit {

  @Input() columns: Array<Column> = []; // Atributo: Columnas de la tabla
  @Input() export: boolean = true;
  @Input() endPoint: string = ''; // Atributo: Punto final
  @Input() data: Array<any> = []; // Atributo: Datos de la tabla
  @Input() loading: boolean = true; // Atributo: Carga de la tabla
  @Input() pageNumber: number | string | any = 10; // Atributo: Número de página
  @Input() path: string = ''; // Atributo: Ruta
  @Input() route: string = ''; // Atributo: Ruta
  @Input() showCurrentPageReport: boolean = true; // Atributo: Mostrar informe de la página actual
  @Input() paginatePage: boolean = true; // Atributo: Paginar la página
  @Input() public parameters: any = {}; // Atributo: Parámetros
  @Input() showFilter: boolean = true; // Atributo: Mostrar filtro
  @Input() closingDate: boolean = false; // Atributo: Fecha de cierre
  @Input() public usePostRequest: boolean = false; // Atributo: Usar petición POST
  @Input() public erp: boolean = false; // Attribute: ERP
  @Input() public sendDocument: boolean = false; // Attribute: Send Document
  @Output() dataRequest: any = new EventEmitter<PostData>(); // Método: Emite una solicitud de datos
  @Output() generalData: EventEmitter<any> = new EventEmitter(); // Método: Emite datos generales
  @Output() public runActions = new EventEmitter<RegistroData>(); // Método: Emite una acción
  @Output() public exportAction = new EventEmitter<any>();
  public rowIndexHovered: number = -1;
  public cursorStyle: string = 'default';
  public searchForm: FormGroup = new FormGroup({}); // Atributo: Formulario de búsqueda
  public search: any; // Atributo: Búsqueda
  public size: number = 0; // Atributo: Tamaño
  public hasData$ = new Subject<boolean>(); // Atributo: Tiene datos
  public numberPage: any; // Atributo: Número de página
  public totalPages: number = 0; // Atributo: Total de páginas
  public rows = [8, 20, 30, 50, 100, 200]; // Atributo: Filas
  searched = false; // Atributo: Búsqueda realizada
  public datatable: any; // Atributo: Tabla de datos
  public datatableSort: DatatableSort = new DatatableSort(); // Atributo: Orden de clasificación de la tabla
  public selectedPage: any = 0; // Atributo: Página seleccionada
  public selectedRows: any; // Atributo: Filas seleccionadas
  public datatableData: any[] = []; // Atributo: Datos de la tabla

  currentDate: Date = new Date(); // Atributo: Fecha actual
  public dateTime: any; // Atributo: Fecha y hora
  public rowsPerPageOptions: number[] = [10, 25, 50, 100];

  constructor(
    public services: ApisServicesServiceImp,
  ) {
    this.services.endPoint = this.endPoint;
  }

  onMouseEnter(rowIndex: number): void {
    if (this.sendDocument) {
      this.rowIndexHovered = rowIndex;
    }
  }

  onMouseLeave(): void {
    this.rowIndexHovered = -1;
  }

  /**
   * Clears invalid characters from the input.
   * Elimina caracteres inválidos del input.
   * @param event Event object.
   */
  clearInvalidCharacters(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    if (this.isDate(inputValue)) {
      inputValue = this.formatDate(inputValue);
    }
    inputValue = inputValue.replace(/[^0-9a-zA-ZáéíóúÁÉÍÓÚ@_.# +\-]/g, '');
    inputElement.value = inputValue;
    this.searchForm.controls['search'].setValue(inputValue);
  }

  /**
   * Validates the input pattern.
   * Valida el patrón de entrada.
   * @param control AbstractControl object.
   * @returns Validation result.
   */
  validatePattern(control: AbstractControl) {
    if (control.value == null || control.value == '') {
      return null;
    }
    let lastCharacter = control.value.charAt(control.value.length - 1);
    let validCharacters: string[] = [
      'Á',
      'É',
      'Í',
      'Ó',
      'Ú',
      'á',
      'é',
      'í',
      'ó',
      'ú',
      'Ñ',
      'ñ',
      '#',
      '-',
      '_',
      '.',
      '+',
      '@',
      ' ',
    ];
    validCharacters.push(String.fromCharCode(13));

    for (let x: number = 48; x <= 57; x++) {
      // numbers 0-9
      validCharacters.push(String.fromCharCode(x));
    }
    for (let x: number = 65; x <= 90; x++) {
      //A-Z
      validCharacters.push(String.fromCharCode(x));
    }
    for (let x: number = 97; x <= 122; x++) {
      //a-z
      validCharacters.push(String.fromCharCode(x));
    }
    let validCharacter: boolean = false;
    for (let j in validCharacters) {
      if (lastCharacter.includes(validCharacters[j])) {
        validCharacter = true;
      }
    }
    if (!validCharacter) {
      control.setValue(control.value.replace(lastCharacter, ''));
    }
    return null;
  }

  /**
   * Initializes the component.
   * Inicializa el componente.
   */
  ngOnInit(): void {

    this.searchForm = new FormGroup({
      search: new FormControl(null, [
        Validators.pattern(/^[0-9a-zA-ZáéíóúÁÉÍÓÚ@_\-.# \+]+$/),
        this.validatePattern,
      ]),
    });
    this.loadTable(0);
  }

  /**
   * Clears the search input.
   * Limpia el input de búsqueda.
   */
  clear() {
    if (!!this.search) {
      this.search = '';
      this.loadTable(0);
    }
  }

  /**
   * Sets the data for the component.
   * Establece los datos para el componente.
   * @param data Array of data to be set.
   */
  private setData(data: Array<any>) {
    this.data = data;
    this.datatableData = [];
    for (const newData of data) {
      const exists = this.datatableData.some(
        (item) => item.id === newData.id
      );
      if (!exists) {
        this.datatableData.push(newData);
      }
    }
    this.generalData.emit(this.datatableData ? this.datatableData : null);
    if (this.data.length < 1) {
      this.hasData$.next(true);
    } else {
      this.hasData$.next(false);
    }
  }

  /**
   * Handles the sorting of data.
   * Maneja la ordenación de los datos.
   * @param event Event object containing sorting information.
   */
  onSort(event: any) {
    if (event.sortField && event.sortField !== '') {
      this.sortData(event.sortField, event.sortOrder);
    }
  }

  /**
   * Sorts the data.
   * Ordena los datos.
   * @param column Column to sort.
   * @param order Sorting order.
   */
  sortData(column: any, order: number) {
    this.datatableSort.sortField = column;
    this.datatableSort.sortOrder = order;
    this.loadTable(
      this.selectedPage,
      this.pageNumber,
      this.path,
      this.datatable,
      this.loading,
      this.datatableSort.sortField,
      this.datatableSort.sortOrder,
      this.searchForm.controls['search'].value
    );
  }

  /**
   * Loads the table data.
   * Carga los datos de la tabla.
   * @param page Page number.
   * @param rows Number of rows per page.
   * @param path Path for data retrieval.
   * @param datatable Datatable object.
   * @param loading Loading indicator.
   * @param sortField Field to sort.
   * @param sortOrder Sorting order.
   * @param search Search value.
   */
  loadTable(
    page: number,
    rows: number | string | any = this.pageNumber,
    path?: string,
    datatable: any = null,
    loading: boolean = true,
    sortField: string = this.datatableSort.sortField,
    sortOrder: number = 1,
    search: string = ''
  ) {
    path = path == null ? this.path : path;
    this.loading = loading;
    this.services.endPoint = this.endPoint;
    this.services.render();

    if (this.usePostRequest) {
      if (datatable) this.parameters = datatable;
      const postData: ExtendedPostData | PostData | any = {
        ...this.parameters,
        length: rows,
        busqueda: search,
        columnOrder: sortField,
        directionOrder: sortOrder === 1 ? 'asc' : 'desc',
      };
      this.services.postData(postData, page).subscribe((res: any) => {
        this.setData(res?.content);
        this.numberPage = res.totalElements;
        this.size = res.content.length;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.dataRequest.emit(postData);
      });
    } else {
      // Construir objeto JSONParams
      const jsonParams: JsonParams = {
        draw: 1, // Asigna el valor adecuado para draw
        columns: this.columns.map(col => {
          return {
            data: col.data,
            name: '',
            searchable: true,
            orderable: true,
            search: {
              value: '',
              regex: false,
            }
          };
        }),
        order: [{ column: this.columns.findIndex((col: Column) => col.data == sortField) != -1 ? this.columns.findIndex((col: Column) => col.data == sortField) : 0, dir: sortOrder == 1 ? 'desc' : 'asc' }],
        start: (page - 1) * rows,
        length: rows,
        search: {
          value: search || '',
          regex: false,
        },
        pageCurrent: page,
        params: [],
      };

      this.services.getDataJsonParams(jsonParams)
        .subscribe((res: any) => {
          this.setData(res?.content);
          this.numberPage = res.totalElements;
          this.size = res.content.length;
          this.totalPages = res.totalPages;
          this.loading = false;
        });
    }
  }


  /**
   * Handles pagination.
   * Maneja la paginación.
   * @param page Page object.
   */
  paginate(page: any, quantity = false) {
    if (quantity) {
      this.pageNumber = page.value;
      this.selectedRows = page.value;
    } else {
      this.pageNumber = page.rows;
      this.selectedPage = page.page;
      this.selectedRows = page.rows;
    }
    this.loadTable(
      this.selectedPage,
      this.pageNumber,
      this.path,
      this.datatable,
      this.loading,
      this.datatableSort.sortField,
      this.datatableSort.sortOrder
    );
  }

  /**
   * Filters the data when 'Enter' key is pressed.
   * Filtra los datos cuando se presiona la tecla 'Enter'.
   * @param filter Filter object.
   * @param path Path for data retrieval.
   * @param page Page number.
   * @param rows Number of rows per page.
   */
  filterEnter() {
    let string = this.searchForm.controls['search'].value;
    string = string == null ? '' : string;
    if (this.isDate(string)) {
      string = this.formatDate(string); // Formats date to "YYYY-MM-DD"
    } else {
      string = encodeURIComponent(string); // Converts special characters (e.g., '#' becomes '%23')
    }
    this.loadTable(0, this.pageNumber, this.path, null, true, this.datatableSort.sortField, 1, string )
  }

  /**
   * Checks if the given value is a date.
   * Comprueba si el valor dado es una fecha.
   * @param value Value to check.
   * @returns Boolean indicating if the value is a date.
   */
  isDate(value: string): boolean {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);

    if (match) {
      const [, day, month, year] = match.map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return (
        parsedDate.getDate() === day &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getFullYear() === year
      );
    }

    return false;
  }

  /**
   * Formats the date value.
   * Formatea el valor de la fecha.
   * @param dateValue Date value to format.
   * @returns Formatted date string.
   */
  formatDate(dateValue: string): string {
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return formattedDate;
    }
    return dateValue;
  }

  handleRunActions(event: RegistroData) {
    this.runActions.emit(event);
  }
}
