export const routes: { [key: string]: string | undefined }[] = [
  {
    name: "Inicio",
    to: "/",
  },
  {
    name: "Expedientes",
    to: "/expediente",
  },
  {
    name: "Ciclo de expedientes",
    to: "/expediente/ciclo-expedientes",
  },
];

export const estadoOptions = [
  {
    label: "Por firmar",
    value: 1
  },
  {
    label: "Firmado",
    value: 2
  },
  {
    label: "Finalizado",
    value: 3
  },
  {
    label: "Cerrado Transferido",
    value: 4
  },
];

export const FIRMA_HEADER = [
  {
    name: "id",
    align: "center",
    label: "#",
    field: "id",
    sortable: true,
  },
  {
    name: "codigoExpediente",
    align: "center",
    label: "Número expediente",
    field: "codigoExpediente",
    sortable: true,
  },
  {
    name: "numeroRadicado",
    align: "center",
    label: "Número radicado",
    field: "numeroRadicado",
    sortable: true,
  },
  {
    name: "documento",
    align: "center",
    label: "Número documento",
    field: "documento",
    sortable: true,
  },
  {
    name: "serie",
    align: "center",
    label: "Serie",
    field: "serie",
    sortable: true,
  },
  {
    name: "subserie",
    align: "center",
    label: "Subserie",
    field: "subserie",
    sortable: true,
  },
  {
    name: "fechaInicio",
    align: "center",
    label: "Fecha inicial",
    field: "fechaInicio",
    sortable: true,
  },
  {
    name: "fechaFin",
    align: "center",
    label: "Fecha final",
    field: "fechaFin",
    sortable: true,
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
];

export const formatedDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export const util = [
  {
    "idexpediente": 58,
    "idseriesubserie": 140,
    "idradicado": 0,
    "codigoexpediente": "EXP2023123537",
    "nombreexpediente": "Expediente Prueba QA",
    "fechavigenciainicial": "2023-12-01",
    "fechavigenciafinal": "2023-12-19",
    "tipoexpediente": 1,
    "idccd": 0,
    "area": "Calidad",
    "grupo": "Calidad",
    "nivelseguridad": 2,
    "ubicacion": "Bogotá",
    "nombredocumento": "",
    "fechadocumento": null,
    "numeroradicado": null,
    "tieneanexos": false,
    "tipodocumental": null,
    "nodeid": "97846b65-aff3-4082-a2e1-fde17c3c99a7",
    "estado": 1,
    "serieSubSerie": {
      "idSeriesubserie": 140,
      "descripcion": "Actas de informe",
      "estados": true,
      "tipo_de_soporte": 1,
      "padre": {
        "idSeriesubserie": 139,
        "descripcion": "ACTAS",
        "estados": true,
        "tipo_de_soporte": 0,
        "padre": null,
        "fecha_vigencia_inicial": "2023-12-20",
        "fecha_vigencia_final": "2023-12-20",
        "observacion": null,
        "codigo": "59384",
        "nodeid": null,
        "idAlfresco": "eb7b2233-4f6f-40a8-a9fd-4dc464e8b69c",
        "seccionSubSeccion": {
          "idSeccionSubSeccion": 2453,
          "idversiontrd": {
            "id": 57,
            "codigo": "57",
            "nombreVersion": "Versión Prueba QA",
            "fechaInicio": "2023-12-05",
            "fechaFin": "2030-12-31",
            "observaciones": "",
            "estado": 54,
            "fechaVersion": "2023-12-20",
            "id_fondo": 80
          },
          "nombre": "Gerencia de Calidad",
          "padre": null,
          "codigo": "459384",
          "estado": true,
          "observacion": "",
          "idNodeAlfresco": "string",
          "idAlfresco": "691211b7-e599-478b-96e7-ba8e7b0681d0"
        },
        "procedimiento": "",
        "ct": false,
        "e": false,
        "md": false,
        "s": false,
        "tiempoArchivoGestion": 0,
        "tiempoArchivoCentral": 0
      },
      "fecha_vigencia_inicial": "2023-12-20",
      "fecha_vigencia_final": "2023-12-20",
      "observacion": "",
      "codigo": "64859",
      "nodeid": null,
      "idAlfresco": "e4ec5c9e-1759-45bf-8008-07ce76b934ca",
      "seccionSubSeccion": {
        "idSeccionSubSeccion": 2453,
        "idversiontrd": {
          "id": 57,
          "codigo": "57",
          "nombreVersion": "Versión Prueba QA",
          "fechaInicio": "2023-12-05",
          "fechaFin": "2030-12-31",
          "observaciones": "",
          "estado": 54,
          "fechaVersion": "2023-12-20",
          "id_fondo": 80
        },
        "nombre": "Gerencia de Calidad",
        "padre": null,
        "codigo": "459384",
        "estado": true,
        "observacion": "",
        "idNodeAlfresco": "string",
        "idAlfresco": "691211b7-e599-478b-96e7-ba8e7b0681d0"
      },
      "procedimiento": "Actas",
      "ct": true,
      "e": false,
      "md": false,
      "s": false,
      "tiempoArchivoGestion": 3,
      "tiempoArchivoCentral": 2
    }
  },
  {
    "idexpediente": 59,
    "idseriesubserie": 140,
    "idradicado": 0,
    "codigoexpediente": "EXP2023123572",
    "nombreexpediente": "prueba",
    "fechavigenciainicial": "2023-12-19",
    "fechavigenciafinal": "2023-12-19",
    "tipoexpediente": 3,
    "idccd": 0,
    "area": "prueba",
    "grupo": "prueba",
    "nivelseguridad": 1,
    "ubicacion": "prueba",
    "nombredocumento": "",
    "fechadocumento": null,
    "numeroradicado": null,
    "tieneanexos": false,
    "tipodocumental": null,
    "nodeid": "1bdd6e8c-1e1e-49f8-8854-49e1d25931ae",
    "estado": 1,
    "serieSubSerie": {
      "idSeriesubserie": 140,
      "descripcion": "Actas de informe",
      "estados": true,
      "tipo_de_soporte": 1,
      "padre": {
        "idSeriesubserie": 139,
        "descripcion": "ACTAS",
        "estados": true,
        "tipo_de_soporte": 0,
        "padre": null,
        "fecha_vigencia_inicial": "2023-12-20",
        "fecha_vigencia_final": "2023-12-20",
        "observacion": null,
        "codigo": "59384",
        "nodeid": null,
        "idAlfresco": "eb7b2233-4f6f-40a8-a9fd-4dc464e8b69c",
        "seccionSubSeccion": {
          "idSeccionSubSeccion": 2453,
          "idversiontrd": {
            "id": 57,
            "codigo": "57",
            "nombreVersion": "Versión Prueba QA",
            "fechaInicio": "2023-12-05",
            "fechaFin": "2030-12-31",
            "observaciones": "",
            "estado": 54,
            "fechaVersion": "2023-12-20",
            "id_fondo": 80
          },
          "nombre": "Gerencia de Calidad",
          "padre": null,
          "codigo": "459384",
          "estado": true,
          "observacion": "",
          "idNodeAlfresco": "string",
          "idAlfresco": "691211b7-e599-478b-96e7-ba8e7b0681d0"
        },
        "procedimiento": "",
        "ct": false,
        "e": false,
        "md": false,
        "s": false,
        "tiempoArchivoGestion": 0,
        "tiempoArchivoCentral": 0
      },
      "fecha_vigencia_inicial": "2023-12-20",
      "fecha_vigencia_final": "2023-12-20",
      "observacion": "",
      "codigo": "64859",
      "nodeid": null,
      "idAlfresco": "e4ec5c9e-1759-45bf-8008-07ce76b934ca",
      "seccionSubSeccion": {
        "idSeccionSubSeccion": 2453,
        "idversiontrd": {
          "id": 57,
          "codigo": "57",
          "nombreVersion": "Versión Prueba QA",
          "fechaInicio": "2023-12-05",
          "fechaFin": "2030-12-31",
          "observaciones": "",
          "estado": 54,
          "fechaVersion": "2023-12-20",
          "id_fondo": 80
        },
        "nombre": "Gerencia de Calidad",
        "padre": null,
        "codigo": "459384",
        "estado": true,
        "observacion": "",
        "idNodeAlfresco": "string",
        "idAlfresco": "691211b7-e599-478b-96e7-ba8e7b0681d0"
      },
      "procedimiento": "Actas",
      "ct": true,
      "e": false,
      "md": false,
      "s": false,
      "tiempoArchivoGestion": 3,
      "tiempoArchivoCentral": 2
    }
  }
]