export interface subserie {

  descripcion: string,
  estados: boolean,
  fechaVigenciaFinal: string,
  fechaVigenciaInicial: string,
  idSerieSubserie: any,
  observacion: string,
  tipoDeSoporte: number

}

export const DOCUMENTAL_HEADER = [

  {
    name: 'codigo',
    align: 'center',
    label: 'Código',
    field: 'idTipologiaDocumental',
    sortable: true,
  },
  {
    name: 'detalle',
    align: 'center',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
]

export const ASSIGN_DOCUMENTS_HEADER = [

  {
    name: 'codigo',
    align: 'center',
    label: 'Código',
    field: 'idTipologiaDocumental',
  },
  {
    name: 'detalle',
    align: 'center',
    label: 'Nombre',
    field: 'nombre',
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Estado',
    field: 'estado',
  },
]

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
    name: 'Asignación de tipologías documentales'
  }
]
