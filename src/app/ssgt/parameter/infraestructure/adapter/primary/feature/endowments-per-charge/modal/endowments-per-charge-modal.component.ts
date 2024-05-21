import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ModalGeneralComponent } from '../../../../../../../../shared/components/modal-general/modal-general.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutocompleteComponent } from '../../../../../../../../shared/components/autocomplete/autocomplete.component';
import { DropdownModule } from 'primeng/dropdown';
import { List } from '../../../../../../../../shared/core/domain/list.model';
import { ListService } from '../../../../../../../../shared/core/application/list.service';
import { EndowmentsPerChargeService } from '../../../../../../core/application/endowments-per-charge/endowments-per-charge.service';
import { EndowmentsPerChargeModel } from '../../../../../../core/domain/endowments-per-charge/endowments-per-charge.model';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';

@Component({
  selector: 'app-endowments-per-charge-modal',
  templateUrl: './endowments-per-charge-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    AutocompleteComponent,
    ModalGeneralComponent,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputSwitchModule,
    DropdownModule,
    InputNumberModule
  ],
})
export class EndowmentsPerChargeModalComponent implements OnInit {

  @Input() id: Number | null = null;
  @Input() chargeId?: Number;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() title: string = '';

  @Output() modalResponse = new EventEmitter<boolean>();

  public titleModal: string = '';
  public frm!: FormGroup;

  public listTimeUnits: List[] = [];

  // autocomplete and advanced
  public displayModalAdvanced: boolean = false;
  public productTxt: any;
  public endPointAutocomplete: string = 'comproductos/autocompleta/false/false/false';
  public paramsAutocomplete: any = { tipo_clase: [43364, 43365] } // dotación, protección

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private helperService: HelpersServiceImp,
    private endowmentsPerChargeService: EndowmentsPerChargeService
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
    this.loadLists()
    if (this.id) {
      this.titleModal = 'Editar: ' + this.title;
      this.loadData(this.id);
    } else {
      this.titleModal = 'Nuevo: ' + this.title;
    }
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      activo: [true],
      producto: [null, Validators.required],
      cantidad: [null, Validators.required],
      frecuencia: [null],
      unidadTiempo: [null, Validators.required],
    })
  }

  loadLists() {
    this.listService.findAll('unidadtiempo').subscribe(res => {
      this.listTimeUnits = res.map((e) => {
        return { ...e, nombre: `${e.data.code} - ${e.data.name}` };
      });
    });
  }

  loadData(id: Number) {
    this.endowmentsPerChargeService.findById(id).subscribe(
      (res: EndowmentsPerChargeModel) => {
        this.frm.patchValue({
          cantidad: res.cantidad,
          frecuencia: res.frecuencia,
          unidadTiempo: res.unidadTiempo.data.id
        })
        this.productSelected(res.producto)
      })
  }

  closeModal(event: boolean) {
    if (event) {
      if (this.frm.valid) {
        this.save();
      }
    } else {
      this.modalResponse.emit(false)
    }
  }

  openModalAdvanced(open: boolean) {
    this.displayModalAdvanced = open;
  }

  productSelected(info: any) {
    this.displayModalAdvanced = false;
    if (info) {
      this.productTxt = {
        id: info.id,
        valor_montar: info.codigoUnspsc + ' - ' + info.nombre
      }
      this.frm.controls['producto'].setValue(info.id);
    }
  }

  clearSelectedProduct() {
    this.productTxt = null;
    this.frm.controls['producto'].setValue(null);
  }

  save(): void {
    const formData = this.frm.getRawValue()

    const data: any = {
      cargo: { id: this.chargeId },
      producto: { id: formData.producto },
      cantidad: formData.cantidad,
      frecuencia: formData.frecuencia,
      unidadTiempo: { id: formData.unidadTiempo }
    };

    if (this.id) {
      this.endowmentsPerChargeService.update(data, this.id).subscribe({
        next: (res: any) => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    } else {
      this.endowmentsPerChargeService.save(data).subscribe({
        next: (res: any) => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.modalResponse.emit(true)
        },
        error: error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      })
    }
  }
}
