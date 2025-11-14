import {
  alfanumericoMax50,
  alfanumericoMax250,
  opcionSeleccionada,
  noVacio,
  numericValidator
} from "./Validators";
import {maxLengthInput} from "src/helpers/validations";

export interface TypeDocumentalObjectBase  {
  idTipologiaDocumental?: number;
  estado: boolean;
  nombre: string;
  codigoTipologiaDocumental: string;
  nombreCorto: string;
  siglaIndice: string;
  descripcionIndice: string;
  descripcion: string;
  terminoTramite?: number;
  tipoDeRadicado?: number;
  tipoEntidadDocumento?: number;
  esUnDocumentoIndexable: boolean;
  esUnDocumentoGestion: boolean;
  esUnDocumentoPlantilla: boolean;
  labelIndice: boolean;
  bloqueoIndice: boolean;
  exigidoIndice: boolean;
  unicoIndice: boolean;
  visibleIndice: boolean;
  indexableIndice: boolean;
  editableIndice: boolean;
  esUnDocumentoPlantillaTipoFormulario: boolean
}

export class TypeDocumentalObject implements TypeDocumentalObjectBase {
  idTipologiaDocumental?: number;
  estado: boolean;
  nombre: string;
  codigoTipologiaDocumental: string;
  nombreCorto: string;
  siglaIndice: string;
  descripcionIndice: string;
  descripcion: string;
  esUnDocumentoIndexable: boolean;
  esUnDocumentoGestion: boolean;
  esUnDocumentoPlantilla: boolean;
  labelIndice: boolean;
  bloqueoIndice: boolean;
  exigidoIndice: boolean;
  unicoIndice: boolean;
  visibleIndice: boolean;
  indexableIndice: boolean;
  editableIndice: boolean;
  esUnDocumentoPlantillaTipoFormulario: boolean

  constructor(def?: TypeDocumentalObjectBase){
    this.idTipologiaDocumental = def?.idTipologiaDocumental || null;
    this.estado = def?.estado || false;
    this.nombre = def?.nombre || '';
    this.codigoTipologiaDocumental = def?.codigoTipologiaDocumental || '';
    this.nombreCorto = def?.nombreCorto || '';
    this.siglaIndice = def?.siglaIndice || '';
    this.descripcionIndice = def?.descripcionIndice || '';
    this.descripcion = def?.descripcion || '';
    this.esUnDocumentoIndexable = def?.esUnDocumentoIndexable || false;
    this.esUnDocumentoGestion = def?.esUnDocumentoGestion || false;
    this.esUnDocumentoPlantilla = def?.esUnDocumentoPlantilla || false;
    this.labelIndice = def?.labelIndice || false;
    this.bloqueoIndice = def?.bloqueoIndice || false;
    this.exigidoIndice = def?.exigidoIndice || false;
    this.unicoIndice = def?.unicoIndice || false;
    this.visibleIndice = def?.visibleIndice || false;
    this.indexableIndice = def?.indexableIndice || false;
    this.editableIndice = def?.editableIndice || false;
    this.esUnDocumentoPlantillaTipoFormulario = def?.esUnDocumentoPlantillaTipoFormulario || false;
  }
}

export const Fields = {
  idTipologiaDocumental: 'idTipologiaDocumental',
  nameTypeDocumental: 'nameTypeDocumental',
  shortName: 'shortName',
  documentType: 'documentType',
  isIndexable: 'isIndexable',
  isGestionDocument: 'isGestionDocument',
  isTemplateDocument: 'isTemplateDocument',
  initialsIndex: 'initialsIndex',
  description: 'description',
  labelIndice: 'labelIndice',
  indexBlock: 'indexBlock',
  indexRequired: 'indexRequired',
  uniqueIndex: 'uniqueIndex',
  visibleIndice: 'visibleIndice',
  accessIndex: 'accessIndex',
  editIndex: 'editIndex',
  typeForm: 'typeForm',
}

export interface GeneralSelector {
  label: string;
  value: number | string;
}

export interface GeneralResponse {
  status: boolean;
  msg : number | string;
}

export interface FormBase {
  idTipologiaDocumental?: number;
  nameTypeDocumental: string;
  shortName: string;
  documentType: GeneralSelector;
  isIndexable: boolean;
  isGestionDocument: boolean;
  isTemplateDocument: boolean;
  initialsIndex: string;
  description: string;
  labelIndice: boolean;
  indexBlock: boolean;
  indexRequired: boolean;
  uniqueIndex: boolean;
  visibleIndice: boolean;
  accessIndex: boolean;
  editIndex: boolean;
  typeForm: boolean;
}

export class FormTypeDocumenatal implements FormBase {
  idTipologiaDocumental?: number;
  nameTypeDocumental: string;
  shortName: string;
  documentType: GeneralSelector;
  isIndexable: boolean;
  isGestionDocument: boolean;
  isTemplateDocument: boolean;
  initialsIndex: string;
  description: string;
  labelIndice: boolean;
  indexBlock: boolean;
  indexRequired: boolean;
  uniqueIndex: boolean;
  visibleIndice: boolean;
  accessIndex: boolean;
  editIndex: boolean;
  typeForm: boolean;

