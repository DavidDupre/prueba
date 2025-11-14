import { TableHeader } from "src/interfaces/TableHeaders";
import moment from 'moment'

export const Casos_HEADER_PUBLICADOR: TableHeader[] = [
  {
    name: "numeroRadicado",
    label: "Radicado de entrada",
    field: "numeroRadicado",
    sortable: true,
    align: "center",
  },
  {
    name: "numeroRadicadoSalida",
    label: "Radicado de salida",
    field: "numeroRadicadoSalida",
    sortable: true,
    align: "center",
    format: (val) => val || "-",
  },
  {
    name: "tipoTramite",
    label: "Tipo de trámite",
    field: "tipoTramite",
    sortable: true,
    align: "center",
  },
  {
    name: "nombreDestinatario",
    label: "Destinatario",
    field: "nombreDestinatario",
    sortable: true,
    align: "center",
    format: (val) => val?.trim() || "-",
  },
  {
    name: "fechaEnvioAprobacion",
    label: "Fecha de envío",
    field: "fechaEnvioAprobacion",
    sortable: true,
    align: "center",
    format: (val) => val ? moment(val).format("DD/MM/YY") : "-",
  },
  {
    name: "formaEnvio",
    label: "Canal de envío",
    field: "formaEnvio",
    sortable: true,
    align: "center",
    format: (val) => val || "No especificado",
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "center",
  },
  {
    name: "tiempoSubproceso",
    label: "Tiempo asignado",
    field: "tiempoSubproceso",
    sortable: true,
    align: "center",
    format: () => "1 día"
  },
  {
    name: "tiempo",
    label: "Tiempo por vencer",
    field: "fechaEnvioAprobacion", // Cambiamos el field para calcular desde la fuente
    sortable: true,
    align: "center",
    format: (fechaEnvio) => {
      if (!fechaEnvio) return "-";

      const hoy = moment();
      const fechaVencimiento = moment(fechaEnvio).add(1, 'day');
      const diasDiferencia = fechaVencimiento.diff(hoy, 'days');

      if (diasDiferencia < 0) {
        return `${Math.abs(diasDiferencia)} días vencidos`;
      }
      return `${diasDiferencia} día${diasDiferencia !== 1 ? 's' : ''}`;
    }
  },
  // {
  //   name: "fechaVencimiento",
  //   label: "Fecha de vencimiento",
  //   field: "fechaEnvioAprobacion",
  //   sortable: true,
  //   align: "center",
  //   format: (val) => {
  //     if (!val) return "Sin vencimiento";
  //     return moment(val).add(1, 'day').format("DD/MM/YY");
  //   }
  // },
  {
    name: "fechaVencimiento",
    label: "Fecha de vencimiento",
    field: "fechaEnvioAprobacion",
    sortable: true,
    align: "center",
    format: (val) => {
      if (!val) return "-";
      return moment(val).add(1, 'day').format("DD/MM/YY");
    }
  },
  {
    name: "nombreAfectado",
    label: "Nombre / N° De Documento",
    field: "nombreAfectado",
    sortable: true,
    align: "center",
    format: (val) => val?.trim() || "-",
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: false,
    align: "center",
  },
];

export const Casos_HEADER: TableHeader[] = [
  {
    name: "canal",
    label: "Canal de radicación",
    field: "canal",
    sortable: true,
  },
  {
    name: "numero",
    label: "Número de radicado",
    field: "numero",
    sortable: true,
  },
  {
    name: "fechaRadicacion",
    label: "Fecha y hora de radicación",
    field: "fechaRadicacion",
    sortable: true,
  },
  {
  name: "tiempoVencer",
  label: "Tiempo por vencer",
  field: "tiempoSubproceso",
  sortable: true,
  format: (val) => {
    if (val === null || val === undefined) return "-";
    return `${val} ${val >= 1 && val <= 20 ? 'Habil' : 'Calendario'}`;
  }
  },
  {
    name: "fechaVencimiento",
    label: "Fecha de vencimiento",
    field: "fechaVencimiento",
    sortable: true,
  },
  {
    name: "siniestro",
    label: "Siniestro",
    field: "siniestro",
    sortable: true,
  },
  {
    name: "nombreAfectado",
    label: "Nombre - Identificación Afectado",
    field: "nombreAfectado",
    sortable: true,
  },
  // {
  //   name: "documentoAfectado",
  //   label: "Documento Afectado",
  //   field: "documentoAfectado",
  //   sortable: true,
  // },
  {
    name: "remitente",
    label: "Nombre - Identificación Remitente",
    field: "remitente",
    sortable: true,

  },
  // {
  //   name: "documentoRemitente",
  //   label: "Documento Remitente",
  //   field: "documentoRemitente",
  //   sortable: true,
  // },
  {
    name: "tipoTramite",
    label: "Tipo de trámite",
    field: "tipoTramite",
    sortable: true,
  },
  {
    name: "Proceso",
    label: "Proceso",
    field: "proceso",
    sortable: true,
  },
  {
    name: "Subproceso",
    label: "Subproceso",
    field: "subproceso",
    sortable: true,
  },
  {
    name: "Prefijo",
    label: "Prefijo",
    field: "prefijo",
    sortable: true,
  },
  {
    name: "fechaCreacion",
    label: "Fecha creación del documento",
    field: "fechaCreacion",
    sortable: true,
  },
  {
    name: "trazabilidad",
    label: "Trazabilidad",
    field: "trazabilidad",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: false,
    align: "center",
  },
];

export const HEADER_DOCUMENTS = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo",
    label: "Tipo de documento",
    field: "tipo",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

export const trazabilidadColumns: any = [
  {
    name: "user",
    label: "Usuario",
    field: "nombre",
    align: "center",
    sortable: true,
  },
  {
    name: "action",
    label: "Acción",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
  {
    name: "tramite",
    label: "Tramite",
    field: "tramite",
    align: "center",
    sortable: true,
  },
  {
    name: "date",
    label: "Fecha",
    field: "fechaHora",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    field: "estado",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "Detalle",
    field: "descripcion",
    align: "center",
    sortable: true,
  },
];

export interface ISearchCasosData {
  numeroRadicado: { label: string; value: string };
  siniestro: string;
  estado: string;
  fechaRadicacion: string;
  fechaVencimiento: string;
  size: number;
  page: number;
}
