export const DOCUMENTOS_SOPORTE_HEADER = [

  {
    name: 'formato',
    align: 'center',
    label: 'Formato',
    field: 'formato',
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre del documento',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'documento',
    align: 'center',
    label: 'Tipo de documento',
    field: 'documento',
    sortable: true,
  },
  {
    name: 'fecha',
    align: 'center',
    label: 'Fecha de cargue',
    field: 'fecha',
    sortable: true,
  },
  {
    name: 'cargado',
    align: 'center',
    label: 'Cargado por',
    field: 'cargado',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
    sortable: true,
  },
];


export const PARRAFOS_HEADER = [

  {
    name: 'formato',
    align: 'center',
    label: 'Usuario',
    field: 'usuario',
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Dependencia',
    field: 'dependencia',
    sortable: true,
  },
  {
    name: 'documento',
    align: 'center',
    label: 'Párrafo',
    field: 'parrafo',
    sortable: true,
  },
  {
    name: 'request',
    align: 'center',
    label: 'Aprobar/Rechazar',
    field: 'request',
    sortable: true,
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
