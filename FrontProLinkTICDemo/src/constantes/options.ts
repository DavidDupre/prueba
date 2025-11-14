export const tipoRemitente = [
  { label: "Apoderado", value: 1 },
  { label: "Tercero", value: 2 },
  { label: "Trabajador", value: 3 },
];

export const tipoDocumento = [
  { label: "Adulto sin Identificación", value: "Adulto sin Identificación" },
  { label: "Carné Diplomático", value: "Carné Diplomático" },
  { label: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
  { label: "Cédula de Extranjería", value: "Cédula de Extranjería" },
  { label: "Certificado de Nacido Vivo", value: "Certificado de nacido vivo" },
  { label: "Documento Extranjería", value: "Documento Extranjería" },
  { label: "Menor sin Identificación", value: "Menor sin Identificación" },
  { label: "Número de Identificación Tributaria NIT", value: "Número de Identificación Tributaria NIT" },
  { label: "Pasaporte", value: "Pasaporte" },
  { label: "Permiso Especial", value: "Permiso Especial" },
  { label: "Permiso Temporal", value: "Permiso Temporal" },
  { label: "Registro Civil", value: "Registro Civil" },
  { label: "Salvo Conducto", value: "Salvo Conducto" },
  { label: "Sin Identificación", value: "Sin Identificación" },
  { label: "Tarjeta de Identidad", value: "Tarjeta de Identidad" },
];

export const tipoDocumentoDatosSalida = [
  { label: "Carné Diplomático", value: "Carné Diplomático" },
  { label: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
  { label: "Cédula de Extranjería", value: "Cédula de Extranjería" },
  { label: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo", value: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo" },
  { label: "Número de Identificación Tributaria NIT", value: "Número de Identificación Tributaria NIT" },
  { label: "Número único de identificación personal (NUIP)", value: "Número único de identificación personal (NUIP)" },
  { label: "Pasaporte", value: "Pasaporte" },
  { label: "Permiso especial de permanencia (PEP)", value: "Permiso especial de permanencia (PEP)" },
  { label: "Permiso por protección temporal (PPT) ", value: "Permiso por protección temporal (PPT) " },
  { label: "Sociedad extranjera sin NIT en Colombia ", value: "Sociedad extranjera sin NIT en Colombia " },
  { label: "Tarjeta de Identidad", value: "Tarjeta de Identidad" },
];

export const tipoDocumentoShort = [
  { label: "Adulto sin Identificación", value: "AS" },
  { label: "Carné Diplomático", value: "CD" },
  { label: "Cédula de Ciudadanía", value: "CC" },
  { label: "Cédula de Extranjería", value: "CE" },
  { label: "Certificado de nacido vivo", value: "CN" },
  { label: "Documento Extranjería", value: "DE" },
  { label: "Menor sin Identificación", value: "MS" },
  { label: "Número de Identificación Tributaria NIT", value: "NI" },
  { label: "Pasaporte", value: "PA" },
  { label: "Permiso Especial", value: "PE" },
  { label: "Permiso Temporal", value: "PT" },
  { label: "Registro Civil", value: "RC" },
  { label: "Salvo Conducto", value: "SC" },
  { label: "Sin Identificación", value: "SI" },
  { label: "Tarjeta de Identidad", value: "TI" },
];

export const tipoDocumentoEscalar = [
  "Carné Diplomático",
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Fideicomiso, Fondos de Inversión Colectiva",
  "Fondos o Patrimonio Autónomo",
  "Número de Identificación Tributaria (NIT)",
  "Número Único de Identificación Personal (NUIP)",
  "Pasaporte",
  "Permiso Especial de Permanencia (PEP)",
  "Permiso Por Protección Temporal (PPT)",
  "Sociedad Extranjera sin NIT en Colombia",
  "Tarjeta de Identidad",
]

export const condicionEspecialOptions = [
  { label: "No aplica", value: 1 },
  { label: "Adulto Mayor", value: 2 },
  { label: "Pensionado", value: 3 },
  { label: "Receptor de subsidio", value: 4 },
  { label: "Discapacidad auditiva", value: 5 },
  { label: "Discapacidad física", value: 6 },
  { label: "Menor de edad", value: 7 },
  { label: "Indígena", value: 8 },
  { label: "Mujer embarazada", value: 9 },
  { label: "Reinsertado", value: 10 },
  { label: "Víctima del conflicto armado", value: 11 },
  { label: "Afrocolombiano", value: 12 },
  { label: "Desplazado", value: 13 },
  { label: "Madre cabeza de familia", value: 14 },
  { label: "Sordomudo", value: 15 },
  { label: "Discapacidad cognitiva", value: 16 },
  { label: "Discapacidad visual", value: 17 },
  { label: "Periodista", value: 18 },
  { label: "Talla baja", value: 19 },
  { label: "Otra", value: 20 },
];

export const genOptions = [
  { label: "Femenino", value: 2 },
  { label: "Masculino", value: 3 },
  { label: "Trans", value: 4 },
  { label: "No binario", value: 5 },
  { label: "Ninguno", value: 1 },
];

export const medioOptions = [
  { label: "Correo electrónico", value: 1 },
];

export const tipoSolicitudOptions = [
  { label: "Actualización de Datos en la afiliación", value: 1 },
  { label: "Aporte de Pruebas Medicina Laboral", value: 2 },
  { label: "Asesoría en SGSST", value: 3 },
  { label: "Asistente Virtual", value: 4 },
  { label: "Autorización médica", value: 5 },
  {
    label: "Centro de Atención telefónica (Call center/Contact center)",
    value: 6,
  },
  { label: "Controversia", value: 7 },
  { label: "Estado de Cuenta Aportes ARL", value: 8 },
  { label: "Facturación y cobro Pólizas de Vida", value: 9 },
  { label: "Internet(página web, portal transaccional)", value: 10 },
  { label: "Modificaciones Pólizas de Vida", value: 11 },
  { label: "Novedades de Afiliación", value: 12 },
  { label: "Oficinas", value: 13 },
  { label: "Otra", value: 14 },
  { label: "Pago de Reembolso", value: 15 },
  { label: "Pago de Incapacidad", value: 16 },
  { label: "Pensiones", value: 17 },
  { label: "Reclamaciones Pólizas de Vida", value: 18 },
  { label: "Renovaciones Pólizas de Vida", value: 19 },
  { label: "Sistema de audio respuesta(IVR)", value: 20 },
  { label: "Solicitud de medicamentos", value: 21 },
  { label: "Suscripción de Pólizas de Vida", value: 22 },
  { label: "Traslado para prestación de servicio.", value: 23 },
];

export const tipoProductoOptions = [
  { label: "Seguro de riesgos laborales", value: 1 },
  { label: "Seguro de accidentes personales", value: 2 },
];

export const tipoPqrdOptions = [
  { label: "Solicitud", value: 1 },
  { label: "Derecho de Petición", value: 2 },
  { label: "Felicitaciones", value: 3 },
  { label: "Sugerencias", value: 4 },
  { label: "Queja", value: 5 },
  { label: "Reclamo", value: 6 },
];

export const tipoDocumentoTutelasOptions = [
  {
    label: "Cédula de Ciudadanía",
    value: "cédula de ciudadanía",
  },
  {
    label: "Cédula de Extranjería",
    value: "Cédula de Extranjería",
  },
  {
    label: "Carné Diplomático",
    value: "Carné Diplomático",
  },
  {
    label: "Permiso por Protección Temporal (PPT)",
    value: "Permiso por Protección Temporal (PPT)",
  },
  {
    label: "Permiso Especial de Permanencia (PEP)",
    value: "Permiso Especial de Permanencia (PEP)",
  },
  {
    label: "Pasaporte",
    value: "Pasaporte",
  },
  {
    label: "Tarjeta de Identidad",
    value: "Tarjeta de Identidad",
  },
  {
    label: "Número Único de Identificación Personal (NUIP)",
    value: "Número Único de Identificación Personal (NUIP)",
  },
  {
    label: "Sociedad Extranjera sin NIT en Colombia",
    value: "Sociedad Extranjera sin NIT en Colombia",
  },
  {
    label: "Fideicomiso, Fondos de Inversión Colectiva",
    value: "Fideicomiso, Fondos de Inversión Colectiva",
  },
  {
    label: "Fondo o Patrimonio Autónomo",
    value: "Fondo o Patrimonio Autónomo",
  },
  {
    label: "Números de Identificación Tributaria (NIT)",
    value: "Números de Identificación Tributaria (NIT)",
  },
];

export const tipoDocumentoTutelasOptions2 = [
  {
    label: "Cédula de Ciudadanía",
    value: "Cédula de Ciudadanía",
  },
  {
    label: "Cédula de Extranjería",
    value: "Cédula de Extranjería",
  },
  {
    label: "Carné Diplomático",
    value: "Carné Diplomático",
  },
  {
    label: "Permiso por Protección Temporal (PPT)",
    value: "Permiso por Protección Temporal (PPT)",
  },
  {
    label: "Permiso Especial de Permanencia (PEP)",
    value: "Permiso Especial de Permanencia (PEP)",
  },
  {
    label: "Pasaporte",
    value: "Pasaporte",
  },
  {
    label: "Tarjeta de Identidad",
    value: "Tarjeta de Identidad",
  },
  {
    label: "Número Único de Identificación Personal (NUIP)",
    value: "Número Único de Identificación Personal (NUIP)",
  },
  {
    label: "Sociedad Extranjera sin NIT en Colombia",
    value: "Sociedad Extranjera sin NIT en Colombia",
  },
  {
    label: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo",
    value: "Fideicomiso, fondos de inversión colectiva Fondo o patrimonio autónomo",
  },
  {
    label: "Número de Identificación Tributaria (NIT)",
    value: "Número de Identificación Tributaria (NIT)",
  },
  {
    label: "Ninguno",
    value: "Ninguno"
  }
];
