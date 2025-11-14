export const UBICACION_HEADER = [

  {
    name: 'codigo',
    align: 'center',
    label: 'Código Ubicación',
    field: 'codigo',
    sortable: true
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Nombre ubicación',
    field: 'descripcion',
    sortable: true
  },
  {
    name: 'fecha_vigencia_inicial',
    align: 'center',
    label: 'Sede',
    field: 'fecha_vigencia_inicial',
    sortable: true
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Fondo',
    field: 'fecha_vigencia_final',
    sortable: true
  },
  {
    name: 'fecha_vigencia_finall',
    align: 'center',
    label: 'Dependecia',
    field: 'fecha_vigencia_final',
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
    name: 'procedimiento',
    align: 'center',
    label: 'Detalle',
    field: 'procedimiento',
    sortable: true
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  }
];

export interface IDataSerie {
  id_seriesubserie: number,
  descripcion: string,
  estados: boolean,
  tipo_de_soporte: number,
  id_padre: number,
  fecha_vigencia_inicial: string | Date,
  fecha_vigencia_final: string | Date,
  observacion: string,
}


export interface ISearchData {
  descripcion: string,
  estados: boolean,
  fechaVigenciaInicial: Date,
  fechaVigenciaFinal: Date,
  id_padre: string
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
    name: 'Ubicaciones'
  }
]

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


export interface IUbication {
  codigo: number;
  sede: string;
  dependecia: string;
  nombre: string;
  estado: boolean;
  fondo: string;
  pasillos: string;
  detalle: string;
}
