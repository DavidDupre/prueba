export const Documental_HEADER = [

  {
    name: 'codigo',
    align: 'center',
    label: 'Código',
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'dependencia',
    align: 'center',
    label: 'Dependencia',
    field: 'dependencia',
    sortable: true,
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Nombre Serie Documental',
    field: 'descripcion',
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
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
  },
  {
    name: 'Series'
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
