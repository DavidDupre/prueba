<template>
  <div class="flex tw-flex-col tw-gap-4">
    <q-card class="tw-rounded-xl tw-bg-white tw-py-6 tw-pb-8 tw-px-8" flat>
      <section>
        <h2 class="tw-font-bold tw-text-xl tw-mb-2">Usuarios en Copia</h2>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-12">
            <p class="tw-text-label tw-font-semibold">¿Con copia?</p>
            <q-select map-options emit-value outlined label="Inserte" dense :options="listadoTiposCopia"
              v-model="selectValue" />
          </div>
        </div>
      </section>
    </q-card>

    <!-- ! Copia Interna -->
    <template v-if="selectValue === 1 || selectValue === 4">
      <q-card class="tw-rounded-xl tw-bg-white tw-px-8" flat>
        <h2 class="tw-font-bold tw-text-xl tw-py-6">Copia interna</h2>
        <q-form ref="formInterno" greedy>
          <div class="tw-grid tw-grid-cols-4 tw-gap-4">
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Dependencia *</p>
              <q-select v-model="usuario_interno.dependencia" :options="opDependencias" map-options emit-value outlined
                label="Inserte" dense use-input fill-input hide-selected @filter="filterDepe"
                :rules="[inputRequired]" />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Nombre funcionario *</p>
              <q-select v-model="usuario_interno.funcionario" map-options emit-value :options="funcionarioOp"
                @filter="filterFun" outlined label="Inserte" dense use-input fill-input hide-selected
                :rules="[inputRequired]">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-form>
        <div class="tw-flex tw-justify-center tw-gap-5 tw-my-6">
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" label="Limpiar" color="white" text-color="secondary"
            @click="limpiarInterno" />
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" label="Agregar" color="primary" icon="add"
            @click="addUsuarioInterno" />
        </div>
      </q-card>

      <q-card q-card class="tw-rounded-xl q-pa-lg tw-bg-white" flat>
        <p class="tw-text-xl tw-font-semibold tw-text-secondary tw-pb-2">Listado de usuarios en copia</p>
        <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_INTERNO_HEADER" :TABLE_BODY="dataTableInterno"
          key-id="grupo" @handle-edit-data="handleDeleteInternos" />
      </q-card>
    </template>

    <!-- ! Copia Externa -->
    <template v-if="selectValue === 2 || selectValue === 4">
      <q-card class="tw-rounded-xl tw-bg-white tw-px-8 tw-w-full" flat>
        <h2 class="tw-font-bold tw-text-xl tw-py-6">Copia externa</h2>
        <q-form ref="formExterno" greedy>
          <div class="tw-grid tw-grid-cols-12 tw-gap-4">
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Forma de envío *</p>
              <q-select map-options :options="formaEnvioOptions" emit-value outlined
                v-model="usuario_externo.formaEnvio" :rules="[inputRequired]" label="Inserte" dense />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Tipo de Documento *</p>
              <q-select map-options :options="filteredDoc" emit-value outlined
                v-model="usuario_externo.tipoDocumentoDestinatario" :rules="[usuario_externo.formaEnvio == 2 || usuario_externo.formaEnvio == 1 ? inputRequired : null]" label="Inserte" dense
                use-input fill-input hide-selected @filter="selectOptionsDoc" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Número de Documento *</p>
              <q-input outlined v-model="usuario_externo.numeroDocumentoDestinatario" label="Inserte"
                dense @change="getPerson"
                :rules="[(v) => lengthInput(15, v), usuario_externo.formaEnvio == 2 || usuario_externo.formaEnvio == 1 ? inputRequired : null, Number(usuario_externo.tipoDocumentoDestinatario) == 11 ? onlyAlphaNumeric : (v: string) => onlyNumbers(v)]"
                @keypress="Number(usuario_externo.tipoDocumentoDestinatario) == 11 ? onlyAlphaNumeric : onlyNumber" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Nombre del destinatario *</p>
              <q-input outlined v-model="usuario_externo.nombreDestinatario"
                :rules="[(v: string) => maxLengthInput(200, v), usuario_externo.formaEnvio == 2 || usuario_externo.formaEnvio == 1 ? inputRequired : null]" label="Inserte" dense
                @keypress="onlyAlphaNumeric" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Dirección destinatario *</p>
              <q-input outlined label="Inserte" v-model="usuario_externo.direccionDestinatario"
                :rules="[(v: string) => maxLengthInput(200, v), usuario_externo.formaEnvio == 4 || usuario_externo.formaEnvio == 3 ? inputRequired : null]" dense />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">País destinatario *</p>
              <q-select :options="filteredPais" outlined v-model="usuario_externo.paisDestinatario" label="Inserte"
                dense use-input fill-input hide-selected @filter="selectOptionsPais" :rules="[usuario_externo.formaEnvio == 4 || usuario_externo.formaEnvio == 3 ? inputRequired : null]" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Departamento destinatario *</p>
              <q-select map-options :options="filteredDep" outlined v-model="usuario_externo.departamentoDestinatario"
                label="Inserte" dense :disable="isntColombia" use-input fill-input hide-selected
                @filter="selectOptionsDep" :rules="[usuario_externo.formaEnvio == 4 || usuario_externo.formaEnvio == 3 ? inputRequired : null]" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Municipio destinatario *</p>
              <q-select map-options :options="filteredCity" outlined v-model="usuario_externo.municipioDestinatario"
                dense label="Inserte" :disable="isntColombia" use-input fill-input hide-selected
                @filter="selectOptionsCity" :rules="[usuario_externo.formaEnvio == 4 || usuario_externo.formaEnvio == 3 ? inputRequired : null]" />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Teléfono destinatario</p>
              <q-input type="text" outlined label="Inserte" v-model="usuario_externo.telefonoDestinatario" :rules="[v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense
                @keypress="onlyNumber" />
            </div>
            <div class="tw-col-span-12">
              <p class="tw-text-label tw-font-semibold">Correo electrónico *</p>
              <q-input outlined label="Inserte" v-model="usuario_externo.correoElectronico" dense
                :rules="[(v: string) => validationEmail(v), (v: string) => lengthValidation(200, v), usuario_externo.formaEnvio == 2 || usuario_externo.formaEnvio == 1 ? inputRequired : null]" />
            </div>
          </div>
        </q-form>
        <div class="tw-flex tw-justify-center tw-gap-5 tw-my-6">
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44" label="Limpiar" color="white" text-color="secondary"
            @click="limpiarExterno" />
          <q-btn type="button" label="Agregar" icon="add" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-44"
            @click="addUsuarioExterno" />
        </div>
      </q-card>

      <q-card q-card class="tw-rounded-xl q-pa-lg tw-bg-white tw-w-full" flat>
        <p class="tw-text-xl tw-font-semibold tw-text-secondary tw-pb-2">Usuarios externos en copia</p>
        <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_EXTERNO_HEADER"
          :TABLE_BODY="sortOptionsVal(dataTableExterno)" key-id="grupo" @handle-edit-data="handleDeleteExternos" />
      </q-card>
    </template>

    <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-3">
      <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="prevStep" />
      <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
        @click="emit('cancel')" />
      <q-btn v-if="activeButton" type="button" :label="isSend ? 'Guardar' : 'Siguiente'" color="primary"
        class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="validateForms()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from "vue";
