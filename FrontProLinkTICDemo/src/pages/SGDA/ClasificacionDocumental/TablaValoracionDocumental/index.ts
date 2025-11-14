export interface Filters {
  dependencia: number | null;
  disposicionFinal: number | null;
  pagina?: number;
  procedimiento: null;
  serie: number | null;
  subserie: number | null;
  tamañoPagina?: number;
}

interface Subserie {
  descripcion: string;
  estados: boolean;
  fecha_vigencia_final: any;
  fecha_vigencia_inicial: any;
  id_seriesubserie: number;
  observacion: string;
  tipo_de_soporte: number;
}

interface TvdList {
  dependencia: {
    código: number;
    nombre: string;
  };
  disposicionFinal: {
    tipo: string;
  };
  procedimiento: string;
  retencion: number;
  serie: {
    codigo: number;
    nombre: string;
  };
  subseries: Subserie[];
  tiposDocumentales: {
    codigo: number;
    nombre: string;
  };
}

export interface ExportFile {
  formato: string;
  tvdList: TvdList[];
}

export const columns = [
  {
    number: "Frozen Yogurt",
    dependecia: "ass",
    codigoDependecia: "asas",
    series: 159,
    archivosGestion: 159,
    archivosCentral: 120,
    CT: 6.0,
    E: 24,
    MD: 4.0,
    S: 87,
    Procedimiento:
      " es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar\n" +
      "          de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una\n" +
      "          galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años,\n" +
      "          sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original.\n" +
      '          Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum,\n' +
      "          y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.",
  },
];

export const cols = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "center",
    sortable: true,
  },
  {
    name: "dependecia",
    field: "dependecia",
    label: "Dependecia",
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
    name: "archivosCentral",
    align: "center",
    field: "archivosCentral",
    label: "archivos Central",
    sortable: true,
  },
  { name: "CT", align: "center", field: "CT", label: "CT", sortable: true },
  { name: "E", align: "center", field: "E", label: "E", sortable: true },
  { name: "MD", align: "center", field: "MD", label: "MD", sortable: true },
  { name: "S", align: "center", field: "S", label: "S", sortable: true },
  {
    name: "procedimiento",
    align: "center",
    field: "procedimiento",
    label: "Procedimiento",
    sortable: true
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

export const data = [
  {
    descripcion: "Lorem ipsum",
    termino: "Lorem ipsum",
    radicado: "Lorem ipsum",
    estado: "Activo",
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
    name: "Tablas de Valoración Documental",
  },
];
