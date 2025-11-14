export const SEGURIDAD_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'id',
    sortable: true
  },
  {
    name: 'codigo',
    align: 'center',
    label: 'Codigo nivel de Seguridad',
    field: 'codigo',
    sortable: true
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre nivel de Seguridad',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Descripcion',
    field: 'descripcion',
    sortable: true
  },
  {
    name: 'estado',
    align: 'center',
    label: 'Estado',
    field: 'estado',
    sortable: true
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
  }

];


export interface IDataSucursal {
  codigo_sucursal: string,
  nombre_sucursal: string,
  empresa: string,
  pais: string,
  departamento: string,
  municipio: string,
  direccion: string,
  telefono: string,
  email: string,
  localidad: string,
  estado: boolean
}


export interface ISearchData {
  nombre_fondo: '',
  codigo_fondo: '',
  estado: ''
}

export const stateOptions = [
  {
    label: 'Activo',
    value: true
  },
  {
    label: 'Inactivo',
    value: false
  }
]
