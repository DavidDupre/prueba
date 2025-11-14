import moment from 'moment';

export const formatDateWithTimeAndMeridiem = (value: string): string => {
  return value ? moment(value).format("DD/MM/YYYY hh:mm A") : "-";
};

export const getCanalType = (): string => {
  return "Canal"; 
};

export const formatCanal = (row: any): string => {
  return row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla";
};

export const formatTiempoAsignado = (row: any): string => {
  const unidad = row?.tiempoAsignado?.unidad;
  const medida = row?.tiempoAsignado?.medida;
  return unidad && medida ? `${unidad} ${medida}` : "-";
};

export const formatTiempoPorVencer = (row: any): string => {
  const valor = row?.tiempoPorVencer;
  const medida = row?.tiempoAsignado?.medida;
  if (valor === undefined || valor === null) return "-";
  if (valor < 0) return "Vencido";
  return `${valor} ${medida === "DIAS" ? "Días" : "Horas"}`;
};

export const formatTiempoAsignadoGeneral = (row: any): string => {
  return row?.tiempoAsignado
    ? `${row.tiempoAsignado} ${
        row.tipoTiemposAsignado === 'DIA'
          ? row.tiempoAsignado === 1 ? 'Día' : 'Días'
          : row.tiempoAsignado === 1 ? 'Hora' : 'Horas'
      }`
    : "-";
};

export const formatTiempoPorVencerGeneral = (row: any): string => {
  if (row?.tiempoXVencer === undefined || row?.tiempoXVencer === null) return "-";
  if (row.tiempoXVencer < 0) return "Vencido";
  return `${row.tiempoXVencer} ${row?.tipoTiemposAsignado === "DIA" ? "Días" : "Horas"}`;
};

export const formatPersona = (documento?: string, nombre?: string): string => {
  return documento && nombre ? `${documento} - ${nombre}` : "-";
};

export const formatUbicacion = (row: any): string => {
  return row.pais
    ? `${row?.ciudad || row?.pais} - ${row?.departamento || row?.pais}`
    : "-";
};

export const formatRadicado = (row: any, estadosRadicadoSalida: string[]): string => {
  return estadosRadicadoSalida.includes(row.estado)
    ? row.documentos?.radicadoSalidaAprobar
    : row.idRadicacion || "-";
};
