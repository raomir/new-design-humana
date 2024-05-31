import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGeneralComponent } from 'src/app/shared/components/table-general/table-general.component';
import { ButtonsGeneralComponent } from 'src/app/shared/components/buttons-general/buttons-general.component';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { Column } from 'src/app/shared/components/table-general/col/col';
import { RegistroData } from 'src/app/shared/components/buttons-general/actions';
import { HelpersServiceImp } from 'src/app/shared/core/application/config/helpers.service.imp';
import { AgentInjuryRepositoryService } from '../../../../secondary/agent-injury/agent-injury-repository.service';
import { AgentInjuryModelResponse } from 'src/app/ssgt/parameter/core/domain/agent-injury/agent-injury.model';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';
import { AgentInjuryModalComponent } from '../modal/agent-injury-modal.component';
import { ColumnConfig } from './column-config';

@Component({
  selector: 'app-agent-injury-index',
  standalone: true,
  imports: [CommonModule,
    TableGeneralComponent,
    ButtonsGeneralComponent,
    HeaderCardComponent,
    AgentInjuryModalComponent
  ],
  templateUrl: './agent-injury-index.component.html',
  styles: [
  ]
})
export class AgentInjuryIndexComponent implements OnInit {

  @ViewChild('dataTable') dataTable?: TableGeneralComponent;
  
  //! Variables
  public columns: Array<Column> = [];
  public dataGeneral: AgentInjuryModelResponse[] = [];
  public endPoint = "v2/agentInjury/pageable";
  public loading: boolean = true;

  //! Variables del header card
  public title: string = 'Agentes De Lesión';
  public buttons: Array<string> = ['btn_print', 'btn_new'];

  //! Variables para la modal
  public displayModal: boolean = false;
  public idEdit?: Number;


  //! Constructor
  constructor(private breadcrumbService: AppBreadcrumbService, private helperService: HelpersServiceImp, private agentInjuryRepositoryService: AgentInjuryRepositoryService) {
    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Agentes De Lesión', routerLink: ['/administration/agent-injury'] },
    ])
    this.retornaColumnas();
  }

  ngOnInit() {
    
  }

  public retornaColumnas() {
    const columnConfig = new ColumnConfig(this.helperService);
    this.columns = columnConfig.getColumns();
    this.loading = false;
  }

  runActions(event: RegistroData) {
    switch (event.action) {
      case 'btn_editar':
        this.displayModal = true;
        this.idEdit = event.data.id;
        break;
      case 'btn_eliminar':
        const idDelete = event.data.id;
        this.helperService.showConfirmationDelete()
          .then((confirmed: boolean) => {
            if (confirmed) {
              this.agentInjuryRepositoryService.delete(idDelete).subscribe(
                (resp: any) => {
                  this.helperService.showAlert('success', resp.mensaje);
                  this.retornaColumnas();
                }
              );
            }
          })
          .catch((error: any) => {
            console.error('Error al mostrar el cuadro de confirmación:', error);
          });
        break;
      default:
        break;
    }
  }

  exportAction(event: any) {
    console.log(event);
  }

  create() {
    this.displayModal = true;
  }

  print(): void {
    //this.reportPreviewer?.showModalDialog();
  }

  modalResponse(event: boolean): void {
    this.displayModal = false;
    if (event) {
      this.dataTable?.loadTable(0);
    }
    this.idEdit = undefined;
  }

}
