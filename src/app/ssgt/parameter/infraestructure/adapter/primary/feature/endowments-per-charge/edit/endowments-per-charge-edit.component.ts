import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { TableGeneralComponent } from '../../../../../../../../shared/components/table-general/table-general.component';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EndowmentsPerChargeService } from '../../../../../../core/application/endowments-per-charge/endowments-per-charge.service';
import { ChargeModel } from '../../../../../../core/domain/endowments-per-charge/charge.model';
import { TabViewModule } from 'primeng/tabview';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { RegistroData } from '../../../../../../../../shared/components/buttons-general/actions';
import { EndowmentsPerChargeModalComponent } from '../modal/endowments-per-charge-modal.component';
import { ButtonsGeneralComponent } from '../../../../../../../../shared/components/buttons-general/buttons-general.component';

@Component({
  selector: 'app-endowments-per-charge-edit',
  standalone: true,
  imports: [
    CommonModule,
    TableGeneralComponent,
    HeaderCardComponent,
    TabViewModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    EndowmentsPerChargeModalComponent,
    ButtonsGeneralComponent
  ],
  templateUrl: './endowments-per-charge-edit.component.html'
})
export class EndowmentsPerChargeEditComponent implements OnInit {

  @ViewChild('table') table?: TableGeneralComponent;

  public title: string = 'Dotaciones por cargo';
  public frm!: FormGroup;
  public id?: Number;

  public idEdit: Number | null = null;
  public tabActive: number = 0;

  public endPointElements: string = 'dotacioncargo/';

  public columnsTable: any[] = [
    { title: 'Código', data: 'producto.codigo_unspsc', sort: 'producto.codigo_unspsc', render: (data: any, row: any) => row.producto.codigoUnspsc },
    { title: 'Nombre del elemento', data: 'producto.nombre', sort: 'producto.nombre', render: (data: any, row: any) => row.producto.nombre },
    { title: 'Cantidad', data: 'cantidad', sort: 'cantidad', classTitle: 'text-right', classCode: 'text-right' },
    { title: 'Frecuencia', data: 'frecuencia', sort: 'frecuencia', render: (data: any, row: any) => `${data} ${row.unidadTiempo.nombre}` },
    { title: 'btn_new', data: 'id', classTitle: 'text-center', actions: ['btn_editar', 'btn_eliminar'] }
  ];

  public displayModal: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private endowmentsPerChargeService: EndowmentsPerChargeService,
    private breadcrumbService: AppBreadcrumbService,
    private helperService: HelpersServiceImp
  ) {
    this.route.params.subscribe(params => (this.id = params['id']));
    this.endPointElements += this.id;
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: ['/main/administration/endowments-per-charge'] },
      { label: 'Editar' },
    ])
  }


  ngOnInit(): void {
    this.loadForm()
    if (this.id) this.loadData(this.id);
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      codigo: [null],
      cargo: [null],
      descripcion: [null],
    })
  }

  loadData(id: Number) {
    this.endowmentsPerChargeService.findChargeById(id).subscribe(
      (res: ChargeModel) => {
        this.frm.patchValue({
          codigo: res.codigo,
          cargo: res.cargo_nivel_grado,
          descripcion: res.descripcion,
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
          this.endowmentsPerChargeService.delete(id).subscribe(
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
    this.router.navigateByUrl('/main/administration/endowments-per-charge')
  }

}
