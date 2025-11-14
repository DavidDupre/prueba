import moment from "moment/moment";

export const formatDate = (date: string | Date | null) => {
  const newDate = moment(date).utc().format("YYYY-MM-DD");
  return newDate;
};

export const formatDateHour = (date: string | Date | null) => {
  const parsedDate = moment(date);
  const formattedDate = parsedDate.format("DD/MM/YYYY HH:mm:ss");
  return formattedDate;
};


export const formatDateMes = (date: string | Date) => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const mesIndex = moment(date).utc().month();
  return meses[mesIndex];
};

export const formatDateForDoc = (date: string | Date | null) => {
  const parsedDate = moment(date, "YYYY-MM-DD hh:mm:ss a");
  const formattedDate = parsedDate.format("DD/MM/YYYY hh:mm:ss A");
  return formattedDate;
};

export const formatDateAndTime = (date: string | Date | null) => {
  const newDate = moment.utc(date).format('DD/MM/YYYY HH:mm');
  return newDate
}

export const formatDateAndTimeTwo = (date: string | Date | null) => {
  const newDate = moment(date).format('DD-MM-YYYY');
  const newHour = moment(date).format('HH:mm');
  return newDate + ' ' + newHour
}

export const formatDateTimeStand = (date: string | Date | null) => {
  const newDate = moment(date).format('DD-MM-YYYY');
  return newDate
}

export const formatDateTimeStandTwo = (date: string | Date | null) => {
  const newDate = moment(date).utc().format('DD/MM/YYYY');
  return newDate
}
//usar este para las fechas estandares de las grillas
export const formatDateWithTimeAndMeridiem = (date: string | Date | null) => {
  if (!date || date == "-") return "-";
  return moment(date).format("DD/MM/YYYY HH:mm");
};

export const formatDateWithTimeAndMeridiemWithInputFormat = (date: string | Date | null) => {
  if (!date) return "-";
  return moment(date,"DD-MM-YYYY HH:mm").local().format("DD/MM/YYYY hh:mm A");
};

export const secondFormatDate = (date: string | Date | null) => {
  if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    // Si es así, utiliza moment especificando el formato de entrada
    return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
  } else {
    // Si no, asume que la fecha ya está en un formato reconocible
    return moment(date).format("YYYY-MM-DD");
  }
};

export const thirdFormatDate = (date: string | Date | null) => {
  return moment(date).format("YYYY/MM/DD");
};

export const fourthFormatDate = (date: string | Date | null) => {
  return moment.utc(date, "YYYY-MM-DD").format("DD/MM/YYYY HH:mm");
};

export const dateForOptions = (date: string | Date | null) => {
  return moment(date, "DD/MM/YYYY").local().format("YYYY/MM/DD");
};

export const dateForFilter = (date: string | Date | null) => {
  return moment(date, "DD/MM/YYYY").local().format("YYYY-MM-DD");
};

export const reverseFormatDate = (date: string | Date | null) => {
  return moment.utc(date, "DD/MM/YYYY").format("YYYY-MM-DD");
}

export const dateValidation = (val: string) => {
  const d = moment(val, "YYYY-MM-DD");
  if (!d.isValid()) {
    return "Error, fecha inválida";
  }
  const year = val.substring(0, 4);

  if (String(year).length > 4) {
    return "Error, formato incorrecto";
  }
  if (+val < 1900) {
    return "Error, fecha no disponible";
  }
  return true;
};

export const secondFormatDateEmpty = (date: string | Date | null) => {
  if (date == "" || date == null) {
    return "";
  }
  return secondFormatDate(date);
};

export const formatDateWithEmpty = (date: string | Date | null) => {
  if (date == "" || date == null) {
    return "";
  }
  return moment(date).format();
};

export const currentHour = (date: Date) => {
  // Verifica si se proporciona una fecha, de lo contrario, usa la fecha actual
  const currentDate = date ? moment(date) : moment();

  // Obtiene la hora actual en formato HH:mm:ss
  const currentHour = currentDate.format("HH:mm:ss");

  return currentHour;
};

export const currentHourWithoutSec = (date: Date) => {
  // Verifica si se proporciona una fecha, de lo contrario, usa la fecha actual
  const currentDate = date ? moment(date) : moment();

  // Obtiene la hora actual en formato HH:mm:ss
  const currentHour = currentDate.format("HH:mm");

  return currentHour;
};