import { inputRequired, onlyAlphaNumeric, onlyNumber } from "src/helpers/validations";
import { sortOptions } from "src/helpers/sortOptions";
import { adminAxios, sgdeaAxios } from "src/services";
import { SelectInput } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { validationEmail, maxLengthInput, lengthInput, minLengthInput } from "src/helpers/validations";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import TableRespuesta from "../Table.vue";
import { useDependencias } from "src/composables/useEntidades";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";

const { optionsDependencias: opForDependencias } = useDependencias()
const funcionarioOp = ref([])
const opForfuncionario = ref([])
const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([]);
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const formaEnvioOptions: Ref<SelectInput[]> = ref([]);
const tipoDocOptions: Ref<SelectInput[]> = ref([]);
const usuariosExternosCopia = ref([]);
const usuariosInternosCopia = ref([]);
const dataTableExterno = ref([]);
const dataTableInterno = ref([]);
const isntColombia = ref(false);
const formExterno = ref();
const formInterno = ref();
const listadoOficinas: Ref<any[]> = ref([]);
const filteredOficinas = ref<SelectInput[]>([]);
const filteredDoc = ref<SelectInput[]>([]);
const filteredPais = ref<SelectInput[]>([]);
const filteredDep = ref<SelectInput[]>([]);
const filteredCity = ref<SelectInput[]>([]);
const listadoTiposCopia = ref([])
const opDependencias = ref([])
const allUsers = ref([])
const isSend = ref(false)
const newListadoDepartamentos = ref()
const newListadoMunicipios = ref()
const activeButton = ref(false)
const props = withDefaults(
  defineProps<{
    datosSalida: any;
    formTwo: any
  }>(),
  {}
);

