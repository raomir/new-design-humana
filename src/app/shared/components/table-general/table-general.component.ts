import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, Column, DatatableSort, ExtendedPostData, PostData } from './col/col';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { DividerModule } from 'primeng/divider';
import { RegistroData } from '../buttons-general/actions';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-table-general',
  standalone: true,
  imports: [ButtonModule, TooltipModule, CommonModule, FormsModule, ReactiveFormsModule, TableModule, PaginatorModule, DividerModule, ButtonsGeneralComponent],
  templateUrl: './table-general.component.html',
  styleUrls: ['./table-general.component.css']
})
export class TableGeneralComponent implements OnInit {
  
  @Input() columns: Array<Column> = []; // Atributo: Columnas de la tabla
  @Input() export: boolean = true;
  @Input() endPoint: string = ''; // Atributo: Punto final
  @Input() data: Array<any> = []; // Atributo: Datos de la tabla
  @Input() loading: boolean = false; // Atributo: Carga de la tabla
  @Input() pageNumber: number | string | any = 10; // Atributo: Número de página
  @Input() path: string = ''; // Atributo: Ruta
  @Input() route: string = ''; // Atributo: Ruta
  @Input() showCurrentPageReport: boolean = true; // Atributo: Mostrar informe de la página actual
  @Input() paginatePage: boolean = true; // Atributo: Paginar la página
  @Input() public parameters: any = {}; // Atributo: Parámetros
  @Input() showFilter: boolean = true; // Atributo: Mostrar filtro
  @Input() closingDate: boolean = false; // Atributo: Fecha de cierre
  @Input() public usePostRequest: boolean = false; // Atributo: Usar petición POST
  @Output() dataRequest: any = new EventEmitter<PostData>(); // Método: Emite una solicitud de datos
  @Output() generalData: EventEmitter<any> = new EventEmitter(); // Método: Emite datos generales
  @Output() public runActions = new EventEmitter<RegistroData>(); // Método: Emite una acción
  @Output() public exportAction = new EventEmitter<any>();
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
    /* public services: ApisServicesService, */
  ) {}

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
    /* this.services.endPoint = this.route; */
    this.endPoint = this.route;

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
  /*     this.services.sendDatatableData(
    this.datatableData ? this.datatableData : ''
  ); */
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
    rows: number | string = this.pageNumber,
    path?: string,
    datatable: any = null,
    loading: boolean = true,
    sortField: string | any = '',
    sortOrder: number = 1,
    search: any = null
  ) {
    path = path == null ? this.path : path;
    this.loading = loading;
    /* this.services.endPoint = this.endPoint;
    this.services.render(); */

    if (this.usePostRequest) {
      if (datatable) this.parameters = datatable;
      /* const postData: ExtendedPostData | PostData = {
        page: page,
        rows: rows,
        sortField: sortField,
        search: search,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc',
        parameters: this.parameters,
      }; */
      /* this.services.postData(postData).subscribe((res: any) => {
        this.setData(res?.content);
        this.numberPage = res.totalElements;
        this.size = res.content.length;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.dataRequest.emit(postData);
      }); */
    } else {
      /* this.services
        .getData(page, 'null', path ? path : null, rows, datatable)
        .subscribe((res: any) => {
          this.setData(res?.content);
          this.numberPage = res.totalElements;
          this.size = res.content.length;
          this.totalPages = res.totalPages;
          this.loading = false;
        }); */
    }
    const resPrueba: any = {
      "content": [
        {
          "id": 85,
          "codigo": "CP001",
          "nombre": "Biológico",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "Causado por hongos bacterias virus y parásitos.",
          "metadatos": null,
          "favorito": 2,
          "activo": 1,
          "createdAt": 1657309884908,
          "updatedAt": null
        },
        {
          "id": 86,
          "codigo": "CP002",
          "nombre": "Físico",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "Temperaturas extremas: Calor y frio.",
          "metadatos": null,
          "favorito": 2,
          "activo": 2,
          "createdAt": 1657309917980,
          "updatedAt": null
        },
        {
          "id": 87,
          "codigo": "CP003",
          "nombre": "Quimico",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "Causado por polvos orgánicos e inorgánicos.",
          "metadatos": null,
          "favorito": 2,
          "activo": 1,
          "createdAt": 1657309943557,
          "updatedAt": null
        },
        {
          "id": 172,
          "codigo": "dddd",
          "nombre": "jjjjj",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "jjjjjjj d",
          "metadatos": {
            "formulario": null
          },
          "favorito": 1,
          "activo": 1,
          "createdAt": 1659732214896,
          "updatedAt": null
        },
        {
          "id": 360,
          "codigo": "PRB1",
          "nombre": "Peligro 1",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308156993,
          "updatedAt": null
        },
        {
          "id": 361,
          "codigo": "PRB2",
          "nombre": "Peligro 2",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308170471,
          "updatedAt": null
        },
        {
          "id": 362,
          "codigo": "PRB3",
          "nombre": "Peligro 3",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308181305,
          "updatedAt": null
        },
        {
          "id": 363,
          "codigo": "PRB4",
          "nombre": "Peligro 4",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308198432,
          "updatedAt": null
        },
        {
          "id": 364,
          "codigo": "PRB5",
          "nombre": "Peligro 5",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308213001,
          "updatedAt": null
        },
        {
          "id": 365,
          "codigo": "PRB6",
          "nombre": "Peligro 6",
          "prvListaElementoId": null,
          "tipoLista": "CLASE_PELIGRO",
          "deletedAt": null,
          "descripcion": "prueba exportacion componente",
          "metadatos": {
            "formulario": null
          },
          "favorito": 2,
          "activo": 1,
          "createdAt": 1664308226873,
          "updatedAt": null
        }
      ],
      "empty": false,
      "first": true,
      "last": false,
      "number": 0,
      "numberOfElements": 10,
      "pageable": {
        "sort": {
          "unsorted": false,
          "sorted": true,
          "empty": false
        },
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 10
      },
      "size": 10,
      "sort": {
        "unsorted": false,
        "sorted": true,
        "empty": false
      },
      "totalElements": 12,
      "totalPages": 2
    };
    this.setData(resPrueba?.content);
    this.numberPage = resPrueba.totalElements;
    this.size = resPrueba.content.length;
    this.totalPages = resPrueba.totalPages;
    this.loading = false;
  }

  /**
   * Handles pagination.
   * Maneja la paginación.
   * @param page Page object.
   */
  paginate(page: any) {
    if (typeof page == 'number') {
      this.pageNumber = page;
      this.selectedRows = page;
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
   * Filters the data.
   * Filtra los datos.
   * @param filter Filter object.
   * @param path Path for data retrieval.
   */
  filter(filter: any, path?: string) {
    path = path == null ? this.path : path;
    let value = this.searchForm.controls['search'].value;
    value = value == null ? '' : value;

    if (this.isDate(value)) {
      value = this.formatDate(value); // Formats date to "YYYY-MM-DD"
    } else {
      value = encodeURIComponent(value); // Converts special characters (e.g., '#' becomes '%23')
    }

    this.loading = true;
    /* this.services.endPoint = this.endPoint;
    this.services.render(); */
    if (this.usePostRequest) {
      /* const postData: ExtendedPostData | PostData = {
        page: 0,
        rows: this.selectedRows,
        sortField: '',
        search: value,
        sortOrder: 'asc',
        parameters: this.parameters,
      }; */

      /* this.services.postData(postData).subscribe((res: any) => {
        this.searched = true;
        this.setData(res?.content);
        this.numberPage = res.totalElements;
        this.size = res.content.length;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.dataRequest.emit(postData);
      }); */
    } else {
      /* this.services
        .getData(0, value, path ? path : null, this.selectedRows)
        .subscribe((res: any) => {
          this.searched = true;
          this.setData(res.content);
          this.numberPage = res.totalElements;
          this.size = res.content.length;
          this.loading = false;
        }); */
    }
  }

  /**
   * Filters the data when 'Enter' key is pressed.
   * Filtra los datos cuando se presiona la tecla 'Enter'.
   * @param filter Filter object.
   * @param path Path for data retrieval.
   */
  filterEnter(filter: any, path?: string) {
    let string = this.searchForm.controls['search'].value;
    string = string == null ? '' : string;
    if (this.isDate(string)) {
      string = this.formatDate(string); // Formats date to "YYYY-MM-DD"
    } else {
      string = encodeURIComponent(string); // Converts special characters (e.g., '#' becomes '%23')
    }

    path = path == null ? this.path : path;
    this.loading = true;
    /* this.services.endPoint = this.endPoint;
    this.services.render();
    this.services
      .getData(0, string, path ? path : null, this.selectedRows)
      .subscribe((res: any) => {
        this.searched = true;
        this.setData(res.content);
        this.numberPage = res.totalElements;
        this.size = res.content.length;
        this.loading = false;
      }); */
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

  /**
   * Checks if the estimated closing date is valid.
   * Comprueba si la fecha de cierre estimada es válida.
   * @param estimatedClosing Estimated closing date.
   * @returns Boolean indicating if the date is valid.
   */
  checkDate(estimatedClosing: any): Boolean {
    /* this.dateTime = this.datePipe.transform(
      this.currentDate,
      'yyyy-MM-dd HH:mm:ss'
    ); */
    const date1 = new Date(estimatedClosing);
    const date2 = new Date(this.dateTime);
    if (date1 <= date2) {
      return true;
    } else {
      return false;
    }
  }
  handleRunActions(event: RegistroData) {
    this.runActions.emit(event);
  }
}
