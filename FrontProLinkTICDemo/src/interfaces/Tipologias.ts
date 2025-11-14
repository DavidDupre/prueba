import { Dependencia } from "./Dependencias";
import { Serie } from "./Series";

export interface AsignacionTiplogia {
  serieAsignacion: Serie;
  tiposDocumentalesAsociados: TiposDocumentalesAsociado[];
  tiposDocumentalesDisponibles: Tipología[];
}

export interface TiposDocumentalesAsociado {
  iddocumentoserie: number;
  idseriesubserie: number;
  idtipologiadocumental: number;
  serieSubserie: Serie;
  tipologiaDocumental: Tipología;
}

export interface Tipología {
  bloqueoIndice: boolean;
  string: string;
  descripcion: string;
  descripcionIndice: string;
  editableIndice: boolean;
  esUnDocumentoGestion: boolean;
  esUnDocumentoIndexable: boolean;
  esUnDocumentoPlantilla: boolean;
  esUnDocumentoPlantillaTipoFormulario: boolean;
  estado: boolean;
  exigidoIndice: boolean;
  idTipologiaDocumental: number;
  indexableIndice: boolean;
  labelIndice: boolean;
  nombre: string;
  nombreCorto: string;
  siglaIndice: string;
  unicoIndice: boolean;
  visibleIndice: boolean;
}