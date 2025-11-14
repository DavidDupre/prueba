// To parse this data:
//
//   import { Convert, IResponseRadicadoML } from "./file";
//
//   const iResponseRadicadoML = Convert.toIResponseRadicadoML(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IResponseRadicadoML {
  id:                 number;
  afectado:           Afectado;
  remitente:          Remitente;
  solicitud:          Solicitud;
  nodeId:             string;
  idRadicado:         string;
  estado:             Estado;
  usuarioCreador:     UsuarioCreador;
  fechaRadicacion:    Date;
  asignacion:         Asignacion;
  subProceso:         SubProceso;
  caseId:             number;
  reclasificacionMl:  null;
  fechaEnvio:         null;
  numeroDevoluciones: number;
  trackEmail:         null;
  respuestaGestor:    null;
}

export interface Afectado {
  id:                number;
  tipoDocumento:     TipoDocumento;
  numeroDocumento:   string;
  nombre:            string;
  correoElectronico: string;
  telefono:          number;
  pais:              Pais;
  departamento:      Departamento;
  municipio:         Departamento;
  direccion:         string;
  lgbti:             null;
  genero:            null;
  condicionEspecial: null;
}

export interface Departamento {
  idDepartamento: number;
  nombre:         string;
  idPais?:        number;
  codigoDivipola: string;
  idMunicipio?:   number;
}


export interface Pais {
  idPais:       number;
  nombre:       string;
  idContinente: number;
  idPositiva:   number;
}

export interface TipoDocumento {
  id:     number;
  nombre: string;
}

export interface Asignacion {
  id:                         number;
  gestionIniciada:            boolean;
  motivoAsignacion:           string;
  motivoReasignacion:         null;
  motivoRechazoRevision:      null;
  motivoRechazoAprobacion:    null;
  motivoRechazoGestion:       null;
  estado:                     Estado;
  metaDatos:                  MetaDatos;
  idAsignador:                UsuarioCreador;
  idGestionador:              UsuarioCreador;
  idRevisor:                  UsuarioCreador;
  idAprobador:                null;
  fechaAsignacionGestionador: Date;
  fechaAsignacionRevisor:     Date;
  fechaAsignacionAprobador:   null;
  datosSalida:                DatosSalida;
  observacionesReinicio:      null;
  fechaVencimiento:           Date;
  fechaAprobacion:            null;
  fechaRevision:              null;
  observacionesAnulacion:     null;
  fechaAnulacion:             null;
  anulacionConReinicio:       boolean;
  numeroRechazosRevision:     number;
  numeroRechazosAprobacion:   number;
}

export interface DatosSalida  {
  id:                          number;
  formaEnvio:                  TipoDocumento;
  tipoDocumentoDestinatario:   TipoDocumento;
  numeroDocumentoDestinatario: string;
  nombreDestinatario:          string;
  direccionDestinatario:       string;
  pais:                        Pais;
  departamento:                Departamento;
  municipio:                   Departamento;
  telefonoDestinatario:        string;
  correoDestinatario:          string;
  anexos:                      number;
  asunto:                      string;
  observacion:                 string;
  tipoDocumentoAfectado:       TipoDocumento;
  nombreAfectado:              string;
  tipoCopia:                   TipoDocumento;
  correoRespuestaAsunto:       string;
  correoRespuestaCuerpoCorreo: string;
  copiasInternas:              any[];
  copiasExternas:              any[];
  trackId:                     null;
  envio:                       null;
  documentoSalida:             DocumentoSalida;
  gestionador:                 UsuarioCreador;
  medioMagnetico:              null;
}

export interface DocumentoSalida extends DatosSalida{
  id:                   number;
  fechaCreacion:        Date;
  nombreComunicacion:   string;
  prefijo:              DocumentoSalidaPrefijo;
  htmlContent:          string;
  nodeIdRadicadoSalida: null;
  radicadoSalida:       null;
  aprobador:            null;
  file:                 string;
}

export interface DocumentoSalidaPrefijo {
  id:                   number;
  oficina:              PrefijoOficina;
  prefijo:              PrefijoPrefijo;
  revisionMasiva:       boolean;
  aprobacionMasiva:     boolean;
  aprobacionAutomatica: boolean;
  activo:               boolean;
  tipoFirma:            TipoFirma;
  plantilla:            string;
  aprobador:            null;
  usuario:              UsuarioCreador;
  fechaCreacion:        Date;
  subProceso:           SubProceso;
}