  constructor(def?: FormBase) {
    this.idTipologiaDocumental = def?.idTipologiaDocumental ?? null;
    this.nameTypeDocumental = def?.nameTypeDocumental ?? '';
    this.shortName = def?.shortName ?? '';
    this.documentType = def?.documentType ?? {label: '', value: null},
    this.isIndexable = def?.isIndexable ?? null;
    this.isGestionDocument = def?.isGestionDocument ?? null;
    this.isTemplateDocument = def?.isTemplateDocument ?? null;
    this.initialsIndex = def?.initialsIndex ?? '';
    this.description = def?.description ?? '';
    this.labelIndice = def?.labelIndice ?? null;
    this.indexBlock = def?.indexBlock ?? null;
    this.indexRequired = def?.indexRequired ?? null;
    this.uniqueIndex = def?.uniqueIndex ?? null;
    this.visibleIndice = def?.visibleIndice ?? null;
    this.accessIndex = def?.accessIndex ?? null;
    this.editIndex = def?.editIndex ?? null;
    this.typeForm = def?.typeForm ?? null;

  }
}


export interface OptionRadioGroup {
  label: string;
  value: boolean;
  classes: string;
}

const optionsRadio : OptionRadioGroup[] = [
  {
    label: 'Sí',
    value: true,
    classes: 'q-mr-md'
  },
  {
    label: 'No',
    value: false,
    classes: 'q-mr-lg'
  },
]
const optionsTypesDocuments : GeneralSelector[] = [
  {
    label: 'Tipo documento 1',
    value: 1
  },
  {
    label: 'Tipo documento 2',
    value: 2
  },
  {
    label: 'Tipo documento 3',
    value: 3
  },
]


export const formBaseCreate = [
  {
    header: { label: '' },
    rows: [
      [
        { type: 'text', col: 12, label: 'Nombre tipología documental (Largo) *', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.nameTypeDocumental, rules: [alfanumericoMax50]},
      ],
      [
        { type: 'text', col: 6, label: 'Nombre corto (Sigla) *', placeholder: 'Ingrese sigla' , required: false, nameField: Fields.shortName, rules: [alfanumericoMax50]},
        { type: 'select', disabled: false, col: 6, label: 'Tipología documento *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsTypesDocuments, required: true, nameField: Fields.documentType, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento indexable? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isIndexable, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento de gestión? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isGestionDocument, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento tipo plantilla? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isTemplateDocument, rules: [opcionSeleccionada, noVacio]},
        { type: 'text', col: 6, label: 'Sigla índice *', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.initialsIndex, rules: [val => maxLengthInput(4, val)]},
      ],
      [
        { type: 'textMultiLine', col: 12, label: 'Descripción Indice *', required: true, nameField: Fields.description, rules: [alfanumericoMax250]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Label índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.labelIndice, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Bloqueo índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.indexBlock, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Exigido índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.indexRequired, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Único índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.uniqueIndex, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Visible índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.visibleIndice, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Indexable índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.accessIndex, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Editable índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.editIndex, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es documento plantilla, tipo formulario? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.typeForm, rules: [opcionSeleccionada, noVacio]},
      ],
    ]
  },
  // Continue with other accordions' data structures
]

export const formBaseEdit = [
  {
    header: { label: '' },
    rows: [
      [
        { type: 'text', col: 6, label: 'Id tipología documental', placeholder: '' , disabled: true ,required: false, nameField: Fields.idTipologiaDocumental , rules: [numericValidator]},
        { type: 'text', col: 6, label: 'Nombre tipología documental (Largo) *', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.nameTypeDocumental, rules: [alfanumericoMax50]},
      ],
      [
        { type: 'text', col: 6, label: 'Nombre corto (Sigla) *', placeholder: 'Ingrese sigla' , required: false, nameField: Fields.shortName, rules: [alfanumericoMax50]},
        { type: 'select', disabled: false, col: 6, label: 'Tipo documento *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsTypesDocuments, required: true, nameField: Fields.documentType, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento indexable? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isIndexable, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento de gestión? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isGestionDocument, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es un documento tipo plantilla? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.isTemplateDocument, rules: [opcionSeleccionada, noVacio]},
        { type: 'text', col: 6, label: 'Sigla índice *', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.initialsIndex, rules: [alfanumericoMax50]},
      ],
      [
        { type: 'textMultiLine', col: 12, label: 'Descripción Indice *', required: true, nameField: Fields.description, rules: [alfanumericoMax250]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Label índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.labelIndice, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Bloqueo índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.indexBlock, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Exigido índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.indexRequired, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Único índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.uniqueIndex, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Visible índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.visibleIndice, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: 'Indexable índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.accessIndex, rules: [opcionSeleccionada, noVacio]},
      ],
      [
        { type: 'radioGroup', disabled: false, col: 6, label: 'Editable índice *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.editIndex, rules: [opcionSeleccionada, noVacio]},
        { type: 'radioGroup', disabled: false, col: 6, label: '¿Es documento plantilla, tipo formulario? *', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: optionsRadio , required: true, nameField: Fields.typeForm, rules: [opcionSeleccionada, noVacio]},
      ],
    ]
  },
  // Continue with other accordions' data structures
]
