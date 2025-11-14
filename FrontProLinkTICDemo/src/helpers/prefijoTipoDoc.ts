export const getAcronimobyDoc = (tipoDoc: string) => {
  const acronimos: { [key: string]: string } = {
    "Cédula Ciudadanía": "CC",
    "Cédula Extranjería": "CE",
    "Permiso por Protección Temporal (PPT)": "PPT",
    "Pasaporte": "PA",
    "Número de identificación Tributaria NIT": "NI",
    "Tarjeta de identidad": "TI",
    "Registro Civil": "RC",
    "Certificado de nacido vivo": "CN",
    "Adulto sin identificación": "AS",
    "Menor sin identificación": "MS",
    "Carné Diplomático": "CD",
    "Salvo Conducto": "SC",
    "Permiso Especial": "PE",
    "Documento Extranjería": "DE",
    "Sin Identificación": "SI",
    "Permiso Temporal": "PT"
  };

  return acronimos[tipoDoc] || "";
};

export const getAcronimobyId = (id: number): string => {
  const acronimos: { [key: number]: string } = {
      3: "CD",  // Carné Diplomático
      1: "CC",  // Cédula Ciudadanía
      2: "CE",  // Cédula Extranjería
      9: "",    // Fideicomisos, Fondos de Inversión Colectiva, Fondo o Patrimonio Autónomo (sin acrónimo)
      10: "NI", // Número de Identificación Tributaria (NIT)
      7: "",    // Número Único de Identificación Personal (NUIP) (sin acrónimo)
      11: "PA", // Pasaporte
      5: "PEP", // Permiso Especial de Permanencia (PEP)
      4: "PPT", // Permiso por Protección Temporal (PPT)
      8: "",    // Sociedad Extranjera sin NIT en Colombia (sin acrónimo)
      6: "TI"   // Tarjeta de Identidad
  };

  return acronimos[id] || "";
};