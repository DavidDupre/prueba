interface UsuarioRelacionesI {
  id: number;
  seccionSubSeccion: {
    idSeccionSubSeccion: number;
    idversiontrd: {
      id: number;
      codigo: string;
      nombreVersion: string;
      fechaInicio: string;
      fechaFin: string;
      observaciones: string;
      estado: number;
      fechaVersion: string;
      id_fondo: number;
    };
    nombre: string;
    codigo: string;
    estado: boolean;
    observacion: string;
    idNodeAlfresco: string | number | null;
    idAlfresco: string | number | null;
  };
  oficina: {
    id: number;
    nombre: string;
    dependencia: {
      idSeccionSubSeccion: number;
      idversiontrd: {
        id: number;
        codigo: string;
        nombreVersion: string;
        fechaInicio: string;
        fechaFin: string;
        observaciones: string;
        estado: number;
        fechaVersion: string;
        id_fondo: number;
      };
      nombre: string;
      codigo: string;
      estado: boolean;
      observacion: string;
      idNodeAlfresco: string | number | null;
      idAlfresco: string | number | null;
    };
  };
}

interface UsuarioRadicadorI {
  id: number;
  userName: string;
  firstname: string;
  lastname: string;
  enabled: boolean;
  cargo: string;
  bonitaId: string | number | null;
  email: string;
  numeroDocumento: string;
  modulo: {
    id: number;
    nombre: string;
  };
  usuarioRelaciones: UsuarioRelacionesI[];
}

interface PuntoRadicacionI {
  id: number;
  oficinaId: {
    id: number;
    nombre: string;
    dependencia: {
      idSeccionSubSeccion: number;
      idversiontrd: {
        id: number;
        codigo: string;
        nombreVersion: string;
        fechaInicio: string;
        fechaFin: string;
        observaciones: string;
        estado: number;
        fechaVersion: string;
        id_fondo: string | number | null;
      };
      nombre: string;
      codigo: string;
      estado: boolean;
      observacion: string;
      idNodeAlfresco: string | number | null;
      idAlfresco: string | number | null;
    };
  };
  nombrePunto: string;
  pais: string | null;
  departamento: string;
  municipio: string;
  activo: boolean;
  codCentroCosto: number;
  puntoRadicacion: boolean;
  id_dependencia: string | number | null;
}

interface RolI {
  id: number;
  nombre: string;
  idBonita: number;
  idGrupoBonita: number;
  idKeycloak: string;
}

interface OficinaResponsableRespuestaI {
  id: number;
  nombre: string;
  dependencia: {
    idSeccionSubSeccion: number;
    idversiontrd: {
      id: number;
      codigo: string;
      nombreVersion: string;
      fechaInicio: string;
      fechaFin: string;
      observaciones: string;
      estado: number;
      fechaVersion: string;
      id_fondo: number;
    };
    nombre: string;
    codigo: string;
    estado: boolean;
    observacion: string;
    idNodeAlfresco: string | number | null;
    idAlfresco: string | number | null;
  };
}

export interface RowI {
  idEnteControl: number;
  numeroRadicado: string;
  fechaRadicacion: string;
  mes: string;
  fechaMaximaRespuesta: string;
  fechaCierre: string;
  fechaEnvio: string;
  tiempoVencer: string;
  canalRadicacion: string;
  nombreRemitente: string;
  tipoDocumentoRemitente: string;
  documentoRemitente: string;
  tipoTramiteRequerimiento: string;
  detalleTramite: string;
  estadoRadicado: string;
  usuarioRadicador: UsuarioRadicadorI;
  puntoRadicacion: PuntoRadicacionI;
  rol: RolI;
  esClonado: string;
  oficinaResponsableRespuesta: OficinaResponsableRespuestaI;
  oficinasIntervinientes: string;
  tiempoAsignadoOficinaResponsable: string;
  asignadorResponsable: string;
  fechaAsignacionOficina: string;
  fechaAsignacionGestionador: string;
  diasAsignacionGestionador: string;
  gestionadorResponsable: string;
  gestionadoresIntervinientes: string;
  diasOtorgadosGestionadoresClonados: string;
  fechaMaximaRespuestaGestionadoresClonados: string;
  fechaCierreGestionadoresClonados: string;
  fechaInicioGestion: string;
  fechaEnvioAprobacion: string;
  fechaAprobacion: string;
  diasEnGestionAprobacion: string;
  responsableAprobacion: string;
  fechaEnvioRevision: string;
  fechaRevision: string;
  diasEnGestionRevision: string;
  responsableRevision: string;
  departamentoRemitente: string;
  municipioRemitente: string;
  direccionRemitente: string;
  emailRemitente: string;
  nombreAfectado: string;
  sexoAfectado: string;
  tipoDocumentoAfectado: string;
  documentoAfectado: string;
  direccionAfectado: string;
  emailAfectado: string;
  telefonoAfectado: string;
  condicionEspecial: string;
  lgbtiq: string;
  tipoSolicitudAsignador: string;
  tipoSolicitudGestionador: string;
  producto: string;
  detalleSolicitud: string;
  tutela: string;
  marcacionSuperfinanciera: string;
  radicadoSalida: string;
  fechaRadicadoSalida: string;
  fechaEnvioRespuesta: string;
  nombreDestinatario: string;
  tipoDocumentoDestinatario: string;
  numeroDocumentoDestinatario: string;
  direccionDestinatario: string;
  departamentoDestinatario: string;
  emailDestinatario:String;
  municipioDestinatario: string;
  telefonoDestinatario: string;
  conCopia: string;
  nombresDestinatariosEnCopia: string;
  formaEnvioConCopia: string;
  formaEnvioDestinatariosCopia: string;
}
