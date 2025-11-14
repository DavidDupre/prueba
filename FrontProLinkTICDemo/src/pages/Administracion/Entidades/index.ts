export const Documental_HEADER = [
  {
    name: "idEntidad",
    align: "center",
    label: "Codigo",
    field: "idEntidad",
    sortable: true,
  },
  {
    name: "idTipoEntidad",
    align: "center",
    label: "Código Tipo Entidad",
    field: "idTipoEntidad",
    sortable: true,
  },
  {
    name: "entidad",
    align: "center",
    label: "Nombre de Entidad",
    field: "entidad",
    sortable: true,
  },

  {
    name: "descripcion",
    align: "center",
    label: "Descripción de entidad",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "estados",
    align: "center",
    label: "Estado",
    field: "estados",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export interface IDataEntidades {
  descripcion: string;
  entidad: string;
  estado: boolean;
  idEntidad: number;
  idTipoEntidad: number;
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
    name: 'Administración',
    to: '/administracion'
  },

  {
    name: 'Entidades'
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
