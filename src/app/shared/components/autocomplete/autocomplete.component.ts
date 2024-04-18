import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteOnSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { AutocompleteService } from '../../core/application/autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    AutoCompleteModule
  ]
})
export class AutocompleteComponent {

  @Input() placeholder: string = '';
  @Input() advanced: boolean = false;
  @Input() endPoint: string = '';
  @Input() usePostRequest: boolean = false;
  @Input() params: any = {};
  @Input() inputModel: any;

  @Output() openAdvanced = new EventEmitter<boolean>();
  @Output() itemSelected = new EventEmitter<any>();
  @Output() clearSelectedItem = new EventEmitter<any>();
  
  public suggestions: Array<any> = [];

  constructor(private autocompleteService: AutocompleteService) { }

  async search(event: AutoCompleteCompleteEvent) {
    if (event.query.length < 3) return;

    if (this.usePostRequest) {
      const data = {
        ...this.params,
        draw: 1,
        length: 10,
        start: 0,
        todoJunto: event.query
      }
      await this.autocompleteService.searchByPost(this.endPoint, data).subscribe({
        next: async res => {
          this.suggestions = await res.content.map((e: any) => {
            e.valor_montar = e.codigo + ' - ' + e.nombre
            return e;
          });
        },
        error: err => {
          this.suggestions = [];
        }
      })
    } else {
      this.autocompleteService.searchByGet(this.endPoint, event.query).subscribe({
        next: async res => { // pendiente verificar la respuesta
          this.suggestions = await res.content.map((e: any) => {
            e.valor_montar = e.codigo + ' - ' + e.nombre
            return e;
          });
        },
        error: err => {
          this.suggestions = [];
        }
      })
    }
  }

  selectItem(event: AutoCompleteOnSelectEvent) {
    this.itemSelected.emit(event.value)
  }

}
