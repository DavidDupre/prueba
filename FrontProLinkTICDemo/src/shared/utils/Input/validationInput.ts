const validateRequiredField = (val: string | null | undefined): string | null => {
  return isNullOrUndefined(val) || val.trim() === "" ? "Este campo es requerido" : null;
};

const maxLengthField = (n: number, val: string): string | null => {
  return val.length > n ? `Máximo ${n} caracteres` : null;
};

const minLengthField = (n: number, val: string): string | null => {
  return val.length < n ? `Mínimo ${n} caracteres` : null;
};

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return obj === null || obj === undefined;
}


export {validateRequiredField,maxLengthField,minLengthField,isNullOrUndefined}
