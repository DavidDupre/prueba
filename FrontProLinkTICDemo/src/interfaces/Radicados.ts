export interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: string;
  condicionEspecial: string;
  correoAfectado: string;
  tlfCelularAfectado: string;
  tlfFijoAfectado: string;
  paisContacto: string;
  departamentoContacto: string;
  ciudadContacto: string;
  remitenteAfectado: boolean,
  direccionContacto: string;
  medioRespuestaContacto: string;
  tipologiaPQRD: string;
  tipoSolicitud: string;
  producto: string;
  accesopPublico: boolean;
  descripcionAccesoInfo: string;
  observaciones: string;
  documentos: string | FileList;
}

export interface ITutelaRadicado {
  tramite: string;
  canal: string;
  pais: string;
  departamento: string;
  municipio: string;
  nombre_juzgado: string;
  direccion: string;
  telefono: string;
  celular: string;
  correo: string;
  codigo: string;
  fecha: string;
  descripcion: string;
  documento: string;
  archivos: any;
}

export interface Tutelas {
  idTutela: number;
  canal: string;
  pais: string;
  departamento: string;
  municipio: string;
  nombreJuzgado: string;
  direccionJuzgado: string;
  telefono: string;
  celular: string;
  email: string;
  codigoProceso: string;
  fecha: string;
  descripcion: string;
  idRadicado: string;
  idNombreJuzgado: string;
  fechaRadicacion: string;
  fechaIngreso:string;
}