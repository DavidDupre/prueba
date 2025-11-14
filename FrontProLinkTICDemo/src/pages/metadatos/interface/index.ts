
interface Metadato {
  id: number;
  nombre: string;
  tipoDato: {
    id: number;
    nombre: string;
  };
  descripcion: string;
  tamanio: number;
  listaRelacional: boolean;
  nombreRelacional: string;
  estado: boolean;
  tipoTramiteCorrespondencia: null;
}

export interface ContentItem {
  metadato: Metadato;
  listadoRelacionalesMD: string;
}

interface ElementoListaRelMD {
  listaRelacional: boolean;
  nombreRelacional: string;
  listadoOpciones: Opcion[] | [];
  estado: boolean;
}

export interface Opcion {
  opcion: string;
  predeterminado: boolean;
}



export interface ContentItemEdit {
  metadato: Metadato;
  listadoRelacionalesMD: listaDesplegableEdit[];
}

export interface listaDesplegableEdit {
  elementoListaRelMD:ElementoListaRelMD;
}



interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ResponseDataListadoMetadatos {
  content: ContentItem[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ResponseListadotipoDato {
  id: number;
  nombre: string;
}

export interface ResponseDataListadoTipoTramite {
  id: number;
  nombre: string;
}
