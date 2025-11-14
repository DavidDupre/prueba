<template>
  <div class="tw-w-full">
    <q-card class="tw-rounded-xl tw" flat bordered>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Copias</b>
          </div>
        </template>

        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-12">
            <span class="tw-text-label">Tipo de Copia *</span>
            <q-select :rules="[inputRequired]" name="copia" outlined v-model="form.copia" label="Seleccione" dense
              map-options emit-value :options="opCopia" />
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card>
      <template v-if="form.copia == '1' || form.copia == '4'">
       <q-form ref="formRefInterna" greedy >
        <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-5">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Dependencia *</span>
            <q-select v-model="form.dependencia" map-options outlined dense use-input hide-selected fill-input
              input-debounce="0" label="Inserte" :options="opDependencias" @filter="filterDepe" :rules="[inputRequired]"
              @input-value="v => addValue(v, 'dependencia')">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Nombre funcionario *</span>
            <q-select v-model="form.nombreFuncionario" map-options outlined dense use-input hide-selected fill-input
              input-debounce="0" label="Inserte" :options="funcionarioOp" @filter="filterFun" :rules="[inputRequired]"
              @input-value="v => addValue(v, 'nombreFuncionario')" :disable="form.dependencia == ''">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-28 tw-gap-x-5">
          <q-btn label="Limpiar" class="tw-h-10 tw-w-40 tw-mb-5" @click="clear" />
          <q-btn color="primary" label="Agregar" class="tw-h-10 tw-w-40 tw-mb-5" @click="addInterna" />
        </div>
       </q-form>
      </template>

    </q-card>

    <q-card>
      <template v-if="(form.copia == '1' || form.copia == '4')">
        <div class="tw-mt-10">
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Listado de Usuarios en Copia
          </p>
          <Table class="full-width" :COPIA_HEADER="COPIA_HEADER3" :COPIA_BODY="COPIA_BODY_INTERNA" :delete-fila="deleteFilaInterna" />
        </div>
      </template>
    </q-card>
    <q-card>
      <template v-if="form.copia == '2' || form.copia == '4'">
       <q-form ref="formRefExterna" greedy>
        <div class="row q-col-gutter-md q-pb-md q-px-md tw-mt-10">
          <div class="col-12">
            <span class="tw-text-label">Forma de Envío *</span>
            <q-select :rules="[inputRequired]" name="tipoEnvio" v-model="form.formaEnvio" outlined label="Seleccione"
              dense map-options :options="opsEnvio" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Tipo de Documento Destinatario *</span>
            <q-select :rules="[inputRequired]" name="tipoDocumento" v-model="form.tipoDocumento" outlined
              label="Seleccione" dense map-options :options="opsTipoDoc" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Número Documento Destinatario *</span>
            <q-input :disable="form.tipoDocumento.value === 12"
              :rules="[inputRequired, Number(form.tipoDocumento.value) == 11 ? alphanumeric2 : v => onlyNumbers(v), v => maxLengthInput(15, v)]"
              name="documento" v-model="form.documento" outlined label="Inserte" dense autocomplete="off" @blur="getPerson()" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label">Nombre del Destinatario *</span>
            <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(200, v)]" name="nombre"
              v-model="form.nombre" outlined label="Inserte" dense autocomplete="off" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="tw-text-label">Dirección de Destinatario * </span>
            <q-input :rules="[v => (form.formaEnvio.value == 3 || form.formaEnvio.value == 4 || form.formaEnvio.value == 5 ? inputRequired(v) : true),
              v => maxLengthInput(200, v)]" name="direccion" v-model="form.direccion"
              outlined label="Inserte" dense autocomplete="off" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="tw-text-label">País Destinatario * </span>
            <q-select :rules="[v => inputRequired(v.label)]" name="pais" v-model="form.pais" outlined label="Seleccione"
              map-options dense :options="optionsCountries" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <span class="tw-text-label">Departamento Destinatario *</span>
            <q-select :rules="[v => (form.formaEnvio.value == 3 || form.formaEnvio.value == 4 || form.formaEnvio.value == 5 ? inputRequired(v.label) : true)]" name="departamento" v-model="form.departamento" outlined
              label="Seleccione" dense map-options :options="departments" :disable="isntColombia" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <span class="tw-text-label">Municipio Destinatario * </span>
            <q-select :rules="[v => (form.formaEnvio.value == 3 || form.formaEnvio.value == 4 || form.formaEnvio.value == 5 ? inputRequired(v.label) : true)]" name="municipio" v-model="form.municipio" outlined
              label="Seleccione" dense map-options :options="municipalities" :disable="isntColombia" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Teléfono Destinatario </span>
            <q-input :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]" name="telefono"
              v-model="form.telefono" outlined label="Inserte" dense autocomplete="off" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="tw-text-label">Correo Electrónico Destinatario *</span>
            <q-input :rules="[(v) => (form.formaEnvio.value == 1 || form.formaEnvio.value == 2 ? inputRequired(v) : true),
              validationEmail, (v) => maxLengthInput(200, v)]" name="correo"
              v-model="form.correo" outlined label="Inserte" dense autocomplete="off" />
          </div>
        </div>
        <div class="row tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-x-5 ">
          <q-btn label="Limpiar" class="tw-h-10 tw-w-40 tw-mb-5" @click="clear" />
          <q-btn color="primary" label="Agregar" class="tw-h-10 tw-w-40 tw-mb-5" @click="addExterna" />
        </div>
       </q-form>
      </template>
    </q-card>
    <q-card>

      <template v-if="(form.copia == '2'|| form.copia == '4')">
        <div class="tw-mt-10">
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Listado de Usuarios en Copia
          </p>
          <Table class="full-width" :COPIA_HEADER="form.copia == '1' ? COPIA_HEADER3 : COPIA_HEADER2"
            :COPIA_BODY="COPIA_BODY_EXTERNA" :delete-fila="deleteFilaExterna" />
        </div>
      </template>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import Table from './Table.vue'
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";
import { COPIA_HEADER2, COPIA_HEADER3 } from './index'
import { alphanumeric2, homePhoneNumber, inputRequired, maxLengthInput, onlyNumbers, validationEmail, alphanumericAbsolute, minLengthInput } from "src/helpers/validations";
import { SelectInput } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import { PropType, Ref, computed, onMounted, ref, watch } from "vue";
import { toast } from 'src/helpers/toast';
import { QForm } from 'quasar';
import { useDependencias } from "src/composables/useEntidades";

