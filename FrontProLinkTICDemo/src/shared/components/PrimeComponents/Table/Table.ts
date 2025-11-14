
export interface Column {
  field: string | funct;
  header: string;
  type: datatype;
  row?: string,
  format?: string;
  filter?: string | FilterColumn;
  width?: string;
  classCss?: string;
  replaceValue?: funct;
  event?: ParamsDinamic;
  tooltip?: string;
  getTooltip?: funct;
  sort?: boolean;
  actions?: Actions[];
  name?: string;
  toggleTrue?: string | number;
  toggleFalse?: string |number;
  eventToggle?: (rowData: any) => void;
  // customTemplate?: TemplateRef<any>;
  eventCheck?: (rowData: any) => void;
}
export interface Actions {
  eventbtn?: (id: any) => void;
  icon?: string;
  iconRight?: string;
  name?:string
  color?:string
  label?:string
  style?:string
  isVisible?: (id: any) => void;
}

export interface Collection<T> {
  column: Column[],
  resource?: Array<any>,
  actions?: events;
  filter?: string[];
  // dataSource?: TablePaginator<T>,
  select?: SelectRows;
  eventbtn?: funct
}

export interface FilterColumn {
  type: filterType,
  display: string, //display for defecto debe ser menu
  field: string,
  format?: string
}

type filterType = "text" | "number" | "date"

export interface funct {
  (event): void | string;
}

export interface functEvent {
  (): void;
}
// export interface TablePaginator<T> {
//   (params: IGeneric): Observable<T>;
// }

export interface SelectRows {
  (params: IGeneric[]): void;
}

interface ParamsDinamic {
  (params: IGeneric): any;
}
export interface events {
  edit?: funct;
  view?: funct;
  delete?: funct;
  print?: funct;
  download?: funct;
  assign?: funct;
  removeAssing?: funct;
}


export interface IGeneric {
  [x: string]: string | number | Date | undefined | boolean | IGeneric | IGeneric[];

}

export interface Paginator {
  Total: number;
  IndicePagina: number;
  CantidadPorPagina: number;
  TotalDePaginas: number;
}

export interface LayoutPaginate {
  label: number;
  value: number;

}


export interface IFilterCollections {
  [x: string]: IGeneric[];
}

type actions = "crear" | 'editar' | 'eliminar';
export type datatype = "string" | "number" | 'date' | "state" | 'currency' | 'icon' | 'template' | 'boolean';

// export interface ExportColumn {
//   title: string;
//   dataKey: string;
// }
// export interface ExportState {
//   key: string;
//   value: boolean;
// }
// export interface Export {
//   key: string;
//   value: string;
// }
