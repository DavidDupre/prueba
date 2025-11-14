// TODO: por ahora funciona hasta millones, además tiene el prefijo de singular o plurar. Agregar como sea necesario en el futuro
export const numberToHumanText = (n: number | string): string => {
  if (typeof n === 'string') {
    n = parseFloat(n)
  }

  if (isNaN(n)) {
    n = 0
  }

  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const decenas = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const veintenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  const veintiunidades = [
    "",
    "veintiuno",
    "veintidós",
    "veintitrés",
    "veinticuatro",
    "veinticinco",
    "veintiséis",
    "veintisiete",
    "veintiocho",
    "veintinueve"
  ];

  if (n === 0) {
    return `cero`;
  }

  if (n === 100) return 'cien';
  if (n === 1000) return 'mil';
  if (n === 100000) return 'cien mil';
  if (n === 1000000) return 'un millón';
  if (n === 100000000) return 'cien millones';
  if (n === 1000000000) return 'mil millones';

  if (n < 10) {
    return `${unidades[n]}`;
  }

  if (n >= 10 && n < 20) {
    return `${decenas[n - 10]}`;
  }

  if (n === 21) {
    return "veintiún";
}

if (n >= 21 && n < 30) {
    return `${veintiunidades[n % 10]}`;
}

  if (n >= 20 && n < 100) {
    const unidad = n % 10 !== 0 ? ` y ${unidades[n % 10]}` : "";
    return `${veintenas[Math.floor(n / 10)]}${unidad}`;
  }

  if (n >= 100 && n < 1000) {
    const decena = n % 100 !== 0 ? ` ${numberToHumanText(n % 100)}` : "";
    return `${centenas[Math.floor(n / 100)]}${decena}`;
  }

  if (n >= 1000 && n < 1000000) {
    const miles = Math.floor(n / 1000);
    const resto = n % 1000 !== 0 ? ` ${numberToHumanText(n % 1000)}` : "";
    // Check if 'miles' is 1 before deciding to use '' or 'uno'
    return `${miles === 1 ? '' : numberToHumanText(miles)} mil${resto}`;
  }

  if (n >= 1000000 && n < 1000000000) {
    const millones = Math.floor(n / 1000000);
    const resto = n % 1000000 !== 0 ? ` ${numberToHumanText(n % 1000000)}` : "";
    // Check if 'millones' is 1 before deciding to use 'un' or 'uno'
    return `${millones === 1 ? 'un' : numberToHumanText(millones)} ${millones !== 1 ? 'millones' : 'millón'}${resto}`;
  }

  // Se corrige la siguiente condición:
  if (n >= 1000000000 && n < 1000000000000) {
    const milMillones = Math.floor(n / 1000000000);
    const restoMilMillones = n % 1000000000;
    const millones = Math.floor(restoMilMillones / 1000000);
    const restoMillones = restoMilMillones % 1000000;

    return `${milMillones === 1 ? '' : numberToHumanText(milMillones)} mil ${millones !== 0 ? `${numberToHumanText(millones)} ` : ''}${millones !== 1 ? 'millones' : 'millón'} ${restoMillones !== 0 ? `${numberToHumanText(restoMillones)}` : ''}`.trim();
  }

  // Se corrige la siguiente condición:
  if (n >= 1000000000000 && n < 1000000000000000) {
    const billones = Math.floor(n / 1000000000000);
    const restoBillones = n % 1000000000000;
    const billonesText = billones === 1 ? 'billón' : 'billones';
    return `${numberToHumanText(billones)} ${billonesText} ${restoBillones !== 0 ? `${numberToHumanText(restoBillones)}` : ''}`.trim();
  }

  return "";
}
