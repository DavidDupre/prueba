export const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo Administración",
  },
  {
    name: "Empresas",
    to: "/administracion/empresas",
  },
];

export const RADICADOS_HEADER = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia",
    field: "dependencia",
  },
  {
    name: "responsable",
    align: "center",
    label: "Responsable",
    field: "responsable",
  },
  {
    name: "tipoTramite",
    align: "center",
    label: "Tipo de trámite",
    field: "tipoTramite",
  },
  {
    name: "recepcion",
    align: "center",
    label: "Canal de recepción",
    field: "recepcion",
  },
  {
    name: "numeroDocumento",
    align: "center",
    label: "Número de documento",
    field: "numeroDocumento",
  },
  {
    name: "numero",
    align: "center",
    label: "Nombre de Radicado",
    field: "numero",
  },
  {
    name: "fecha",
    align: "center",
    label: "Fecha de Radicado",
    field: "fecha",
  },
];

export const COBROS_HEADER = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia radicado",
    field: "dependencia",
  },
  {
    name: "responsable",
    align: "center",
    label: "Responsable del proceso",
    field: "responsable",
  },
  {
    name: "tramite",
    align: "center",
    label: "Tipo de trámite",
    field: "tramite",
  },
  {
    name: "recepcion",
    align: "center",
    label: "Canal de recepción",
    field: "recepcion",
  },
  {
    name: "tipoDocumento",
    align: "center",
    label: "Tipo de documento",
    field: "tipoDocumento",
  },
  {
    name: "numeroDocumento",
    align: "center",
    label: "Número de identificación",
    field: "numeroDocumento",
  },
  {
    name: "remitente",
    align: "center",
    label: "Remitente",
    field: "remitente",
  },
  {
    name: "fechaHora",
    align: "center",
    label: "Fecha y hora",
    field: "fechaHora",
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export interface IDataEmpresa {
  actoAdministrativoConstitucion: string;
  correoRepresentanteLegal: string;
  direccion: string;
  direccionRepresentanteLegal: string;
  email: string;
  estado: true;
  fechaContitucion: string;
  idEmpresa: number;
  nacionalidadRepesentanteLegal: string;
  nit: string;
  nombre: string;
  nombreRepresentanteLegal: string;
  telefono: string;
  telefonoRepresentanteLegal: string;
  tipoSociedad: number;
}

export interface IRadicado {
  dependencia: string;
  responsable?: string;
  tipoTramite: string;
  tipoRemitente: string;
  canal: string;
  tipoDocumento: string;
  numeroDocumento: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;

  pais: string;
  departamento: string;
  municipio: string;

  sec: string;

  telefono: string;
  celular: string;
  correo: string;

  numeroRadicadoDeRemitente: string;
  numeroFactura: string;

  tipoBienServicio: string;
  observacion: string;
  valor: number;
  valorLetras: string;
  aprobador: string;

  fechaRadicar: string;
  horaInicio: string;
  estado: string;

  cuentaCobro: File;
  pagoSeguridadSocial: File;
  entregaSoportes: File;
  otrosTiposDocumentales?: File;

  descripcion: string;

  medioAutorizadoRespuesta: string;
}

export const options = [];

export interface ConsultarDocumentoResponse {
  mensaje: string;
  fecha_recepcion: string;
  id_transaccion: string;
  status: number;
  mimeType: string;
  documento: string;
  id_documento: string;
}

export interface ConsultaOpen {
  razonSocial?: string;
  nombreComercial?: string;
  nombreCompleto?: string;
  mens: string;
  papellido?: string;
  sapellido?: string;
  onombre?: string;
  pnombre?: string;
}


export interface CuentaCobroResponse {
  aprobador: string;
  canal: string;
  dependencia: string;
  docSoporteNodeId: string;
  estado: string;
  fecha_hora: string;
  idCto: number;
  nodeId: string;
  numeroDocumento: number;
  observacion: string;
  otrosNombres: string;
  primerApellido: string;
  primerNombre: string;
  responsable: string;
  sec: string;
  segundoApellido: string;
  tipoBienServicio: string;
  tipoDocumento: string;
  valor: 100
  valor_letra: string;
}
