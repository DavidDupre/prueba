import moment from "moment";
import { tipoDocumento } from "src/constantes/options";

export const REPORTES_HEADER = [
  {
    name: 'dependenciaRadicado',
    align: 'center',
    label: 'Número de Radicado',
    field: 'numeroRadicado',
    sortable: true
  },
  {
    name: 'dependenciaRadicado',
    align: 'center',
    label: 'Dependencia radicado',
    field: 'dependenciaRadicado',
    sortable: true
  },
  {
    name: 'responsableProceso',
    align: 'center',
    label: 'Responsable del proceso',
    field: 'responsable',
    sortable: true
  },
  {
    name: 'tipoTramite',
    align: 'center',
    label: 'Tipo de trámite',
    field: 'tipoTramite',
    sortable: true
  },
  {
    name: 'canalRecepcion',
    align: 'center',
    label: 'Canal de recepción',
    field: 'canalRecepcion',
    sortable: true
  },
  {
    name: 'tipoDocumento',
    align: 'center',
    label: 'Tipo de documento',
    field: (row: any) => tipoDocumento.find((tipo: any) => tipo.value === row.tipoDocumento)?.label,
    sortable: true
  },
  {
    name: 'numeroIdentificacion',
    align: 'center',
    label: 'Número de identificación',
    field: 'numeroIdentificacion',
    sortable: true
  },
  {
    name: 'remitente',
    align: 'center',
    label: 'Remitente',
    field: 'remitente',
    sortable: true
  },
  {
    name: 'fechaHora',
    align: 'center',
    label: 'Fecha y hora',
    field: 'fechaYHora',
    sortable: true
  }
];

export const REPORTES_HEADER_CTO = [
  {
    name: 'dependenciaRadicado',
    align: 'center',
    label: 'Número de Radicado',
    field: 'sec',
    sortable: true
  },
  {
    name: 'dependenciaRadicado',
    align: 'center',
    label: 'Dependencia radicado',
    field: 'dependencia',
    sortable: true
  },
  {
    name: 'responsableProceso',
    align: 'center',
    label: 'Responsable del proceso',
    field: 'responsable',
    sortable: true
  },
  {
    name: 'tipoTramite',
    align: 'center',
    label: 'Tipo de trámite',
    field: 'tipoTramite',
    sortable: true
  },
  {
    name: 'canalRecepcion',
    align: 'center',
    label: 'Canal de recepción',
    field: 'canal',
    sortable: true
  },
  {
    name: 'tipoDocumento',
    align: 'center',
    label: 'Tipo de documento',
    field: (row: any) => tipoDocumento.find((tipo: any) => tipo.value === row.tipoDocumento)?.label,
    sortable: true
  },
  {
    name: 'numeroIdentificacion',
    align: 'center',
    label: 'Número de identificación',
    field: 'numeroDocumento',
    sortable: true
  },
  {
    name: 'remitente',
    align: 'center',
    label: 'Remitente',
    field: (field) => `${field.primerNombre} ${field.otrosNombres} ${field.primerApellido} ${field.segundoApellido}`,
    sortable: true
  },
  {
    name: 'fechaHora',
    align: 'center',
    label: 'Fecha y hora',
    field: (field) => moment(field.fecha).format("DD/MM/YYYY hh:mm:ss A"),
    sortable: true
  }
];

// export const REPORTES_BODY = [
//     {
//         dependenciaRadicado: '947287842',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287843',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287844',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287845',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287846',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287847',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287848',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287849',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287850',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
//     {
//         dependenciaRadicado: '947287851',
//         responsableProceso: 'Juan Méndez',
//         tipoTramite: 'Lorem ipsum',
//         canalRecepcion: 'Correo electrónico',
//         tipoDocumento: 'CC',
//         numeroIdentificacion: '2871878121',
//         remitente: 'Juan Luis Vargas Pérez',
//         fechaHora: '13/04/2023 13:45'
//     },
// ];

export interface IFiltros {
  tipoTramite: string;
  fechaInicial: string;
  fechaFinal: string;
  identificacion: string;
  numeroFactura: string;
}
