import { Usuario } from "src/pages/Administracion/Usuarios/interfaces/usuario";
import { Common } from "./Common";
import { Dependencia } from "./Dependencias";
import { VersionTRD } from "./Versiones";

export interface MedicinaDto {
  asignacion: null;
  canalRadicacion: string;
  constancia: boolean;
  departamentoAfectado: string;
  departamentoRemitente: null;
  descripcion: string;
  direccionAfectado: string;
  direccionRemitente: string;
  emailAfectado: string;
  emailRemitente: string;
  estado: string;
  fechaDictamen: string;
  fechaRadicacion: string;
  id: number;
  idRadicado: string;
  medioRespuesta: string;
  municipioAfectado: string;
  municipioRemitente: null;
  nodeid: string;
  nombreAfectado: string;
  nombreRemitente: string;
  numeroDocumentoAfectado: string;
  numeroDocumentoRemitente: string;
  numeroSiniestros: string;
  oficina: string;
  paisAfectado: string;
  paisRemitente: string;
  radicadoRelacionado: string;
  telefonoAfectado: number;
  telefonoRemitente: string;
  CommonAfectado: string;
  CommonRemitente: string;
  tipoEvento: string;
  tipoRemitente: string;
  tipoSolicitud: string;
  tipoTramite: string;
  usuarioCreador: string;
}

export interface Medicina {
  afectado: Afectado;
  estado: Estado;
  fechaRadicacion: string;
  id: number;
  idRadicado: string;
  nodeId: string;
  remitente: Remitente;
  solicitud: Solicitud;
  asignacion?: AsignacionML;
  usuarioCreador: Usuario;
  caseId: string;
  subProceso: subProcesoMl
}

export interface Metadatos {
  id: number;
  proceso: string;
  process: { proceso: string };
  subProceso: { subProceso: string };
  formatoFecha: string;
  tiempo: number;
  prefijoOficina: any
}

export interface Afectado {
  correoElectronico: string;
  departamento: Departamento;
  direccion: string;
  id: number;
  municipio: Departamento;
  nombre: string;
  numeroDocumento: string;
  pais: Pais;
  telefono: number;
  Common: Common;
  tipoDocumento: { id: number; nombre: string };
}

export interface Departamento {
  codigoDivipola: string;
  idDepartamento: number;
  idMunicipio?: number;
  idPais?: number;
  nombre: string;
}

export interface Pais {
  idContinente: number;
  idPais: number;
  nombre: string;
}

export interface Estado {
  estado: string;
  etapa: string;
  id: number;
}

export interface Remitente {
  canalRadicacion: Common;
  departamento: Departamento;
  direccion: string;
  email: string;
  id: number;
  medioRespuesta: Common;
  municipio: Departamento;
  nombre: string;
  numeroDocumento: string;
  pais: Pais;
  telefono: string;
  Common: Common;
  tipoRemitente: Common;
  tipoDocumento: Common;
}

export interface Solicitud {
  constancia: boolean;
  descripcion: string;
  fechaDictamen: string;
  id: number;
  numeroSiniestro: string;
  oficina: Oficina;
  radicadoRelacionado: string;
  tipoEvento: Common;
  tipoSolicitud: Common;
  tipoTramite: string;
  siniestro: {
    id: number;
    tipoDocumento: {
      id: number;
      nombre: string;
    };
    numeroDocumento: string;
    siniestro: string;
  };
  autorizacionDatos: boolean
}

export interface Oficina {
  dependencia: Dependencia;
  id: number;
  nombre: string;
}

export interface AsignacionML {
  fechaAnulacion: string;
  anulacionConReinicio: boolean;
  gestionIniciada: boolean;
  asignado: boolean;
  estado: Estado;
  fechaAsignacionAprobador?: string;
  fechaAsignacionGestionador?: string;
  fechaAsignacionRevisor?: string;
  id: number;
  idAprobador?: Usuario;
  idAsignador?: Usuario;
  idGestionador?: Usuario;
  idRevisor?: Usuario;
  idOficinaAprobador?: Oficina;
  idOficinaAsignador?: Oficina;
  idOficinaGestionador?: Oficina;
  idOficinaRevisor?: Oficina;
  motivoAsignacion?: string;
  motivoReasignacion?: string;
  motivoRechazo?: string;
  observacionRechazoAprobacion?: string;
  rechazado: boolean;
  solicitudRechazo: null;
  metaDatos: {
    id: number;
    tipoDocumentoAfectado: { id: number; nombre: string };
    documentoAfectado: string;
    nombreAfectado: number;
    siniestro: { id: number; siniestro: string };
    radicadoAsociado: string;
    empresaAfectado: string;
    compromisosProximos: string;
    observacion: string;
    fechaSiniestro: Date | String;
  };
  datosSalida: DatosSalida;
  documentoSalida: any;
  fechaVencimiento: string;
}

export interface DatosSalida {
  id: 1;
  formaEnvio: { id: number; nombre: string };
  tipoDocumentoDestinatario: { id: number; nombre: string };
  numeroDocumentoDestinatario: null;
  nombreDestinatario: string;
  direccionDestinatario: string;
  pais: { idPais: number; nombre: string; idContinente: number };
  departamento: {
    idDepartamento: number;
    nombre: string;
    idPais: number;
    codigoDivipola: string;
  };
  municipio: {
    idMunicipio: number;
    nombre: string;
    idDepartamento: number;
    codigoDivipola: string;
  };
  telefonoDestinatario: string;
  correoDestinatario: string;
  anexos: number;
  asunto: string;
  observacion: string;
  tipoDocumentoAfectado: { id: number; nombre: string };
  nombreAfectado: string;
  numeroDocumentoAfectado: string;
  tipoCopia: { id: number; nombre: string };
  correoRespuestaAsunto: string;
  correoRespuestaCuerpoCorreo: string;
  documentoSalida: any;
  copiasExternas: Array<any>;
  copiasInternas: Array<any>;
}

export interface subProcesoMl {
  id: number;
  subProceso: string;
  formatoFecha: string;
  tiempo: number;
  proceso: {
    id: number;
    proceso: string;
  };
}
