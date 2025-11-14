import { tipoDocumento as tipoDocumentos } from "src/constantes/options";

export const FACTURA_RADICADA_HEADER = [
  {
    name: "radicado",
    align: "center",
    label: "Número de Radicado",
    field: "sec",
  },
  {
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
    field: "tramite",
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
    field: (row) =>
      tipoDocumentos.find((tipo) => tipo.value == row.tipoDocumento)?.label ??
      row.tipoDocumento,
  },
  {
    name: "numeroIdentificacion",
    align: "center",
    label: "Número de Documento",
    field: "numeroDocumento",
  },
  {
    name: "remitente",
    align: "center",
    label: "Nombre Completo del Remitente",
    field: (row) =>
      `${row.primerNombre ?? ""} ${row.otrosNombres ?? ""} ${
        row.primerApellido ?? ""
      } ${row.segundoApellido ?? ""}`,
  },
  {
    name: "fecha_hora",
    align: "center",
    label: "Fecha y Hora",
    field: "fecha_hora",
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
];

export const columnsAsignar = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Oficina",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

export const columnsAsignarOfficina = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Oficina",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];


export const columnsAsignar2 = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    align: "center",
  },
  {
    name: "grupo",
    label: "Oficina",
    field: "grupo",
    align: "center",
  },
];

export const DOCUMENTOS_HEADER = [
  {
    name: "formato",
    align: "center",
    label: "Formato",
    field: "formato",
  },
  {
    name: "nombreDocumento",
    align: "center",
    label: "Nombre del Documento",
    field: "nombreDocumento",
    sortable: true,
  },
  {
    name: "tipoDocumento",
    align: "center",
    label: "Tipo del Documento",
    field: "tipoDocumento",
    sortable: true,
  },
  {
    name: "fechaCargue",
    align: "center",
    label: "Fecha de Cargue",
    field: "fechaCargue",
    sortable: true,
  },
  {
    name: "cargadoPor",
    align: "center",
    label: "Cargado por",
    field: "cargadoPor",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const DOCUMENTOS_BODY = [
  {
    nombreDocumento: "Nombre_de_documento1.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento2.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento3.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento4.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento5.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento6.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
  },
  {
    nombreDocumento: "Nombre_de_documento7.pdf",
    tipoDocumento: "De salida",
    fechaCargue: "14/02/2023 - 13:45",
    cargadoPor: "Pedro Pérez",
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
