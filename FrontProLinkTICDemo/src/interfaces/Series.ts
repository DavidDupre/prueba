import { Dependencia } from "./Dependencias";

export interface Serie {
  codigo:                 string;
  ct:                     boolean;
  descripcion:            string;
  e:                      boolean;
  estados:                boolean;
  fecha_vigencia_final:   Date;
  fecha_vigencia_inicial: Date;
  idAlfresco:             null | string;
  idSeriesubserie:        number;
  md:                     boolean;
  observacion:            string | null;
  padre:                  null | Serie;
  procedimiento:          string;
  s:                      boolean;
  seccionSubSeccion:      Dependencia;
  tiempoArchivoCentral:   number;
  tiempoArchivoGestion:   number;
  tipo_de_soporte:        number;
 }
