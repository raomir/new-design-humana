import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalGeneralComponent } from '../../modal-general/modal-general.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../core/application/config/helpers.service.imp';
import { ListService } from '../../../core/application/list.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-list-modal',
  templateUrl: './element-list-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ModalGeneralComponent,
    InputSwitchModule,
    DropdownModule
  ]
})
export class ElementListModalComponent {

  @Input() listName: string = '';
  @Input() id: Number | null = null;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() buttons: Array<string> = ['btn_save', 'btn_cancel'];
  @Input() addTypeInjuryAgent: boolean = false;
  @Input() addWorth: boolean = false;

  @Output() modalResponse = new EventEmitter<boolean>();

  public title: string = '';

  public frm!: FormGroup;
  public tipoPeligro : Array<any> = [];
  public labelDescription: string = 'Descripción';

  public codePatterns = { '0': { pattern: new RegExp('[a-zA-Z0-9-]') } }

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
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
    if (this.addWorth) {
      this.labelDescription = 'Significado'
    }
    if (this.addTypeInjuryAgent) {
      this.listService.getHazardClassList().subscribe(resp => {
        this.tipoPeligro = resp;
      })
      this.frm.addControl('tipoPeligro', new FormControl(null, Validators.required))
    }
    if (this.addWorth) {
      this.frm.addControl('valor', new FormControl(null, Validators.required))
    }
  }

  loadData(id: Number) {
    this.listService.findById(id, this.endPoint).subscribe({
      next: resp => {
        this.frm.patchValue({
          activo: resp.activo === 1,
          favorito: resp.favorito === 1,
          codigo: resp.codigo,
          nombre: resp.nombre,
          descripcion: resp.descripcion
        })
        if (this.addTypeInjuryAgent) {
          this.frm.get('tipoPeligro')?.setValue(resp.listaPeligro);
        }
        if (this.addWorth) {
          this.frm.get('valor')?.setValue(resp.metadatos?.valor);
        }
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
    const data: any = {
      codigo: this.frm.value.codigo,
      nombre: this.frm.value.nombre,
      descripcion: this.frm.value.descripcion,
      favorito: this.frm.value.favorito ? 1 : 2,
      activo: this.frm.value.activo ? 1 : 2
    }
    if (this.addTypeInjuryAgent) {
      data.listaPeligro = { id: this.frm.value.tipoPeligro.id }
    }
    if (this.addWorth) {
      data.metadatos = { valor: this.frm.value.valor}
    }
    
    if (this.id) {
      data.id = this.id
      this.listService.update(data, this.endPoint, this.id).subscribe({
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
      this.listService.save(data, this.endPoint).subscribe({
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
