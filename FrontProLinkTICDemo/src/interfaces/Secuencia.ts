export interface Secuencia {
  activo: boolean;
  comentario: string;
  consecutivoInicial: string;
  idSecuencia: number;
  nombre: string;
  nombreCorto: string;
  observacion: null;
  parametrizacion: string;
  parametrizacionAno: null;
  parametrizacionDependencia: null;
  parametrizacionDocumental: null;
  parametrizacionRadicado: null;
  parametrizacionSerie: null;
  parametrizacionSubserie: null;
  prefijo: string;
  reinicioAnual: boolean;
  sufijo: string;
  tipoSecuencia: TipoSecuencia;
}
export interface TipoSecuencia {
  id: number;
  nombre: string;
  nombreCorto: string;
}
