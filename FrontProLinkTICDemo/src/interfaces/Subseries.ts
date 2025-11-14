import { Dependencia } from "./Dependencias";
import { Serie } from "./Series";

export interface Subserie {
  codigo: string;
  id_seriesubserie: string;
  fecha_vigencia_inicial: Date | string;
  fecha_vigencia_final: Date | string;
  descripcion: string;
  tiempoGestion: number;
  tiempoCentral: number;
  soporte: string;
  disposicionFinal: string;
  estados: boolean | string;
  procedimiento: string;
  observacion: string;
  id_padre?: string;
  dependecia: number;
  fondo: string | number;
  version: string | number;
}

export interface SubserieSerie {
  codigo: string;
  ct: boolean;
  descripcion: string;
  e: boolean;
  estados: boolean;
  fecha_vigencia_final: Date;
  fecha_vigencia_inicial: Date;
  idAlfresco: null | string;
  idSeriesubserie: number;
  md: boolean;
  observacion: null;
  procedimiento: string;
  s: boolean;
  seccionSubSeccion: Dependencia;
  tiempoArchivoCentral: number;
  tiempoArchivoGestion: number;
  tipo_de_soporte: number;
  padre?: Serie
}