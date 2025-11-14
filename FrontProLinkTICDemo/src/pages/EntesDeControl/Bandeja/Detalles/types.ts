export interface InfoGeneral {
  id: number
  asignaciones: Asignaciones[]
  informacionRemitente: InformacionRemitente
  informacionGeneral: InformacionGeneral
  informacionAfectado: InformacionAfectado
  informacionContacto: InformacionContacto
  informacionSolicitud: InformacionSolicitud
  numeroDevoluciones: number
  nroRadicado: string
  nodeID: string
  clonado: boolean
  estado: Estado
  fechaRadicacion: string
  detalleSolicitud: string
  consolidadorId: number
  tiempoAsignado: string
  tiempoPorVencer: string
}

export interface Asignaciones {
  idAsignacion: number
  motivoAsignacion: string
  idEstado: number
  estado: string
  fechaAsignacion: string
  idEC: number
  idAsignador: number
  idGestionador: number
  idRevisor: number
  idAprobador: number
  motivoRechazo: string
  fechaRespuesta: string
  unidadTiempo: string
  valorTiempo: number
  motivoReasignacion: string
}
export interface InformacionRemitente {
  tipoRemitente: string
  tipoDocumentoRemitente: string
  numeroDocumentoremitente: string
  nombreRemitente: string
}

export interface InformacionGeneral {
  numeroRadicado: string
  tipoSolicitud: string
  afectado: string
  colaborador: string
  fechaVencimiento: any
}
export interface InformacionAfectado {
  tipoDocumentoAfectado: string
  numeroDocumentoAfectado: string
  nombresAfectado: string
  perteneceLGBT:  string
  sexo: string
  condicionEspecial: string
}

export interface InformacionContacto {
  email: string
  telefonoCelular: string
  telefonoFijo: string
  paisContacto: string
  departamentoContacto: string
  municipioContacto: string
  direccionContacto: string
  medioRepuesta: string
}

export interface InformacionSolicitud {
  tipoSolicitud: string
  detalle: string
  producto: string
  observaciones: string
}

export interface Estado {
  id: number
  etapa: string
  estado: string
}

export enum AccionesDocumentos {
  AGREGAR_DOCS = 'AGREGAR_DOCS',
  ELIMINAR_DOCS = 'ELIMINAR_DOCS'
}

export enum AccionesDocumentosClonacion {
  EDITAR = 'editar',
  ADJUNTAR = 'adjuntar'
}

//-----------------------------

export interface FiltroAsignacionI {
    dependencia: DependenciaI
    id: number;
    nombre: string;
}

interface ModuloI {
  id: number;
  nombre: string;
}

interface AditionalInUserI {
  unidadTiempo?: string;
  valorTiempo?: string;
  unidadTiempoRefs: any;
  valorTiempoRefs: any;
  cargo?: string;
  label?: string;
}

export interface UserRelationI {
  id: number;
  usuario: string;
  seccionSubSeccion: SeccionSubSeccionI;
  oficina: OficinaI;
  puntoRadicacion: PuntoRadicacionI;
  rol: RolI;
}

interface SeccionSubSeccionI {
  idSeccionSubSeccion: number;
  idversiontrd: VersionTRDI;
  nombre: string;
  padre: string;
  codigo: string;
  estado: boolean;
  observacion: string;
  idNodeAlfresco: string;
  idAlfresco: string;
}

interface VersionTRDI {
  id: number;
  codigo: string;
  nombreVersion: string;
  fechaInicio: Date;
  fechaFin: Date;
  observaciones: string;
  estado: number;
  fechaVersion: Date;
  id_fondo: number;
}

export interface OficinaI {
  id: number;
  nombre: string;
  dependencia: DependenciaI;
}

export interface DependenciaI {
  idSeccionSubSeccionI: number;
  idversiontrd: VersionTRDI;
  nombre: string;
  padre: string;
  codigo: string;
  estado: boolean;
  observacion: string;
  idNodeAlfresco: string;
  idAlfresco: string;
}

interface PuntoRadicacionI {
  id: number;
  oficinaId: OficinaI;
  nombrePunto: string;
  pais: string;
  departamento: string;
  municipio: string;
  activo: boolean;
  codCentroCosto: number;
  puntoRadicacion: boolean;
  id_dependencia: DependenciaI;
}

interface RolI {
  id: number;
  nombre: string;
  idBonita: number;
  idGrupoBonita: number;
  idKeycloak: string;
}

export interface UserByRolAndIdOfficinaI extends AditionalInUserI {
  id: number;
  userName: string;
  firstname: string;
  lastname: string;
  enabled: boolean;
  cargo: string;
  bonitaId: string;
  email: string;
  numeroDocumento: string;
  modulo: ModuloI;
  usuarioRelaciones: UserRelationI[];
}
