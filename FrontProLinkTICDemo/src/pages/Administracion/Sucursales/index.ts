export const SUBSERIES_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'Código Sucursal',
    field: 'id',
    sortable: true
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre Sucursal',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'Empresa',
    align: 'center',
    label: 'Empresa',
    field: 'empresa',
    sortable: true
  },
  {
    name: 'Pais',
    align: 'center',
    label: 'Pais',
    field: 'pais',
    sortable: true
  },

  {
    name: 'Departamento',
    align: 'center',
    label: 'Departamento',
    field: 'departamento',
    sortable: true
  },
  {
    name: 'Municipio',
    align: 'center',
    label: 'Municipio',
    field: 'municipio',
    sortable: true
  },
  {
    name: 'Direccion',
    align: 'center',
    label: 'Dirección',
    field: 'direccion',
    sortable: true
  },

  {
    name: 'Telefono',
    align: 'center',
    label: 'Telefono',
    field: 'telefono',
    sortable: true
  },
  {
    name: 'Email',
    align: 'center',
    label: 'Email',
    field: 'email',
    sortable: true
  },
  {
    name: 'Localidad',
    align: 'center',
    label: 'Localidad',
    field: 'localidad',
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

export interface crearSucursal {
  codigo: string;
  nombre: string;
  empresa: string;
  pais: string;
  departamento: string;
  municipio: string;
  direccion: string;
  localidad: string;
  telefono: string;
  correo: string;
  estado: boolean;
  informacionAdicional: string;
  cumple: boolean;
}

export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/administracion'
  },
  {
    name: 'Sucursal',
    to: '/administracion/sucursales'

  },
  {
    name: 'Editar Fondos',
    to: '/administracion/sucursal/editar'

  },

]
