export const CARGUE_HEADER = [

  {
    name: 'codigo',
    align: 'center',
    label: 'ID',
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Nombre archivo',
    field: 'descripcion',
    sortable: true,
  },
  {
    name: 'fecha_vigencia_inicial',
    align: 'center',
    label: 'Usuario',
    field: 'fecha_vigencia_inicial',
    sortable: true,
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Fecha última actualización',
    field: 'fecha_vigencia_final',
    sortable: true,
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Tamaño',
    field: 'fecha_vigencia_final',
    sortable: true,
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  }
];

export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: 'Administración',
  },
  {
    name: 'Cargar plantilla'
  }
]

export const routes_details = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: 'Administración',
  },
  {
    name: 'Cargar plantilla',
    to: '/administracion/cargue-plantillas'
  },
  {
    name: 'Detalle plantilla'
  }
]
