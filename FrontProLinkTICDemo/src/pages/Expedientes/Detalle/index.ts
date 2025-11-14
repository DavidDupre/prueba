
// expediente: 'Lorem ipsum',
// radicado: '',
// numeroDocumento: '',
// mail:'',
// tipoRadicado:'',
// fechaInicio:'',
// fechaFin:'',
// dependencia:''

export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: 'Clasificación documental',
    to: '/home'
  },
  {
    name: 'Busqueda de Expedientes'
  }
];


export const routesDetalle = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Modulo SGDEA',
    to: '/home'
  },
  {
    name: 'Expedientes',
    to: '/expediente'
  },
  {
    name: 'Detalle Expediente',

  },

];


export const Expedientes_HEADER = [

  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'idIndice',
  },
  {
    name: 'nombreDocumento',
    align: 'center',
    label: 'Nombre Documento',
    field: 'nombreDocumento',
  },
  {
    name: 'tipologiaDocumental',
    align: 'center',
    label: 'Tipología Documental',
    field: 'tipologiaDocumental',
  },
  {
    name: 'fechaDeclaracionDocumento',
    align: 'center',
    label: 'Fecha declaración documento',
    field: 'fechaDeclaracionDocumento', //(row: any) => row.fechaVigenciaInicial.split(" ")[0],
  }, {
    name: 'fechaIncorporacionExpediente',
    align: 'center',
    label: 'Fecha incorporación documento',
    field: 'fechaIncorporacionExpediente', //(row: any) => row.fechaVigenciaFinal.split(" ")[0],
  },
  {
    name: 'valorHuella',
    align: 'center',
    label: 'Valor huella',
    field: 'valorHuella',
  },
  {
    name: 'funcionResumen',
    align: 'center',
    label: 'Función resumen',
    field: 'funcionResumen',
  },
  {
    name: 'ordenDocumento',
    align: 'center',
    label: 'Orden documento expediente',
    field: (row: any) => row.idExpediente ? row.idExpediente.nombreExpediente : 'documento'
  },
  {
    name: 'paginaInicio',
    align: 'center',
    label: 'Página inicio',
    field: (row: any) => row.folio ? row.folio.pagina_inicio : 'N/A'
  },
  {
    name: 'paginaFin',
    align: 'center',
    label: 'Página Fin',
    field: (row: any) => row.folio ? row.folio.pagina_fin : 'N/A'
  },
  {
    name: 'formato',
    align: 'center',
    label: 'Formato',
    field: 'formato',
  },
  {
    name: 'tamanio',
    align: 'center',
    label: 'Tamaño',
    field: 'tamanio',
  },
  {
    name: 'origen',
    align: 'center',
    label: 'Origen',
    field: (row: any) => row.origen ? row.origen.descripcion : 'origen'
  }


];

interface IRadicado {
  descripcion: string;
  id_tipo_de_radicado: number;
}

export interface IDataDocumental {
  descripcion: string;
  estado: boolean | string;
  id_tipo_documental: number;
  nombre: string;
  termino_tramite: number;
  tipoRadicadoId: IRadicado;
}
export const DOCUMENT_HEADER = [
  {
    name: "id",
    align: "center",
    label: 'ID',
    field: "id",
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del anexo",
    field: "nombre",
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción del anexo",
    field: "descripcion",
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo Documental",
    field: (row: string) => row,
  },
  {
    name: "fecha",
    align: "center",
    label: "Fecha del documento",
    field: "fecha",
  },
  {
    name: "archivo",
    align: "center",
    label: "Archivo adjunto",
    field: "archivo",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];
