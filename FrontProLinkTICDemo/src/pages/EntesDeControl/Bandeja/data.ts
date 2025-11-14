export const trazabilidadColumns = [
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true
  },
  {
    name: "action",
    label: "Acción",
    field: "accion",
    align: "center",
    sortable: true
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true
  }, {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true
  },
  {
    name: "description",
    label: "Detalle",
    field: "detalle",
    align: "center",
    sortable: true
  },
]

export const fileColumnsDocs = [
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
    name: "cargado_por",
    label: "Cargado Por",
    field: "cargado_por",
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
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];