const props = defineProps({
  opsEnvio: [],
  opsTipoDoc: [],
  tableCopiasInterna: [],
  tableCopiasExterna: [],
  copiasInterna: [],
  copiasExterna: [],
  tipoCopia: {
    default: null
  },
  form: {
    type: Object as PropType<copia>,
    default: () => ({
      copia: '',
      dependencia: '',
      nombreFuncionario: '',

      formaEnvio: '',
      tipoDocumento: '',
      documento: '',
      nombre: '',
      direccion: '',
      pais: { label: 'Colombia', value: 425 },
      departamento: { label: '', value: null },
      municipio: { label: '', value: null },
      telefono: '',
      correo: '',
      copiaBody: []
    })
  }
})

const { optionsDependencias: opForDependencias } = useDependencias()
const opDependencias = ref([])
const funcionarioOp = ref([])
const opForfuncionario = ref([])
const departments: Ref<SelectInput[]> = ref([]);
const municipalities: Ref<SelectInput[]> = ref([]);
const formRef: Ref<QForm | null> = ref(null);
const formRefInterna: Ref<QForm | null> = ref(null);
const formRefExterna: Ref<QForm | null> = ref(null);

const opCopia = ref([])
const COPIA_BODY = ref([...props.form.copiaBody])
const { optionsCountries } = useCountries()

const COPIA_BODY_INTERNA = ref([])
const COPIA_BODY_EXTERNA = ref([])
const arrCopiasInterna = ref([])
const arrCopiasExterna = ref([])


const emit = defineEmits(['update:formCopia', 'update:itemTable'])

const arrCopias = ref([])

const addInterna = async () => {
  try {
    // Validar el formulario
    if (!(await formRefInterna.value.validate())) {
      toast.error('Debe diligenciar los campos obligatorios');
      return;
    }

    // Construir el nombre del funcionario
    const nombre = props.form.nombreFuncionario.label


    // Validar que el usuario no exista ya en la lista
    const usuarioExistente = COPIA_BODY_INTERNA.value.find(it => it.correspondenciaFuncionario === nombre);
    if (usuarioExistente) {
      toast.error('El usuario ya está agregado.');
      return;
    }
    // Agregar al array interno
    COPIA_BODY_INTERNA.value.push({
      correspondenciaDependencia: props.form.dependencia.label,
      correspondenciaFuncionario: props.form.nombreFuncionario.label
    });

    arrCopiasInterna.value = [...props.copiasInterna, {
      correspondenciaDependencia: props.form.dependencia.value,
      correspondenciaFuncionario: props.form.nombreFuncionario.value.id
    }];
    // Actualizar las listas según el tipo de copia
    if (props.form.copia == '1') {
      COPIA_BODY.value = COPIA_BODY_INTERNA.value;
      arrCopias.value = arrCopiasInterna.value;
      emit('update:itemTable', arrCopias.value);
    } else if (props.form.copia == '4') {
      COPIA_BODY.value = [...COPIA_BODY_INTERNA.value, ...COPIA_BODY_EXTERNA.value];
      arrCopias.value = [...arrCopiasInterna.value, ...arrCopiasExterna.value];
      emit('update:itemTable', arrCopiasInterna.value, arrCopiasExterna.value);
    }
    await clear();
  } catch (error) {
    toast.error('Ha ocurrido un error.');
  }
};


