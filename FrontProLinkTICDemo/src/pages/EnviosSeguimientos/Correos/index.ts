import { fourthFormatDate } from "src/helpers/formtDate";

export const trazabilidadColumns: any[] = [
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true,
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
  {
    label: "Trámite",
    field: (row) => row.tramite,
    align: "center",
    sortable: true,
    name: "tramite",
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
];

export const REPORTES_HEADER = [
  {
    name: "canalRadicacion",
    label: "Canal de radicación",
    field: "canalRadicacion",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroRadicadoSalida",
    label: "Radicado de Salida",
    field: "radicadoSalida",
    sortable: true,
    align: "center",
  },
  {
    name: "destinatario",
    label: "Destinatario",
    field: "destinatario",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaRadicadoSalida",
    label: "Fecha de envío",
    field: "fechaAprobacion",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoEnvio",
    label: "Tipo de envío",
    field: "tipoEnvio",
    sortable: true,
    align: "center",
  },

  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "correo",
    label: "Correo electrónico",
    field: "correoElectronico",
    sortable: true,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre Afectado",
    field: "nombreAfectado",
    sortable: true,
    align: "center",
  },
  {
    name: "acciones",
    label: "Documento Afectado",
    field: "acciones",
    sortable: true,
    align: "center",
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
    align: "center",
  },
  {
    name: "accion",
    label: "Acción",
    field: "",
    sortable: true,
    align: "center",
  },
];

export const fileColumns = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];