const selectValue = ref();
const notChangePais = ref(true)
const notChangeDep = ref(true)
const emit = defineEmits(["previous-step", "cancel", "next-step", "isSend"]);

if (props?.formTwo?.selectValue) {
  selectValue.value = props?.formTwo?.selectValue
  activeButton.value = true
}

const usuario_externo = ref({
  formaEnvio: null,
  tipoDocumentoDestinatario: null,
  numeroDocumentoDestinatario: null,
  nombreDestinatario: "",
  direccionDestinatario: "",
  paisDestinatario: null,
  departamentoDestinatario: null,
  municipioDestinatario: null,
  telefonoDestinatario: "",
  correoElectronico: ""
})

const usuario_interno = ref({
  dependencia: "",
  funcionario: ""
})

const DESTINARIOS_INTERNO_HEADER = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia",
    field: (row) => {
      const ofi = opForDependencias.value.find((item) => item.value == row.dependencia)?.label
      return ofi ? ofi : row.dependencia
    },
    sortable: true,
  },
  {
    name: "funcionario",
    align: "center",
    label: "Nombre funcionario",
    field: (row) => {
      const user = allUsers.value.find((item) => item.value === row.funcionario)?.label
      return user ? user : row.funcionario
    },
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
    label: "Acciones",
    field: "actions",
    sortable: true,
  },
];

const DESTINARIOS_EXTERNO_HEADER = [
  {
    name: 'formaEnvio',
    align: 'center',
    label: 'Forma de Envío',
    field: (row) => {
      const form = formaEnvioOptions.value.find((item) => item.value == row.formaEnvio)?.label
      return form ? form : row.formaEnvio
    },
    sortable: true,
  },
  {
    name: 'tipodoc',
    align: 'center',
    label: 'Tipo de documento destinatario',
    field: (row) => {
      const doc = tipoDocOptions.value.find((item) => item.value == row.tipoDocumentoDestinatario)?.label
      return doc ? doc : row.tipo_documento_nombre
    },
    sortable: true,
  },
  {
    name: 'numeroDocumentoDestinatario',
    align: 'center',
    label: 'Número de documento',
    field: 'numeroDocumentoDestinatario',
    sortable: true,
  },
  {
    name: 'nombreDestinatario',
    align: 'center',
    label: 'Nombre del destinatario',
    field: 'nombreDestinatario',
    sortable: true,
  },
  {
    name: 'direccionDestinatario',
    align: 'center',
    label: 'Dirección de destinatario',
    field: 'direccionDestinatario',
    sortable: true,
  },
  {
    name: 'pais',
    align: 'center',
    label: 'País destinatario',
    field: (row) => {
      const pais = optionsPaises.value.find((item) => item.value == row.paisDestinatario)?.label
      return pais ? pais : row.pais_nombre
    },
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'center',
    label: 'Departamento destinatario',
    field: (row) => {
      const dep = newListadoDepartamentos.value.find((item) => item.value == row.departamentoDestinatario)?.label
      return dep ? dep : row.departamento_nombre
    },
    sortable: true,
  },
  {
    name: 'municipio',
    align: 'center',
    label: 'Municipio destinatario',
    field: (row) => {
      const mun = newListadoMunicipios.value.find((item) => item.value == row.municipioDestinatario)?.label
      return mun ? mun : row.municipio_nombre
    },
    sortable: true,
  },
  {
    name: 'telefonoDestinatario',
    align: 'center',
    label: 'Teléfono destinatario',
    field: 'telefonoDestinatario',
    sortable: true,
  },
  {
    name: 'correoElectronico',
    align: 'center',
    label: 'Correo electrónico',
    field: 'correoElectronico',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
    sortable: true,
  },
];

onMounted(() => {
  getDatosOptions()
  getAllUsers()
  getTipoCopia()
})

