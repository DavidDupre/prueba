// src/utils/table/columnDefinitions.ts
import { formatDateWithTimeAndMeridiem, getCanalType, formatCanal,
    formatRadicado, formatTiempoAsignado, formatTiempoPorVencer, formatTiempoAsignadoGeneral, 
    formatTiempoPorVencerGeneral, formatPersona, formatUbicacion } from 'src/utils/table/formatters'
    
import moment from 'moment';

export const getPublicadorColumns = () => [
  { name: 'radicadoEntrada', label: 'Radicado de Entrada', field: 'radicadoEntrada', sortable: true },
  { name: 'radicadoSalida', label: 'Radicado de Salida', field: 'radicadoSalida', sortable: true },
  { name: 'tipoTramite', label: 'Tipo de Trámite', field: 'tipoTramite', sortable: true },
  { name: 'destinatario', label: 'Destinatario', field: 'destinatario', sortable: true },
  { name: 'fechaEnvio', label: 'Fecha de Envío', field: 'fechaEnvio', sortable: true },
  { name: 'canalEnvio', label: 'Canal de Envío', field: 'canalEnvio', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true },
  { name: 'tiempoAsignado', label: 'Tiempo Asignado', field: formatTiempoAsignado, sortable: true },
  { name: 'tiempoPorVencer', label: 'Tiempo por Vencer', field: formatTiempoPorVencer, sortable: true },
  { name: 'fechaVencimiento', label: 'Fecha de Vencimiento', field: row => row?.fechaVencimiento || '-', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'documento', label: 'Documento', field: 'documento', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones' },
  { name: 'trazabilidad', label: 'Trazabilidad', field: 'trazabilidad' }
];

// 🌐 Columnas Generales
export const getGeneralColumns = () => {
  const estadosRadicadoSalida = [
    'Devolucion', 'Publicacion rechazada', 'Por Publicar',
    'Publicado', 'Publicacion cerrada', 'Aprobado'
  ];

  return [
    { name: 'canal', label: getCanalType(), field: formatCanal, sortable: true },
    { name: 'idRadicacion', label: 'Radicado', field: row => formatRadicado(row, estadosRadicadoSalida), sortable: true },
    { name: 'fechaRadicacion', label: 'Fecha de Radicación', field: 'fechaRadicacion', sortable: true, format: (val: string) => val ? formatDateWithTimeAndMeridiem(val) : '-' },
    { name: 'tiempoAsignado', label: 'Tiempo Asignado', field: formatTiempoAsignadoGeneral, sortable: true },
    { name: 'tiempoPorVencer', label: 'Tiempo por Vencer', field: formatTiempoPorVencerGeneral, sortable: true },
    { name: 'fecha', label: 'Fecha de Vencimiento', field: row => row?.fechaVencimiento ? moment(row.fechaVencimiento).format('DD/MM/YYYY') : '-', sortable: true },
    { name: 'nombreAfectado', label: 'Afectado', field: row => formatPersona(row?.documentoAfectado, row?.nombreAfectado), sortable: true },
    { name: 'nombreRemitente', label: 'Remitente', field: row => formatPersona(row?.documentoRemitente, row?.nombreRemitente), sortable: true },
    { name: 'municipio', label: 'Ciudad - Departamento', field: formatUbicacion, align: 'center', sortable: true },
    { name: 'etapaProcesal', label: 'Tipo Trámite', field: row => row?.tipoTramite || '-', sortable: true },
    { name: 'trazabilidad', label: 'Trazabilidad', field: 'trazabilidad' },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true },
    { name: 'acciones', label: 'Acciones', field: 'acciones' },
  ];
};
