<script setup lang="ts">
import {
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Base64UploadAdapter,
  Bold,
  ButtonView,
  Code,
  CodeBlock,
  DecoupledEditor,
  Editor,
  EditorConfig,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  Image,
  ImageInsert,
  ImageResize,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  RemoveFormat,
  RestrictedEditingMode,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  StandardEditingMode,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Underline,
  Undo,
  List,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { onMounted, ref, toRefs, watch } from "vue";
import { PdfManipulate } from "src/helpers/DocumentManipulator";
import PdfView from "src/shared/components/PdfView/PdfView.vue";
import FontSizeModal from "src/shared/components/Modal/FontSizeModal.vue";
import SearchColumn from "src/shared/components/SearchColumn/SearchColumn.vue";
import { useDocumentStore } from "src/stores/documentStore";
import collaboration from "./Collaboration.vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "stores/auth.store";
import { useRoute } from "vue-router";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import FieldModalAgregarCampo from "../Modal/FieldModalAgregarCampo.vue";
import { maxLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";

let desciption = ref<string>("");
let autosaveTimeout: ReturnType<typeof setTimeout> | null = null;
const pdfDocument = ref(null);
const showPdfViewer = ref(false);
const showSearchColumn = ref(false);
const showFontSizeModal = ref(false);
const acceptedId = ref<number | null>(null);
const fontSize = ref<number>(11);
const filteredCollaborators = ref<Array<any>>([]);
const documentStore = useDocumentStore();
const auth = useAuthStore();
const route = useRoute();
const showRemoveCollabModal = ref(false);
const selectedDiv = ref(null);
const comment = ref("");
const comunicacionMasivaId = ref(route.params.id);
const availableFields = ref<Array<any>>([]);

const showAddFieldModal = ref(false);
const newField = ref({
  name: "",
  type: "",
  format: "",
  maxLength: 250,
  allowSpecialChars: true,
});

let isInitialLoad = true;
const props = defineProps({
  id: {
    type: Number,
    required: false,
  },
  agregarCampos: {
    type: Boolean,
    default: true,
  },
  base64: {
    type: String,
    required: true,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  restric: {
    type: Boolean,
    default: false,
  },
  referentKey: {
    require: true,
    type: Object,
  },
  internalCom: {
    required: false,
    type: Object,
  },
  data: {
    require: true,
    type: Object,
  },
  document: {
    type: String,
    required: true,
  },
  revisado: {
    type: Boolean,
    required: false,
  },
  aprobado: {
    type: Boolean,
    required: false,
  },
  dataHeader: {
    require: false,
    type: Object,
  },
  isEditorEmpty: {
    require: false,
    type: Boolean,
  },
  imgBase64: {
    type: Object,
    required: false,
  },
  aling: false,
  collaboration: {
    type: Boolean,
    default: false,
  },
  changesCollaborators: {
    type: Array,
    default: [],
  },
  isCloner: {
    type: Boolean,
    default: false,
  },
  isMasivo: {
    type: Boolean,
    default: false,
  },
  autoSaveOnMount: {
    type: Boolean,
    default: false,
  },
});
const { revisado, aprobado } = toRefs(props);
const config: EditorConfig = {
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "link",
      "insertTable",
      "highlight",
      "blockQuote",
      "codeBlock",
      "|",
      "alignment",
      "|",
      "outdent",
      "indent",
      "|",
      "insertImage",
      "|",
      "verPdf",
      "tamañoFuente",
      "listaDesc",
      "bulletedList",
      "numberedList",
      props.agregarCampos ? "agregarCampos" : null,
      props.restric ? "restrictedEditingException" : null,
      props.isDisable ? "restrictedEditingException" : null,
    ],
  },
  plugins: [
    AccessibilityHelp,
    Alignment,
    Autoformat,
    AutoLink,
    Autosave,
    BalloonToolbar,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    RemoveFormat,
    SelectAll,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Underline,
    Undo,
    Image,
    ImageToolbar, // Plugin para mostrar la barra de herramientas en la imagen
    ImageResize, // Plugin para permitir redimensionar la imagen
    ImageInsert, // Inserción de imagen
    Base64UploadAdapter,
    List, Autoformat,
    props.agregarCampos ? AgregarCamposPlugin : null,
    props.restric ? RestrictedEditingMode : StandardEditingMode,
    props.isDisable ? RestrictedEditingMode : StandardEditingMode,
  ],
  balloonToolbar: ["bold", "italic", "|", "link"],
  blockToolbar: [
    "fontSize",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "bold",
    "italic",
    "|",
    "link",
    "insertTable",
    "|",
    "outdent",
    "indent",
  ],
  fontFamily: {
    options: [
      'default',
      'Arial, Helvetica, sans-serif',
      "Courier New, Courier, monospace",
      "Georgia, serif",
      "Lucida Sans Unicode, Lucida Grande, sans-serif",
      "Tahoma, Geneva, sans-serif",
      "Times New Roman, Times, serif",
      "Trebuchet MS, Helvetica, sans-serif",
      "Verdana, Geneva, sans-serif",
    ],
    supportAllValues: true,
  },
  fontColor: {
    colorPicker: {
      format: "hex",
    },
    colors: [
      "#000000",
      "#4D4D4D",
      "#999999",
      "#E6E6E6",
      "#FFFFFF",
      "#E64D4D",
      "#E6994D",
      "#E6E64D",
      "#99E64D",
      "#4DE64D",
      "#4DE699",
      "#4DE6E6",
      "#4D99E6",
      "#4D4DE6",
      "#994DE6",
    ],
  },
  fontBackgroundColor: {
    colorPicker: {
      format: "hex",
    },
    colors: [
      "#000000",
      "#4D4D4D",
      "#999999",
      "#E6E6E6",
      "#FFFFFF",
      "#E64D4D",
      "#E6994D",
      "#E6E64D",
      "#99E64D",
      "#4DE64D",
      "#4DE699",
      "#4DE6E6",
      "#4D99E6",
      "#4D4DE6",
      "#994DE6",
    ],
  },
  fontSize: {
    options: [6, 8, 10, 'default', 14, 16, 18, 20, 22, 26, 36],
    supportAllValues: true,
  },
  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  htmlSupport: {
    allow: [
      {
        name: /^.*$/,
        styles: true,
        attributes: true,
        classes: true,
      },
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
    decorators: {
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
    },
  },
  menuBar: {
    isVisible: true,
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
  restrictedEditing:
    props.restric || props.isDisable
      ? {
          allowedAttributes: ["bold", "italic"],
          allowedCommands: ["bold", "italic"],
        }
      : undefined,
  autosave: {
    save: (data) => eventAutoSave(data),
  },
  image: {
    toolbar: [
      "toggleImageCaption",
      "imageTextAlternative",
      "ckboxImageEdit",
      "imageTextAlternative", // Alternar texto de la imagen
      "imageStyle:full",
      "imageStyle:side",
      "imageResize",
    ],
    resizeUnit: "%",
  },

  extraPlugins: [BloquearPlugin, FontSizePlugin, AddItemDescript],
};

const emit = defineEmits(["revisado", "aprobado", "datos-response"]);
const editorMenuBarElement = ref<HTMLElement | null>(null);
const editorToolbarElement = ref<HTMLElement | null>(null);
const isEdit = ref<Boolean>(true);
const editorRef = ref<Editor>();
const docGenerado = ref<Boolean>(false);

onMounted(async () => {
  filterCollaborations();
  if (props.isMasivo) {
    await loadExistingFields();
  }
});

watch(
  () => props.autoSaveOnMount,
  async (val) => {
    if (val && editorRef.value) {
      await eventAutoSave(editorRef.value);
    }
  },
  { immediate: true }
);

const observer = new MutationObserver(() => {
  const el = document.querySelector(".ck-powered-by-balloon");
  if (el) el.remove();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const loadExistingFields = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacionMasiva/campos/${
        props.id || comunicacionMasivaId.value
      }`
    );
    availableFields.value = response.data;
  } catch (error) {
    console.error(error);
    // toast.error('No se pudieron cargar los campos existentes');
  }
};

const handleFieldCreated = (newField) => {
  availableFields.value = [...availableFields.value, newField]; // Añade el nuevo campo
};

const filterCollaborations = () => {
  if (props.changesCollaborators && props.changesCollaborators.length > 0) {
    filteredCollaborators.value = props.changesCollaborators.filter(
      (doc) => !doc.aceptado && !doc.rechazado
    );
  }
};

const handleInsertField = async (field: any) => {
  const editor = editorRef.value;
  if (!editor) return;

  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacion-masiva/campos-dinamicos/${comunicacionMasivaId.value}`
    );

    const campoDinamico = response.data.find(
      (item: any) => item.campoComunicacionMasivaId === field.id
    );

    const fieldContent = campoDinamico?.valor;

    editor.model.change((writer) => {
      const insertPosition = editor.model.document.selection.getFirstPosition();
      const text = writer.createText(fieldContent, {
        "data-field-id": field.id,
        "data-field-type": field.tipoCampo,
        "data-field-format": field.formatoVisualizacion,
      });
      writer.insert(text, insertPosition);
    });
  } catch (error) {
    toast.error("Error al cargar el valor del campo");
  }
};

function AgregarCamposPlugin(editor) {
  editor.ui.componentFactory.add("agregarCampos", (locale) => {
    const button = new ButtonView(locale);

    button.set({
      label: "Agregar Campos",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>',
      tooltip: true,
      withText: true,
    });

    button.on("execute", () => {
      showSearchColumn.value = !showSearchColumn.value;
    });

    return button;
  });
}

function AddItemDescript(editor) {
  // Evitar que se genere un nuevo span restricted vacío cada vez que se agrega un elemento nuevo
  editor.data.on(
    "set",
    () => {
      editor.model.change((writer) => {
        for (const marker of editor.model.markers.getMarkersGroup(
          "restrictedEditingException"
        )) {
          writer.removeMarker(marker.name);
        }
      });
    },
    { priority: "high" }
  );

  editor.ui.componentFactory.add("listaDesc", (locale) => {
    const button = new ButtonView(locale);

    button.set({
      label: "Adicionar Item",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"><path d="M19 15v-3h-2v3h-3v2h3v3h2v-3h3v-2h-.937zM4 7h11v2H4zm0 4h11v2H4zm0 4h8v2H4z"/></svg>',
      tooltip: true,
    });

    // Mostrar modal cuando se haga clic en el botón

    button.on("execute", () => {
      const html = desciption.value.replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
});
      let isAdd = false;
      const pro = html.split("</p>");
      const stringArray = [];

      pro.reverse().forEach((element) => {
        if (
          element.indexOf('<span class="restricted-editing-exception">') > 0 &&
          isAdd == false
        ) {
          const [cantida] = element.split(".");
          const numeroActual = cantida.replace("<p>", "");
          const increment = Number(numeroActual) + 1;

          stringArray.push(
            `<p><span class="restricted-editing-exception">-- Reemplace el texto--</span>`
          );
          isAdd = true;
        }
        stringArray.push(element);
      });

      const contents = stringArray.reverse().map((item) => `${item}</p>`);
      editorRef.value.setData(contents.join(""));
    });

    return button;
  });
}

