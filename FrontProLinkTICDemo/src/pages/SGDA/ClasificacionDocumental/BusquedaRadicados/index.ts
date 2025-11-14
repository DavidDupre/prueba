export const header = [
  {
    name: 'uid',
    label: 'ID',
    field: 'uid',
    align: 'center',
    sortable: true,
  },
  {
    name: 'id',
    align: 'center',
    label: 'ID Radicado',
    field: 'id',
    sortable: true,
  },
  {
    name: 'id_tipo_documento',
    label: 'Tipo documento',
    field: 'id_tipo_documento',
    align: 'center',
    sortable: true,
  },
  {
    name: 'documento',
    label: 'Documento',
    field: 'documento',
    align: 'center',
    sortable: true,
  },
  {
    name: 'nombre_completo',
    label: 'Nombre y apellido',
    field: 'nombre_completo',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fecha_radicado',
    label: 'Fecha de radicación',
    field: 'fecha_radicado',
    align: 'center',
    sortable: true,
  },
  {
    name: 'id_tipo_radicado',
    label: 'Tipo de radicado',
    field: 'id_tipo_radicado',
    align: 'center',
    sortable: true,
  },
  {
    name: 'id_tipo_documental',
    label: 'Tipo documental',
    field: 'id_tipo_documental',
    align: 'center',
    sortable: true,
  },
  {
    name: 'acciones',
    label: '',
    field: 'acciones',
    align: 'center',
  },
]

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
    name: 'Clasificación documental',
    to: '/home'
  },
  {
    name: 'Búsqueda de radicados'
  }
]
