import {ref} from "vue";

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
    name: 'Editar ubicación',
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
    name: 'pasillos',
    align: 'center',
    label: 'Pasillo',
    field: 'pasillos',
  },
  {
    name: 'entrepanos',
    align: 'center',
    label: 'Número de estantes',
    field: 'entrepanos',
  },
  {
    name: 'cantidad_fijo',
    align: 'center',
    label: 'Estantes fijos',
    field: 'cantidad_fijo',
  },
  {
    name: 'capacidad_fijo',
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
    name: 'capacidad_rodante',
    align: 'center',
    label: 'Capacidad estantes rodantes',
    field: 'capacidad_rodante',
  },
  {
    name: 'entrepanos',
    align: 'center',
    label: 'Total entrepaños',
    field: 'entrepanos',
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
    name: 'pasillon',
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
    name: 'capacidad_estante',
    align: 'center',
    label: 'Capacidad estantería',
    field: 'capacidad_estante',
  },
  {
    name: 'contenedor',
    align: 'center',
    label: 'Contenedor',
    field: 'contenedor',
  },
  {
    name: 'contenedor_capacidad',
    align: 'center',
    label: 'Capacidad contenedor',
    field: 'contenedor_capacidad',
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
  }
];

export const radioList = ref([
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
])