function BloquearPlugin(editor) {
  editor.ui.componentFactory.add("verPdf", (locale) => {
    const button = new ButtonView(locale);

    button.set({
      label: "Ver PDF",
      icon: `<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 309.267 309.267" xml:space="preserve"> <g> <path style="fill:#E2574C;" d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658 c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z"/> <path style="fill:#B53629;" d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z"/> <path style="fill:#FFFFFF;" d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44 c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153 c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159 c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413 c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964 c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379 c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703 c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z"/> </g></svg>`,
      tooltip: true,
    });

    button.on("execute", async () => {
      const pdfBlob = await getPdf(props.aprobado);
      const blob = new Blob([pdfBlob], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      pdfDocument.value = blobUrl;

      showPdfViewer.value = true;
    });

    return button;
  });
}

function FontSizePlugin(editor) {
  editor.ui.componentFactory.add("tamañoFuente", (locale) => {
    const button = new ButtonView(locale);

    button.set({
      label: "Tamaño Fuente",
      icon: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="474.000000pt" height="474.000000pt" viewBox="0 0 474.000000 474.000000"
          preserveAspectRatio="xMidYMid meet">
          <metadata>
          Created by potrace 1.16, written by Peter Selinger 2001-2019
          </metadata>
          <g transform="translate(0.000000,474.000000) scale(0.100000,-0.100000)"
          fill="#000000" stroke="none">
          <path d="M3633 4006 c-200 -207 -363 -381 -363 -386 0 -6 84 -10 215 -10 l215
          0 0 -445 0 -445 295 0 295 0 0 445 0 445 216 0 c128 0 214 4 212 9 -1 5 -138
          150 -303 321 -165 172 -327 342 -360 377 l-60 65 -362 -376z"/>
          <path d="M1121 4188 c-29 -101 -105 -358 -168 -573 -62 -214 -150 -514 -194
          -665 -44 -151 -102 -349 -129 -440 -27 -91 -81 -275 -120 -410 -39 -135 -98
          -335 -130 -445 -101 -343 -235 -801 -300 -1025 -35 -118 -67 -217 -72 -218 -4
          -2 -8 -15 -8 -28 l0 -24 343 0 343 0 56 193 c31 105 97 334 148 507 50 173 95
          326 99 340 l8 25 485 3 486 2 25 -82 c14 -46 66 -229 117 -408 50 -179 108
          -382 128 -452 l36 -128 342 0 342 0 -20 73 c-11 39 -65 227 -119 417 -55 190
          -275 962 -490 1715 -215 754 -420 1467 -454 1585 l-62 215 -320 3 -319 2 -53
          -182z m428 -1273 c28 -99 95 -337 149 -528 55 -191 96 -349 93 -351 -3 -1
          -143 -4 -310 -5 l-303 -2 6 34 c4 19 51 185 105 370 54 184 120 411 147 505
          27 94 52 168 56 164 4 -4 30 -88 57 -187z"/>
          <path d="M3710 1575 l0 -445 -182 -1 c-101 -1 -198 0 -215 1 -18 1 -33 -3 -33
          -9 0 -6 163 -180 362 -387 l362 -376 50 54 c70 73 470 491 589 613 53 55 97
          101 97 102 0 2 -99 3 -220 3 l-220 0 0 445 0 445 -295 0 -295 0 0 -445z"/>
          </g>
          </svg>`,
      tooltip: true,
    });

    // Mostrar modal cuando se haga clic en el botón
    button.on("execute", () => {
      showFontSizeModal.value = true; // Mostrar el modal
    });

    return button;
  });
}

function addItemToList(existingHtml: string): string {
  // Buscar las coincidencias de la numeración en la lista
  const regex =
    /<p>(\d+)\.<span class="restricted-editing-exception">Remplace el texto<\/span><\/p>/g;
  const matches: RegExpExecArray[] = [];
  let match;

  // Ejecutar el regex y almacenar las coincidencias
  while ((match = regex.exec(existingHtml)) !== null) {
    matches.push(match);
  }

  // Determinar el próximo número en la secuencia
  const nextNumber =
    matches.length > 0 ? parseInt(matches[matches.length - 1][1]) + 1 : 1;

  // Crear el nuevo ítem con el siguiente número
  const newItem = `<p>${nextNumber}.<span class="restricted-editing-exception"><p>Remplace el texto</p></span></p>`;

  // Agregar el nuevo ítem al final del HTML
  const updatedHtml = existingHtml.replace(/(<\/p>)\s*$/, `\n${newItem}\n$&`);

  return updatedHtml;
}

const formatCopia = (copia: string, index: number) => {
  return `<p style="margin: 0;">Copia ${String(index + 1)}: ${copia}</p>`;
};

const splitText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  let result = '';
  let remaining = text;
  while (remaining.length > maxLength) {
    let cut = remaining.substring(0, maxLength);
    let lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) {
      result += cut.substring(0, lastSpace) + '<br>';
      remaining = remaining.substring(lastSpace + 1);
    } else {
      result += cut + '<br>';
      remaining = remaining.substring(maxLength);
    }
  }
  result += remaining;
  return result;
};

const isEditRoute = route.path.includes(
  "/correspondencia/crear-comunicaciones-masiva/editar"
);

const htmlAprobarCom = ref("");

const getPdf = async (includeFirma = false) => {
  try {
    desciption.value = editorRef.value.getData().replace(/font-size:(\d+)px/g, (match, p1) => {
      return `font-size:${p1}pt`;
    });
    const htmlContent = desciption.value;


    let footer = props.data;
    if (props.restric) {
      const regex =
        /<p><span class="restricted-editing-exception">(.*?)<\/span><\/p>/g;
      const matches = htmlContent.match(regex);

      // Convertir las coincidencias en un string (si hay alguna coincidencia).
      const resultString = matches ? matches.join(" ") : "";
      const content = props.restric ? resultString : htmlContent;

      // Filtrar referentKey para incluir o excluir 'Firma'
      let referentKey = { ...props.referentKey };
      if (!includeFirma) {
        // delete referentKey.Firma; // Remover 'Firma' si no es necesario
        referentKey.Firma = "";
        referentKey.NombreAprobador = ""; // Vaciar info del aprobador hasta aprobar
        referentKey.CargoAprobador = "";
        referentKey.DependenciaAprobador = "";
      }

      let preleaPlaceholder = {};

      const placeholder = {
        ...referentKey,
        ...footer,
        des: content,
      };

      Object.keys(placeholder).forEach((key) => {
        const isSignatureOrPosition =
          (key === "Firma" || key === "CargoAprobador") &&
          placeholder[key] !== "";
        if (isSignatureOrPosition) {
          preleaPlaceholder[key] = `<span><p>${placeholder[key]}</p></span>`;
        } else if (
          key !== "Copia" &&
          key !== "des" &&
          placeholder[key] !== ""
        ) {
          preleaPlaceholder[key] = `<p>${placeholder[key]}</p>`;
        } else {
          preleaPlaceholder[key] = placeholder[key];
        }
      });

      // htmlAprobarCom.value = JSON.stringify(preleaPlaceholder);

      const body = {
        base64Pdf: props.base64,
        placeholders: preleaPlaceholder,
      };

      const response = await sgdeaAxios.post(
        "/generar/documentos/generarPDF",
        body,
        {
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200 || response.status === 201) {
        docGenerado.value = true;
      }

      return response.data;
    } else {
      let referentKey = { ...props.referentKey };
      let isImage = referentKey?.Firma && referentKey?.Firma?.length > 50;

      if (!includeFirma) {
        delete referentKey.Firma; // Remover 'Firma' si no es necesario
        delete referentKey.NombreAprobador; // Vaciar info hasta que no sea apruebe
        delete referentKey.CargoAprobador;
        delete referentKey.DependenciaAprobador;
      }

      const footerHtml = `
      <p style="text-align: left; font-size: 8pt !important; font-famileditor-eventy: Arial, sans-serif !important; font-family: Arial, sans-serif !important; margin: 25px 0;">
        Cordialmente,
      </p>
      ${
        isImage && referentKey?.Firma
          ? `<div style="display: flex; justify-content: start; width: 100%;">
             <img style="aspect-ratio:1365/765;" alt="firma aprobador" src="data:image/png;base64,${referentKey?.Firma}" width="150" height="100">
           </div>`
          : `<p style="font-size: 25pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important; margin: 0;">${
              referentKey?.Firma || "&nbsp;"
            }</p>`
      }
      <div style="text-align: left; font-size: 8pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important; margin-bottom: 12px; font-weight: 600;">
        ${
          referentKey?.NombreAprobador
            ? `<p style="margin:2px 0;">${referentKey?.NombreAprobador}</p>`
            : ""
        }
        <p style="margin: 0;">${referentKey?.CargoAprobador || "&nbsp;"}</p>
        <p style="margin: 0;">${
          referentKey?.DependenciaAprobador || "&nbsp;"
        }</p>
      </div>
      <footer style="text-align: left; font-size: 8pt !important; font-famileditor-eventy: Arial, sans-serif !important; ">
        <p style="margin: 0;">Anexo: ${footer.Anexo || "0"}</p>
        ${
          Array.isArray(footer.Copia)
            ? footer.Copia.map((copia: string, index: number) =>
                formatCopia(copia, index)
              ).join("")
            : `<p style="margin: 0;">Copia: ${footer.Copia || "0"}</p>`
        }
        <p style="margin: 0;">Elaboró: ${footer.DatosGestionador || ""}</p>
        <p style="margin: 0;">Revisó: ${footer.DatosRevisor || ""}</p>
        <p style="margin: 0;">Aprobador: ${footer.DatosAprobador || ""}</p>
        <p style="margin: 0;">Forma de envío: ${footer.FormadeEnvio || ""}</p>
      </footer>`;

      // Agregar el footer al contenido HTML
      // const htmlWithFooter = `${htmlFormat}${footerHtml}`;

      if (!htmlContent) {
        console.error("El contenido HTML está vacío o indefinido.");
        return;
      }
      const htmlWithFooter = `${(htmlContent)}${footerHtml}`;
      const body = {
        placeholders: htmlWithFooter,
      };

      // Enviar idRadicado si es Com. Interna
      if (props.internalCom) {
        body["radicado"] = props.internalCom.radicado;
      }

      htmlAprobarCom.value = htmlWithFooter;

      const response = await sgdeaAxios.post(
        "/webhook/render/editor-event",
        body,
        {
          responseType: "arraybuffer",
          showLoader: false,
          headers: {
            "X-Request-Id": `req-${Date.now()}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        docGenerado.value = true;
      }

      return response.data;
    }
  } catch (error) {
    console.error(error);
    docGenerado.value = false;
  }
};

const extractUserContent = (html: string): string => {
  const afterAsunto = html.split("<strong>Asunto:")[1];

  if (!afterAsunto) return html;

  const userContent = afterAsunto.split("</strong>")[1] || "";

  return userContent
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const generatePdf = async () => {
  let header = "";
  let asunto = "";
  let isActive = false;
  let generado: string;

  const textAfterFirma = `
        ${props.data?.firmaAprobador}
        ${props.data?.cargoAprobador}
        ${props.data?.dependenciaAprobador}
      `;

  let newdocuemnt;
  const pdfm = new PdfManipulate();
  //text remplace plantilla
  if (!!props.restric) {
    const footer = `
    Anexo: ${props?.data?.anexos}
    ${
      Array.isArray(props.data?.copia)
        ? props.data?.copia
            .map((copia: string, index: number) => formatCopia(copia, index))
            .join("\n")
        : `Copia: ${props.data?.copia}`
    }
    Elaboró: ${props.data?.elaboro}
    Revisó: ${props.data?.reviso ? `Revisó: ${props.data?.reviso}` : ""}
    Aprobador: ${props.data?.aprobo}
    Forma de envío: ${props.data?.formaEnvio}
  `;
    let paragraphs = desciption.value
      .split("<p>")
      .map((item: string) =>
        item.includes("</p>") ? item.replace("</p>", "") : item
      )
      .filter((f) => !f.includes("&nbsp;"));
    const last = paragraphs[paragraphs.length - 1];
    if (last === "a") {
      paragraphs.pop();
    }

    paragraphs = paragraphs.map((item) =>
      item.replace(/<span class="restricted-editing-exception">|<\/span>/g, "")
    );
    generado = await pdfm.replaceTextInPdf(
      props.base64,
      paragraphs,
      props.imgBase64
    );

    newdocuemnt = await pdfm.addFooterBeforeLastContent(
      generado,
      footer,
      textAfterFirma,
      isActive,
      header,
      asunto
    );
  } else {
    const { imgBase64 } = props;
    const isImage = imgBase64?.fileType?.includes("image") ?? false;

    const footerHtml = `
    <br/>
    <p>Cordialmente,</p> <br/>
    ${
      isImage
        ? `<img style="aspect-ratio:1365/765;" src="data:image/png;base64,${imgBase64?.fileData}" width="150" height="100">`
        : imgBase64?.fileName ?? ""
    }
    <b><p>${props.data?.firmaAprobador}</p></b>
    <p>${props.data?.cargoAprobador}</p>
    <p>${props.data?.dependenciaAprobador}</p>
    <br/>
    <p>Anexo: ${props?.data?.anexos} </p>
    ${
      Array.isArray(props.data?.copia)
        ? props.data?.copia
            .map(
              (copia: string, index: number) =>
                `<p>${formatCopia(copia, index)}</p>`
            )
            .join("")
        : `<p>Copia: ${props.data?.copia ?? ""}</p>`
    }
    <p>Elaboró: ${props.data?.elaboro ?? ""}</p>
    ${
      props.data?.reviso
        ? props.data?.reviso === "N/A"
          ? `<p>Revisó: </p>`
          : `<p>Revisó: ${props.data?.reviso}</p>`
        : ""
    }
    <p>Aprobador: ${props.data?.aprobo ?? ""}</p>
    <p>Forma de envío: ${props.data?.formaEnvio ?? ""}</p>
    <br/>
    <br/>
    `;

    const datatest = isEditRoute
      ? `${extractUserContent(desciption.value.replace(/font-size:(\d+)px/g, (match, p1) => {
      return `font-size:${p1}pt`;
    }))}${footerHtml}`
          : `${desciption.value.replace(/font-size:(\d+)px/g, (match, p1) => {
      return `font-size:${p1}pt`;
    })}${footerHtml}`;

    const { data: render } = await sgdeaAxios.post(
      "/webhook/render/editor-event",
      {
        placeholders: datatest,
      },
      { showLoader: false }
    );
    newdocuemnt = render;
  }

  const bits = props.restric
    ? pdfm.base64ToUint8Array(newdocuemnt)
    : newdocuemnt;

  const blob = new Blob([bits], { type: "application/pdf" });
  return blob;
};

const cleanText = (value) => value.replace(/\s+/g, " ").trim();

const obtenerTextoEtiqueta = (paragraphs: Array<string>) => {
  const textParagraphs = [];

  for (let i = 0; i < paragraphs.length; i++) {
    let paragraphText = paragraphs[i];

    const text = paragraphText.toLocaleLowerCase();
    if (paragraphText.trim()) {
      paragraphText = cleanText(paragraphText);

      paragraphText = paragraphText.replace(
        "{%des%}",
        '<span class="restricted-editing-exception">-- Reemplace el texto --</span>'
      );

      paragraphText = paragraphText.replace(
        "{%Anexo%}",
        `${String(props.data?.Anexo)}`
      );

      paragraphText = paragraphText.replace("{%Copia%}", formatCopies());
    }
    textParagraphs.push(`<p>${paragraphText}</p>`);
  }

  const textRemplace = remplaceInternalData(props, textParagraphs);
  const datar = textRemplace.join(" ");

  return datar;
};

const formatCopies = () => {
  let stringCopies = "";

  if (!props.data?.Copia) {
    return "0";
  }

  for (let i = 0; i < props.data?.Copia.length; i++) {
    stringCopies += `${
      i > 0 ? `Copia${i + 1}: ${props.data.Copia[i]}` : props.data.Copia[i]
    }`;
    if (i < props.data?.Copia.length - 1) {
      stringCopies += "<br />";
    }
  }
  return stringCopies;
};

const getRandomColor = () => {
  const randomValue = () => Math.floor(Math.random() * 128 + 127); // Valores claros (127 a 255)
  const r = randomValue().toString(16).padStart(2, "0");
  const g = randomValue().toString(16).padStart(2, "0");
  const b = randomValue().toString(16).padStart(2, "0");

  const alpha = Math.floor(0.3 * 255)
    .toString(16)
    .padStart(2, "0"); // 30% de opacidad
  return `#${r}${g}${b}${alpha}`;
};
const escapeHtml = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Función opcional para sanitizar contenido HTML
const sanitizeHtml = (html) => {
  // Implementar una librería como DOMPurify si es necesario
  // return DOMPurify.sanitize(html);
  return html; // Suponiendo que el contenido es seguro
};
const getDataClonacion = () => {
  let sanitizedHtmlContent = "";
  filteredCollaborators.value.forEach((doc) => {
    // Generar un color aleatorio para el fondo
    const backgroundColor = getRandomColor();
    // Si el id del aporte del colaborador fue aceptado, muestra solo el texto a guardar
    if (acceptedId.value && acceptedId.value === doc.id) {
      sanitizedHtmlContent += `
        <p>${sanitizeHtml(doc.htmlContent)}</p>
      `;
    } else {
      // Mostrar en un div el aporte del colaborador a validar (No se guarda en doc)
      sanitizedHtmlContent += `
      <div id="${
        doc.id
      }" style="background-color: ${backgroundColor}; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <div>
          <p><strong>${escapeHtml(doc.nombreUsuarioCreador)}</strong></p>
          <div>${sanitizeHtml(doc.htmlContent)}</div>
        </div>
      </div>
      `;
    }
  });

  if (acceptedId.value) {
    const index = filteredCollaborators.value.findIndex(
      (item) => item.id === acceptedId.value
    );
    // // Se elimina el aporte del prop
    filteredCollaborators.value.splice(index, 1);
    acceptedId.value = null;
  }

  return sanitizedHtmlContent;
};

const confirmDeletionDiv = (item: any) => {
  selectedDiv.value = item;
  showRemoveCollabModal.value = true;
};

const deleteSelectedDiv = () => {
  const index = filteredCollaborators.value.findIndex(
    (i) => i.id === selectedDiv.value.id
  );
  // Se elimina el párrafo del prop
  filteredCollaborators.value.splice(index, 1);
  // Se rechaza el párrafo de acuerdo al flujo
  switch (selectedDiv.value?.moduloActual) {
    case "PQRD":
      rejectParagraphPQRD(selectedDiv.value);
      break;
    case "ENTES":
      rejectParagraphEntes(selectedDiv.value);
      break;
  }
  desciption.value = generateRefValue();
  showRemoveCollabModal.value = false;
};

const acceptSelectedDiv = (item: any) => {
  acceptedId.value = item.id;
  // Se acepta el párrafo de acuerdo al flujo
  switch (item?.moduloActual) {
    case "PQRD":
      acceptParagraphPQRD(item);
      break;
    case "ENTES":
      acceptParagraphEntes(item);
      break;
  }
  desciption.value = generateRefValue();
};

const rejectParagraphPQRD = async (item: any) => {
  await sgdeaAxios.patch(`/pqrd/rechazar-parrafo-doc-salida/${item.id}`, {
    motivo_rechazo: comment.value,
  });
};

const rejectParagraphEntes = async (item: any) => {
  await sgdeaAxios.patch(`/api/entes/rechazar-parrafo-doc-salida/${item.id}`, {
    motivo_rechazo: comment.value,
  });
};

const acceptParagraphPQRD = async (item: any) => {
  await sgdeaAxios.patch(`/pqrd/aceptar-parrafo-doc-salida/${item.id}`);
};

const acceptParagraphEntes = async (item: any) => {
  await sgdeaAxios.patch(`/api/entes/aceptar-parrafo-doc-salida/${item.id}`);
};

const headerInternalCommunication = () => {
  return `
      <p style="text-align: center; font-famileditor-eventy: Arial, sans-serif !important; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-weight: 600; margin-bottom: 2rem">MEMORANDO INTERNO</p>
      <span id="header" style="text-align: left; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">
      <p style="margin: 0; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">
        <span style="width: 2.5rem; margin:  0;">PARA: </span>
        ${props.internalCom.nombreDestinatario}
      </p>
      <p style="padding-left: 2.85rem; margin: 0; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">
       ${props.internalCom.oficinaDestinatario}
      </p>
      <p style="margin: 0; font-size: 11pt !important; font-family: Arial, sans-serif;">
        <span style="padding-right: 1.15rem;"> DE: </span>
        ${props.internalCom.nombreElaboro}
      </p>
      <p style="padding-left: 2.85rem; margin: 42px 0; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">
        ${props.internalCom.oficinaElaboro}
      </p>
      <p style="font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;"><br/><strong>Asuntos: ${props.internalCom.asunto ?? ""}</strong></p>
      </span>
      <br/>
    `;
};

const generateRefValue = () => {
  const header = `
        <span id="header" style="text-align: left; font-size: 11pt !important; font-family: Arial, sans-serif !important; line-height: 1; font-famileditor-eventy: Arial, sans-serif !important;" >
          <p style="margin: 0; line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">Señor(a):</p>
          <p style="margin: 0; line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">${
            splitText(props.referentKey.NombredeDestinatario ?? "", 50)
          }</p>
          ${
            props.referentKey.DireccionDeDestinatario
              ? `<p style="margin: 0;line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">Dirección: ${
                  splitText(props.referentKey.DireccionDeDestinatario ?? "", 50)
                }</p>`
              : ""
          }
          ${
            props.referentKey.TelefonoDeDestinatario
              ? `<p style="margin: 0;line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">Teléfono: ${
                  props.referentKey.TelefonoDeDestinatario ?? ""
                }</p>`
              : ""
          }
          ${
            props.referentKey.CorrreoDestinatario ||
            props.referentKey.CorreoDestinatario
              ? `<p style="margin: 0;line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">Correo: ${
                  props.referentKey.CorrreoDestinatario ||
                  props.referentKey.CorreoDestinatario
                }</p>`
              : ""
          }
          <p style="margin: 0;line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">${
            props.referentKey.DepartamentoYMunicipioDestinatario ?? ""
          }</p>
          <br />
          <p style="margin: 0;line-height: 1; font-size: 11pt !important; font-family: Arial, sans-serif !important; font-famileditor-eventy: Arial, sans-serif !important;">
             <strong>Asunto: ${props.referentKey.asunto ?? ""}</strong>
          </p>
          <br />
        </span>
        <br />
        `;
  // Si está vacío el documento, se genera nuevamente la cabecera del documento
  // Si hay colaboraciones las agrega, remueve los divs pintados previamente
  return `${
    desciption.value && desciption.value.trim().length > 0
      ? desciption.value.replace(/<div[^>]*>[\s\S]*?<\/div>/g, "").replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
}) : header
  }
          ${props.collaboration ? getDataClonacion() : ""}
        `;
};

const onReady = async (editorInstance: any) => {
  editorInstance.execute('fontFamily', 'Arial, Helvetica, sans-serif');
  editorInstance.execute('fontSize', '12pt');
  const toolbarElement = editorToolbarElement.value;
  const menuBarElement = editorMenuBarElement.value;

  if (toolbarElement && editorInstance.ui.view.toolbar) {
    toolbarElement.appendChild(editorInstance.ui.view.toolbar.element);
  }

  if (menuBarElement && editorInstance.ui.view.menuBar) {
    menuBarElement.appendChild(editorInstance.ui.view.menuBar.element);
  }

  let value;

  if (props.restric !== false) {
    const pdfm = await new PdfManipulate();
    const da = await pdfm.extractTextFromPDFBase64(props.base64);
    value = obtenerTextoEtiqueta(da);
  } else if (props.internalCom) {
    value = headerInternalCommunication();
  } else {
    value = generateRefValue();
  }

  let result = "";

  if (props.internalCom) {
    if (props.document) {
      result = props.document;
    } else {
      result = value;
    }
  } else {
    if (props.document && !props.restric) {
      result = props.document + (props.collaboration ? getDataClonacion() : "");
    } else {
      result = setRestrictedDocChanges(value);
    }
  }

  desciption.value = result.replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
});
  editorRef.value = editorInstance;

  if (props.autoSaveOnMount) {
    await eventAutoSave(editorRef.value);
  }
};

const setRestrictedDocChanges = (htmlText: string) => {
  if (!props.document) {
    return htmlText;
  }
  // Para encontrar los elementos editables
  const regex =
    /<p><span class="restricted-editing-exception">(.*?)<\/span><\/p>/g;
  // Enlista los elementos agregados previamente en el documento
  const matches = props.document.match(regex);
  // Reemplaza el elemento de ejemplo por los ya creados
  return htmlText.replace(regex, matches.join(""));
};

const htmldocument = ref();
const eventAutoSave = async (editor) => {
  let paragraph = "";
  htmldocument.value = editor.getData().replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
});
  if (isEdit.value) {
    isEdit.value = false;
    return Promise.resolve(editor.getData().replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
}));
  }
  // Se eliminan Divs presentes de aportes de clonadores sin confirmar
  if (props.isCloner && props.collaboration) {
    paragraph = editor.getData().replace(/<div[^>]*>[\s\S]*?<\/div>/g, "").replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
});
  } else {
    paragraph = editor.getData().replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
});
  }

  const payload = {
    paragraf: paragraph,
    pdf: await generatePdf(),
  };

  documentStore.setDocumentContent(payload.paragraf);
  emit("datos-response", payload);
  isEdit.value = false;

  return Promise.resolve(editor.getData().replace(/font-size:(\d+)px/g, (match, p1) => {
  return `font-size:${p1}pt`;
}));
};

