export interface ExpedienteGlobal {
  dependencia: string;
  series: string;
  subSeries: string;
  tipoDocumental: string;
  expedientes: string;
  numeroIdentificacion: string;
  responsableExpediente: string;
  nivelAcceso: string;
  observacion: string;
  numeroDocumento?: string;
  buscarExp?: string
}

export interface FormDataExpediente {
  recordId?: number;
  series: {
    id: number;
    description?: string;
  };
  subseries?: {
    id: number;
    nodeId?: string;
    description?: string;
  };
  documentType: {
    id: number;
  };
  dependency: {
    id: number;
    name?: string;
  };
  identificationCode: string;
  responsibleId: string;
  observations?: string;
  securityLevel: string;
  title: string;
  module?: number;
  status: string;
  recordStatusId?: number;
  startDate: string;
  endDate: string;
  recordType?: string;
  createDate: string;
  closeDate: string;
  phaseFile: string;
  nodeId?: string;
  numeroContrato?: string;
  proveedor?: string;
  objeto?: string;
  fichaDeclaracionExpediente?: string;
  faseArchivoSolicitada?: string;
  fechaTransferencia?: string;
  justification?: string;
  metadata: {},
}