if (props.datosSalida.forma_envio === 3 || props.datosSalida.forma_envio === 6 || props.datosSalida.forma_envio.value === 3 || props.datosSalida.forma_envio.value === 6) {
  isSend.value = true
} else {
  isSend.value = false
}

async function getDatosOptions() {
  const formaEnvioResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
  const municipiosResponse = await adminAxios.get('/municipios/list')
  const paisesResponse = await adminAxios.get('/paises/list')
  const departamentoResponse = await adminAxios.get('/departamentos/list')
  const tipoDocResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoIdentificacion')
  const oficinas = await sgdeaAxios.get('/pqrd/listadoOficinas')

  dataTableExterno.value = props.datosSalida?.copiasExternas?.map((e: any) => ({
    formaEnvio: e.formaEnvio,
    tipoDocumentoDestinatario: e.tipoDocumentoDestinatario,
    numeroDocumentoDestinatario: e.numeroDocumentoDestinatario,
    nombreDestinatario: e.nombreDestinatario,
    direccionDestinatario: e.direccionDestinatario,
    paisDestinatario: e.paisDestinatario,
    departamentoDestinatario: e.departamentoDestinatario,
    municipioDestinatario: e.municipioDestinatario,
    telefonoDestinatario: e.telefonoDestinatario,
    correoElectronico: e.correoElectronico
  })) ?? [];

  dataTableInterno.value = props.datosSalida?.copiasInternas?.map((e: any) => ({
    funcionario: e.funcionario,
    dependencia: e.dependencia,
  })) ?? [].sort((a, b) => a.funcionario.localeCompare(b.funcionario));

  if (props?.formTwo) {
    if (props?.formTwo?.usuariosExt?.length) {
      usuariosExternosCopia.value.push(...props?.formTwo?.usuariosExt)
      dataTableExterno.value.push(...props?.formTwo?.usuariosExt)
    }

    if (props?.formTwo?.usuariosInt?.length) {
      usuariosInternosCopia.value.push(...props?.formTwo?.usuariosInt)
      dataTableInterno.value.push(...props?.formTwo?.usuariosInt)
    }
  }

  tipoDocOptions.value = tipoDocResponse.data.map((item) => { return { label: item.nombre, value: item.id } }).sort((a, b) => {
    if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
    if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

    if (a.value == 3) return -1; // "Carné Diplomático" va segundo
    if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

    return 0;
  });
  tipoDocOptions.value = tipoDocOptions.value.filter((item) => { return item.value !== 12 })
  filteredDoc.value = tipoDocOptions.value
  formaEnvioOptions.value = formaEnvioResponse.data.map((item) => { return { label: item.nombre, value: item.id } })
  formaEnvioOptions.value = sortOptions(formaEnvioOptions.value.filter((e) => { return e.value !== 5 && e.value !== 4 }))
  optionsPaises.value = paisesResponse.data.map((item) => { return { label: item.nombre, value: item.idPais } })
  usuario_externo.value.paisDestinatario = optionsPaises.value.find((val) => val.value === 425)
  filteredPais.value = optionsPaises.value
  optionsDepartamentos.value = departamentoResponse.data.map((item) => { return { label: item.nombre, value: item.idDepartamento } })

  newListadoDepartamentos.value = departamentoResponse.data.map((item) => { return { label: item.nombre, value: item.idDepartamento } })

  filteredDep.value = optionsDepartamentos.value

  optionsMunicipios.value = municipiosResponse.data.map((item) => { return { label: item.nombre, value: item.idMunicipio } })

  newListadoMunicipios.value = municipiosResponse.data.map((item) => { return { label: item.nombre, value: item.idMunicipio } })

  filteredCity.value = optionsMunicipios.value
  listadoOficinas.value = oficinas.data.map((e) => { return { label: e.nombre, value: e.id } })
  listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
  filteredOficinas.value = listadoOficinas.value

  await formExterno.value.reset()
}

const getTipoCopia = async () => {
  try {
    const response = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoCopia')
    listadoTiposCopia.value = sortOptions(response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.id
      }
    }))
  } catch (error) {
    console.error(error)
  }
}

const getAllUsers = async () => {
  const response = await sgdeaAxios.get("/api/usuarios/")
  allUsers.value = response.data.map((e) => {
    return {
      label: e.firstname + ' ' + e.lastname,
      value: e.id
    }
  })

}