export interface PrefijoOficina {
  id:            number;
  nombre:        string;
  idDependencia: number;
}
export interface PrefijoPrefijo {
  id:            number;
  nombre:        string;
  descripcion:   string;
  activo:        boolean;
  usuario:       UsuarioCreador;
  fechaCreacion: Date;
}

export interface UsuarioCreador {
  id:                           number;
  userName:                     string;
  firstname:                    string;
  lastname:                     string;
  enabled:                      boolean;
  cargo:                        string;
  bonitaId:                     null;
  email:                        string;
  emailPersonal:                null;
  numeroDocumento:              string;
  modulo:                       TipoDocumento;
  usuarioRelaciones:            UsuarioRelacione[];
  fechaCreacion:                Date;
  fechaModificacion:            Date;
  tipoUsuario:                  string;
  tipoDocumento:                PurpleTipoDocumento;
  causaUltimaInactivacion:      null;
  fechaUltimaInactivacion:      Date;
  ultimaFechaAcceso:            Date;
  correoCertificadoGestionador: null;
  consolida:                    boolean;
  accionModificacion:           string;
  departamento:                 Departamento;
  municipio:                    Departamento;
  direccion:                    null;
  razonSocial:                  null;
  isConsolidador:               boolean;
  celular:                      null;
  usuarioModificacion:          null;
  fullname:                     string;
}

export interface PurpleTipoDocumento {
  id:          number;
  codigo:      string;
  descripcion: string;
}

export interface UsuarioRelacione {
  id:                number;
  seccionSubSeccion: Dependencia;
  oficina:           UsuarioRelacioneOficina | null;
  puntoRadicacion:   null;
  rol:               Rol;
}

export interface UsuarioRelacioneOficina {
  id:          number;
  nombre:      string;
  dependencia: Dependencia;
  estado:      boolean;
}

export interface Dependencia {
  idSeccionSubSeccion:  number;
  idversiontrd:         Idversiontrd;
  nombre:               string;
  codigo:               string;
  estado:               boolean;
  observacion:          string;
  idNodeAlfresco:       string;
  idAlfresco:           string;
  consolidadorAsignado: TipoDocumento;
}

export interface Idversiontrd {
  id:            number;
  codigo:        string;
  nombreVersion: string;
  fechaInicio:   Date;
  fechaFin:      Date;
  observaciones: string;
  estado:        number;
  fechaVersion:  Date;
  id_fondo:      number;
}

export interface Rol {
  id:            number;
  nombre:        string;
  idBonita:      number;
  idGrupoBonita: number;
  idKeycloak:    string;
}

export interface SubProceso {
  id:           number;
  subProceso:   string;
  formatoFecha: string;
  tiempo:       number;
  proceso:      Proceso;
}

export interface Proceso {
  id:      number;
  proceso: string;
}

export interface TipoFirma {
  id:        number;
  tipoFirma: string;
}

export interface Estado {
  id:     number;
  etapa:  string;
  estado: string;
}

export interface MetaDatos {
  id:                    number;
  tipoDocumentoAfectado: TipoDocumento;
  documentoAfectado:     string;
  nombreAfectado:        string;
  siniestro:             Siniestro;
  radicadoAsociado:      null;
  empresaAfectado:       string;
  compromisosProximos:   string;
  observacion:           string;
  fechaSiniestro:        Date;
}

export interface Siniestro {
  id:              number;
  tipoDocumento:   TipoDocumento;
  numeroDocumento: string;
  siniestro:       string;
}

export interface Remitente {
  id:              number;
  tipoRemitente:   TipoDocumento;
  tipoDocumento:   TipoDocumento;
  canalRadicacion: TipoDocumento;
  numeroDocumento: string;
  nombre:          string;
  pais:            Pais;
  departamento:    Departamento;
  municipio:       Departamento;
  direccion:       string;
  telefono:        string;
  email:           string;
  medioRespuesta:  TipoDocumento;
}

export interface Solicitud {
  id:                  number;
  tipoTramite:         string;
  tipoEvento:          TipoDocumento;
  tipoSolicitud:       TipoDocumento;
  fechaDictamen:       null;
  oficina:             UsuarioRelacioneOficina;
  descripcion:         string;
  radicadoRelacionado: string;
  constancia:          boolean;
  autorizacionDatos:   boolean;
  siniestro:           Siniestro;
}
