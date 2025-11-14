export interface ITutelaDetalles {

    "idTutela": number
    "canal": string
    "pais": string
    "departamento": string
    "municipio": string
    "nombreJuzgado": string
    "direccionJuzgado": string
    "telefono": string
    "celular": string
    "email": string
    "codigoProceso": string
    "fecha": string
    "descripcion"?: string
    "idRadicado": string
    "estado": string,
    "fechaAnulacion": string,
    "anulacionConReinicio": boolean
}

//TABLA ASIGNAR
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
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];

export const columnsAsignarEscalar = [
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
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  },
  // {
  //   name: "escalado",
  //   label: "Escalado",
  //   field: "escalado",
  //   sortable: true,
  //   align: "center",
  // }
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
    label: "Nombre del Documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo",
    label: "Tipo de Documento",
    field: "tipo",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de Cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado Por",
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

export const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Tutelas",
    to: "/tutelas",
  },
  {
    name: "Ver tutelas",
    to: "",
  },
];
