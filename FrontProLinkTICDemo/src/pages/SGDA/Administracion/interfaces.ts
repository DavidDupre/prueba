export interface TableDataDocumentalsBase {
  id: number;
  idTipoDocumental: number;
  nombre: string;
  siglaIndice: string;
  codigoTipoDocumental: string,
  estados?: boolean
}


export class TableDataDocumentals implements TableDataDocumentalsBase {
  codigoTipoDocumental: string;
  nombre: string;
  siglaIndice: string;
  idTipoDocumental: number;
  estados?: boolean;
  id: number
  constructor(def?: TableDataDocumentalsBase){
    this.id = def?.id || null
    this.codigoTipoDocumental = def?.codigoTipoDocumental || '';
    this.nombre = def?.nombre || '';
    this.siglaIndice = def?.siglaIndice || '';
    this.idTipoDocumental = def?.idTipoDocumental || null;
    this.estados = def?.estados || false;
  }
}

export interface GeneralSelectorBase {
  label: string;
  value: boolean | number;
}

export class GeneralSelector implements GeneralSelectorBase {
  label: string;
  value: number | boolean;
  constructor(def?: GeneralSelectorBase){
    this.label = def?.label || '';
    this.value = def?.value || null;
  }
}

export interface FilterBase {
  codigo: string;
  codigoTipologiaDocumental: GeneralSelectorBase;
  nombre: string;
  nombreCorto: string;
  siglaIndice: string;
  descripcionIndice:string;
  tipoDocumento: string;
  estado: GeneralSelectorBase;
}

export class Filters implements FilterBase {
  codigo: string;
  codigoTipologiaDocumental: GeneralSelectorBase;
  estado: GeneralSelectorBase;
  nombre: string;
  nombreCorto: string;
  siglaIndice: string;
  descripcionIndice: string;
  tipoDocumento: string;

  constructor(def?: FilterBase){
    this.codigo = def?.codigo || '';
    this.codigoTipologiaDocumental = def?.codigoTipologiaDocumental || {label: '', value: null};
    this.nombre = def?.nombre || '';
    this.estado = def?.estado || {label: '', value: null};
    this.nombreCorto = def?.nombreCorto || '';
    this.descripcionIndice = def?.descripcionIndice || '';
    this.tipoDocumento = def?.tipoDocumento || '';
    this.siglaIndice = def?.siglaIndice || '';
  }
}

export interface PaginationBase {
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
}

export class PaginationObject implements PaginationBase {
  descending: boolean;
  page: number;
  rowsNumber: number;
  rowsPerPage: number;
  constructor(def?: PaginationBase){
    this.descending = def?.descending || false;
    this.page = def?.page || 0;
    this.rowsNumber = def?.rowsNumber || 0;
    this.rowsPerPage = def?.rowsPerPage || 0;
  }
}
