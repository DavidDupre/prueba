

export const SUBSERIES_HEADER = [
  {
    name: 'idSecuencia',
    align: 'center',
    label: 'Código Secuencia',
    field: 'idSecuencia',
    sortable: true
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre Secuencia',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'nombreCorto',
    align: 'center',
    label: 'Nombre Corto',
    field: 'nombreCorto',
    sortable: true
  },
  {
    name: 'Funcionalidad',
    align: 'center',
    label: 'Funcionalidad',
    field: 'funcionalidad',
    sortable: true
  },

  {
    name: 'prefijo',
    align: 'center',
    label: 'Prefijo',
    field: 'prefijo',
    sortable: true
  },
  {
    name: 'consecutivoInicial',
    align: 'center',
    label: 'Consecutivo inicial',
    field: 'consecutivoInicial',
    sortable: true
  },
  {
    name: 'sufijo',
    align: 'center',
    label: 'Sufijo',
    field: 'sufijo',
    sortable: true
  },

  {
    name: 'reinicioAnual',
    align: 'center',
    label: 'Reinicio Anual',
    field: 'reinicioAnual',
    sortable: true
  },
  {
    name: 'parametrizacion',
    align: 'center',
    label: 'Parametrizacion adicional',
    field: 'parametrizacion',
    sortable: true
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Estado',
    field: 'estados',
    sortable: true
  },
  {
    name: 'comentario',
    align: 'center',
    label: 'Comentario',
    field: 'comentario',
    sortable: true
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
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
    name: 'Secuencias',
  },
]

export const crear_routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/administracion'
  },
  {
    name: 'Secuencias',
    to: '/administracion/secuencias'
  },
  {
    name: 'Crear Secuencia',
  },

]

export const edit_routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Administracion',
  },
  {
    name: 'Secuencias',
    to: '/administracion/secuencias'
  },
  {
    name: 'Editar Secuencia',
  },
]

export const columns = [
  { name: 'name', required: true, align: 'center', label: '', field: 'name' },
  { name: 'antesPrefijo', required: true, align: 'center', label: 'Antes del prefijo', field: 'antesPrefijo' },
  { name: 'despuesPrefijo', required: true, align: 'center', label: 'Después del prefijo', field: 'despuesPrefijo' },
  { name: 'antesSufijo', required: true, align: 'center', label: 'Antes del sufijo', field: 'antesSufijo' },
  { name: 'despuesSufijo', required: true, align: 'center', label: 'Después del sufijo', field: 'despuesSufijo' },
];
