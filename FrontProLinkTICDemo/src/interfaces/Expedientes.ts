import { Serie } from "./Series";

export interface Expediente {
  area:                 string;
  codigoexpediente:     string;
  estado:               number;
  fechadocumento:       null;
  fechavigenciafinal:   Date;
  fechavigenciainicial: Date;
  grupo:                string;
  idccd:                number;
  idexpediente:         number;
  idradicado:           number;
  idseriesubserie:      number;
  nivelseguridad:       number;
  nodeid:               string;
  nombredocumento:      string;
  nombreexpediente:     string;
  numeroradicado:       null;
  serieSubSerie:        Serie;
  tieneanexos:          boolean;
  tipodocumental:       null;
  tipoexpediente:       number;
  ubicacion:            string;
}

export interface DocumentosExp {
  nodeIdDocumento: string;
  nombreDocumento: string;
  tipoDocumento: string;
}
