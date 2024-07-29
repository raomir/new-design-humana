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
import { EndowmentsPerChargeModel } from '../../../../../../core/domain/endowments-per-charge/endowments-per-charge.model';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { AdvancedSearchFormsProdutsComponent } from '../../../../../../../../shared/components/advanced-search-forms-produts/advanced-search-forms-produts.component';
import { CommitteeService } from '../../../../../../core/application/committee/committee.service';
import { CommitteesDetailsModel } from 'src/app/ssgt/parameter/core/domain/committee/ommitteesDetails.model';

@Component({
  selector: 'app-commitee-modal',
  templateUrl: './commitee-modal.component.html',
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
    InputNumberModule,
    AdvancedSearchFormsProdutsComponent
  ],
})
export class CommiteeModalComponent implements OnInit {

  @Input() id: Number | null = null;
  @Input() committeeId?: Number;
  @Input() displayModal: boolean = false;
  @Input() endPoint: string = '';
  @Input() title: string = '';

  @Output() modalResponse = new EventEmitter<boolean>();

  public titleModal: string = '';
  public frm!: FormGroup;

  public listRolCommittees: Array<any> = [];

  // autocomplete and advanced
  public displayModalAdvanced: boolean = false;
  public employeeTxt: any;
  public endPointAutocomplete: string = 'buscadores/empleado/busquedageneral/page/0';
  public paramsAutocomplete: any = { 
    grupo: {
      tipo_clase: [43364, 43365] 
    },
    validaciones_extras: null,
    dataBusqueda: null,
    vinculacion_id: null,
    tipo_concepto: null
  } // dotación, protección

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private helperService: HelpersServiceImp,
    private committeeService: CommitteeService
  ) {

  }

  ngOnInit(): void {
    this.loadForm()
    this.loadLists()
    this.titleModal = 'Nuevo: ' + this.title;
  }

  loadForm() {
    this.frm = this.formBuilder.group({
      committee: [{id: this.committeeId}],
      rolCommittee: [null, Validators.required],
      employee: [null, Validators.required],
      position: [{id: 71}, Validators.required],
    })
  }

  loadLists() {
    this.listService.findAllByTypeListId('v2/listElementsst', 52).subscribe(
      (resp: any) => {
        this.listRolCommittees = resp.data;
      }
    );
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

  employeeSelected(info: any) {
    this.displayModalAdvanced = false;
    if (info) {
      this.employeeTxt = {
        id: info.id,
        valor_montar: info.tipoDocumento + ' - ' + info.numeroDocumento + ' - ' + info.nombre1
      }
      this.frm.controls['employee'].setValue({id: info.id});
    }
  }

  clearSelectedEmployee() {
    this.employeeTxt = null;
    this.frm.controls['employee'].setValue(null);
  }

  save(): void {

    const data: CommitteesDetailsModel = new CommitteesDetailsModel(this.frm.getRawValue());

    if (this.id) {
      this.committeeService.updateDetails(this.id, data).subscribe({
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
      this.committeeService.saveDetails(data).subscribe({
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