const onChange = (_) => {
  isEdit.value = true;
};

const remplaceInternalData = (
  props: {
    readonly referentKey?: { [x: string]: string };
    readonly data?: { [x: string]: string };
  },
  paragraphs: Array<string> | null
) => {
  const { referentKey = {}, data = {} } = props;
  const allValues = {
    ...referentKey,
    ...data,
    Firma: "",
  };

  if (!paragraphs) {
    return [""];
  }

  const listdata = paragraphs.map((item) => {
    let value = item;

    Object.keys(allValues).forEach((key) => {
      const val = key.trim();
      const exp = new RegExp(`{%${val}%}`, "g");
      const remplaceData = allValues[val] || "";

      value = value.replace(exp, remplaceData);
    });

    // Reemplazar cualquier {%...%} que no tenga clave en referentKey por una cadena vacía
    value = value.replace(/{%[^%]+%}/g, "");

    return value;
  });

  return listdata;
};

const emitEvent = (event_: number) => (fontSize.value = event_);

watch(
  revisado,
  async (newValue) => {
    if (newValue === true) {
      const docGenerate = await getPdf(true);
      const blob = new Blob([docGenerate], { type: "application/pdf" });
      if (docGenerado.value) {
        emit("revisado", blob);
      }
    }
  },
  { immediate: true }
);

