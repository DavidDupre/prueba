export interface mapping {
  id: number;
  label: string;
}

export interface FilterFormI {
  selectEstado: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  destinatario: {
    val: string | null;
    ref: HTMLElement | null;
  };
  radicado: {
    val: string | null;
    ref: HTMLElement | null;
  };
  selectCanalRadicacion: {
    val: string | mapping| null;
    ref: HTMLElement | null;
  };
  selectCanalEnvio: {
    val: string | mapping| null;
    ref: HTMLElement | null;
  };
  selectReporte: {
    val: string | mapping| null;
    ref: HTMLElement | null;
  };
  selectTipoReporte: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  selectTipoTramite: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  fechaFinal: {
    val: string | null;
    ref: HTMLElement | null;
  };
  selectOficina: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  selectOficinaOrigen: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  selectOficinaDestino: {
    val: string | mapping | null;
    ref: HTMLElement | null;
  };
  fechaInicial: {
    val: string | null;
    ref: HTMLElement | null;
  };
}