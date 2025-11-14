<template>
  <q-card class="tw-rounded-xl tw-bg-white tw-py-6 tw-px-8" flat>
    <section>
      <h2 class="tw-font-bold tw-text-lg tw-mb-2">Copia</h2>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">
        <div class="tw-col-span-12">
          <p class="tw-text-label tw-font-semibold">¿Con copia?</p>
          <q-select map-options emit-value outlined :disable="isAprobador" label="Inserte" dense :options="items" v-model="selectValue" />
        </div>
      </div>
      <template v-if="selectValue === 'Interna' || selectValue === 'InternayExterna'">
        <q-form ref="formInterno" greedy>
          <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mt-3">
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Oficina</p>
              <q-select v-model="usuario_interno.oficina_id" :options="filteredOficinas" map-options emit-value outlined
                label="Inserte" :disable="isAprobador" dense use-input fill-input hide-selected @filter="selectOptionsFilterFn"
                @update:model-value="getFuncionario" :rules="[inputRequired]" />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Nombre funcionario</p>
              <q-select v-model="usuario_interno.usuario_id" map-options emit-value :options="funcionarioOptions"
                outlined label="Inserte" :disable="isAprobador" dense :rules="[inputRequired]">
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
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" :disable="isAprobador" label="Limpiar" color="white" text-color="secondary"
            @click="limpiarInterno" />
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" :disable="isAprobador" label="Agregar" color="primary"
            @click="addUsuarioInterno" />
        </div>

        <div class="">
          <p class="tw-text-lg tw-font-semibold tw-text-secondary">Listado de usuarios en copia</p>
          <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_INTERNO_HEADER" :TABLE_BODY="dataTableInterno"
            v-model:item-selected="item" key-id="grupo" @handle-edit-data="handleDeleteInternos" />
        </div>
      </template>
    </section>
    <template v-if="selectValue === 'Externa' || selectValue === 'InternayExterna'">
      <h2 class="tw-font-bold tw-text-lg tw-mb-2">Copia externa</h2>
      <q-form ref="formExterno" greedy>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Forma de envío *</p>
            <q-select map-options :options="filteredForma" emit-value outlined v-model="usuario_externo.forma_envio_id"
              :rules="[inputRequired]" label="Inserte" :disable="isAprobador" dense use-input fill-input hide-selected
              @filter="selectOptionsForma" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Tipo de Documento *</p>
            <q-select map-options :options="filteredDoc" emit-value outlined v-model="usuario_externo.tipo_documento_id"
              :rules="[inputRequired]" label="Inserte" :disable="isAprobador" dense use-input fill-input hide-selected
              @filter="selectOptionsDoc" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">
              Número de documento destinatario *
            </p>
            <q-input type="text" :disable="isAprobador" v-model="usuario_externo.numero_documento" min="0"
              :rules="[(v: string) => lengthValidation(15, v), inputRequired]" outlined label="Inserte" dense
              @keypress="Number(usuario_externo.tipo_documento_id)" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">
              Nombre del destinatario *
            </p>
            <q-input outlined :disable="isAprobador" v-model="usuario_externo.nombre" min="0"
              :rules="[(v: string) => lengthValidation(100, v), inputRequired]" label="Inserte" dense />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">
              Dirección destinatario *
            </p>
            <q-input outlined label="Inserte" :disable="isAprobador" v-model="usuario_externo.direccion"
              :rules="[(v: string) => maxLengthInput(150, v), isFisicoOrCorreo() == 1 ? inputRequired : true]"
              dense />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">
              País destinatario
            </p>
            <q-select :options="filteredPais" :disable="isAprobador" outlined v-model="usuario_externo.pais_id" label="Inserte" dense use-input
              fill-input hide-selected @filter="selectOptionsPais" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">
              Departamento destinatario
            </p>
            <q-select map-options :options="filteredDep" outlined v-model="usuario_externo.departamento_id"
              label="Inserte" dense use-input fill-input hide-selected
              @filter="selectOptionsDep"
              :rules="[(val) => Number(usuario_externo.forma_envio_id) === 3 || Number(usuario_externo.forma_envio_id) === 4 ? val ? true : 'Este campo es requerido' : true]" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Municipio destinatario</p>
            <q-select map-options :options="filteredCity" outlined v-model="usuario_externo.municipio_id"
              label="Inserte" use-input fill-input hide-selected @filter="selectOptionsCity"
              :rules="[(val) => Number(usuario_externo.forma_envio_id) === 3 || Number(usuario_externo.forma_envio_id) === 4 ? val ? true : 'Este campo es requerido' : true]" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Teléfono destinatario</p>
            <q-input type="text" :disable="isAprobador" outlined label="Inserte" min="0" v-model="usuario_externo.numero_celular" dense
               :rules="[mobilePhonNumber]" />
          </div>
          <div class="tw-col-span-2">
            <p class="tw-text-label tw-font-semibold">Correo electrónico</p>
            <q-input outlined label="Inserte" :disable="isAprobador" v-model="usuario_externo.correo" dense
              :rules="[(v: string) => validationEmail(v), (v: string) => lengthValidation(200, v), isFisicoOrCorreo() == 2 ? inputRequired : true]" />
          </div>
        </div>
      </q-form>
      <div class="row tw-flex tw-justify-center tw-gap-4 tw-mt-6 tw-mb-8">
        <q-btn class="tw-rounded-xl tw-h-9 tw-p-2 tw-w-52" :disable="isAprobador" label="Limpiar" color="white" text-color="secondary"
          @click="limpiarExterno" />
        <q-btn type="button" label="Agregar" :disable="isAprobador" color="primary" class="tw-rounded-xl tw-h-9 tw-p-2 tw-w-52"
          @click="addUsuarioExterno" />
      </div>

      <p class="tw-text-lg tw-font-semibold tw-text-secondary">Listado de usuarios en copia</p>
      <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_EXTERNO_HEADER" :TABLE_BODY="dataTableExterno"
        v-model:item-selected="item" key-id="grupo" @handle-edit-data="handleDeleteExternos" />
    </template>
  </q-card>
  <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-5">
    <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
      @click="() => emit('previous-step')" />
    <q-btn label="Cancelar" color="accent" :disable="isAprobador" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52"
      @click="emit('cancel')" />
    <q-btn type="button" :label="'Guardar'" :disable="isAprobador" color="primary"
      class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="validateForms()" />
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch, nextTick } from "vue";
import { inputRequired } from "src/helpers/validations";
import { adminAxios, sgdeaAxios } from "src/services";
import { SelectInput } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { validationEmail, maxLengthInput, onlyAlphaNumeric, alphanumeric } from "src/helpers/validations";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import TableRespuesta from "../TableRespuesta.vue";
import { useAuthStore } from "src/stores/auth.store";
import { useDependencias } from "src/composables/useEntidades";

