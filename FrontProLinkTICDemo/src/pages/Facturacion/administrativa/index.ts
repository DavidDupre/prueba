import moment from "moment";

export const FACTURA_HEADER: any[] = [
  {
    name: "radicado",
    align: "center",
    label: "Número de Radicado",
    field: "sec",
  },
  {
    name: "id",
    align: "center",
    label: "Número de Factura",
    field: "numeroFactura",
  }, {
    name: "dependencia",
    align: "center",
    label: "Dependencia Radicado",
    field: "dependencia",
  },
  {
    name: "responsable",
    align: "center",
    label: "Responsable del Proceso",
    field: "responsable",
  },
  {
    name: "tramite",
    align: "center",
    label: "Tipo de Trámite",
    field: "tipoTramite",
  },
  {
    name: "recepcion",
    align: "center",
    label: "Canal de Recepción",
    field: "canal",
  },
  {
    name: "tipoDocumento",
    align: "center",
    label: "Tipo de Documento",
    field: "tipoDocumento",
  },
  {
    name: "numeroIdentificacion",
    align: "center",
    label: "Número de Identificación",
    field: "numeroDocumento",
  },
  {
    name: "nombreRemitente",
    align: "center",
    label: "Nombre del Remitente",
    // add a ellipsis to the field if it is too long
    field: (row) => (row.tipoDocumento.includes('NIT') && row?.razonSocial !== null) ? (row.razonSocial.substring(0, 35) + "..." ) : ((row?.primerNombre ?? '') + ' ' + (row.otrosNombres ?? '') + ' ' + (row?.primerApellido ?? '') + ' ' + (row?.segundoApellido ?? ''))
  },
  {
    name: "fecha_hora",
    align: "center",
    label: "Fecha y Hora",
    field: row => moment(row.fechaFormateada, 'DD/MM/YYYY hh:mm:ss a').format("DD/MM/YYYY HH:mm:ss"),
    // haz el sort por fecha, de la más vieja a la más reciente
    sort: (row) => new Date(row.fecha_hora).getTime(),
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
]

export interface Filtro {
  sec: string;
  dependencia: string;
  remitente: string;
  fecha: string;
  estado: string;
  numeroDocumento: string;
}

export const DOCUMENTOS_HEADER = [
  {
    name: 'formato',
    align: 'center',
    label: 'Formato',
    field: 'formato'
  },
  {
    name: 'nombreDocumento',
    align: 'center',
    label: 'Nombre del Documento',
    field: 'nombreDocumento',
    sortable: true
  },
  {
    name: 'tipoDocumento',
    align: 'center',
    label: 'Tipo de Documento',
    field: 'tipoDocumento',
    sortable: true
  },
  {
    name: 'fechaCargue',
    align: 'center',
    label: 'Fecha de Cargue',
    field: 'fechaCargue',
    sortable: true
  },
  {
    name: 'cargadoPor',
    align: 'center',
    label: 'Cargado por',
    field: 'cargadoPor',
    sortable: true
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  },
];

export const fileColumnsDocs = [
  {
    name: "formato",
    label: "Formato",
    align: "center",
    field: (row) => row.formato,
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: (row) => row.nombre,
  },
  { name: "tipo", label: "Tipo", align: "center", field: (row) => row.tipo },
  {
    name: "cargado_por",
    label: "Cargado Por",
    align: "center",
    field: (row) => row.cargado_por,
  },
  {
    name: "nodeId",
    label: "Node ID",
    align: "center",
    field: (row) => row.nodeId,
  },
  { name: "fecha", label: "Fecha", align: "center", field: (row) => row.fecha },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
]