import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { ActivoIcon, ColumnGeneral, ItemData, TreeNodeGeneral } from './tree/tree.interface';
import { ButtonsGeneralComponent } from '../buttons-general/buttons-general.component';

@Component({
  selector: 'app-tree-table-general',
  standalone: true,
  imports: [CommonModule, TreeTableModule, ButtonModule, ButtonsGeneralComponent],
  templateUrl: './tree-table-general.component.html',
  styleUrls: ['./tree-table-general.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [
  ]
})
export class TreeTableGeneralComponent implements OnInit {

  @ViewChild('tt') treeTable: TreeTable | TreeTableModule | any;

  //Outputs
  @Output() onAction = new EventEmitter<ItemData>();
  @Output() valueSearch = new EventEmitter<string>();
  @Output() public exportAction = new EventEmitter<any>();

  //Inputs
  @Input() data?: TreeNodeGeneral[];
  @Input() cols?: ColumnGeneral[];
  @Input() buttonsDatatable?: string[];
  @Input() loading: boolean = true;
  

  constructor() { }

  ngOnInit(){
  }

  //Acciones de la botonera de la datatable
  runActions(event: any) {
    let itemData: ItemData;
    switch (event.action) {
      case 'btn_nuevo':
        break;
      case 'btn_editar':
        itemData = event.data;
        break;
      case 'btn_eliminar':
        itemData = event.data.id;
        break;
    }
    this.onAction.emit(event);
  }

  getIconClass(activoValue: number): string {
    switch (activoValue) {
      case 1:
        return ActivoIcon.check;
      case 2:
        return ActivoIcon.times;
      default:
        return '';
    }
  }

  getIconColor(activoValue: number): string {
    switch (activoValue) {
      case 1:
        return 'blue';
      case 2:
        return 'red'; 
      default:
        return '';
    }
  }

  search(event: InputEvent | any, contain = 'contains') {
    this.treeTable.filterGlobal(event.target?.value, contain);
    this.valueSearch.emit(event.target?.value);
  }
}
