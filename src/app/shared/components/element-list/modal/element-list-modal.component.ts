import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalGeneralComponent } from '../../modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { List } from '../../../core/domain/list.model';
import { ListRepositoryService } from '../../../infraestructure/adapter/secondary/list-repository.service';
import { HelpersServiceImp } from '../../../core/application/config/helpers.service.imp';

@Component({
  selector: 'app-element-list-modal',
  templateUrl: './element-list-modal.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ModalGeneralComponent,
    InputSwitchModule,
  ]
})
export class ElementListModalComponent {

  @Input() listName: string = '';
  @Input() id: Number | null = null;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];

  @Output() modalResponse = new EventEmitter<boolean>();

  public title: string = '';

  public frm!: FormGroup;

  public codePatterns = { '0': { pattern: new RegExp('[a-zA-Z0-9-]') } }

  constructor(
    private formBuilder: FormBuilder,
    private listRepositoryService: ListRepositoryService,
    private helperService: HelpersServiceImp
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData(this.id);
    } else {
      this.title = 'Nuevo: ' + this.listName;
    }
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      activo: [true],
      codigo: [null, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])],
      nombre: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      descripcion: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      favorito: [false],
    })
  }

  loadData(id: Number) {
    this.listRepositoryService.findById(id, this.endPoint).subscribe({
      next: resp => {
        this.frm.patchValue({
          activo: resp.activo === 1,
          favorito: resp.favorito === 1,
          codigo: resp.codigo,
          nombre: resp.nombre,
          descripcion: resp.descripcion
        })
      },
      error: error => {

      }
    })
  }

  closeModal(event: boolean) {
    if (event) {
      if (this.frm.valid) {
        this.save();
      } else {
      }
    } else {
      this.modalResponse.emit(false)
    }
  }

  async save(): Promise<void> {
    const data = {
      codigo: this.frm.value.codigo,
      nombre: this.frm.value.nombre,
      descripcion: this.frm.value.descripcion,
      favorito: this.frm.value.favorito ? 1 : 2,
      activo: this.frm.value.activo ? 1 : 2
    }

    if (this.id) {
      this.listRepositoryService.update(data, this.endPoint, this.id).subscribe({
        next: resp => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          console.log(error)
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    } else {
      this.listRepositoryService.save(data, this.endPoint).subscribe({
        next: resp => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          console.log(error)
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    }
  }

}
