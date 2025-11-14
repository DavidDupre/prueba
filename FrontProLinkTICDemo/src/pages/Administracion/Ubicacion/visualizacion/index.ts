export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'SGDEA',
    to: '/home'
  },
  {
    name: 'Administración',
  },
  {
    name: 'Ubicaciones',
    to: '/administracion/ubicacion'
  },
  {
    name: 'Editar Ubicaciones'
  }
]

export const PASILLOS_HEADER = [

  {
    name: '#',
    align: 'center',
    label: 'ID',
    field: 'codigo',
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Pasillo',
    field: 'descripcion',
  },
  {
    name: 'fecha_vigencia_inicial',
    align: 'center',
    label: 'Número de estantes',
    field: 'fecha_vigencia_inicial',
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Estantes fijos',
    field: 'fecha_vigencia_final',
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Capacidad estantes fijos',
    field: 'fecha_vigencia_final',
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Estantes rodantes',
    field: 'estados',
  },
  {
    name: 'procedimiento',
    align: 'center',
    label: 'Capacidad estantes rodantes',
    field: 'procedimiento',
  },
  {
    name: 'procedimiento',
    align: 'center',
    label: 'Total entrepaños',
    field: 'procedimiento',
  },
];


export const ESTANTES_HEADER = [
  {
    name: 'codigo',
    align: 'center',
    label: 'ID',
    field: 'codigo',
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Pasillo',
    field: 'descripcion',
  },
  {
    name: 'fecha_vigencia_inicial',
    align: 'center',
    label: 'Estante',
    field: 'fecha_vigencia_inicial',
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Entrepaño',
    field: 'fecha_vigencia_final',
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Capacidad estantería',
    field: 'fecha_vigencia_final',
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Contenedor',
    field: 'estados',
  },
  {
    name: 'procedimiento',
    align: 'center',
    label: 'Capacidad Contenedor',
    field: 'procedimiento',
  },
];
