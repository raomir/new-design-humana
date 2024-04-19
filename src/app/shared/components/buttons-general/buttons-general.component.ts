import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { CommonModule } from "@angular/common";
import { RegistroData } from "./actions";
import { HelpersServiceImp } from "../../core/application/config/helpers.service.imp";

/**
 * Componente que representa un conjunto de botones generales.
 */
@Component({
  selector: 'app-buttons-general',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './buttons-general.component.html',
  styleUrls: ['./buttons-general.component.css']
})
export class ButtonsGeneralComponent implements OnInit {

  @ViewChild("toolbar") toolbar: ElementRef | any;

  @Input() buttons: any = [];
  @Input() type: any = null;
  @Input() datatable: boolean = false;
  @Input() buttonColor: string = "primary";
  @Input() icon: string = "plus-circle";
  @Input() buttonStyle: { [klass: string]: any } | any;
  @Input() buttonTitle: string = "";
  @Input() disabled: boolean = false;
  @Input() buttonType: string = "submit";
  @Input() isBehavior: boolean = false;
  @Input() aligned = 'float-right';
  @Input() dataDatatable: any;
  @Input() arrayDisabled: any = [];


  // Special
  // Especial
  @Input() afterPrint: boolean = true;
  public id: any;

  // Output events
  // Eventos de salida
  @Output() public newAction = new EventEmitter<void>();
  @Output() public cancelAction = new EventEmitter<void>();
  @Output() public saveAction = new EventEmitter<void>();
  @Output() public dropdownAction = new EventEmitter<void>();
  @Output() public deleteAction = new EventEmitter<void>();
  @Output() public returnAction = new EventEmitter<void>();
  @Output() public authorizeAction = new EventEmitter<void>();
  @Output() public rejectAction = new EventEmitter<void>();
  @Output() public requestAction = new EventEmitter<void>();
  @Output() public searchAction = new EventEmitter<void>();
  @Output() public confirmAction = new EventEmitter<void>();
  @Output() public exportAction = new EventEmitter<any>();
  @Output() public printAction = new EventEmitter<any>();
  @Output() public printViewerAction = new EventEmitter<void>();
  @Output() public annulAction = new EventEmitter<void>();
  @Output() public buttonIconAction = new EventEmitter<any>();
  @Output() public downloadAction = new EventEmitter<void>();
  @Output() public generateAction = new EventEmitter<void>();
  @Output() public sendAction = new EventEmitter<void>();
  @Output() public resetAction = new EventEmitter<void>();
  @Output() public closeAction = new EventEmitter<void>();
  @Output() public editAction = new EventEmitter<void>();
  @Output() public cleanAction = new EventEmitter<void>();
  @Output() public createAction = new EventEmitter<void>();

  @Output() public onClick = new EventEmitter<any>();
  @Output() public consultAction = new EventEmitter<void>();

  // Without icon
  // Sin icono
  @Output() public acceptAction = new EventEmitter<void>();

  @Output() public reverseAction = new EventEmitter<any>();

  @Output() public sendInvitationsAction = new EventEmitter<void>();

  // DataTable
  // DataTable
  @Output() public runActions = new EventEmitter<RegistroData>();

  permission: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private helperService: HelpersServiceImp,
  ) {
    const data: any = this.activatedRoute.snapshot.data;
    if (data && Object.keys(data).length) {
      this.permission = data.permissions.name;
    }
  }

  ngOnInit(): void {
    this.loadButtons();
  }

  /**
   * Method to print the current page.
   * Método para imprimir la página actual.
   */
  printPage() {
    window.print();
  }

  /**
   * Load buttons according to the specified type.
   * Carga los botones según el tipo especificado.
   */
  loadButtons() {
    const switcher: any = {
      modal: ["btn_save"],
      datatable: ["btn_print", "btn_new"],
      dropdown: ["btn_new"],
      datatable_all: [
        "btn_print",
        "btn_new",
        "btn_save",
        "btn_print",
      ],
      authorize: ["btn_authorize", "btn_reject"],
      parModal: ["btn_cancel", "btn_add"],
      parAttachment: ["btn_edit", "btn_delete", "btn_download"]
    };
    this.buttons = switcher[this.type] || this.buttons;
  }

  /**
   * Method to obtain permissions for buttons of a modal.
   * Método para obtener permisos para los botones de un modal.
   * @param namePermission Permission name.
   * @returns Full permission name.
   */
  activatePermissionsModal(namePermission: string): any {
    if (this.type == 'modal') {
      const path = this.router.url.split('/');
      let pathModule = path[1].replace('-', '');
      if (pathModule === 'sggt') {
        pathModule = 'talentohumano';
      }
      const permissions = this.helperService.getProfilesJson()?.permissions;

      // Check if the module exists
      // Verifica si el módulo existe
      if (permissions.hasOwnProperty(pathModule)) {
        const component = path[3].replace(/-/g, '_');
        const newValuePermissions = permissions[pathModule];

        // Check if the component exists within the module and permissions
        // Verifica si el componente existe dentro del módulo y los permisos
        if (newValuePermissions[component]) {
          return `${pathModule}.${component}.${namePermission}`;
        }
      }
    }
    return '';
  }
}