function validateForms() {
  if (selectValue.value) {
    if (selectValue.value == 3) {
      props.datosSalida.tipoCopia = 3
      isSend.value ? emit('isSend') : emit('next-step')
    }

    if (selectValue.value == 1) {
      if (dataTableInterno.value.length) {
        props.datosSalida.copiasInternas = dataTableInterno.value
        props.datosSalida.copiasExternas = []
        props.datosSalida.tipoCopia = 1
        isSend.value ? emit('isSend') : emit('next-step')
      } else {
        toast.error("Debe seleccionar como mínimo un usuario en copia")
      }
    }

    if (selectValue.value == 2) {
      if (dataTableExterno.value.length) {
        props.datosSalida.copiasExternas = dataTableExterno.value
        props.datosSalida.copiasInternas = []
        props.datosSalida.tipoCopia = 2
        isSend.value ? emit('isSend') : emit('next-step')
      } else {
        toast.error("Debe seleccionar como mínimo un usuario en copia")
      }
    }

    if (selectValue.value == 4) {
      if (dataTableExterno.value.length && dataTableInterno.value.length) {
        props.datosSalida.copiasInternas = dataTableInterno.value
        props.datosSalida.copiasExternas = dataTableExterno.value
        props.datosSalida.tipoCopia = 4
        isSend.value ? emit('isSend') : emit('next-step')
      } else {
        toast.error("Debe seleccionar como mínimo un usuario interno y un usuario externo")
      }
    }
  }
  else {
    toast.error("Seleccione una opción")
  }
}

const onlyNumbers = (string: string) => {
  const regex = /^[0-9]+$/;

  if (regex.test(string)) {
    return true;
  } else {
    return "Solo numeros";
  }
};

const prevStep = () => {
  const object = {
    selectValue: selectValue.value,
    usuariosInt: usuariosInternosCopia.value,
    usuariosExt: usuariosExternosCopia.value
  }
  emit('previous-step', object)
}

async function addUsuarioExterno() {
  if (await formExterno.value.validate()) {

    if (dataTableExterno.value.length > 49) {
      toast.error("Tienes un limite de 50 destinatarios")
      return
    }

    const usuarioModificado = { ...usuario_externo.value }
    // @ts-ignore
    usuarioModificado.paisDestinatario = usuarioModificado.paisDestinatario.value
    // @ts-ignore
    usuarioModificado.departamentoDestinatario = usuarioModificado.departamentoDestinatario.value
    // @ts-ignore
    usuarioModificado.municipioDestinatario = usuarioModificado.municipioDestinatario.value
    dataTableExterno.value.push(usuarioModificado)
    usuariosExternosCopia.value.push(usuarioModificado)

    limpiarExterno()
  }
}

async function addUsuarioInterno() {
  if (await formInterno.value.validate()) {
    const filter = usuariosInternosCopia.value.find((e) => { return e.funcionario == usuario_interno.value.funcionario })
    const filter2 = dataTableInterno.value.find((x) => { return x.funcionario == usuario_interno.value.funcionario })

    if (filter || filter2) {
      toast.error("No puedes agregar 2 usuarios iguales")
      return
    }

    dataTableInterno?.value.push(usuario_interno.value);
    usuariosInternosCopia.value.push(usuario_interno.value);

    limpiarInterno()
  }
}

async function limpiarInterno() {
  usuario_interno.value = {
    dependencia: null,
    funcionario: null
  };
  await formInterno.value.reset()
}

async function limpiarExterno() {
  usuario_externo.value = {
    formaEnvio: null,
    tipoDocumentoDestinatario: null,
    numeroDocumentoDestinatario: null,
    nombreDestinatario: "",
    direccionDestinatario: "",
    paisDestinatario: { label: "Colombia", value: 425 },
    departamentoDestinatario: null,
    municipioDestinatario: null,
    telefonoDestinatario: "",
    correoElectronico: ""
  }
  await formExterno.value.reset()
}

