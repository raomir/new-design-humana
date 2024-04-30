import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MessageModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule
  ]
})
export class ValidationMessageComponent {

  @Input() control: FormControl | any = new FormControl({});

  get errorMessage(): any {
    if (this.control.errors) {
      for (const errorKey in this.control.errors) {
        if (this.control.errors.hasOwnProperty(errorKey) && this.control.touched) {
          return this.getErrorMessage(errorKey, this.control.errors[errorKey]);
        }
      }
    }
    return null;
  }

  private getErrorMessage(errorKey: string, errorValue: any): string | any {
    const messages: { [key: string]: string } = {
      required: 'El campo es obligatorio',
      minlength: `El mínimo de caracteres permitido es ${errorValue.requiredLength}`,
      maxlength: `El máximo de caracteres permitido es ${errorValue.requiredLength}`,
      max: `El campo no debe ser mayor a ${errorValue.max}`,
      invalidDescription: 'La descripción debe contener al menos dos palabras.'
      // Otros mensajes de error según necesidad
    };
    return messages[errorKey];
  }

  public hasErrors() {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched);
  }

}
