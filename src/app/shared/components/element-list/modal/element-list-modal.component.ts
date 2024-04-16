import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalGeneralComponent } from '../../modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { List } from '../../../core/domain/list.model';
import { ListRepositoryService } from '../../../infraestructure/adapter/secondary/list-repository.service';

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
  @Input() listTypeId: Number = 0;
  @Input() id: number | null = null;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];

  @Output() modalResponse = new EventEmitter<boolean>();

  public title: string = '';

  public frm!: FormGroup;

  public codePatterns = { '0': { pattern: new RegExp('[a-zA-Z0-9-]') } }

  constructor(
    private formBuilder: FormBuilder,
    private _listRepositoryService: ListRepositoryService
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData();
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
      favorito: [true],
    })
  }

  async loadData() {
    /* this.frm.patchValue({
      codigo: resp.codigo,
      nombre: resp.nombre,
      descripcion: resp.descripcion
    }) */
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
      codigo: this.frm.value.code,
      nombre: this.frm.value.name,
      descripcion: this.frm.value.description,
      prvTipoListaId: this.listTypeId,
      favorito: this.frm.value.favorito ? 1 : 2,
      activo: this.frm.value.activo ? 1 : 2
    }

    if (this.id) {

      this._listRepositoryService.update(data, this.endPoint, this.id).subscribe({
        next: resp => {
          console.log(resp)
        },
        error: error => {
          console.log(error)
        },
      })
    } else {
      this._listRepositoryService.save(data, this.endPoint).subscribe(
        res => {

        },
        error => {

        }
      )
    }
    this.modalResponse.emit(true)
  }

}
