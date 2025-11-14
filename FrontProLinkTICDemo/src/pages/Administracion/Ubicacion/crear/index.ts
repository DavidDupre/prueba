
export interface ICrearSerie {
  descripcion: string,
  estados: boolean,
  fechaVigenciaInicial: Date,
  fechaVigenciaFinal: Date,
}

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
    name: 'Crear ubicación',
  },
]


export const PASILLOS_DEFINIDOS_HEADER = [

  {
    name: '#',
    align: 'center',
    label: 'ID',
    field: '#',
  },
  {
    name: 'pasillo',
    align: 'center',
    label: 'Pasillo',
    field: 'pasillo',
  },
  {
    name: 'numero_pasillos',
    align: 'center',
    label: 'Número de pasillos',
    field: 'numero_pasillos',
  },
  {
    name: 'estantes_fijos',
    align: 'center',
    label: 'Estantes fijos',
    field: 'estantes_fijos',
  },
  {
    name: 'capacidad_estantes_fijos',
    align: 'center',
    label: 'Capacidad estantes fijos',
    field: 'capacidad_estantes_fijos',
  },
  {
    name: 'estantes_rodantes',
    align: 'center',
    label: 'Estantes rodantes',
    field: 'estantes_rodantes',
  },
  {
    name: 'capacidad_estantes_rodantes',
    align: 'center',
    label: 'Capacidad estantes rodantes',
    field: 'capacidad_estantes_rodantes',
  },
  {
    name: 'total_entrepanos',
    align: 'center',
    label: 'Total entrepaños',
    field: 'total_entrepanos',
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
  }
];


export const ESTANTES_DEFINIDOS_HEADER = [

  {
    name: '#',
    align: 'center',
    label: 'ID',
    field: 'codigo',
  },
  {
    name: 'pasillo',
    align: 'center',
    label: 'Pasillo',
    field: 'pasillo',
  },
  {
    name: 'estante',
    align: 'center',
    label: 'Estante',
    field: 'estante',
  },
  {
    name: 'entrepano',
    align: 'center',
    label: 'Entrepaño',
    field: 'entrepano',
  },
  {
    name: 'capacidad_estanteria',
    align: 'center',
    label: 'Capacidad estantería',
    field: 'capacidad_estanteria',
  },
  {
    name: 'contenedor',
    align: 'center',
    label: 'Contenedor',
    field: 'contenedor',
  },
  {
    name: 'capacidad_contenedor',
    align: 'center',
    label: 'Capacidad contenedor',
    field: 'capacidad_contenedor',
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
  }
];

export const radioList = [
  {
    label: 'Carpetas',
    value: 'carpetas',
  },
  {
    label: 'Cajas',
    value: 'cajas',
  },
  {
    label: 'Tomos',
    value: 'tomos',
  },
  {
    label: 'Folios',
    value: 'folios',
  },
  {
    label: 'A-Z',
    value: 'a-z',
  },
  {
    label: 'Otra opción',
    value: 'otra',
  },
]
