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
    ButtonsGeneralComponent
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
        this.frm.patchValue({
          date: new Date(res.data.date),
          employee: res.data.employee.typeNumberNameLastName,
          bonding: res.data.bonding.charge,
          injury: res.data.injury,
          usedItem: res.data.usedItem,
          description: res.data.description,
          inCharge: res.data.inCharge.typeNumberNameLastName,
        })
      })
  }

  navigateToList() {
    this.router.navigateByUrl('/main/management/first-aid')
  }

  save(): void | boolean{
    this.frm.markAllAsTouched();
    if (this.frm.invalid) { return false }
   ;
    const data: FirstAidModelRequest =  {
      date: this.helperService.getDateAString(this.frm.get('date')?.value, '-'),
      employee: 51759,
      bonding: 61,
      injury: this.frm.get('injury')?.value,
      usedItem: this.frm.get('usedItem')?.value,
      description: this.frm.get('description')?.value,
      inCharge: 51764
    }
    console.log(data);
    if (this.id) {
      this.firstAidService.update(this.id, data).subscribe(
        (resp: any) => {
          console.log(resp);
          this.helperService.showAlert('success', resp.message);
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.firstAidService.save(data).subscribe(
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
