import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-card',
  templateUrl: './header-card.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ButtonsGeneralComponent
  ]
})
export class HeaderCardComponent {

  @Input() title: string = '';
  @Input() buttons: Array<string> = [];
  @Input() typeComponent: string = 'Listado';
  @Input() divider: boolean = false;

  @Output() actionNew = new EventEmitter<void>();
  @Output() actionPrint = new EventEmitter<void>();

}
