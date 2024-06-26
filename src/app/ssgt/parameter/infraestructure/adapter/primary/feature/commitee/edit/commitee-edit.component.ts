import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { TableGeneralComponent } from '../../../../../../../../shared/components/table-general/table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { RegistroData } from '../../../../../../../../shared/components/buttons-general/actions';
import { CommiteeModalComponent } from '../modal/commitee-modal.component';
import { ButtonsGeneralComponent } from '../../../../../../../../shared/components/buttons-general/buttons-general.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ValidationMessageComponent } from '../../../../../../../../shared/components/validation-message/validation-message.component';
import { CommitteeService } from '../../../../../../core/application/committee/committee.service';
import { CommitteeModel } from 'src/app/ssgt/parameter/core/domain/committee/committee.model';

@Component({
  selector: 'app-commitee-edit',
  standalone: true,
  imports: [
    CommonModule,
    TableGeneralComponent,
    HeaderCardComponent,
    TabViewModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CommiteeModalComponent,
    ButtonsGeneralComponent,
    CalendarModule,
    DropdownModule,
    ValidationMessageComponent
  ],
  templateUrl: './commitee-edit.component.html'
})
export class CommiteeEditComponent implements OnInit {

  @ViewChild('table') table?: TableGeneralComponent;

  public title: string = 'Comités';
  public frm!: FormGroup;
  public id?: Number;

  public idEdit: Number | null = null;
  public tabActive: number = 0;
  public listStatus: Array<any> = [
    {id:1, name:"Activo"},
    {id:2, name:"Inactivo"}
  ];

  public endPointElements: string = 'dotacioncargo/';

  public columnsTable: any[] = [
    { title: 'Código', data: 'producto.code_unspsc', sort: 'producto.code_unspsc', render: (data: any, row: any) => row.producto.codeUnspsc },
    { title: 'Nombre del elemento', data: 'producto.nombre', sort: 'producto.nombre', render: (data: any, row: any) => row.producto.nombre },
    { title: 'Cantidad', data: 'cantidad', sort: 'cantidad', classTitle: 'text-right', classCode: 'text-right' },
    { title: 'Frecuencia', data: 'frecuencia', sort: 'frecuencia', render: (data: any, row: any) => `${data} ${row.unidadTiempo.nombre}` },
    { title: 'btn_new', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar'] }
  ];

  public displayModal: boolean = false;
  public type: string = 'Nuevo'

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private committeeService: CommitteeService,
    private breadcrumbService: AppBreadcrumbService,
    private helperService: HelpersServiceImp
  ) {
    this.route.params.subscribe(params => (this.id = params['id']));
    this.endPointElements += this.id;

    if (this.id) this.type = "Editar";
    
    // Obtener la ruta actual
    const currentPath = this.router.url;
    console.log(currentPath);
    // Configurar el breadcrumb con la ruta actual

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: [currentPath] }
    ]);
  }


  ngOnInit(): void {
    this.loadForm()
    if (this.id) this.loadData(this.id);
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      id: [this.id],
      code: [null, Validators.required],
      name: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [null, Validators.required],
      description: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
    })
  }

  loadData(id: Number) {
    this.committeeService.findID(id).subscribe(
      (res: any) => {
        console.log(res);
        this.frm.patchValue({
          code: res.data.code,
          name: res.data.name,
          startDate: new Date(res.data.startDate),
          endDate: new Date(res.data.endDate),
          status: res.data.status,
          description: res.data.description,
        })
      })
  }

  runActions(event: RegistroData) {
    if (event.action == 'btn_editar') {
      this.idEdit = event.data.id;
      this.displayModal = true;
    } else if (event.action == 'btn_eliminar') {
      this.delete(event.data.id)
    } else {
      this.displayModal = true;
    }
  }

  delete(id: Number): void {
    this.helperService.showConfirmationDelete()
      .then((confirmed: boolean) => {
        if (confirmed) {
          this.committeeService.delete(id).subscribe(
            (resp: any) => {
              this.helperService.showAlert('success', resp.mensaje);
              this.table?.loadTable(0);
            }
          );
        }
      })
      .catch((error: any) => {
        console.error('Error al mostrar el cuadro de confirmación:', error);
      });
  }

  closeModal(event: boolean) {
    this.displayModal = false;
    this.idEdit = null;
    if (event) {
      this.table?.loadTable(0);
    }
  }

  navigateToList() {
    this.router.navigateByUrl('/main/administration/committee')
  }

  save(): void | boolean {
    this.frm.markAllAsTouched(); 
    if (this.frm.invalid) {
      return false
    }
    const data: CommitteeModel = new CommitteeModel(
      this.frm.getRawValue()
    );
    console.log(data);
    if (this.id) {
      this.committeeService.update(this.id, data).subscribe(
        (resp: any) => {
          console.log(resp);
          this.helperService.showAlert('success', resp.message);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.committeeService.save(data).subscribe(
        (resp: any) => {
          console.log(resp);
          this.helperService.showAlert('success', resp.message);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
