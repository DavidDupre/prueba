

export const SUBSERIES_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
{
    name: 'tiposCodigo',
    align: 'center',
    label: 'Tipos código de barras',
    field: 'tiposCodigo',
    sortable: true,
  },
  {
    name: 'detalle',
    align: 'center',
    label: 'Detalle',
    field: 'detalle',
    sortable: true,
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Estado',
    field: 'estados',
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
    name: 'Administracion',
  },
  {
    name: 'Tipos códigos de barras',
  },
]