const addExterna = async () => {
  try {
    if (await formRefExterna.value.validate()) {
      const nombreDestinatario = props.form.nombre
      if (!COPIA_BODY_EXTERNA.value.find(it => it.nombreDestinatario === nombreDestinatario)) {
        COPIA_BODY_EXTERNA.value.push({
          formaEnvio: props.form.formaEnvio.label,
          tipoDocumentoDestinatario: props.form.tipoDocumento.label,
          numeroDocumentoDestinatario: props.form.documento,
          nombreDestinatario: nombreDestinatario,
          direccionDestinatario: props.form.direccion,
          paisDestinatario: props.form.pais.label,
          departamentoDestinatario: props.form.departamento.label,
          municipioDestinatario: props.form.municipio.label,
          telefonoDestinatario: props.form.telefono,
          correoElectronico: props.form.correo
        })
        arrCopiasExterna.value = [...props.copiasExterna, {
          formaEnvio: props.form.formaEnvio.value,
          tipoDocumentoDestinatario: props.form.tipoDocumento.value,
          numeroDocumentoDestinatario: props.form.documento,
          nombreDestinatario: nombreDestinatario,
          direccionDestinatario: props.form.direccion,
          paisDestinatario: props.form.pais.value,
          departamentoDestinatario: props.form.departamento.value,
          municipioDestinatario: props.form.municipio.value,
          telefonoDestinatario: props.form.telefono,
          correoElectronico: props.form.correo
        }];

        // Actualizar la lista de copia según el tipo de copia
        if (props.form.copia == '2') {
          COPIA_BODY.value = COPIA_BODY_EXTERNA.value
          arrCopias.value = arrCopiasExterna.value
          emit('update:itemTable', [], arrCopias.value);
        } else if (props.form.copia == '4') {
          // Si es copia mixta, combinar ambas listas
          COPIA_BODY.value = [...COPIA_BODY_INTERNA.value, ...COPIA_BODY_EXTERNA.value]
          arrCopias.value = [...arrCopiasInterna.value, ...arrCopiasExterna.value]
          emit('update:itemTable', arrCopiasInterna.value, arrCopiasExterna.value);
        }


        await clear()
      } else {
        toast.error('El usuario ya esta agregado.')
      }
    } else {
      toast.error('Debe diligenciar los campos obligatorios')
    }
  } catch (error) {
    toast.error('Ha ocurrido un error.')
  }
}

const deleteFilaInterna = async (_, id) => {
  // Determinar qué lista estamos modificando basándonos en el tipo
  if (props.form.copia == '1' || props.form.copia == '4') {
    // Eliminar el item de la lista interna
    COPIA_BODY_INTERNA.value.splice(id, 1);
  }

  // Emitir la lista actualizada
  emit('update:itemTable', arrCopias.value);
}


const deleteFilaExterna = async (_, id) => {
  if(props.form.copia == '2' || props.form.copia == '4') {
    // Eliminar el item de la lista externa (asegúrate de tener esta lista disponible)
    COPIA_BODY_EXTERNA.value.splice(id, 1); // Suponiendo que EXTERNAL_BODY es tu lista externa
  }
  // Emitir la lista actualizada
  emit('update:itemTable', arrCopias.value)
}

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

const clear = async () => {
  try {
    emit('update:formCopia', props.form);

    if (formRefInterna.value) {
      await formRefInterna.value.reset();
    }

    if (formRefExterna.value) {
      await formRefExterna.value.reset();
    }
  } catch (error) {
    toast.error('No se pudo limpiar los formularios correctamente.');
  }
};