const { optionsDependencias: opForDependencias } = useDependencias()
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
const filteredForma = ref<SelectInput[]>([]);
const filteredDoc = ref<SelectInput[]>([]);
const filteredPais = ref<SelectInput[]>([]);
const filteredDep = ref<SelectInput[]>([]);
const filteredCity = ref<SelectInput[]>([]);
const funcionarioOptions = ref([]);
const permanentFuncionariosMachete = ref([]);
const funcionarioOptionsDisplay = ref([]);
const auth = useAuthStore();
const isAprobador = auth.userInfo.role.toLowerCase().includes("aprobador");

const props = withDefaults(
  defineProps<{
    datosSalida: any;
  }>(),
  {}
);

const selectValue = ref(null);
const emit = defineEmits(["save", "previous-step", "cancel"]);

const items = ref([
  {
    label: "Interna",
    value: "Interna",
  },
  {
    label: "Externa",
    value: "Externa",
  },
  {
    label: "Interna y Externa",
    value: "InternayExterna",
  },
  {
    label: "Ninguna",
    value: "Ninguna",
  },
]);

const usuario_externo = ref({
  nombre: "",
  direccion: "",
  correo: "",
  externo: true,
  usuario_id: null,
  forma_envio_id: null,
  tipo_documento_id: null,
  numero_documento: "",
  pais_id: {},
  departamento_id: {},
  municipio_id: {},
  numero_celular: "",
  id: null
})

