export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Modulo SGDEA',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/administracion'
  },
  {
    name: 'Tipos de Entidades',
    to: '/administracion/tiposEntidades'

  },

]

export const Empresa_HEADER = [

  {
    name: 'idTipoEntidad',
    align: 'center',
    label: 'Código',
    field: 'idTipoEntidad',
    sortable: true
  },
  {
    name: 'tipoEntidad',
    align: 'center',
    label: 'Tipo entidad',
    field: 'tipoEntidad',
    sortable: true
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Descripción',
    field: 'descripcion',
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
    field: 'acciones'
  }
];


export interface IDataEmpresa {
  idTipoEntidad: number;
  tipoEntidad: string;
  descripcion: string;
  estado: boolean;
}

export interface Ifilters {
  codigo?: number,
  tipoEntidad?: string,
  estado?: boolean
}

export const options = []
