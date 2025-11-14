export const BASE_HEADER = [
  {
    name: 'canal_radication',
    label: 'Canal de Radicación',
    field: 'canal_radication',
    sortable: true,
  },
  {
    name: 'codigo',
    label: 'Número de Radicado',
    field: 'numero',
    sortable: true,
  },
  {
    name: 'fecha_radicacion',
    label: 'Fecha y Hora de Radicación',
    field: 'fecha_radicacion',
    sortable: true,
  },
  {
    name: 'tiempo',
    label: 'Tiempo Asignado',
    field: 'tiempo',
    sortable: true,
  },
  {
    name: 'tiempo_vencer',
    label: 'Tiempo por Vencer',
    field: 'diasPorVencer',
    sortable: true,
  },
  {
    name: 'fecha',
    label: 'Fecha de Vencimiento',
    field: 'fechaDeVencimiento',
    sortable: true,
  },
  {
    name: 'nombre_afectado',
    label: 'Nombre - Identificación Afectado',
    field: 'nombre_afectado',
    sortable: true,
  },
  {
    name: 'remitente',
    label: 'Nombre - Identificación Remitente',
    field: 'remitente',
    sortable: true,
  },
  {
    name: 'city',
    label: 'Ciudad - Departamento',
    field: 'city',
    sortable: true,
  },
  {
    name: 'tramite_type',
    label: 'Tipo de Trámite',
    field: 'tramite_type',
    sortable: true,
  },
  {
    name: 'trazabilidad',
    label: 'Trazabilidad',
    field: 'trazabilidad',
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    sortable: true,
    style: 'width: 500px'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones'
  }
];

export const ASIGNACION_HEADER = [
  ...BASE_HEADER.slice(0, -2),
  {
    name: 'tiempoAprobador',
    label: 'Tiempo Empleado Aprobador',
    field: 'tiempoAprobador',
  },
  ...BASE_HEADER.slice(-2)
];

export const ASIGNACION_HEADER_PQRD = [
  ...BASE_HEADER.slice(0, -2),
  {
    name: 'tiempoRevisor',
    label: 'Tiempo Empleado Revisor',
    field: 'tiempoRevisor',
  },
  ...BASE_HEADER.slice(-2)
];
