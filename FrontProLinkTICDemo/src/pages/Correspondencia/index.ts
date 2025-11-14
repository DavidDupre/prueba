
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
    name: 'Correspondencia',
  }
];


export const routesDetalle = [
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
    name: 'Busqueda de Expedientes',
    to: '/SGDA/expedientes'
  },
  {
    name: 'Detalle',

  }
];


export const Documental_HEADER = [

  {
    name: 'tipoTramite',
    align: 'center',
    label: 'Tipo Tramite',
    field: 'tipoTramite',
    sortable: true,
  },
  {
    name: 'tipoDocumental',
    align: 'center',
    label: 'Tipo Documental',
    field: 'tipoDocumental',
    sortable: true,
  },
  {
    name: 'tipoComunicacion',
    align: 'center',
    label: 'Tipo de Comunicación',
    field: 'tipoComunicacion',
    sortable: true,
  },
  {
    name: 'remitente',
    align: 'center',
    label: 'Remitente',
    field: 'remitente',
    sortable: true,
  },
  {
    name: 'documentoRemitente',
    align: 'center',
    label: 'Documento remitente',
    field: 'documentoRemitente',
    sortable: true,
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
  }


];

//TABLA ASIGNAR
export const columnsAsignar = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargoNombre",
    label: "Cargo",
    field: "cargoNombre",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

export const columnsAsignar2 = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

export interface IRadicadoDetalles {
  "id": number
  "idRadicado": string
  "afectado": any
  "consolidador": string
  "estadoProceso": any
  "fechaRadicacion": number
  "nodeId": string
  "remitente": any
  "tipoTramite": any
  "usuarioCreador": any
  "datosSalida": any
  "idOficina": any,
  "es_mesaback": boolean,
  "revision": any,
  "numeroDevoluciones": number
  "isCierreDevolucion": boolean
  "radicadoSalida": string
  "fechaAnulacion": string
  "anulacionConReinicio": boolean
}

export interface IAsignacionDetalles {
  "id": number
  "isManual": boolean
  "iniciada": boolean
  "fechaAsignacion": string
  "radicacion": any
  "time": number
  "typeTime": string
  "usuario": any
  "fechaVencimiento": string
  "radicadoSalidaAprobar": string
}

export interface IComunicacionesDetalles {
  "id": number
  "idRadicado": string
  "nodeId": string
  "estado": any
}

export const parseHtml = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html').body;
};

export const extractText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue.trim();
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.nodeName === 'IMG') {
      return node.outerHTML;
    }

    return node.innerText.trim();
  }

  return '';
};