const selectOptionsDoc = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredDoc.value = tipoDocOptions.value;
    });
    return;
  }
  update(() => {
    filteredDoc.value = tipoDocOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsPais = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredPais.value = optionsPaises.value;
    });
    return;
  }
  update(() => {
    filteredPais.value = optionsPaises.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsDep = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredDep.value = optionsDepartamentos.value;
    });
    return;
  }
  update(() => {
    filteredDep.value = optionsDepartamentos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsCity = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredCity.value = optionsMunicipios.value;
    });
    return;
  }
  update(() => {
    filteredCity.value = optionsMunicipios.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

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

const handleDeleteInternos = async (item) => {
  dataTableInterno.value = dataTableInterno.value.filter((e) => { return e.funcionario !== item.funcionario })
  usuariosInternosCopia.value = usuariosInternosCopia.value.filter((e) => { return e.funcionario !== item.funcionario })
}

const handleDeleteExternos = async (item) => {
  dataTableExterno.value = dataTableExterno.value.filter((e) => { return e.correoElectronico !== item.correoElectronico })
  usuariosExternosCopia.value = usuariosExternosCopia.value.filter((e) => { return e.correoElectronico !== item.correoElectronico })

}

async function getPerson() {
  await formExterno.value.reset()
  const tipoDoc = getAcronimobyId(Number(usuario_externo.value.tipoDocumentoDestinatario))
  const number = Number(usuario_externo.value.numeroDocumentoDestinatario) ? Number(usuario_externo.value.numeroDocumentoDestinatario) : ''

  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      }

      const fullName = Object.values(nameObject).join(' ')

      usuario_externo.value.nombreDestinatario = fullName
      usuario_externo.value.direccionDestinatario = response.data.direccion
      usuario_externo.value.telefonoDestinatario = response.data.telefono
      usuario_externo.value.correoElectronico = response.data.email
      usuario_externo.value.paisDestinatario = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      usuario_externo.value.departamentoDestinatario = { label: response.data.departamento.nombre, value: response.data.departamento.idDepartamento }
      usuario_externo.value.municipioDestinatario = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      notChangePais.value = false
      notChangeDep.value = false
    } else {
      await resetForm()
    }
  } catch (error) {
    await resetForm()
  }
}

const resetForm = async () => {
  usuario_externo.value.nombreDestinatario = ''
  usuario_externo.value.direccionDestinatario = ''
  usuario_externo.value.telefonoDestinatario = ''
  usuario_externo.value.correoElectronico = ''
  usuario_externo.value.paisDestinatario = ''
  usuario_externo.value.departamentoDestinatario = ''
  usuario_externo.value.municipioDestinatario = ''
  await formExterno.value.reset()
}

const sortOptionsVal = (vals: any[]) => {
  return vals.sort(
    (leftItem: { nombreDestinatario: string }, rightItem: { nombreDestinatario: string }) => {
      const nombreA = leftItem.nombreDestinatario.toLowerCase().trim();
      const nombreB = rightItem.nombreDestinatario.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  );
};

watch(() => usuario_externo.value.paisDestinatario, async (value) => {
  if (notChangePais.value) {
    let val = value.label as unknown as string;
    usuario_externo.value.departamentoDestinatario = "";
    usuario_externo.value.municipioDestinatario = "";
    if (val.toLowerCase() == "colombia") {
      isntColombia.value = false;
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
    } else {
      usuario_externo.value.departamentoDestinatario = value;
      usuario_externo.value.municipioDestinatario = value;
      isntColombia.value = true;
    }
  }
  notChangePais.value = true
});

watch(() => usuario_externo.value.departamentoDestinatario, async (value) => {
  if (notChangeDep.value) {
    if (!isntColombia.value) {
      usuario_externo.value.municipioDestinatario = "";
    }
  }

  // @ts-ignore
  const { optionsMunicipalities } = await useMunicipalities(value.value);
  optionsMunicipios.value = sortOptions(optionsMunicipalities.value);

  notChangeDep.value = true
});

watch(() => usuario_externo.value.paisDestinatario, async (value) => {
  // @ts-ignore
  const { optionsDepartments } = await useDepartments(value.value);
  optionsDepartamentos.value = optionsDepartments.value;
})

watch(() => usuario_interno.value.dependencia, async (value) => {
  const { data } = await sgdeaAxios.get(`api/usuarios/seccionSubseccion/${value}`)
  opForfuncionario.value = data.map((item) => ({
    label: item.firstname + ' ' + item.lastname,
    value: item.id
  })).sort((a, b) => a.label.localeCompare(b.label))
});

watch(() => selectValue.value, () => {
  activeButton.value = true
})

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

</script>

