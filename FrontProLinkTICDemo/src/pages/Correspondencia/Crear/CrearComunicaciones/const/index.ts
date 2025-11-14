export const DOCUMENTOS_HEADER = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: false,
    align: "center",
  },
  {
    name: "nombre",
    label: "Nombre del Documento",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo",
    label: "Tipo de Documento",
    field: "tipo",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha de Cargue",
    field: "fecha",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado Por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    sortable: true,
    align: "center",
  },
];

export const DESTINARIOS_HEADER_COPY_EXTERNA = [
  {
    name: "forma",
    align: "center",
    label: "Forma de envío",
    field: "forma_label",
    sortable: true,
  },
  {
    name: "correoElectronico",
    align: "center",
    label: "Correo Electronico",
    field: "correoElectronico",
    sortable: true,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de documento destinatario",
    field: "tipo_label",
    sortable: true,
  },
  {
    name: "numeroDeDocumeto",
    align: "center",
    label: "Número de documento",
    field: "numeroDeDocumeto",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del destinatario",
    field: "nombre",
    sortable: true,
  },
  {
    name: "direccion",
    align: "center",
    label: "Dirección del destinatario",
    field: "direccion",
    sortable: true,
  },
  {
    name: "pais",
    align: "center",
    label: "Pais destinatario",
    field: "pais_label",
    sortable: true,
  },
  {
    name: "departamento",
    align: "center",
    label: "Departamento destinatario",
    field: "departamento_label",
    sortable: true,
  },
  {
    name: "forma",
    align: "center",
    label: "Forma de envío",
    field: "forma_label",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const DESTINARIOS_HEADER_COPY_EXTERNA_MANUAL = [
  {
    name: "forma",
    align: "center",
    label: "Forma de envío",
    field: "forma_label",
    sortable: true,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de documento destinatario",
    field: "tipo_label",
    sortable: true,
  },
  {
    name: "numero",
    align: "center",
    label: "Número de documento",
    field: "numero",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre",
    field: "nombre",
    sortable: true,
  },
  {
    name: "direccion",
    align: "center",
    label: "Dirección",
    field: "direccion",
    sortable: true,
  },
  {
    name: "pais",
    align: "center",
    label: "País",
    field: "pais_label",
    sortable: true,
  },
  {
    name: "departamento",
    align: "center",
    label: "Departamento",
    field: "departamento_label",
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio_label",
    sortable: true,
  },
  {
    name: "telefono",
    align: "center",
    label: "Teléfono",
    field: "telefonoDestinatario",
    sortable: true,
  },
  {
    name: "correo",
    align: "center",
    label: "Correo electrónico",
    field: "correoElectronico",
    sortable: true,
  },

  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const DESTINARIOS_HEADER_COPY_INTERNA = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia",
    field: "dependencia_label",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del Funcionario",
    field: "nombre_label",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const DESTINARIOS_HEADER_COPY_INTERNA_MANUAL = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia",
    field: "dependencia_label",
    sortable: true,
  },

  {
    name: "nombre",
    align: "center",
    label: "Nombre funcionario",
    field: "nombre_label",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const dictionaryTypeCopy = {
  1: "interno",
  2: "externo",
  3: "ninguno",
  4: "interno y externo",
};

export const bodyDocumentDummy = [
  {
    id: "prueba.pdf",
    nombre: "prueba.pdf",
    tipo: "De entrada",
    fecha: "2021-09-01",
    cargado_por: "Juan Perez",
    formato: "avi",
  },
];

export const dataBodyDummy = [
  {
    id: 1,
    formato: "Courier",
    tipo: "Cedula de ciudadania",
    nombre: "Juan Perez",
    direccion: "Calle 123",
    pais: "Colombia",
    departamento: "Bogotá",
    municipio: "Bogotá",
  },
  {
    id: 2,
    forma: "Courier",
    tipo: "Cedula de ciudadania",
    nombre: "Maria Paez",
    direccion: "Calle 123",
    pais: "Colombia",
    departamento: "Bogotá",
    municipio: "Bogotá",
  },
];

export const dataBodyDummy2 = [
  {
    id: 1,
    nombre_label: "Funcionario de prueba",
    dependencia_label: "Dependencia 1",
    cargo: "contador",
    correo: "test2@test.com",
  },
  {
    id: 2,
    nombre_label: "Funcionario de prueba",
    dependencia_label: "Dependencia 2",
    cargo: "contador",
    correo: "test1@test.com",
  },
];

export const textModal = {
  // 'datos-generales':'¿Está seguro de abandonar la creación del documento en curso?',
  "datos-generales":
    "Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?",
  "datos-salida":
    "Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?",
  "enviar-aprobacion":
    "Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?",
  "enviar-revision":
    "Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?",
  "adjuntar-documento":
    "Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?",
};

export const objResponse = {
  campos_obligatorios:
    "Para continuar, asegúrese de que todos los campos requeridos estén completos.",
  lista_vacia: "Debe agregar como mínimo un destinatario copia.",
  usuario_repetido:
    "Ya se encuentra agregado el usuario para el envío de la copia.",
  aprobador_vacio: "Debe seleccionar un usuario para completar la acción.",
  aprobador_asigandor_vacio:
    "Debe seleccionar un usuario para completar la acción.",
  formulario_valido: "Datos guardados exitosamente",
  default_error: "Algo salió mal, por favor intente nuevamente.",
  success: "El radicado ha sido asignado con éxito para aprobación",
  eliminated: "La comunicación fue eliminada correctamente",
  no_data: "No se puede eliminar la comunicación, por favor intente nuevamente",
  asignacion_success: "El caso ha sido asignado para revisión con éxito",
  revision_success: "El caso ha sido asignado para aprobación con éxito",
  metadato_vacio:
    "Debe diligenciar el módulo metadato para continuar con el proceso",
  success_medicina: "Datos guardados exitosamente",
  doc_saved: "Datos guardados exitosamente",
  prev_revision: "Debe ingresar los metadatos para poder completar la acción",
  prev_revision_doc:
    "Debe diligenciar los datos y el documento de salida para poder completar la acción",
  select_user: "Debe seleccionar un usuario para completar la acción",
  succes_radicado: "El radicado ha sido enviado para revisión con éxito",
};

export const mapFormData = {
  comunicacion: {
    comNombre: "nombreComunicacion",
    comTipoComunicacionId: "tipoComunicacion",
    comPrefijoComunicacionId: "prefijoComunicacion",
    comTipoPlantillaComunicacionId: "tipoPlantilla",
    comUsuarioCreadorId: "comUsuarioCreadorId",
  },

  "datos-generales": {
    datosGeneralesAsunto: "asunto",
    datosGeneralesTipoDocumentoId: "tipoDocumento",
    datosGeneralesNumeroDocumento: "numeroDocumento",
    datosGeneralesNombre: "nombreAfectado",
    datosGeneralesRA: "radNumero",
  },
  "datos-salida": {
    datosSalidaFormaEnvioId: "datosSalidaFormaEnvioId",
    datosSalidaTipoDocumentoDestinatarioId:
      "datosSalidaTipoDocumentoDestinatarioId",
    datosSalidaNumeroDocumentoDestinatario:
      "datosSalidaNumeroDocumentoDestinatario",
    datosSalidaNombreDestinatario: "datosSalidaNombreDestinatario",
    datosSalidaDireccion: "datosSalidaDireccion",
    datosSalidaPaisId: "datosSalidaPaisId",
    datosSalidaDeptoId: "datosSalidaDeptoId",
    datosSalidaMunicipioId: "datosSalidaMunicipioId",
    datosSalidaCorreo: "datosSalidaCorreo",
    datosSalidaTelefono: "datosSalidaTelefono",
    datosSalidaAnexos: "datosSalidaAnexos",
    observacion: "observacion",
    datosSalidaTipoDocumentoAfectadoId: "datosSalidaTipoDocumentoAfectadoId",
    datosSalidaNumeroDocumentoAfectado: "datosSalidaNumeroDocumentoAfectado",
    datosSalidaNombreAfectado: "datosSalidaNombreAfectado",
  },
  "datos-salida-1": {
    datosSalidaTipoCopiaId: "copyType",
  },
  "datos-salida-2": {
    asuntoCorreo: "asuntoCorreo",
    contenidoCorreo: "contenidoCorreo",
  },
  "adjuntar-documento": {
    files: "files",
  },
  "enviar-revision": {
    numeroAnexos: "numeroAnexos",
    observaciones: "observaciones",
  },
  "enviar-aprobacion": {
    DG_numeroAnexos: "numeroAnexos",
    DG_observaciones: "observaciones",
  },

  myForm0: {
    nombre: "comNombre",
    tipoComunicacion: "comTipoComunicacionId",
    tipoGestion: "comTipoGestion",
    // tipoPlantilla:'comTipoPlantilla',
    usuarioCreador: "comUsuarioCreadorId",
  },
  // "myForm1":{
  //   comTipoComunicacionIdAfectado : "",

  //   datosGeneralesNombre: "datosGeneralesNombre",
  //   manualTipoRadicadoSalidaId: "manualTipoRadicadoSalidaId",
  //   datosGeneralesAsunto: "datosGeneralesAsunto",
  //   datosGeneralesTipoDocumentoId: "datosGeneralesTipoDocumentoId",
  //   datosGeneralesNumeroDocumento: "datosGeneralesNumeroDocumento",
  //   manualNroAnexos:'manualNroAnexos',
  //   files: "files",
  // },
};

export const filteredTabs = [
  { key: "datos-generales", name: "Datos Generales", icon: "info" },
  { key: "datos-salida", name: "Datos de Salida", icon: "account_tree" },
  { key: "documento-salida", name: "Documento de Salida", icon: "post_add" }, 
  { key: "adjuntar-documento", name: "Adjuntar Documento", icon: "attach_file",},
  { key: "incluir-exp", name: "Incluir Expediente", icon: "adf_scanner" },
  { key: "enviar-revision", name: "Enviar a revisión", icon: "assignment_turned_in" },
  { key: "enviar-aprobacion", name: "Enviar a Aprobación", icon: "task_alt" },
  { key: "trazabilidad", name: "Trazabilidad", icon: "history" },
  { key: "eliminar-comunicacion", name: "Eliminar Comunicación", icon: "delete_outline",},
];

export const optionsCopy = [
  {
    value: true,
    label: "Si",
  },
  {
    value: false,
    label: "No",
  },
];

export const dataObjectSend = [
  "tipoComunicacion",
  "tipoGestion",
  "tipoPlantilla",
  "usuarioCreador",
];
