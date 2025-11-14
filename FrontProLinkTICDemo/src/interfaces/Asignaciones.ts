export interface CorrespondenciaAsignaciones {
  id: number;
  usuario: Asignador;
  asignador: Asignador;
  observaciones: string;
  radicacion: Radicacion;
  typeTime: string;
  time: number;
  fechaAsignacion: Date;
  notificada: boolean;
  isManual: boolean;
  tiempoXVencer: number;
  fechaVencimiento: Date;
  iniciada: boolean;
  documentos: Documentos;
  radicadoSalidaAprobar: string;
  gestionador: Aprobador;
  aprobador: Aprobador;
  revisor: Aprobador;
  copiaExterna: CopiaExterna[];
  copiaInterna: CopiaInterna[];
}

export interface Aprobador {
  nombreCompleto: string;
  cargo: string;
  dependencia: string;
}

export interface Asignador {
  id: number;
  userName: string;
  firstname: string;
  lastname: string;
  enabled: boolean;
  cargo: Cargo;
  bonitaId: string;
  email: string;
  emailPersonal: string;
  numeroDocumento: string;
  modulo: Cargo;
  usuarioRelaciones: UsuarioRelacione[];
  fechaCreacion: Date;
  fechaModificacion: Date;
  tipoUsuario: TipoUsuario;
  tipoDocumento: TipoDocumento;
  causaUltimaInactivacion: string;
  fechaUltimaInactivacion: Date;
  ultimaFechaAcceso: Date;
  correoCertificadoGestionador: string;
  consolida: boolean;
  accionModificacion: string;
  departamento: Departamento;
  municipio: Departamento;
  direccion: string;
  razonSocial: string;
  isConsolidador: boolean;
  celular: number;
  isCertificado: boolean;
  usuarioModificacion: string;
  fullname: string;
  firmaPredeterminadaId: number;
}

export interface Cargo {
  id: number;
  nombre: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  idPais?: number;
  codigoDivipola: string;
  idMunicipio?: number;
}

export interface TipoDocumento {
  id: number;
  codigo: string;
  descripcion: string;
}

export enum TipoUsuario {
  Proveedor = "Proveedor",
}

export interface UsuarioRelacione {
  id: number;
  usuario: string;
  seccionSubSeccion: CorrespondenciaDependencia;
  oficina: IDOficina;
  puntoRadicacion: PuntoRadicacion;
  rol: Rol;
}

export interface IDOficina {
  id: number;
  nombre: string;
  dependencia?: CorrespondenciaDependencia;
  estado: boolean;
  idDependencia?: number;
}

export interface CorrespondenciaDependencia {
  idSeccionSubSeccion: number;
  idversiontrd: Idversiontrd;
  nombre: string;
  padre: string;
  codigo: string;
  estado: boolean;
  observacion: string;
  idNodeAlfresco: string;
  idAlfresco: string;
  consolidadorAsignado: Cargo;
}

export interface Idversiontrd {
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

export interface PuntoRadicacion {
  id: number;
  oficinaId: IDOficina;
  nombrePunto: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  activo: boolean;
  codCentroCosto: number;
  puntoRadicacion: boolean;
  id_dependencia: CorrespondenciaDependencia;
}

export interface Rol {
  id: number;
  nombre: string;
  idBonita: number;
  idGrupoBonita: number;
  idKeycloak: string;
}

export interface CopiaExterna {
  id: number;
  formaEnvio: Cargo;
  tipoDocumentoDestinatario: Cargo;
  numeroDocumentoDestinatario: string;
  nombreDestinatario: string;
  direccionDestinatario: string;
  paisDestinatario: Pais;
  departamentoDestinatario: Departamento;
  municipioDestinatario: Departamento;
  telefonoDestinatario: string;
  correoElectronico: string;
  datosSalida: DatosSalida;
  destinatarioEXT: DestinatarioEXT;
}

export interface DatosSalida {
  id: number;
  formaEnvio: Cargo;
  tipoDocumentoDestinatario: Cargo;
  numeroDocumentoDestinatario: string;
  nombreDestinatario: string;
  direccionDestinatario: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  telefonoDestinatario: string;
  correoDestinatario: string;
  anexos: number;
  asunto: string;
  observacion: string;
  tipoDocumentoAfectado: Cargo;
  numeroDocumentoAfectado: string;
  nombreAfectado: string;
  tipoCopia: Cargo;
  comunicacionAsunto: string;
  comunicacionCuerpoCorreo: string;
  trackId: string;
}

export interface Pais {
  idPais: number;
  nombre: string;
  idContinente: number;
  idPositiva: number;
}

export interface DestinatarioEXT {
  id: number;
  formaEnvio: Cargo;
  tipoDocumentoDestinatario: Cargo;
  numeroDocumentoDestinatario: string;
  nombreDestinatario: string;
  direccionDestinatario: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  telefonoDestinatario: string;
  correoDestinatario: string;
}

export interface CopiaInterna {
  id: number;
  correspondenciaDependencia: CorrespondenciaDependencia;
  correspondenciaFuncionario: Asignador;
  correspondenciaDatosSalida: DatosSalida;
  destinatarioINT: DestinatarioINT;
}

export interface DestinatarioINT {
  id: number;
  oficina: IDOficina;
  nombreFuncionario: string;
  correoDestinatario: string;
  cargo: Cargo;
  formaEnvio: Cargo;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  telefonoDestinatario: string;
}

export interface Documentos {
  id: number;
  usuario: Asignador;
  asignador: Asignador;
  observaciones: string;
  radicacion: Radicacion;
  fechaAsignacion: Date;
  radicadoSalidaAprobar: string;
  fechaRechazo: Date;
  numeroRechazos: number;
  nodeId: string;
  nodeIdFolder: string;
}

export interface Radicacion {
  id: number;
  idRadicado: string;
  remitente: Remitente;
  afectado: Afectado;
  tipoTramite: Cargo;
  estadoProceso: EstadoProceso;
  usuarioCreador: Asignador;
  consolidador: Asignador;
  asignador: Asignador;
  motivoAsignador: string;
  fechaRadicacion: Date;
  notificada: boolean;
  datosSalida: DatosSalida;
  revision: Revision;
  idOficina: IDOficina;
  puntoRadicacion: number;
  dependencia: number;
  nodeId: string;
  es_mesaback: boolean;
  isCierreDevolucion: boolean;
  numeroDevoluciones: number;
  fechaPublicacion: Date;
  motivoAnulacion: string;
  fechaAnulacion: Date;
  anulacionConReinicio: boolean;
  fechaEnvio: Date;
  externoTipoTramite: ExternoTipoTramite;
  reclasificada: boolean;
  esMesabackDevuelto: boolean;
  observacionRetornoMesaback: string;
}

export interface Afectado {
  id: number;
  tipoDocumento: Cargo;
  numeroDocumento: string;
  nombre: string;
  telefono: string;
}

export interface EstadoProceso {
  id: number;
  etapa: string;
  estado: string;
}

export interface ExternoTipoTramite {
  id: number;
  nombreTramite: string;
}

export interface Remitente {
  id: number;
  numeroRadicadoEntidad: string;
  nroFactura: string;
  tipoDocumento: Cargo;
  numeroDocumento: string;
  nombre: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  direccion: string;
  correo: string;
  telefono: number;
  trackingId: string;
}

export interface Revision {
  id: number;
  revisor: Asignador;
  observacionesRevision: string;
  respuesta: string;
  observacionesRespuesta: string;
}
