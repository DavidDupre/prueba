export const lengthInput = (n: number, val: any) => {
  return val?.length > n ? "Máximo " + n + " cáracteres" : true;
};

export const inputRequired = (val: any) => {
  if (val?.length === 0 || val === null) {
    return "Este campo es requerido";
  }

  return true;
};

export const inputRequiredWithoutValue = (val: string) => {
  if (val.length < 1 || val == null || val == "") return false;
  return true;
};

export const inputSelectRequired = (val: any) => {
  if (val === null) {
    return "Este campo es requerido";
  }

  return true;
};

export const maxLengthInputForRich = (n: number, val: any) => {
  if (!val?.length) {
    return true;
  } else {
    const texto = val;
    const etiquetaIgnorar = /<img.*?>/g;
    const textoSinEtiqueta = texto.replace(
      new RegExp(etiquetaIgnorar, "g"),
      " "
    );
    const expresionRegular = /<.*?>/g;
    const cantidadCaracteres = textoSinEtiqueta.replace(
      new RegExp(expresionRegular, "g"),
      ""
    ).length;
    return cantidadCaracteres <= n || "Máximo " + n + " caracteres";
  }
};

export const maxLengthInputForRich2 = (n: number, val: any) => {
  if (!val?.length) {
    return true;
  } else {
    const etiquetaIgnorar = /<img[^>]*>/gi;
    const textoSinImagenes = val.replace(etiquetaIgnorar, "");
    const expresionRegular = /<[^>]*>/g;
    const textoSinEtiquetas = textoSinImagenes.replace(expresionRegular, "");
    const textoDecodificado = decodeHTMLEntities(textoSinEtiquetas);
    const cantidadCaracteres = textoDecodificado.length;

    return cantidadCaracteres <= n || `Máximo ${n} caracteres`;
  }
};

function decodeHTMLEntities(text: string): string {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

export const maxLengthInput = (n: number, val: any) => {
  val = `${val}`;

  if (!val?.length) {
    return true;
  }
  return val?.length <= n || "Máximo " + n + " caracteres";
};

export const maxLengthInputCustom = (n: number, val: any, field: string) => {
  if (!val?.length) {
    return true;
  }
  return (
    val?.length <= n ||
    "El " + field + " debe contener máximo " + n + " caracteres"
  );
};

export const minLengthInput = (n: number, val: any) => {
  if (!val?.length) {
    return true;
  }
  return val?.length >= n || "Mínimo " + n + " caracteres";
};

export const minLengthInputCustom = (n: number, val: any, field: string) => {
  if (!val?.length) {
    return true;
  }
  return (
    val?.length >= n ||
    "El " + field + " debe contener al menos " + n + " caracteres"
  );
};

export const minLengthInputCustomAsignacion = (n: number, val: any, field?: string) => {
  if (!val?.length) {
    return true;
  }
  return (
    val?.length >= n || `El ${field || 'mensaje'} debe contener al menos ${n} caracteres`
  );
};

export const preciseLengthInput = (n: number, val: any) => {
  if (!val?.length) {
    return true;
  }
  return val?.length == n || "Debe contener " + n + " caracteres";
};

export const homePhoneNumber = (val: any) => {
  // Acepta números fijos que empiecen por 03X o 60X + 7 dígitos
  const expresionRegular = /^(03[0-9]|60[1-9])[0-9]{7}$/;
  if (val) {
    return (
      expresionRegular.test(val) ||
      "El número de teléfono fijo debe contener el indicativo (ej: 031 o 601) y un total de 10 dígitos"
    );
  }
  return true;
};

export const homePhoneNumberAndMaxLength = (n: number, val: any) => {
  const expresionRegular = new RegExp(
    `^(601|602|603|604|605|606|607|608|609)\\d{7,${n - 3}}$`
  );
  if (val) {
    return (
      expresionRegular.test(val) ||
      `El número de teléfono fijo debe contener el indicativo y maximo ${n} dígitos`
    );
  }
};

export const phoneFormat = (val: any) => {
  const expresionRegular = /^[0-9]{7}$|^[0-9]{10}$/;
  if (val) {
    return (
      expresionRegular.test(val) ||
      "El número de teléfono debe contener al menos 7 o 10 dígitos"
    );
  }
};

export const mobilePhonNumber = (val: any) => {
  if (!val) return true; // No valida si el campo está vacío
  // Teléfonos celulares en Colombia: 30, 31, 32, 35 + 8 dígitos
  const celularRegex = /^(30|31|32|35)[0-9]{8}$/;
  //  Teléfonos fijos: 03X o 60X + 7 dígitos
  const fijoRegex = /^(03[0-9]|60[1-9])[0-9]{7}$/;
  // Si cumple con alguna de las dos expresiones, está correcto
  if (celularRegex.test(val) || fijoRegex.test(val)) {
    return true;
  }
  // Si no cumple, mostramos el mensaje
  return "Ingrese un número de teléfono válido (celular o fijo con indicativo)";
};

export const mobilePhonNumberCel = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8}$/;
  if (val) {
    if (val.length < 11 && !expresionRegular.test(val)) {
      return "Ingrese un número de celular válido";
    } else if (!expresionRegular.test(val)) {
      return "El número de celular debe contener máximo 10 dígitos";
    }
  }
};

