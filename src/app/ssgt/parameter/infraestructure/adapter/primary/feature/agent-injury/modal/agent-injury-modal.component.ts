import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalGeneralComponent } from '../../../../../../../../shared/components/modal-general/modal-general.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HelpersServiceImp } from '../../../../../../../../shared/core/application/config/helpers.service.imp';
import { ListService } from 'src/app/shared/core/application/list.service';
import { ValidationMessageComponent } from '../../../../../../../../shared/components/validation-message/validation-message.component';
import { DropdownModule } from 'primeng/dropdown';
import { AgentInjuryService } from '../../../../../../core/application/agent-injury/agent-injury.service';
import { AgentInjuryModelResponse, AgentInjuryModelRequest } from '../../../../../../core/domain/agent-injury/agent-injury.model';

@Component({
  selector: 'agent-injury-modal',
  standalone: true,
  imports: [CommonModule,
    ModalGeneralComponent,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputSwitchModule,
    DropdownModule,
    ValidationMessageComponent
  ],
  templateUrl: './agent-injury-modal.component.html',
  styles: [
  ]
})
export class AgentInjuryModalComponent implements OnInit {

  @Output() modalResponse = new EventEmitter<boolean>();
  @Input() displayModal: boolean = false;
  @Input() listName: string = '';
  @Input() id?: Number;
  public title: string = '';
  public isLoading: boolean = false;
  public frm!: FormGroup;
  public dangersList: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private helperService: HelpersServiceImp,
    private agentInjuryService: AgentInjuryService
  ) {

  }

  ngOnInit(): void {
    this.isLoading = true
    this.loadForm()
    if (this.id) {
      this.title = 'Editar: ' + this.listName;
      this.loadData(this.id);
    } else {
      this.isLoading = false
      this.title = 'Nuevo: ' + this.listName;
    }
  }


  loadForm() {
    this.frm = this.formBuilder.group({
      active: [true],
      code: [null, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ])],
      name: [null, Validators.compose([
        Validators.maxLength(150),
        Validators.minLength(3),
        Validators.required
      ])],
      dangersList: [null, Validators.required],
      description: [null, [
        Validators.maxLength(150),
        Validators.minLength(8),
        this.helperService.validateDescription.bind(this.helperService),
        Validators.required
      ]]
    })
    this.dataList();
  }

  dataList() {
    this.listService.getHazardClassList().subscribe(resp => {
      this.dangersList = resp;
      this.isLoading = false;
    })
  }



  loadData(id: Number) {
    this.agentInjuryService.findId(id).subscribe(
      (res: AgentInjuryModelResponse | any) => {
        this.frm.patchValue({
          active: res.data.active === 1,
          code: res.data.code,
          name: res.data.name,
          description: res.data.description,
          dangersList: res.data.dangersList.id
        })
      }
    )
  }

  save(): void {
    const data: AgentInjuryModelRequest = {
      code: this.frm.value.code,
      name: this.frm.value.name,
      description: this.frm.value.description,
      active: this.helperService.getSwitch(this.frm.value.active, false),
      dangerId: this.frm.value.dangersList 
    };
    if (this.id) {
      this.agentInjuryService.update(this.id, data).subscribe(
        (res: any) => {
          this.helperService.showAlert('success', 'Registro actualizado exitosamente!');
          this.modalResponse.emit(true)
        },
        error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        },
      )
    } else {
      this.agentInjuryService.save(data).subscribe(
        (res: any) => {
          this.helperService.showAlert('success', 'Registro creado exitosamente!');
          this.modalResponse.emit(true)
        },
        error => {
          this.helperService.showAlert('info', error.error.message);
          this.modalResponse.emit(false)
        }
      )
    }
  }


  closeModal(event: boolean) {
    if (event) {
      this.frm.markAllAsTouched();
      if (this.frm.valid) {
        this.save();
      }
    } else {
      this.modalResponse.emit(false)
    }
  }
}
