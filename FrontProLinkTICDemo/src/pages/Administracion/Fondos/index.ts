export const SUBSERIES_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'Código',
    field: 'id',
    sortable: true,
  },
  {
    name: 'Nombre Fondo',
    align: 'center',
    label: 'Nombre Fondo',
    field: 'nombreFondo',
    sortable: true,
  },
  {
    name: 'nitFondo',
    align: 'center',
    label: 'NIT Fondo',
    field: 'nitFondo',
    sortable: true,
  },
  {
    name: 'Empresa',
    align: 'center',
    label: 'Código Empresa',
    field: 'empresa',
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
  }
];


export interface ISearchData {
  nombre_fondo: '',
  codigo_fondo: '',
  estado: ''
}