export const mobilePhoneNumberTenToTwelve = (val: string) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8,10}$/;
  if (val) {
    if (!expresionRegular.test(val)) {
      if (val.length < 10) {
        return "El número de teléfono debe contener al menos 10 dígitos";
      } else if (val.length > 12) {
        return "El número de teléfono no puede contener mas de 12 dígitos";
      } else {
        return "Ingrese un número de teléfono válido";
      }
    }
  }
};

export const validationEmail = (email: string) => {
  // const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const patron =
    /^(?!.*\.\.)(?!^\.)(?!\.$)(?!^_)(?!_$)(?!^-)(?!-$)(?!^\%)(?!\%$)(?!^\+)(?!\+$)(?!.*\.\.@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email) {
    if (!patron.test(email)) {
      return "Ingrese un correo electrónico válido";
    }

    return true;
  }
  return true;
};

export const validationEmailOnlyOne = (email: string) => {
  // Validación básica de formato de correo electrónico
  const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!patron.test(email)) {
    return "Ingrese un correo electrónico válido";
  }

  // Verificar si hay comas
  if (email.includes(",")) {
    return "Solo se permite un correo electrónico";
  }

  return true;
};

export const validateNoDecimal = (value: string | number) => {
  const regex = /^[^.]*$/; // No debe contener un punto (.)

  return regex.test(String(value)) || "El campo no debe contener decimales";
};

export const validateNumber = (value: string | number) => {
  const regex = /^[1-9][0-9]*$/; // Empieza con un número del 1 al 9 y sigue con cualquier dígito (o ninguno)

  return (
    regex.test(String(value)) ||
    "El campo no debe empezar con cero o tener letras"
  );
};

export const onlyNumbers = (value: string) => {
  const regex = /^([0-9])*$/;

  return regex.test(value) || "El campo solo debe contener números";
};

export const onlyNumbersForRad = (value: string) => {
  const regex = /^([0-9 ])*$/;

  return regex.test(value) || "El campo solo debe contener números";
};

export const nonRequiredOnlyNumbers = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^([0-9])*$/;

    return regex.test(value) || "El campo solo debe contener números";
  }
};

export const alphanumericWithSpaceAndHashtag = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-Z0-9# ]+$/;
    return regex.test(value) || "El campo solo permite valores alfanuméricos";
  }
};

export const addressValidation = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-Z0-9#\-,. áéíóúÁÉÍÓÚÑñ]+$/;
    return regex.test(value) || "Caracteres no válidos en la dirección";
  }
};

export const alphanumericWithSpace = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-Z0-9 ,.:]+$/;
    return regex.test(value) || "El campo solo permite valores alfanuméricos";
  }
};

export const alphanumeric = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[\p{L}\d\s'’\-&]+$/u;
    return regex.test(value) || "El campo solo permite letras y números";
  }
};

export const alphanumericWithPoint = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[\p{L}\d\s.,;:'-]+$/u;
    // const regex = /^[\p{L}\d\s,'-]+$/u;
    return regex.test(value) || "El campo solo permite valores alfanuméricos";
  }
};

export const alphanumericAbsolute = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[\p{L}\d\s]+$/u;
    // const regex = /^[\p{L}\d\s,'-]+$/u;
    return regex.test(value) || "El campo solo permite valores alfanuméricos";
  }
};

export const nonRequiredAlphanumeric = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /[A-Za-z0-9_ñÑ]/;
    return regex.test(value) || "El campo solo permite valores alfanuméricos";
  }
};

export const alphabetical = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-ZñÑ\s]*$/;
    return regex.test(value) || "El campo solo permite letras";
  }
};

export const alphabeticalWithSpecialCharacters = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-ZñÑ\s%$#"“”&¿?¡!().,áéíóúÁÉÍÓÚ]*$/;
    return regex.test(value) || "El campo solo permite letras y caracteres especiales";
  }
};

export const nonRequiredAlphabetical = (value: string) => {
  const regex = /^[a-zA-ZñÑ\s]*$/;
  return regex.test(value) || "El campo solo permite letras";
};

