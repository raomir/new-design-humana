export interface Action {
  name: string;
  classButton?: string;
  icon: string;
  data: any;
  tooltipText?: string;
}

export interface Column {
  data: string;
  value?: any;
  render?: any;
  title: string;
  sort?: string;
  dataConcat?: string[];
  logo?: boolean;
  check?: boolean;
  checkHeader?: boolean;
  actions?: Action[] | string[];
  class?: string;
  width?: string;
  widthColumn?: string;
  classTitle?: string;
  classCode?: string;
  classNames?: string;
  classStatus?: string;
  iconDatatable?: boolean;
}

export interface DatatableSort {
  sortField: string;
  sortOrder: number;
}

export class DatatableSort implements DatatableSort {
  public sortField: string = 'id';
  public sortOrder: number = 1;
}

export interface PostData {
  page: number;
  rows: number | string;
  sortField: string | any;
  sortOrder: string;
  filter: string;
}

export interface ExtendedPostData extends PostData {
  [key: string]: any;
}
