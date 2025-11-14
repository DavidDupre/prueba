import type { FormStructure, Input } from './index';

// Definir el tipo para los componentes del JSON
interface FormComponent {
  type?: string;
  label?: string;
  key?: string;
  id?: string;
  name?: string;
  title?: string;
  text?: string;
  validate?: {
    required?: boolean;
    pattern?: string;
    validationType?: string;
    customMessage?: string;
  };
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  values?: Array<{ label: string; value: string | number }> | string[];
  data?: {
    values?: Array<{ label: string; value: string | number }>;
  };
  options?: Array<{ label: string; value: string | number }>;
  items?: Array<{ label: string; value: string | number }>;
  endpoint?: string;
  multiple?: boolean;
  hidden?: boolean;
  defaultValue?: string | number | boolean;
  layout?: {
    row?: string;
    columns?: number | null;
  };
}

export const fieldConfigParser = (data: unknown): FormStructure => {
  const raw = (data as Record<string, unknown>) ?? {};

  // Extraer componentes de manera segura
  let components: FormComponent[] = [];

  if (Array.isArray(raw.components)) {
    components = raw.components as FormComponent[];
  } else if (Array.isArray(raw)) {
    components = raw as FormComponent[];
  } else if (Array.isArray(raw.inputs)) {
    components = raw.inputs as FormComponent[];
  } else if (raw.inputs && typeof raw.inputs === 'object') {
    components = Object.entries(raw.inputs as Record<string, FormComponent>).map(([k, v]) => ({
      key: k,
      ...v,
    }));
  }

  const recognizedInputTypes = new Set([
    'textfield',
    'text',
    'string',
    'select',
    'dropdown',
    'number',
    'numeric',
    'time',
    'date',
    'datetime',
    'textarea',
    'checkbox',
    'file',
    'upload',
    'separator',
  ]);

  const inputs: Input[] = components
    .map((c: FormComponent, idx: number) => {
      const t = (c.type || '').toString().toLowerCase();

      const looksLikeInput =
        !!c.key ||
        recognizedInputTypes.has(t) ||
        Array.isArray(c.values) ||
        typeof c.label === 'string' ||
        typeof c.text === 'string';

      if (!looksLikeInput) return null;

      const key = c.key || c.id || c.name || c.title || `field_${idx}`;

      // Separador - no necesita key
      if (t === 'separator') {
        return {
          type: 'separator',
          nombre: c.text || c.label || '',
          text: c.text,
          label: c.id || `separator_${idx}`,
          config: c as Record<string, unknown>,
          layout: c.layout,
        } as Input;
      }

      // Texto/Título - no necesita key
      if (t === 'text') {
        return {
          type: 'text',
          nombre: c.text || c.label || '',
          text: c.text,
          label: c.id || `text_${idx}`,
          config: c as Record<string, unknown>,
          layout: c.layout,
        } as Input;
      }

      let mappedType: string = 'text';
      if (['textfield', 'text', 'string'].includes(t)) mappedType = 'text';
      else if (['select', 'dropdown'].includes(t)) mappedType = 'select';
      else if (['number', 'numeric'].includes(t)) mappedType = 'number';
      else if (['time'].includes(t)) mappedType = 'time';
      else if (['date', 'datetime'].includes(t)) mappedType = 'date';
      else if (['textarea'].includes(t)) mappedType = 'textarea';
      else if (['checkbox'].includes(t)) mappedType = 'checkbox';
      else if (['file', 'upload'].includes(t)) mappedType = 'file';

      const input: Input = {
        type: mappedType,
        nombre: c.label || c.title || c.text || '',
        label: key,
        required: !!(c.validate && c.validate.required),
        disabled: !!c.disabled,
        multiple: !!c.multiple,
        config: c as Record<string, unknown>,
        hint: c.placeholder || '',
        class: c.className || '',
        key: key,
        ...(c.layout && { layout: c.layout }),
        ...(c.defaultValue !== undefined && { defaultValue: c.defaultValue }),
      };

      // Agregar opciones para selects
      if (mappedType === 'select') {
        input.options = c.values || c.options || c.items || c.data?.values || [];
      }

      if (c.validate?.required) {
        const errorMessage = c.validate.customMessage || 'El campo es obligatorio';
        input.rules = [(v: unknown) => !!v || errorMessage];
      }

      return input;
    })
    .filter((input): input is Input => input !== null);

  return { title: (raw.title as string) || (raw.type as string) || '', inputs };
};