export const validateDate = (val: any) => {
  const inputDate = new Date(val);
  inputDate.setHours(0, 0, 0, 0); // Ignorar la hora actual para comparar solo las fechas.

  const currentDate = new Date();

  if (inputDate >= currentDate) {
    return "La fecha debe ser anterior a la fecha actual";
  }

  if (isNaN(inputDate.getTime()) && val !== "") {
    return "Introduzca una fecha real";
  }

  return true;
};

export const validateDateWithoutLimit = (val: any) => {
  const inputDate = new Date(val);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ignorar la hora actual para comparar solo las fechas.

  if (isNaN(inputDate.getTime()) && val !== "") {
    return "Introduzca una fecha real";
  }

  return true;
};

export const nonRequiredNotNumber = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^([a-zA-Z ])*$/;

    return regex.test(value) || "El campo solo debe contener números";
  }
};

export const notNumber = (value: string) => {
  const regex = /^([a-zA-Z ])*$/;
  return regex.test(value) || "El campo solo debe contener letras";
};

export const alphanumericNotSpecial = (value: string) => {
  const regex = /^[a-zA-Z0-9\u00C0-\u00FF.;, \-_]+$/;
  return (
    regex.test(value) ||
    'El campo tiene uno o varios caracteres inválidos: (*, ", <, >, \\, /, ?, :, |).'
  );
};

export const notRequiredlphanumericNotSpecial = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[a-zA-Z0-9\u00C0-\u00FF.;, \-_]+$/;
    return (
      regex.test(value) ||
      'El campo tiene uno o varios caracteres inválidos: (*, ", <, >, \\, /, ?, :, |).'
    );
  }
};

export const greaterThan = (n: number, val: number) => {
  if (val > n) {
    return true;
  } else {
    return "El valor debe ser mayor a " + n;
  }
};

export const greaterThan2 = (n: number, val: number) => {
  if (!val) {
    return true;
  } else if (val > n) {
    return true;
  } else {
    return "El valor debe ser mayor a " + n;
  }
};

export const lessThan = (n: number, val: number) => {
  if (val < n) {
    return true;
  } else {
    return "El valor debe ser menor a " + n;
  }
};

export const alphanumeric2 = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[\p{L}\d\s'’]+$/u;
    return (
      regex.test(value) ||
      "El campo solo permite valores alfanuméricos sin guiones ni caracteres especiales"
    );
  }
};

export const alphanumericbyEntes = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[\p{L}\d\s'’]+$/u;
    return (
      regex.test(value) ||
      "El campo solo debe contener números y letras"
    );
  }
};

export const alphanumeric2WithSpace = (value: string) => {
  if (!value) {
    return true;
  } else {
    const regex = /^[A-Za-z0-9 ]*$/
    return (
      regex.test(value) ||
      "El campo solo permite valores alfanuméricos sin guiones ni caracteres especiales"
    );
  }
};


export const numbersInRange = (value: number, min: number, max: number) => {
  if (
    value >= min &&
    value <= max &&
    value.toString().length === value.toString().replace(/^0+/, "").length
  ) {
    return true;
  } else {
    return `El campo solo permite números del ${min} al ${max} sin ceros a la izquierda`;
  }
};

export const homePhoneNumberMinAndMaxLength = (val: any) => {
  const expresionRegular = /^(601|602|603|604|605|606|607|608|609)[0-9]{4,7}$/;
  if (val) {
    return (
      expresionRegular.test(val) ||
      "El número de teléfono debe contener el indicativo y tener entre 7 y 10 números"
    );
  }
};

// ! Keypress
export function onlyAlphaNumeric(event: {
  which: any;
  keyCode: any;
  preventDefault: () => void;
}) {
  let charCode = event.which ? event.which : event.keyCode;
  let charTyped = String.fromCharCode(charCode);
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ]*$/;
  if (regex.test(charTyped)) {
    return true;
  } else {
    // event.preventDefault();
    return false;
  }
}

export function onlyNumber(event: {
  keyCode: any;
  which: any;
  preventDefault: () => void;
}) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if (keyCode >= 48 && keyCode <= 57) {
    return true;
  }
  event.preventDefault();
  return false;
}

export const alphanumericSelect = (v) => {
  if(v==null || v?.length==0) return true;
  return /^[a-zA-Z0-9]+$/.test(v);
};

export const noCaracteresEspecialesSelect = (v) => {
  if(v==null || v?.length==0) return true;
  return /^[a-zA-Z0-9]+$/.test(v) || 'No se permiten caracteres especiales';
};

export const maxLengthInputSelect = (max:number, v:string) => {
  if(v==null || v?.length==0) return true
  return Number(v.length) <= max || `No puede ingresar mas de ${max} caracteres`;
};