const getData = async () => {
  try {
    COPIA_BODY_INTERNA.value = props.tableCopiasInterna;
    COPIA_BODY_EXTERNA.value = props.tableCopiasExterna;

    const { data: opsCopia } = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoCopia')

    opCopia.value = opsCopia?.map((item: any) => ({
      value: item.id,
      label: item.nombre
    }))

    props.form.copia = opCopia.value.find((item: any) => item.value === props.tipoCopia)?.value;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async() => {
  await getData()
})

const isntColombia = ref(false)

watch(
  () => props.form.pais,
  async (value, oldValue) => {

    if (oldValue && oldValue.value !== value.value) {
      props.form.departamento = { label: '', value: null };
      props.form.municipio = { label: '', value: null };
      municipalities.value = [];
    }

    if (!value || !value.label) {
      return;
    }

    let val = value as unknown as { label: string, value: any };

    // @ts-ignore
    if (val.label.toUpperCase() === 'COLOMBIA') {
      isntColombia.value = false;
      const { optionsDepartments } = await useDepartments(value.value);
      departments.value = sortOptions(optionsDepartments.value);
    } else {
      isntColombia.value = true;
      // @ts-ignore
      props.form.departamento = { label: val.label, value: null };
      // @ts-ignore
      props.form.municipio = { label: val.label, value: null };
    }
  },
  { immediate: true }
);

watch(
  () => props.form.departamento,
  async (value, oldValue) => {

    if (oldValue && oldValue.value !== value.value) {
      props.form.municipio = { label: '', value: null };
    }

    if (value && value.value) {
      const { optionsMunicipalities } = await useMunicipalities(value.value)
      municipalities.value = sortOptions(optionsMunicipalities.value)
    } else {
      municipalities.value = [];
    }
  }
);

watch(
  () => props.form.dependencia.value,
  async (value) => {

  const { data } = await sgdeaAxios.get(`api/usuarios/seccionSubseccion/${value}`)
  opForfuncionario.value = data.map((item) => ({
    label: item.firstname.trim() + ' ' + item.lastname.trim(),
    value: item,
    firstName: item.firstname,
    lastName: item.lastname
  })).sort((a, b) =>
    a.label.toLowerCase().localeCompare(b.label.toLowerCase(), 'es', { sensitivity: 'base' })
  )

  props.form.nombreFuncionario = "";
}
);

// watch(
//   () => props.form.tipoDocumento.label,
//   async (value) => {
//     if (value == 'Ninguno') {
//       props.form.documento = ''
//     }
//   }
// )

// Modificar el watch para limpiar las listas cuando cambia el tipo de copia
watch(
  () => props.form.copia,
  async (newValue, oldValue) => {
    if (oldValue && newValue !== oldValue) {
      COPIA_BODY_INTERNA.value = []
      COPIA_BODY_EXTERNA.value = []
      arrCopiasInterna.value = []
      arrCopiasExterna.value = []
      COPIA_BODY.value = []
      arrCopias.value = []
    }
    if (newValue == 2) {
      const { optionsDepartments } = await useDepartments(props.form.pais.value);
      departments.value = optionsDepartments.value;
    }
  }
)

interface copia {
  copia: any;
  dependencia: string;
  nombreFuncionario: string;
  formaEnvio: { label: string, value: number };
  tipoDocumento: { label: string, value: number };
  documento: string;
  nombre: string;
  direccion: string;
  pais: { label: string, value: number };
  departamento: { label: string, value: number };
  municipio: { label: string, value: number };
  telefono: string;
  correo: string;
  copiaBody: any;
}

const addValue = (value, type) => {
  props.form[type] = value
}

const filterDepe = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      opDependencias.value = opForDependencias.value
    } else {
      const needle = val.toLowerCase();
      opDependencias.value = opForDependencias.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}

const filterFun = (val: string, update: any) => {
  update(() => {
    if (val === '') {
      funcionarioOp.value = opForfuncionario.value
    } else {
      const needle = val.toLowerCase();
      funcionarioOp.value = opForfuncionario.value.filter(({ label }) => label.toLowerCase().includes(needle));
    }
  });
}

async function getPerson() {
  try {
    const tipoDoc = getAcronimobyId(Number(props.form.tipoDocumento.value));
    const number = props.form.documento ? Number(props.form.documento) : '';
    const { data } = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (data) {
      // if(data.pais && data.pais.idPais !== 425){
      //   props.form.departamento = { label: data.departamento.nombre, value: data.departamento.idDepartamento };
      //   // isDisable.value = true;
      // }

      const nameObject = {
        nombre1: data.nombre1,
        nombre2: data.nombre2,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
      }

      // Unir los valores y eliminar los espacios al final
      let nombreCompleto = Object.values(nameObject).join(' ');
      // Si el último carácter es un espacio, eliminar todos los espacios al final
      nombreCompleto = nombreCompleto.replace(/\s+$/, '');

      props.form.nombre = nombreCompleto;
      props.form.direccion = data?.direccion;
      props.form.telefono = data?.telefono;
      props.form.correo = data?.email;
      props.form.pais = { label: data.pais.nombre, value: data.pais.idPais };
      props.form.departamento = { label: data.departamento?.nombre, value: data.departamento?.idDepartamento };
      props.form.municipio = { label: data.municipio?.nombre, value: data.municipio?.idMunicipio };
    }
  } catch (error) {
    console.error(error);
    props.form.nombre = "";
    props.form.direccion = "";
    props.form.telefono = "";
    props.form.correo = "";
  }
}
</script>
