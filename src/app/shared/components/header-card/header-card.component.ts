import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppBreadcrumbService } from '../../../ssgt/parameter/infraestructure/adapter/primary/root/breadcrumb/app.breadcrumb.service';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';

@Component({
  selector: 'app-header-card',
  templateUrl: './header-card.component.html',
  standalone: true,
  imports: [
    ButtonsGeneralComponent
  ]
})
export class HeaderCardComponent {

  @Input() title: string = '';
  @Input() buttons: Array<string> = [];

  @Output() actionNew = new EventEmitter<void>();
  @Output() actionPrint = new EventEmitter<void>();

}
