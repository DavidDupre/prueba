export interface IEnteControl {
    // Remitente
    tipoRemitente: string;
    tipoDocumentoRemitente: string | number;
    numeroDocumentoRemitente: string | number;
    nombreRemitente: string;
    paisRemitente: any;
    departamentoRemitente: any;
    municipioRemitente: any;
    direccionRemitente: string;
    telefonoRemitente: string;
    emailRemitente: string;

    // Afectado
    tipoDocumentoAfectado: string | number;
    numeroDocumentoAfectado: string | number;
    nombreAfectado: string | number;
    lgbti: string | boolean; /*TO-DO: el dropdown no toma valores boolean false, se setea en la petición como boolean*/
    sexoAfectado: string;
    condicionEspecial: string;

    // Medios de contacto
    emailAfectado: string;
    telefonoCelularAfectado: string;
    telefonoFijoAfectado: string;
    paisAfectado: string | number;
    departamentoAfectado: string | number;
    municipioAfectado: string | number;
    direccionAfectado: string;
    medioRespuesta: string | number;

    // Solicitud
    nroRadicadoEntidadRemitente: string;
    tipoSolicitud: string;
    detalle: string;
    tipoProducto: string;
    observaciones?: string;
    canalRecepcion?: number;

    // Documentos
    documentos: [];
}

export interface IFiltros {
    estado: string;
    numeroRadicado: string;
    fechaVencimiento: string;
    ciudad: string;
    tipoTramite: string;
}

export enum Roles {
  ASIGNADOR_RESPONSABLE = "asignador responsable",
  GESTIONADOR = "gestionador",
  APROBADOR = "aprobador",
  REVISOR = "revisor",
}