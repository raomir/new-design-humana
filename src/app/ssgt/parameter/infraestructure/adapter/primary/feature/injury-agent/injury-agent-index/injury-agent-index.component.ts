import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbService } from '../../../root/breadcrumb/app.breadcrumb.service';
import { HeaderCardComponent } from '../../../../../../../../shared/components/header-card/header-card.component';

@Component({
  selector: 'app-injury-agent-index',
  standalone: true,
  imports: [CommonModule, HeaderCardComponent],
  templateUrl: './injury-agent-index.component.html',
  styles: [
  ]
})
export class InjuryAgentIndexComponent {

  public buttonsGenerals: any[] = ["btn_print","btn_new"];
  colums: { field: string; header: string; }[];

  constructor(
    private breadcrumbService: AppBreadcrumbService
  ) {

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/'] },
      { label: 'Agentes De Lesión', routerLink: ['/administration/injury-agent'] },
    ])

    this.colums = [
      { field: 'code', header: 'Código' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' },
      { field: 'active', header: 'Activo' },
    ];
  }

  //* Accion Nuevo 
  actionNew() {
  }

 //* Accion Imprimir
  actionPrint(event: any) {

  }

  
}
