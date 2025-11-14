export const SUBSERIES_HEADER = [
  {
    name: 'codigoSerie',
    align: 'center',
    label: 'ID serie',
    field: 'codigoSerie',
    sortable: true,
  },
  {
    name: 'dependencias',
    align: 'center',
    label: 'Dependencia',
    field: 'dependencias',
    sortable: true,
  },
  {
    name: 'codigo',
    align: 'center',
    label: 'Código subserie',
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Descripción',
    field: 'descripcion',
    sortable: true,
  },
  {
    name: 'archivoGestion',
    align: 'center',
    label: 'Archivo gestión',
    field: 'archivoGestion',
    sortable: true,
  },
  {
    name: 'archivoCentral',
    align: 'center',
    label: 'Archivo central',
    field: 'archivoCentral',
    sortable: true,
  },
  {
    name: 'soporte',
    align: 'center',
    label: 'Soporte',
    field: (row: any) => tipoSoporte(row.soporte),
    sortable: true,
  },

  {
    name: 'estados',
    align: 'center',
    label: 'Estado',
    field: 'estados',
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Procedimientos',
    field: 'descripcion',
    sortable: true,
  },
  {
    name: 'idDisposicionFinal	',
    align: 'center',
    label: 'Disposición final',
    field: 'disposicion_final',//(row: any) => row.idDisposicionFinal
    sortable: true,
    classes: 'tw-uppercase',
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  },

];


const disposicionamiento = (n: string ) =>

  ` ${n == "1" ? 'ct' : ''}
  ${n == "2" ? 'e' : ''}
  ${n=="3" ? 'md' : ''}
  ${n=="4" ? 's' : ''}
  `

const tipoSoporte = (val: number) => {
  if (val === 1) {
    return "Físico"
  } else if (val === 2) {
    return "Electrónico"
  }
}

export interface IDataSerie {
  codigo: string,
  descripcion: string,
  estados: boolean,
  fecha_vigencia_inicial: string | Date,
  fecha_vigencia_final: string | Date,
  id_seriesubserie: number,
  observacion: string,
  padre: number | any,
  tipo_de_soporte: number
  codigoSerie?: number
}



export interface ISearchData {
  descripcion: string,
  estados: boolean,
  fechaVigenciaInicial: Date,
  fechaVigenciaFinal: Date,
  id_padre: string
}
