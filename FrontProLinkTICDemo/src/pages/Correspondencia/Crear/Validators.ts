export const alfanumericoMax50 = (val: string) => {
  const alfanumericoPattern = /^[a-zA-Z0-9][a-zA-Z0-9 ]{0,48}[a-zA-Z0-9]$/;

  if (!val.match(alfanumericoPattern)) {
    return 'El campo solo debe contener caracteres alfanuméricos';
  }

  if (val.length > 50) {
    return 'El campo debe tener un máximo de 50 caracteres';
  }

  return true;
};

export const alfanumericoMax250 = (val: string) => {
  const alfanumericoPattern = /^[a-zA-Z0-9][a-zA-Z0-9 ]{0,48}[a-zA-Z0-9]$/;

  if (!val.match(alfanumericoPattern)) {
    return 'El campo solo debe contener caracteres alfanuméricos';
  }

  if (val.length > 250) {
    return 'El campo debe tener un máximo de 50 caracteres';
  }

  return true;
};


export const opcionSeleccionada = (val: any) => {

  if (val.label === null || val.label === undefined || val.label === '') {
    return 'Debes seleccionar una opción';
  }
  return true;
};

export const opcionSeleccionadaRegion = (val: any) => {

  if (val.nombre === null || val.nombre === undefined || val.nombre === '') {
    return 'Debes seleccionar una opción';
  }
  return true;
};
export const esCorreoValido = (extraValidator: (val: string) => true | string) => {
  return (val: string): true | string => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(val)) {
      return extraValidator("El correo electrónico no es válido.");
    }

    // Llama al validador extra después de validar el formato del correo
    return extraValidator("OK");
  };
}

export const esTelefonoValido = (val: number) => {
  const telefonoRegex = /^[1-9][0-9]{6,14}$/; // Números de 7 a 15 dígitos que no comienzan con 0

  if (!telefonoRegex.test(String(val))) {
    return 'Debes introducir un número de teléfono válido';
  }

  return true;
};

export const noVacio = (val: any) => {
  if (val === null || val === undefined) {
    return 'Este campo es obligatorio';
  }

  if (typeof val === 'string' && val.trim() === '') {
    return 'Este campo es obligatorio';
  }

  if (Array.isArray(val) && val.length === 0) {
    return 'Debe seleccionar al menos un elemento';
  }

  return true;
};

export const noCeroNuloOVacio = (val: number | null | undefined) => {
  if (val === null || val === undefined || val === 0) {
    return 'El valor no puede ser 0, nulo o vacío';
  }
  return true;
};

export const esFechaValida = (val: string) => {
  // Verificar que cumple con el formato básico

  const newDate = val.replace(/\//g, "-");
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(newDate)) {
    return 'El formato de la fecha debe ser YYYY-MM-DD';
  }

  // Intentar construir un objeto Date
  const fecha = new Date(newDate);

  if (isNaN(fecha.getTime())) {
    return 'Fecha inválida';
  }

  // Verificar que los componentes de la fecha coincidan con la cadena original
  if (fecha.toISOString().slice(0, 10) !== newDate) {
    return 'Fecha inválida';
  }

  return true;
};

export const esHoraValida = (val: string) => {
// Expresión regular que valida el formato HH:mm
  const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!horaRegex.test(val)) {
    return 'El formato de la hora debe ser HH:mm';
  }

  return true;
};

export const esDireccionValida = (val: string) => {
  // Expresión regular que valida las condiciones mencionadas
  const direccionRegex = /^[a-zA-Z0-9#.-\s]+$/;

  if (!direccionRegex.test(val)) {
    return 'La dirección debe ser alfanumérica y solo puede incluir #, . y -';
  }

  return true;
};