watch(
  aprobado,
  async (newValue) => {
    if (newValue === true) {
      const docGenerate = await getPdf(true);
      const blob = new Blob([docGenerate], { type: "application/pdf" });
      if (docGenerado.value) {
        emit("aprobado", blob, htmlAprobarCom?.value);
      }
    }
  },
  { immediate: true }
);

watch(
  fontSize,
  async (value) => {
    if (editorRef.value !== undefined) {
      editorRef.value.execute("fontSize", { value: `${value}pt` });
    }
  },
  { immediate: true }
);

const classSpan = () =>
  props.collaboration ? "tw-col-span-3" : "tw-col-span-4";

const handlerClick = (item: any) => {
  acceptSelectedDiv(item);
};

const handlerCancel = (item: any) => {
  deleteSelectedDiv(item);
};

const resetFieldForm = () => {
  newField.value = {
    name: "",
    type: "",
    format: "",
    maxLength: 250,
    allowSpecialChars: true,
  };
};

const fieldTypes = [
  { value: "PARRAFO", label: "Párrafo" },
  { value: "TEXTO_CORTO", label: "Texto corto" },
  { value: "NUMERO", label: "Número" },
  { value: "FECHA", label: "Fecha" },
  { value: "EMAIL", label: "Email" },
  { value: "SELECTOR", label: "Selector" },
];

