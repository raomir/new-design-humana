import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog'
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule,
    ButtonsGeneralComponent
  ]
})
export class ModalGeneralComponent {

  @Input() displayModal: boolean = false;
  @Input() title: string = '';
  @Input() sizeLimitTitle: number = 40;
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];

  @Output() closeModal = new EventEmitter<boolean>();

  public cutTitle = false;
  public newTitle = '';

  ngOnInit(): void {
    if (this.title.length >= this.sizeLimitTitle) {
      this.cutTitle = true;
      this.newTitle = this.title.substring(0, this.sizeLimitTitle) + '...';
    }
  }

  hideModal() {
    this.displayModal = false
    this.closeModal.emit(false)
  }

}
