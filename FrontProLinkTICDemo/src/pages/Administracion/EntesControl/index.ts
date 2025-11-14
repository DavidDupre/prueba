export interface IEnteControl {
    // Remitente
    tipoRemitente: string;
    tipoDocumentoRemitente: string;
    nroDocumentoRemitente: string | number;
    nombreRemitente: string;
    pais: string;
    departamento: string;
    municipio: string;
    direccionRemitente: string;
    telefono: string;
    correoRemitente: string;

    // Afectado
    tipoDocumentoAfectado: string;
    nroDocumentoAfectado: string | number;
    nombreAfectado: string;
    perteneceLgbt: string;
    sexoAfectado: string;
    condicionEspecial: string;

    // Medios de contacto
    correoAfectado: string;
    telefonoAfectado: string;
    telefonoFijoAfectado: string;
    paisContacto: string;
    departamentoAfectado: string;
    ciudadContacto: string;
    direccionContacto: string;
    medioAutorizacion: string;

    // Solicitud
    nroRadicadoEntidad: number;
    tipoSolicitud: string;
    detalle: string;
    producto: string;
    observacion?: string;
}

export interface IFiltros {
    estado: string;
    numeroRadicado: string;
    fechaVencimiento: string;
    ciudad: string;
    tipoTramite: string;
}