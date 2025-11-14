export const optionsExport = [
  {
    label: "Exportar XML",
    value: "XML",
  },
  {
    label: "Exportar PDF",
    value: "PDF",
  },
  {
    label: "Exportar CSV",
    value: "CSV",
  },
  {
    label: "Exportar Excel",
    value: "Excel",
  },
];

export const optionsDisposicionFinal = [
  {
    label: "Conservación Total",
    value: "1",
  },
  {
    label: "Medio Tecnológico",
    value: "2",
  },
  {
    label: "Eliminar",
    value: "3",
  },
  {
    label: "Selección",
    value: "4",
  },
];

export const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
  },
  {
    name: "Clasificación documental",
  },
  {
    name: "Tablas de retención documental",
  },
];

export const cols = [
  {
    name: "number",
    label: "ID",
    field: "number",
    align: "center",
    sortable: true,
  },
  {
    name: "dependencia",
    field: "dependencia",
    label: "Dependencia",
    align: "center",
    sortable: true,
  },
  {
    name: "codigoDependencia",
    field: "codigoDependencia",
    label: "Código Dependencia",
    align: "center",
    sortable: true,
  },
  {
    name: "series",
    field: "series",
    label: "Series, subseries y\n" + "tipos documentales",
    align: "center",
    sortable: true,
  },
  {
    name: "archivosGestion",
    align: "center",
    field: "archivosGestion",
    label: "Archivos Gestión",
    sortable: true,
  },
  {
    name: "archivosCentral",
    align: "center",
    field: "archivosCentral",
    label: "Archivos Central",
    sortable: true,
  },
  { name: "ct", align: "center", field: "ct", label: "CT", sortable: true },
  { name: "e", align: "center", field: "e", label: "E", sortable: true },
  { name: "md", align: "center", field: "md", label: "MD", sortable: true },
  { name: "s", align: "center", field: "s", label: "S", sortable: true },
  {
    name: "procedimiento",
    align: "center",
    field: "procedimiento",
    label: "Procedimiento",
    sortable: true,
  },
];

export const header = [
  {
    name: "",
    label: "",
    field: "",
    align: "",
    colSpan: "5",
  },
  {
    name: "retencion",
    label: "Retención",
    field: "retencion",
    align: "center",
    colSpan: "2",
  },
  {
    name: "disposicion",
    label: "Disposición final",
    field: "disposicion",
    align: "center",
    colSpan: "4",
  },
  {
    name: "",
    label: "",
    field: "",
    align: "",
    colSpan: "2",
  },
];

export interface Filters {
  codigoSerie: string;
  codigoSubserie: string;
  fechaInicial: string;
  fechaFinal: string;
  descripcion: string;
  tiempoGestion: string;
  tiempoCentral: string;
  soporte: string;
  disposicionFinal: string;
  estado: string;
  procedimiento: string;
  dependencia: string;
}

export const disposicionamiento = (key) => (key ? "X" : "");
