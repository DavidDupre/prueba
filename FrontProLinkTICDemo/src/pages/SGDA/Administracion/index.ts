export const DOCUMENTAL_HEADER = [
  {
    name: 'idTipoDocumental',
    align: 'center',
    label: 'Código Tipología Documental',
    field: 'idTipoDocumental',
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre Tipología Documental',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'siglaIndice',
    align: 'center',
    label: 'Sigla',
    field: 'siglaIndice',
    sortable: true,
  },
  {
    name: 'codigoTipoDocumental',
    align: 'center',
    label: 'Tipología Documento',
    field: 'codigoTipoDocumental',
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
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions'
  }
];

export interface IRadicado {
  descripcion: string,
  id_tipo_de_radicado: number
  tipoRadicadoId: {
    descripcion: string
  }
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

export const routes: { [key: string]: string | undefined }[] = [
  {
    name: 'Inicio',
  },
  {
    name: 'Módulo SGDEA',
  },
  {
    name: 'Clasificación documental',
    to: '/sgda//tipologia-documental'
  },

]

export const routesCreate: { [key: string]: string | undefined }[] = [
  {
    name: 'Inicio',

  },
  {
    name: 'Módulo SGDEA',

  },
  {
    name: 'Clasificación documental',

  },
  {
    name: 'Tipología Documental',
    to: '/SGDA/administracion'
  },


]