const formatOptions = [
  { value: "PRESENTACION_FECHA", label: "Presentación fecha" },
  { value: "PRESENTACION_TEXTO", label: "Presentación texto" },
  { value: "FORMATO_FECHA", label: "Formato Fecha" },
  { value: "FORMATO_NUMERO", label: "Formato Número" },
  { value: "FORMATO_TEXTO", label: "Formato texto" },
  { value: "FORMATO_SELECTOR", label: "Formato selector" },
];
</script>

<template>
  <div ref="editorToolbarElement"></div>
  <div class="tw-flex tw-w-full tw-gap-4">
    <div class="tw-w-64 tw-shrink-0">
      <SearchColumn
        v-if="showSearchColumn"
        v-model="searchTerm"
        :fields="availableFields"
        @open-modal="showAddFieldModal = true"
        @search="handleSearch"
        @insert-field="handleInsertField"
      />
    </div>

    <div class="tw-flex-1 tw-min-w-0">
      <div class="tw-flex tw-justify-center tw-w-full">
        <div class="tw-w-full tw-max-w-4xl">
          <ckeditor
            v-model="desciption"
            :editor="DecoupledEditor"
            :config="config"
            @ready="onReady"
          />
        </div>
      </div>
    </div>

    <div class="tw-w-80 tw-shrink-0" v-if="props.collaboration">
      <div class="tw-bg-slate-300 tw-pt-5 tw-mt-4 tw-h-full">
        <div
          v-if="filteredCollaborators.length === 0"
          class="tw-ml-4 tw-mr-4 tw-text-center"
        >
          <p class="tw-inline-block tw-align-baseline tw-font-medium">
            No hay cambios en el documento.
          </p>
        </div>
        <collaboration
          v-for="(item, i) in filteredCollaborators"
          :key="item.name"
          :userName="item.nombreUsuarioCreador"
          @confir="acceptSelectedDiv(item)"
          @remove="confirmDeletionDiv(item)"
        ></collaboration>
      </div>
    </div>
  </div>

  <FontSizeModal
    @update:showModalSize="showFontSizeModal = false"
    @update:Size="emitEvent"
    v-model="showFontSizeModal"
  />

  <PdfView
    :showDialog="showPdfViewer"
    :pdfUrl="pdfDocument"
    @update:showDialog="showPdfViewer = $event"
  />

  <FieldModalAgregarCampo
    v-model:showModal="showAddFieldModal"
    :field-types="fieldTypes"
    :format-options="formatOptions"
    @created="handleFieldCreated"
    :comunicacion-masiva-id="comunicacionMasivaId"
  />

  <q-dialog
    v-model="showRemoveCollabModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
    transition-duration="300"
  >
    <q-card class="dialog tw-p-4">
      <q-card-section class="tw-bg-white">
        <q-form ref="comentarioForm">
          <div
            class="tw-font-semibold tw-text-2xl tw-text-secondary"
            style="word-break: break-word"
          >
            Rechazar
          </div>
          <br />
          <div
            class="bold tw-text-lg tw-text-secondary"
            style="word-break: break-word"
          >
            ¿Está seguro que desea rechazar el párrafo?
          </div>
          <br />

          <CommentTextArea
            v-model="comment"
            :is-required="true"
            :max-length="1000"
            label="Escriba aquí el motivo"
          />
          <div class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
            <q-btn
              color="accent"
              textColor="secondary"
              label="Cancelar"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              no-caps
              @click="showRemoveCollabModal = false"
            />

            <q-btn
              color="secondary"
              label="Aceptar"
              style="
                width: 250px;
                height: 45px;
                border-radius: 8px;
                font-size: 18px;
              "
              no-caps
              @click="deleteSelectedDiv()"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.ck-editor__editable {
  background-color: white;
  min-height: 200px;
  padding: 2cm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  width: 21cm;
  height: 29.7cm;
  overflow: auto;
  border: 1px solid #ddd;
  font-family: Arial, Helvetica, sans-serif;
}

.ck-editoreditable {
  font-family: Arial, sans-serif !important;
  font-size: 12pt !important;
}

p {
  margin-bottom: 1em;
  /* Asegura espacio entre los párrafos */
  white-space: normal !important;
  /* Asegura que los saltos de línea sean respetados */
}

/* Ocultar el texto de "Powered by" cuando el editor está enfocado */
.ck-powered-by {
  visibility: visible;
  transition: visibility 0.3s ease-in-out;
}

/* Cuando el editor está enfocado (condición), oculta el mensaje */
.ck-editor__editable:focus + .ck-powered-by,
.ck-editor__editable:hover + .ck-powered-by {
  visibility: hidden;
}

</style>
