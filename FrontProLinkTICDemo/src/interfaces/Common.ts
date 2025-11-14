export interface SelectInput {
  label: string;
  value: string | number | boolean
  estado?: boolean;
}

export interface DocumentoRadicado {
  documento: string;
  base64x: string;
  fecha_recepcion: string;
  id_documento: string;
  id_transaccion: string;
  mensaje: string;
  status: number;
  name: string;
}

export interface BonitaAPI {
  persistenceId:             number;
  persistenceId_string:      string;
  persistenceVersion:        null;
  persistenceVersion_string: null;
  id:                        string;
  codigoDivipola:            string;
  nombre:                    string;
}

export interface DataSteps {
  nombre: string;
  persistenceId: string;
}

export interface DocsBD {
  id: number;
  nodeId: string;
  tipo: string;
  nombre: string;
  fechaCargue: string;
  es_devolucion:string;
  usuario: string;
}

export interface Common {
  id: number;
  nombre: string;
}