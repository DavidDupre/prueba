export const PUNTOS_HEADER = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia",
    field: (row) => row.id_dependencia?.nombre ?? 'N/A',
    sortable: true,
  },
  {
    name: "sucursal",
    align: "center",
    label: "Sucursal o Gerencia",
    field: "sucursal",
    sortable: true,
  },
  {
    name: "departamento",
    align: "center",
    label: "Departamento",
    field: "departamento",
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
  {
    name: "pais",
    align: "center",
    label: "País",
    field: "pais",
    sortable: true,
  },
  {
    name: "is_point",
    align: "center",
    label: "Es un punto de radicación",
    field: "is_point",
    sortable: true,
  },
  {
    name: "point_name",
    align: "center",
    label: "Nombre del punto",
    field: "point_name",
    sortable: true,
  },
  {
    name: "point_code",
    align: "center",
    label: "Código centro de costo",
    field: "point_code",
    sortable: true,
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const objResponse={
  campos_obligatorios:'Diligencie los campos obligatorios para continuar.',
  edicion_exitosa:'El punto de radicación ha sido modificado exitosamente.',
  creacion_exitosa:'El punto de radicación ha sido creado exitosamente.',
  punto_existente_activo:'El punto de radicación que está intentando crear ya existe y se encuentra activo',
  punto_existente_inactivo:'El punto de radicación que está intentando crear ya existe, pero se encuentra inactivo, si lo requiere puede activarlo',
  default:'Ha ocurrido un error, por favor intente nuevamente.',
}

export interface Filtro {
  departamento: string;
  municipio: string;
  nombre: string;
}

interface Idversiontrd {
  id: number;
  codigo: string;
  nombreVersion: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
  estado: number;
  fechaVersion: string;
  id_fondo: number;
}

interface Dependencia {
  idSeccionSubSeccion: number;
  idversiontrd: Idversiontrd;
  nombre: string;
  padre: string;
  codigo: string;
  estado: boolean;
  observacion: string;
  idNodeAlfresco: string;
  idAlfresco: string;
}

interface OficinaId {
  id: number;
  nombre: string;
  dependencia: Dependencia;
}

export interface PuntoRadicacion {
  id: number;
  oficinaId: OficinaId;
  nombrePunto: string;
  pais: string;
  departamento: string;
  municipio: string;
  activo: boolean;
  codCentroCosto: number;
  puntoRadicacion: boolean;
}
