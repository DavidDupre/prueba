

export const SUBSERIES_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
{
    name: 'nombreDocumento',
    align: 'center',
    label: 'Nombre documento',
    field: 'nombreDocumento',
    sortable: true,
  },
  {
    name: 'usuario',
    align: 'center',
    label: 'Usuario',
    field: 'usuario',
    sortable: true,
  },

  {
    name: 'fechaElaboracion',
    align: 'center',
    label: 'Fecha de elaboracion',
    field: 'fechaElaboracion',
    sortable: true,
  },

  {
    name: 'formatoDocumento',
    align: 'center',
    label: 'Formato Documento',
    field: 'formatoDocumento',
    sortable: true,
  },
  {
    name: 'size',
    align: 'center',
    label: 'Tamaño',
    field: 'size',
    sortable: true,
  },

  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
    sortable: true,
  },
];


export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/SGDA'
  },
  {
    name: 'Documentos',
  },
  {
    name: 'Documentos Temporales',
  },
]

