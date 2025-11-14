export const Fields = {
    dependencia:'dependencia',
    dependenciaCopia:'dependenciaCopia',
    funcionario:'funcionario',
    funcionarioCopia:'funcionarioCopia',
    tipoTramite:'tipoTramite',
    tipodocumental:'tipodocumental',
    tipoComunicacion:'tipoComunicacion',
    ocr:'ocr',
    numerofolios:'numerofolios',
    anexos: 'anexos',
    descripcionAnexos:'descripcionAnexos',
    numeroFoliosAnexos:'numeroFoliosAnexos',
    canalRecepcion: 'canalRecepcion',
    asunto:'asunto',
    radicadoEntidadRemitente:'radicadoEntidadRemitente',
    referenciarOtroRadicado:'referenciarOtroRadicado',
    fechaOriginalDocumento:'fechaOriginalDocumento',
    fechaRecepcion:'fechaRecepcion',
    horaRecepcion:'horaRecepcion',
    numeroRadicadoEntrada:'numeroRadicadoEntrada',
    tipoDocumento:'tipoDocumento',
    numeroDocumento:'numeroDocumento',
    nombres:'nombres',
    apellidos:'apellidos',
    pais:'pais',
    departamento:'departamento',
    ciudad:'ciudad',
    direccion:'direccion',
    telefono:'telefono',
    movil:'movil',
    celular:'celular',
    email:'email',
}

export interface Pais {
  idPais: number;
  nombre: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
}

export interface Municipios {
  idMunicipio: number;
  nombre: string;
}

export interface GeneralSelector {
  label: string;
  value: number;
}

export interface FilesData {
  filesProcedure : File | null;
  filesDocumental : File | null;
  filesComunication : File | null;
}

export interface FormBase {
    dependencia?: GeneralSelector;
    dependenciaCopia?: GeneralSelector;
    funcionario?: string;
    funcionarioCopia?: string;
    tipoTramite?: GeneralSelector;
    tipodocumental?: GeneralSelector;
    tipoComunicacion?: GeneralSelector;
    ocr?: boolean;
    numerofolios?: number;
    anexos?: GeneralSelector;
    descripcionAnexos?: string;
    numeroFoliosAnexos?: number;
    canalRecepcion?: GeneralSelector;
    asunto?: string;
    radicadoEntidadRemitente?: string;
    referenciarOtroRadicado?: string;
    fechaOriginalDocumento?: string;
    fechaRecepcion?: string;
    horaRecepcion?: string;
    numeroRadicadoEntrada?: string;
    tipoDocumento?: GeneralSelector;
    numeroDocumento?: string;
    nombres?: string;
    apellidos?: string;
    pais?: Pais;
    departamento?: Departamento;
    ciudad?: Municipios;
    direccion?: string;
    telefono?: number;
    movil?: number;
    celular?: number;
    email?: string;
};

export class FormCorrespondency implements FormBase {

  dependencia?: GeneralSelector;
  dependenciaCopia?: GeneralSelector;
  funcionario?: string;
  funcionarioCopia?: string;
  tipoTramite?: GeneralSelector;
  tipodocumental?: GeneralSelector;
  tipoComunicacion?: GeneralSelector;
  ocr?: boolean;
  numerofolios?: number;
  anexos?: GeneralSelector;
  descripcionAnexos?: string;
  numeroFoliosAnexos?: number;
  canalRecepcion?: GeneralSelector;
  asunto?: string;
  radicadoEntidadRemitente?: string;
  referenciarOtroRadicado?: string;
  fechaOriginalDocumento?: string;
  fechaRecepcion?: string;
  horaRecepcion?: string;
  numeroRadicadoEntrada?: string;
  tipoDocumento?: GeneralSelector;
  numeroDocumento?: string;
  nombres?: string;
  apellidos?: string;
  pais?: Pais;
  departamento?: Departamento;
  ciudad?: Municipios;
  direccion?: string;
  telefono?: number;
  movil?: number;
  celular?: number;
  email?:string;

  constructor(def?: FormBase) {

    this.dependencia= def?.dependencia || {label: '', value: null};
    this.dependenciaCopia= def?.dependenciaCopia || {label: '', value: null};
    this.funcionario=def?.funcionario || '';
    this.funcionarioCopia=def?.funcionarioCopia || '';
    this.tipoTramite=def?.tipoTramite || {label: '', value: null};
    this.tipodocumental=def?.tipodocumental || {label: '', value: null};
    this.tipoComunicacion=def?.tipoComunicacion || {label: '', value: null};
    this.ocr=def?.ocr || false;
    this.numerofolios=def?.numerofolios || 0;
    this.anexos=def?.anexos || {label: '', value: null};
    this.descripcionAnexos=def?.descripcionAnexos || '';
    this.numeroFoliosAnexos=def?.numeroFoliosAnexos || 0;
    this.canalRecepcion=def?.canalRecepcion || {label: '', value: null};
    this.asunto=def?.asunto || '';
    this.radicadoEntidadRemitente=def?.radicadoEntidadRemitente || '';
    this.referenciarOtroRadicado=def?.referenciarOtroRadicado || '';
    this.fechaOriginalDocumento=def?.fechaOriginalDocumento || '';
    this.fechaRecepcion=def?.fechaRecepcion || '';
    this.horaRecepcion=def?.horaRecepcion || '';
    this.numeroRadicadoEntrada=def?.numeroRadicadoEntrada || '';
    this.tipoDocumento=def?.tipoDocumento || {label: '', value: null};
    this.numeroDocumento=def?.numeroDocumento || '';
    this.nombres=def?.nombres || '';
    this.apellidos=def?.apellidos || '';
    this.pais=def?.pais || {idPais: null, nombre: ''};
    this.departamento=def?.departamento || {idDepartamento: 0, nombre: ''};
    this.ciudad=def?.ciudad || {idMunicipio: 0, nombre: ''};
    this.direccion=def?.direccion || '';
    this.telefono=def?.telefono  || 0;
    this.movil=def?.movil || 0;
    this.celular=def?.celular || 0;
    this.email=def?.email || '';
  }
}
