import { TableHeader } from "src/interfaces/TableHeaders";

export const Comunicaciones_HEADER: TableHeader[] = [
  {
    name: "numeroComunicacion",
    label: "Número de comunicación",
    field: "numeroComunicacion",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoComunicacion",
    label: "Tipo de comunicación",
    field: "tipoComunicacion",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaComunicacion",
    label: "Fecha de comunicación",
    field: "fechaComunicacion",
    sortable: true,
    align: "center",
  },
  {
    name: "siniestro",
    label: "Siniestro",
    field: "siniestro",
    sortable: true,
    align: "center",
  },
  {
    name: "prefijo",
    label: "Prefijo",
    field: "prefijo",
    sortable: true,
    align: "center",
  },
  {
    name: "afectado",
    label: "Afectado",
    field: "afectado",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoTramite",
    label: "Tipo de trámite",
    field: "tipoTramite",
    sortable: true,
    align: "center",
  },
  {
    name: "fechaCreacionDocumento",
    label: "Fecha creación documento",
    field: "fechaCreacionDocumento",
    sortable: true,
    align: "center",
  },
  {
    name: "tipoEvento",
    label: "Tipo de evento",
    field: "tipoEvento",
    sortable: true,
    align: "center",
  },
  {
    name: "origenEvento",
    label: "Origen del evento",
    field: "origenEvento",
    sortable: true,
    align: "center",
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: false,
    align: "center",
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: false,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: false,
    align: "center",
  },
];

export const HEADER_DOCUMENTS = [
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
    name: "tipo",
    label: "Tipo de documento",
    field: "tipo",
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
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
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

export const trazabilidadColumns: any = [
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
    name: "tramite",
    label: "Tramite",
    field: "tramite",
    align: "center",
    sortable: true,
  },
  {
    name: "oficinaUser",
    label: "Oficina del usuario",
    field: "oficinaUser",
    align: "center",
    sortable: true,
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

export interface ISearchCasosData {
  numeroRadicado: { label: string; value: string };
  siniestro: string;
  estado: string;
  fechaRadicacion: string;
  fechaVencimiento: string;
  size: number
  page: number
}