const usuario_interno = ref({
  oficina_id: "",
  usuario_id: "",
  externo: false,
  id: null
})

function isFisicoOrCorreo() {
  if (usuario_externo.value.forma_envio_id == 3 || usuario_externo.value.forma_envio_id == 4) {
    return 1
  } else {
    return 2
  }
}

const DESTINARIOS_INTERNO_HEADER = [
  {
    name: "oficina_id",
    align: "center",
    label: "Oficina",
    field: (row) => {
      const ofi = filteredOficinas.value.find((item) => item.value == row.oficina_id)?.label
      return ofi ? ofi : row.oficina_id
    },
    sortable: true,
  },
  {
    name: "usuario_id",
    align: "center",
    label: "Nombre funcionario",
    field: (row) => {
      const user = permanentFuncionariosMachete.value.find((item) => item.value == row.usuario_id)?.label
      return user ? user : row.usuario_id
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
      const form = formaEnvioOptions.value.find((item) => item.value == row.forma_envio_id)?.label
      return form ? form : formaEnvioOptions.value.find((item) => item.value == row.formaEnvio).label
    },
    sortable: true,
  },
  {
    name: 'tipodoc',
    align: 'center',
    label: 'Tipo de documento destinatario',
    field: (row) => {
      const doc = tipoDocOptions.value.find((item) => item.value == row.tipo_documento_id)?.label
      return doc ? doc : row.tipo_documento_nombre
    },
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre del destinatario',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'direccion',
    align: 'center',
    label: 'Direccion de destinatario',
    field: 'direccion',
    sortable: true,
  },
  {
    name: 'pais',
    align: 'center',
    label: 'País destinatario',
    field: (row) => {
      const pais = optionsPaises.value.find((item) => item.value == row.pais_id)?.label
      return pais ? pais : row.pais_nombre
    },
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'center',
    label: 'Departamento destinatario',
    field: (row) => {
      const dep = optionsDepartamentos.value.find((item) => item.value == row.departamento_id)?.label
      return dep ? dep : row.departamento_nombre
    },
    sortable: true,
  },
  {
    name: 'municipio',
    align: 'center',
    label: 'Municipio destinatario',
    field: (row) => {
      const mun = optionsMunicipios.value.find((item) => item.value == row.municipio_id)?.label
      return mun ? mun : row.municipio_nombre
    },
    sortable: true,
  },
  {
    name: 'telefono',
    align: 'center',
    label: 'Teléfono destinatario',
    field: 'numero_celular',
    sortable: true,
  },
  {
    name: 'correo',
    align: 'center',
    label: 'Correo electrónico',
    field: 'correo',
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

onMounted(async () => {
  getDatosOptions()
})

async function getDatosOptions() {
  const formaEnvioResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoFormaEnvio')
  const municipiosResponse = await adminAxios.get('/municipios/list')
  const paisesResponse = await adminAxios.get('/paises/list')
  const departamentoResponse = await adminAxios.get('/departamentos/list')
  const tipoDocResponse = await sgdeaAxios.get('/correspondencia/comunicacion/listadoTipoIdentificacion')
  const oficinas = opForDependencias.value;

  const usuariosExternosCopia = props.datosSalida?.usuariosCopia?.filter((e) => { return e.externo == true })
  dataTableExterno.value = usuariosExternosCopia?.map((e: any) => ({
    formaEnvio: e.forma_envio_id,
    direccion: e.direccion,
    tipodoc: e.tipo_documento_id,
    tipo_documento_nombre: e.tipo_documento_nombre,
    nombre: e.nombre,
    pais_nombre: e.pais_nombre,
    pais: e.pais_id,
    departamento_nombre: e.departamento_nombre,
    departamento: e.departamento_id,
    municipio_nombre: e.municipio_nombre,
    municipio: e.municipio_id,
    numero_celular: Number(e.numero_celular),
    correo: e.correo,
    id: e.id
  })) ?? [];

  const usuariosInternosCopia = props.datosSalida?.usuariosCopia?.filter((e) => { return e.externo !== true })
  dataTableInterno.value = usuariosInternosCopia?.map((e: any) => ({
    usuario_id: e.nombre,
    oficina_id: e.oficina_nombre,
    id: e.id,
    usuario_ID: e.usuario_id,
  })) ?? [];

  tipoDocOptions.value = tipoDocResponse.data.map((item) => { return { label: item.nombre, value: item.id } })
  filteredDoc.value = tipoDocOptions.value
  formaEnvioOptions.value = formaEnvioResponse.data.map((item) => { return { label: item.nombre, value: item.id } })
  formaEnvioOptions.value = formaEnvioOptions.value.filter((e) => { return e.value !== 6 })
  filteredForma.value = formaEnvioOptions.value
  optionsPaises.value = paisesResponse.data.map((item) => { return { label: item.nombre, value: item.idPais } })
  usuario_externo.value.pais_id = optionsPaises.value.find((val) => val.value === 425)
  filteredPais.value = optionsPaises.value
  optionsDepartamentos.value = departamentoResponse.data.map((item) => { return { label: item.nombre, value: item.idDepartamento } })
  filteredDep.value = optionsDepartamentos.value
  optionsMunicipios.value = municipiosResponse.data.map((item) => { return { label: item.nombre, value: item.idMunicipio } })
  filteredCity.value = optionsMunicipios.value
  listadoOficinas.value = oficinas
  listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
  filteredOficinas.value = listadoOficinas.value
}

function validateForms() {
  if (selectValue.value == "Ninguna") {
    props.datosSalida.copia = "Ninguna"
    emit("save")
  } else if (selectValue.value == "Interna" || selectValue.value == "Externa" || selectValue.value == "InternayExterna") {
    if (dataTableExterno.value.length || dataTableInterno.value.length) {
      const total = usuariosInternosCopia.value.concat(usuariosExternosCopia.value);
      props.datosSalida.usuariosCopia = total
      props.datosSalida.copia = selectValue.value
      emit("save");
    } else {
      toast.error("Debe agregar como mínimo un destinatario copia")
    }
  } else {
    toast.error("Seleccione una opción")
  }
}

async function addUsuarioExterno() {
  if (await formExterno.value.validate()) {

    if (dataTableExterno.value.length > 49) {
      toast.error("Tienes un limite de 50 destinatarios")
      return
    }

    const usuarioModificado = { ...usuario_externo.value }
    // @ts-ignore
    usuarioModificado.pais_id = usuarioModificado.pais_id.value
    // @ts-ignore
    usuarioModificado.departamento_id = usuarioModificado.departamento_id.value
    // @ts-ignore
    usuarioModificado.municipio_id = usuarioModificado.municipio_id.value
    dataTableExterno.value.push(usuarioModificado)
    usuariosExternosCopia.value.push(usuarioModificado)

    limpiarExterno()
  }
}

async function addUsuarioInterno() {
  if (await formInterno.value.validate()) {
    const filter = usuariosInternosCopia.value.find((e) => { return e.usuario_id == usuario_interno.value.usuario_id })
    const filter2 = dataTableInterno.value.find((x) => { return x.usuario_ID == usuario_interno.value.usuario_id })
    if (filter || filter2) {
      toast.error("No puedes agregar 2 usuarios iguales")
      return
    }

    if (dataTableInterno.value.length > 49) {
      toast.error("Tienes un limite de 50 destinatarios")
      return
    }

    dataTableInterno?.value.push(usuario_interno.value);
    usuariosInternosCopia.value.push(usuario_interno.value);
    limpiarInterno()
  }
}

async function limpiarInterno() {
  usuario_interno.value = {
    oficina_id: null,
    usuario_id: null,
    externo: false,
    id: null
  };
  await formInterno.value.reset()
  funcionarioOptions.value = [];
}

async function limpiarExterno() {
  usuario_externo.value = {
    nombre: "",
    direccion: "",
    correo: "",
    externo: true,
    usuario_id: null,
    forma_envio_id: null,
    tipo_documento_id: null,
    numero_documento: "",
    pais_id: { label: "Colombia", value: 425 },
    departamento_id: null,
    municipio_id: null,
    numero_celular: "",
    id: null
  }
  await formExterno.value.reset()
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOficinas.value = listadoOficinas.value;
    });
    return;
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const selectOptionsForma = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredForma.value = formaEnvioOptions.value;
    });
    return;
  }
  update(() => {
    filteredForma.value = formaEnvioOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

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

async function getFuncionario(idOficina: number) {
  try {
    usuario_interno.value.usuario_id = '';
    const response = await sgdeaAxios.get(`/pqrd/listadoUsuariosGestionadores?pageNo=0&pageSize=8&oficina=${idOficina ?? ''}`)
    const newFuncionarios = response.data.elementos.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(({ fullName, usuarioId }) => {
      return {
        label: fullName,
        value: usuarioId
      }
    })

    funcionarioOptions.value = newFuncionarios
    permanentFuncionariosMachete.value = [...permanentFuncionariosMachete.value, ...newFuncionarios]
    funcionarioOptionsDisplay.value = [...funcionarioOptions.value];
  } catch (error) {
    console.error(error);
  }
}

const handleDeleteInternos = async (item) => {
  try {
    const id = item.id
    if (id) {
      const response = await sgdeaAxios.delete(`/pqrd/eliminar-usuario-copia/${id}`)
      if (response.status == 200) {
        dataTableInterno.value = dataTableInterno.value.filter((e) => { return e.id !== item.id })
      }
    } else {
      dataTableInterno.value = dataTableInterno.value.filter((e) => { return e.usuario_id !== item.usuario_id })
      usuariosInternosCopia.value = usuariosInternosCopia.value.filter((e) => { return e.usuario_id !== item.usuario_id })
    }
  } catch (error) {
    console.error(error);
  }
}

const handleDeleteExternos = async (item) => {
  try {
    const id = item.id
    if (id) {
      const response = await sgdeaAxios.delete(`/pqrd/eliminar-usuario-copia/${id}`)
      if (response.status == 200) {
        dataTableExterno.value = dataTableExterno.value.filter((e) => { return e.id !== item.id })
      }
    } else {
      dataTableExterno.value = dataTableExterno.value.filter((e) => { return e.numero_documento !== item.numero_documento })
      usuariosExternosCopia.value = usuariosExternosCopia.value.filter((e) => { return e.numero_documento !== item.numero_documento })
    }
  } catch (error) {
    console.error(error);
  }
}

// Modifica el watcher así:
watch(
  () => usuario_externo.value.pais_id,
  async (value) => {
    //@ts-ignore
    let val = value?.label as unknown as string;
    usuario_externo.value.departamento_id = null;
    usuario_externo.value.municipio_id = null;

    if (val?.toLowerCase() == "colombia") {
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
      filteredDep.value = optionsDepartamentos.value;
    } else {
      // Si no es Colombia, limpia las opciones
      optionsDepartamentos.value = [];
      optionsMunicipios.value = [];
      filteredDep.value = [];
      filteredCity.value = [];
    }
  }
);

watch(
  () => usuario_externo.value.departamento_id,
  async (value) => {
    // Solo resetea si el departamento cambió
 //@ts-ignore
    if (value && value.value) {
       //@ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
      filteredCity.value = optionsMunicipios.value;
    }
  },
  { deep: true }
);

watch(
  () => usuario_externo.value.pais_id,
  async (value) => {
    // @ts-ignore
    const { optionsDepartments } = await useDepartments(value.value);
    optionsDepartamentos.value = optionsDepartments.value;
  }
);

const sortOptions = (vals: any[]) => {
  return vals.sort(
    (leftItem: { label: string }, rightItem: { label: string }) => {
      const nombreA = leftItem.label.toLowerCase().trim();
      const nombreB = rightItem.label.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  )
}

function onlyNumber(event: {
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

const mobilePhonNumber = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{5,8}$/;
  if (val) {
    if (val.length < 7) {
      return "El número de teléfono celular debe contener entre 7 y 10 dígitos";
    }

    if (val.length > 10) {
      return "El número de teléfono celular debe contener entre 7 y 10 dígitos";
    }

    if (val.length <= 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    }
  }
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

</script>
