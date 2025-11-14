import { VersionTRD } from "./Versiones";

export interface Dependencia {
  codigo:              string;
  estado:              boolean;
  idAlfresco:          string;
  idNodeAlfresco:      string;
  idSeccionSubSeccion: number;
  idversiontrd?:        VersionTRD;
  nombre:              string;
  observacion:         string;
  padre:               Dependencia | null;
 }