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
  imports: [CommonModule, HeaderCardComponent, TableGeneralComponent, ButtonsGeneralComponent],
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
    //* Obtener la ruta actual
    const currentPath = this.router.url;

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: this.titleHeader, routerLink: [currentPath] },
    ])
    this.columns = this.retornaColumnas();
    this.loading = false;
  }
  ngOnInit(): void {

  }

  //! Accion Nuevo
  actionNew() {
    this.router.navigate(['/main/management/first-aid/new']);
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
        searchable: false,
        width: '10%'
      },
      {
        title: 'Paciente',
        data: 'employee',
        render: (data: any) => {
          return data?.typeNumberNameLastName;
        },
        sort: 'employee.name1',
        orderable: true,
        searchable: false,
        width: '20%'
      },
      {
        title: 'Cargo',
        data: 'bonding',
        render: (data: any) => {
          return data?.charge;
        },
        searchable: false,
        sort: 'bonding.charge',
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
        searchable: false,
        sort: 'inCharge.name1',
        width: '20%'
      },
      {
        title: 'Elementos usados',
        data: 'usedItem',
        searchable: true,
        sort: 'usedItem',
        width: '20%'
      },
      {
        title: 'Descripción',
        data: 'description',
        sort: 'description',
        searchable: true,
        orderable: true,
        width: '20%'
      },
      {
        title: 'Acciones',
        data: '',
        width: '10%',
        classTitle: 'text-center no-pointer',
        actions: ['btn_eliminar', 'btn_ver', 'btn_editar'],
        orderable: false,
        searchable: false
      },
    ];
  }

  runActions(event: RegistroData) {
    switch (event.action) {
      case 'btn_editar':
        this.router.navigateByUrl(`/main/management/first-aid/edit/${event.data.id}`);
        break;
      case 'btn_eliminar':
        this.helperService.showConfirmationDelete()
          .then((confirmed: boolean) => {
            if (confirmed) {
              this.firstAidService.delete(event.data.id).subscribe(
                (resp: any) => {
                  this.helperService.showAlert('success', resp.message);
                  this.dataTable?.loadTable(0);
                }
              );
            }
          })
          .catch((error: any) => {
            console.error('Error al mostrar el cuadro de confirmación:', error);
          });
        break;

      case 'btn_ver':
        this.router.navigateByUrl(`/main/management/first-aid/show/${event.data.id}`);
        break;
      default:
        break;
    }
  }


  exportAction(event: any) {
    console.log(event);
  }
}
