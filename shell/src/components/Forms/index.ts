// Tipo de regla de validación genérico (compatible con Quasar)
export type ValidationRule = (val: unknown) => boolean | string;

// Eliminar los tipos redundantes y usar solo string
export type InputType =
  | 'select'
  | 'text'
  | 'date'
  | 'time'
  | 'textarea'
  | 'number'
  | 'percentage'
  | 'file'
  | 'checkbox';

export interface Input {
  type?: string; // Permitir tanto los tipos específicos como cualquier string
  nombre?: string;
  text?: string; // Para separadores y títulos
  validaciones?: ValidationRule[];
  required?: boolean;
  disabled?: boolean;
  label?: string;
  options?: string[] | { label: string; value: string | number }[];
  endpoint?: string;
  multiple?: boolean;
  accept?: string;
  hide?: (value: unknown) => boolean;
  config?: Record<string, unknown>;
  rules?: ValidationRule[];
  hint?: string;
  class?: string;
  key?: string;
  name?: string;
  defaultValue?: string | number | boolean;
  layout?: {
    row?: string;
    columns?: number | null;
  };
  values?: { label: string; value: string | number }[];
}

export interface FormStructure {
  title?: string;
  inputs: Input[];
}
