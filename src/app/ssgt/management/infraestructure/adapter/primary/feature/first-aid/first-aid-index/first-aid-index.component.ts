import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../../../../../parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { TableGeneralComponent } from '../../../../../../../../shared/components/table-general/table-general.component';
import { Column } from '../../../../../../../../shared/components/table-general/col/col';
import { RegistroData } from '../../../../../../../../shared/components/buttons-general/actions';
import { ButtonsGeneralComponent } from '../../../../../../../../shared/components/buttons-general/buttons-general.component';
import { Router } from '@angular/router';
import { FirstAidService } from '../../../../../../core/application/first-aid/first-aid.service';

@Component({
  selector: 'app-first-aid-index',
  standalone: true,
  imports: [CommonModule, HeaderCardComponent, TableGeneralComponent,ButtonsGeneralComponent],
  templateUrl: './first-aid-index.component.html',
  styleUrls: ['./first-aid-index.component.css']
})
export class FirstAidIndexComponent implements OnInit {

  @ViewChild('dataTable') dataTable?: TableGeneralComponent;

  //! Variables Cabecera
  public buttonsGenerals: any[] = ["btn_print", "btn_new"]
  public titleHeader: string = 'Primeros Auxilios'

  //! Variables Tabla
  public columns: Array<Column>;
  public loading: boolean = true;
  public endPoint = "v2/firstAid/pageable";


  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private helperService: HelpersServiceImp,
    private firstAidService: FirstAidService,
    private router: Router) {
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Primeros Auxilios', routerLink: ['/administration/first-aid'] },
    ])
    this.columns = this.retornaColumnas();
    this.loading = false;
  }
  ngOnInit(): void {
    
  }

  //! Accion Nuevo
  actionNew() {
      this.router.navigate(['/main/administration/first-aid/new-first-aid']);
   }

  //! Accion Imprimir
  actionPrint(event: any) { }

  public retornaColumnas(): Array<Column> {
    return [
      {
        title: 'Fecha',
        data: 'date',
        render: (data: any) => {
          return data[2] + '/' + data[1] + '/' + data[0];
        },
        sort: 'date',
        width: '10%'
      },
      {
        title: 'Paciente',
        data: 'employee',
        render: (data: any) => {
          return data?.typeNumberNameLastName;
        },
        sort: 'employee',
        width: '20%'
      },
      {
        title: 'Cargo',
        data: 'bonding',
        render: (data: any) => {
          return data?.charge;
        },
        sort: 'inCharge.typeNumberNameLastName',
        width: '10%',
      },
      {
        title: 'Lesion',
        data: 'injury',
        sort: 'injury',
        width: '10%',
      },
      {
        title: 'Encargado de primeros auxilios',
        data: 'inCharge',
        render: (data: any) => {
          return data?.typeNumberNameLastName;
        },
        sort: 'inCharge',
        width: '20%'
      },
      {
        title: 'Elementos usados',
        data: 'usedItem',
        sort: 'usedItem',
        width: '20%'
      },
      {
        title: 'Descripción',
        data: 'description',
        sort: 'description',
        width: '20%'
      },
      {
        title: 'Acciones',
        data: '',
        sort: '',
        width: '10%',
        classTitle: 'text-center no-pointer',
        actions: ['btn_eliminar', 'btn_editar'],
      },
    ];
  }

  runActions(event: RegistroData) {
    switch (event.action) {
      case 'btn_editar':
        console.log(event.data);
        break;
      case 'btn_eliminar':
        console.log(event.data);
        break;
      default:
        break;
    }
  }


  exportAction(event: any) {
    console.log(event);
  }
}
