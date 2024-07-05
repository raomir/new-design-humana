import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ValidationMessageComponent } from '../../../../../../../../shared/components/validation-message/validation-message.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonsGeneralComponent } from '../../../../../../../../shared/components/buttons-general/buttons-general.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from '../../../../../../../parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { FirstAidService } from '../../../../../../core/application/first-aid/first-aid.service';
import { FirstAidModelRequest } from '../../../../../../core/domain/first-aid/first-aid.model';
import { AutocompleteComponent } from '../../../../../../../../shared/components/autocomplete/autocomplete.component';
import { DropdownModule } from 'primeng/dropdown';
import { C } from '@fullcalendar/core/internal-common';
import { AdvancedSearchEmployeComponent } from '../../../../../../../../shared/components/advanced-search-employe/advanced-search-employe.component';

@Component({
  selector: 'app-first-aid-form',
  standalone: true,
  imports: [
    CommonModule,
    HeaderCardComponent,
    ValidationMessageComponent,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonsGeneralComponent,
    AutocompleteComponent,
    DropdownModule,
    AdvancedSearchEmployeComponent
  ],
  templateUrl: './first-aid-form.component.html',
  styles: [
  ]
})
export class FirstAidFormComponent implements OnInit {

  //* Variables
  public type: string = 'Nuevo';
  public title: string = 'Primero Auxilio';
  public frm!: FormGroup;
  public id?: Number;
  public endPointElements: string = 'firstAid/'
  public selectCharge: Array<any> = [];
  public origen: string = '';

  // autocomplete and advanced
  public displayModalAdvanced: boolean = false;
  public employeeTxt: any;
  public endPointAutocomplete: string = 'v2/search/employee/general/page/0';
  public paramsAutocomplete: any = {
    grupo: {
      tipo_clase: [43364, 43365]
    },
    validaciones_extras: null,
    dataBusqueda: null,
    vinculacion_id: null,
    tipo_concepto: null
  }
  public inChargeTxt: any;
  public buttonsGeneral = ['btn_save', 'btn_cancel'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private formBuilder: FormBuilder,
    private helperService: HelpersServiceImp,
    private firstAidService: FirstAidService
  ) {
    this.route.params.subscribe(params => (this.id = params['id']));
    this.endPointElements += this.id;

    if (this.id) this.type = 'Editar';
    if (this.route.snapshot.data['view']) this.type = "Ver";

    //* Obtener la ruta actual
    const currentPath = this.router.url;

    //* Configurar el breadcrumb con la ruta actual
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.title, routerLink: [currentPath] }
    ]);
  }
  ngOnInit(): void {
    this.loadForm();
    if (this.id) this.loadData(this.id);
  }

  loadForm() {
    const DATE = new Date();
    this.frm = this.formBuilder.group({
      id: [this.id],
      date: [DATE, Validators.required],
      employee: [null, Validators.required],
      bonding: [null, Validators.required],
      injury: [null, Validators.required],
      usedItem: [null, Validators.required],
      description: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]],
      inCharge: [null, Validators.required],
    })
  }

  loadData(id: Number) {
    this.firstAidService.findID(id).subscribe(
      (res: any) => {
        this.firstAidService.findChargeByEmployeeId(res.data.employee.id).subscribe(
          (res: any) => {
            this.selectCharge = res.data;
          }
        )
        this.frm.patchValue({
          date: new Date(res.data.date),
          employee: { id: res.data.employee.id },
          bonding: res.data.bonding.id,
          injury: res.data.injury,
          usedItem: res.data.usedItem,
          description: res.data.description,
          inCharge: res.data.inCharge.id,
        })
        this.employeeTxt = {id: res.data.employee.id , valor_montar: res.data.employee.typeNumberNameLastName};
        this.inChargeTxt = {id: res.data.inCharge.id , valor_montar: res.data.inCharge.typeNumberNameLastName};
        if (this.route.snapshot.data['view']) {
          this.frm.disable();
          this.buttonsGeneral = ['btn_cancel'];
        }
      })


  }

  navigateToList() {
    this.router.navigateByUrl('/main/management/first-aid')
  }

  save(): void | boolean {
    this.frm.markAllAsTouched();
    if (this.frm.invalid) { return false }
    const data: FirstAidModelRequest = {
      date: this.convertDate(this.frm.get('date')?.value),
      employee: this.frm.get('employee')?.value.id,
      bonding: this.frm.get('bonding')?.value,
      injury: this.frm.get('injury')?.value,
      usedItem: this.frm.get('usedItem')?.value,
      description: this.frm.get('description')?.value,
      inCharge: this.frm.get('inCharge')?.value.id
    }
    if (this.id) {
      this.firstAidService.update(this.id, data).subscribe(
        (resp: any) => {
          this.helperService.showAlert('success', resp.message);
        },
        (error) => {
          this.helperService.showAlert('error', error.error.message);
        }
      );
    } else {
      this.firstAidService.save(data).subscribe(
        (resp: any) => {
          this.helperService.showAlert('success', resp.message);
        },
        (error) => {
          this.helperService.showAlert('error', error.error.message);
        }
      );
    }
  }

  openModalAdvanced(open: boolean, origen: string) {
    this.origen = origen;
    this.displayModalAdvanced = open;
  }

  //Cuando viene el buscador avanzado pone el valor del info.valor_montar 
  employeeSelected(info: any, origin: string, advance: boolean = false) {
    this.origen = '';
    this.displayModalAdvanced = false;
    if (info) {
      switch (origin) {
        case 'inCharge':
          this.inChargeTxt = {
            id: info.id,
            valor_montar:  advance ? info.valor_montar : info.fullName
          }
          this.frm.controls['inCharge'].setValue({ id: info.id });
          break;
        case 'employee':
          this.employeeTxt = {
            id: info.id,
            valor_montar:  advance ? info.valor_montar : info.fullName
          }
          this.frm.controls['employee'].setValue({ id: info.id });
          this.firstAidService.findChargeByEmployeeId(info.id).subscribe(
            (res: any) => {
              this.selectCharge = res.data;
            }
          )
          break;
      }
    }
    console.log(info)
  }

  clearSelectedEmployee(origin: string) {
    switch (origin) {
      case 'inCharge':
        this.inChargeTxt = null;
        this.frm.controls['inCharge'].setValue(null);
        break;
      case 'employee':
        this.employeeTxt = null;
        this.frm.controls['employee'].setValue(null);
        break;
    }
  }

  convertDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade ceros a la izquierda si es necesario
    const day = date.getDate().toString().padStart(2, '0'); // Añade ceros a la izquierda si es necesario
    return `${year}-${month}-${day}`;
  }
}
