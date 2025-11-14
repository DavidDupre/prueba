
<template>
  <q-card class="tw-rounded-xl tw-bg-white tw-px-8" flat>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4">
        <div class="tw-col-span-12">
          <h3 class="text-bold tw-text-xl tw-mb-4">
            Usuarios en Copia
          </h3>
          <q-form ref="conCopiaRef" >
            <p class="tw-text-label tw-font-semibold">¿Con Copia? *</p>
            <q-select map-options emit-value outlined label="Inserte" dense :options="items" v-model="datosSalida.copia"
            :rules="[val => !!val || 'Campo requerido' ]" :disable="isPorAprobarPorRevisar"/>
          </q-form>
        </div>
      </div>
      <div class="tw-pt-[40px]" v-if="datosSalida.copia == 'Interna' || datosSalida.copia == 'Interna/Externa'">
        <h2 class="tw-font-bold tw-text-lg tw-my-4 tw-mb-5">Copia Interna</h2>
        <q-form ref="formInterno" greedy class="tw-mb-6" v-if="!isPorAprobarPorRevisar">
          <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mt-3" >
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Dependencias *</p>
              <q-select v-model="usuario_interno.dependencia_id" :options="filteredDependencias" map-options emit-value outlined label="Inserte" dense use-input fill-input hide-selected @filter="selectOptionsFilterFn" @update:model-value="getFuncionario" :rules="[inputRequired]" />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Nombre Funcionario *</p>
              <q-select v-model="usuario_interno.usuario_id" outlined label="Seleccione" dense :rules="[inputRequired]" map-options emit-value :options="funcionarioOptions" use-input @filter="filtrarOpciones" fill-input hide-selected >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
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
        <div class="tw-flex tw-justify-center tw-gap-5 tw-mb-10" v-if="!isPorAprobarPorRevisar">
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" label="Limpiar" color="white" text-color="secondary"
            @click="limpiarInterno" />
          <q-btn class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" label="Agregar" color="primary"
            @click="addUsuarioInterno" />
        </div>

        <div>
          <p class="tw-text-lg tw-font-semibold tw-text-secondary">Usuarios Internos en Copia</p>
          <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_INTERNO_HEADER" :TABLE_BODY="dataTableInterno"
            v-model:item-selected="item" key-id="grupo" @handle-edit-data="handleDeleteInternos" :showActions="false" :isDeleteDisable="isPorAprobarPorRevisar"/>
        </div>
      </div>
      <div class="tw-pt-[60px]" v-if="datosSalida.copia == 'Externa' || datosSalida.copia == 'Interna/Externa'">
        <h2 class="tw-font-bold tw-text-lg tw-mb-10">Copia Externa</h2>
        <q-form ref="formExterno" greedy class="tw-mb-6" v-if="!isPorAprobarPorRevisar">
          <div class="tw-grid tw-grid-cols-4 tw-gap-4">
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Forma de Envío *</p>
              <q-select map-options :options="filteredForma" emit-value outlined v-model="usuario_externo.forma_envio_id" :rules="[inputRequired]" label="Inserte" dense use-input fill-input hide-selected @update:model-value="changeFormaEnvio" @filter="selectOptionsForma" :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Tipo de Documento del Destinatario *</p>
              <q-select map-options :options="filteredDoc" emit-value outlined v-model="usuario_externo.tipo_documento_id" :rules="[inputRequired]" label="Inserte" dense use-input fill-input hide-selected @update:model-value="changeTipoDocumento" @filter="selectOptionsDoc" :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                Número de Documento del Destinatario {{ isNumeroDocumento ? '' : '*'}}
              </p>
              <q-input type="text" v-model="usuario_externo.numero_documento" min="0"
                :rules="[ Number(usuario_externo.tipo_documento_id) == 6 ? alphanumeric2 : onlyNumbers, (val) => maxLengthInput(15, val), inputRequired]" outlined label="Inserte" dense
                :disable="isNumeroDocumento || isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                Nombre del Destinatario *
              </p>
              <q-input outlined v-model="usuario_externo.nombre" min="0" :rules="[(v: string) => maxLengthInput(200, v), alphanumeric2, inputRequired]" label="Inserte" dense :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                Dirección del Destinatario
                <span v-if="isDireccionRequired">*</span>
              </p>
              <q-input outlined label="Inserte" v-model="usuario_externo.direccion"
                :rules="[(v: string) => maxLengthInput(200, v), isDireccionRequired ? inputRequired : true, alphanumeric2]"
                dense :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                País Destinatario
                <span v-if="isDireccionRequired">*</span>
              </p>
              <q-select :options="filteredPais" outlined v-model="usuario_externo.pais_id" label="Inserte" dense use-input fill-input hide-selected @filter="selectOptionsPais" :rules="[isDireccionRequired ? inputRequired : true]" :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                Departamento Destinatario
                <span v-if="isDireccionRequired">*</span>
              </p>
              <q-select map-options :options="filteredDep" outlined v-model="usuario_externo.departamento_id"
                label="Inserte" dense :disable="isntColombia || isPorAprobarPorRevisar" use-input fill-input hide-selected @filter="selectOptionsDep" :rules="isDireccionRequired ? [(val) =>  Number(usuario_externo.forma_envio_id) === 3 || Number(usuario_externo.forma_envio_id) === 4 ? val ? true : 'Este campo es requerido' : true] : []"/>
              </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                Municipio Destinatario
                <span v-if="isDireccionRequired">*</span>
              </p>
              <q-select map-options :options="filteredCity" dense outlined v-model="usuario_externo.municipio_id" label="Inserte" :disable="isntColombia || isPorAprobarPorRevisar" use-input fill-input hide-selected @filter="selectOptionsCity" :rules="isDireccionRequired ? [(val) => Number(usuario_externo.forma_envio_id) === 3 || Number(usuario_externo.forma_envio_id) === 4 ? val ? true : 'Este campo es requerido' : true] : []"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Teléfono del Destinatario</p>
              <q-input type="text" outlined label="Inserte" min="0" v-model="usuario_externo.numero_celular" dense
                @update:model-value="(val: string) => validateInputPhone(val, formExterno, 'telefonoFijoDestinatario')"
                name="telefonoFijoDestinatario"
                @keypress="onlyNumber" :rules="[homePhoneNumberMinAndMaxLength]" :disable="isPorAprobarPorRevisar"/>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Correo Electrónico del Destinatario *</p>
              <q-input outlined label="Inserte" v-model="usuario_externo.correo" dense
                :rules="[(v: string) => validationEmail(v), (v: string) => lengthValidation(200, v), isFisicoOrCorreo() == 2 ? inputRequired : true]" :disable="isPorAprobarPorRevisar"/>
            </div>
          </div>
        </q-form>
        <div class="row tw-flex tw-justify-center tw-gap-4 tw-mb-10" v-if="!isPorAprobarPorRevisar">
          <q-btn class="tw-rounded-xl tw-h-9 tw-p-2 tw-w-52" label="Limpiar" color="white" text-color="secondary"
            @click="limpiarExterno" />
          <q-btn type="button" label="Agregar" color="primary" class="tw-rounded-xl tw-h-9 tw-p-2 tw-w-52"
            @click="addUsuarioExterno" />
        </div>

        <div>
        <p class="tw-text-lg tw-font-semibold tw-text-secondary">Usuarios Externos en Copia</p>
        <TableRespuesta icon="delete" :TABLE_HEADER="DESTINARIOS_EXTERNO_HEADER" :TABLE_BODY="dataTableExterno"
          v-model:item-selected="item" key-id="grupo" @handle-edit-data="handleDeleteExternos" :isDeleteDisable="isPorAprobarPorRevisar"/>
        </div>
      </div>
  </q-card>
  <div class="tw-flex tw-justify-center tw-gap-5 tw-mt-20">
    <q-btn label="Regresar" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="() => emit('previous-step')"/>
    <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="emit('cancel')" v-if="!isPorAprobarPorRevisar"/>
    <q-btn type="button" :label="'Guardar'" color="primary" class="tw-rounded-xl tw-h-11 tw-p-2 tw-w-52" @click="validateForms()" v-if="!isPorAprobarPorRevisar"/>
  </div>
</template>

<script lang="ts" setup>
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { validationEmail, maxLengthInput, homePhoneNumberMinAndMaxLength, alphanumeric2, onlyNumbers } from "src/helpers/validations";
import { computed, Ref, onMounted, ref, watch, nextTick } from "vue";
import { inputRequired } from "src/helpers/validations";
import { adminAxios, sgdeaAxios } from "src/services";
import TableRespuesta from "./TableRespuesta.vue"
import { SelectInput } from "src/interfaces";
import { toast } from "src/helpers/toast";
import { validateInputPhone } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";

const props = defineProps<{datosSalida: any, informacionGeneral: any}>();
const emit = defineEmits([ "cancel", "save", "previous-step"]);

const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([]);
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const formaEnvioOptions: Ref<SelectInput[]> = ref([]);
const tipoDocOptions: Ref<SelectInput[]> = ref([]);
const usuariosExternosCopia = ref([]);
const usuariosInternosCopia = ref([]);
const isNumeroDocumento = ref(false);
const dataTableExterno = ref([]);
const dataTableInterno = ref([]);
const isntColombia = ref(false);
const formExterno = ref();
const formInterno = ref();
const listadoDependencias: Ref<any[]> = ref([]);
const filteredDependencias = ref<SelectInput[]>([]);
const filteredForma = ref<SelectInput[]>([]);
const filteredDoc = ref<SelectInput[]>([]);
const filteredPais = ref<SelectInput[]>([]);
const filteredDep = ref<SelectInput[]>([]);
const filteredCity = ref<SelectInput[]>([]);
const funcionarioOptions = ref([]);
const permanentFuncionariosMachete = ref([]);
const funcionarioOptionsDisplay = ref([]);
const conCopiaRef = ref()

const isPorAprobarPorRevisar = computed(() => ['por aprobar', 'por revisar'].includes(props.informacionGeneral.estado.estado.toLowerCase()));

const items = ref([
  {
    label: "Externa",
    value: "Externa",
  },
  {
    label: "Interna",
    value: "Interna",
  },
  {
    label: "Interna y Externa",
    value: "Interna/Externa",
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
  dependencia_id: "",
  usuario_id: "",
  externo: false,
  id: null
})

const isFisicoOrCorreo = () => {
  if (usuario_externo.value.forma_envio_id == 3 || usuario_externo.value.forma_envio_id == 4) {
    return 1
  } else {
    return 2
  }
}

const DESTINARIOS_INTERNO_HEADER = [
  {
    name: "dependencia_id",
    align: "center",
    label: "Dependencia",
    field: (row) => {
      const ofi = filteredDependencias.value.find((item) => item.value == row.dependencia_id)?.label
      return ofi ? ofi : row.dependencia_id
    },
    sortable: true,
  },
  {
    name: "usuario_id",
    align: "center",
    label: "Nombre Funcionario",
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
    label: 'Tipo de Documento del Destinatario',
    field: (row) => {
      const doc = tipoDocOptions.value.find((item) => item.value == row.tipo_documento_id)?.label
      return doc ? doc : row.tipo_documento_nombre
    },
    sortable: true,
  },
  {
    name: 'numero_documento',
    align: 'center',
    label: ' Número de Documento del Destinatario',
    field: "numero_documento",
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre del Destinatario',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'direccion',
    align: 'center',
    label: 'Dirección del Destinatario',
    field: 'direccion',
    sortable: true,
  },
  {
    name: 'pais',
    align: 'center',
    label: 'País Destinatario',
    field: (row) => {
      const pais = optionsPaises.value.find((item) => item.value == row.pais_id)?.label
      return pais ? pais : row.pais_nombre
    },
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'center',
    label: 'Departamento Destinatario',
    field: (row) => {
      const dep = optionsDepartamentos.value.find((item) => item.value == row.departamento_id)?.label
      return dep ? dep : row.departamento_nombre
    },
    sortable: true,
  },
  {
    name: 'municipio',
    align: 'center',
    label: 'Municipio Destinatario',
    field: (row) => {
      const mun = optionsMunicipios.value.find((item) => item.value == row.municipio_id)?.label
      return mun ? mun : row.municipio_nombre
    },
    sortable: true,
  },
  {
    name: 'telefono',
    align: 'center',
    label: 'Teléfono del Destinatario',
    field: 'numero_celular',
    sortable: true,
  },
  {
    name: 'correo',
    align: 'center',
    label: 'Correo Electrónico del Destinatario',
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

const isDireccionRequired = ref(false)

const getDatosOptions = async () => {
  try{
  const formaEnvioResponse = await sgdeaAxios.get('/api/entes/listadoFormaEnvio')
  const municipiosResponse = await adminAxios.get('/municipios/list')
  const paisesResponse = await adminAxios.get('/paises/list')
  const departamentoResponse = await adminAxios.get('/departamentos/list')
  const tipoDocResponse = await sgdeaAxios.get('/api/entes/listadoTipoIdentificacion')
  const dependencias = await sgdeaAxios.get('/seccionSubSeccion')

  const usuariosExternosCopia = props.datosSalida?.usuariosCopia?.filter((e) => { return e.externo == true })
  dataTableExterno.value = usuariosExternosCopia?.map((e: any) => ({
    numero_documento: e.numero_documento,
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
    dependencia_id: e.dependencia_id,
    id: e.id,
    usuario_ID: e.usuario_id,
  })) ?? [];

  tipoDocOptions.value = tipoDocResponse.data.map((item) => { return { label: item.nombre, value: item.id } }).sort((a, b) => a.label.localeCompare(b.label))
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
  listadoDependencias.value = dependencias.data.map((e) => { return { label: e.nombre, value: e.idSeccionSubSeccion } })
    filteredDependencias.value = listadoDependencias.value.sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error(error)
  }
}

const validateForms = () => {
  if (props.datosSalida.copia == "Ninguna") {
    props.datosSalida.copia = "Ninguna"
    props.datosSalida.usuariosCopia = []
    saveForm()
    window.location.reload();
  }
  else if (props.datosSalida.copia == "Interna" ||
    props.datosSalida.copia == "Externa" ||
    props.datosSalida.copia == "Interna/Externa"
  ) {
    if (dataTableExterno.value.length || dataTableInterno.value.length) {
      const total = usuariosInternosCopia.value.concat(usuariosExternosCopia.value);
      props.datosSalida.usuariosCopia = total
      saveForm()
      window.location.reload();
    } else toast.error("Debe agregar como mínimo un destinatario copia")
  }
  else {
    conCopiaRef.value.validate()
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")}
}

const addUsuarioExterno = async () => {
  if (await formExterno.value.validate()) {
    const filter = usuariosExternosCopia.value.find((e) => { return e.numero_documento == usuario_externo.value.numero_documento && ( e?.tipo_documento_id || e?.tipodoc) == usuario_externo.value.tipo_documento_id  })
    const filter2 = dataTableExterno.value.find((x) => { return x.numero_documento == usuario_externo.value.numero_documento && ( x?.tipo_documento_id || x?.tipodoc ) == usuario_externo.value.tipo_documento_id })

    if (filter || filter2) {
      toast.error("No puedes agregar 2 usuarios iguales")
      return
    }

    if (dataTableExterno.value.length > 49) {
      toast.error("Tienes un limite de 50 destinatarios")
      return
    }

    const usuarioModificado = { ...usuario_externo.value }
    usuarioModificado.pais_id = usuarioModificado.pais_id.value
    usuarioModificado.departamento_id = usuarioModificado.departamento_id.value
    usuarioModificado.municipio_id = usuarioModificado.municipio_id.value
    dataTableExterno.value.push(usuarioModificado)
    usuariosExternosCopia.value.push(usuarioModificado)

    limpiarExterno()
  }
}

const addUsuarioInterno = async () => {
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

const limpiarInterno = async () => {
  usuario_interno.value = {
    dependencia_id: null,
    usuario_id: null,
    externo: false,
    id: null
  };
  await formInterno.value.reset()
  funcionarioOptions.value = [];
}

const limpiarExterno = async () => {
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
      filteredDependencias.value = listadoDependencias.value;
    });
    return;
  }
  update(() => {
    filteredDependencias.value = listadoDependencias.value.filter((option) => {
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

const getFuncionario = async(idDependencia: number) => {
  try {
    usuario_interno.value.usuario_id = '';
    funcionarioOptions.value = [];
    const response = await sgdeaAxios.get(`/api/usuarios/seccionSubseccion/${idDependencia}`)
    const newFuncionarios = response.data.map(a => ({...a, fullName: `${a.firstname} ${a.lastname}`})).sort((a, b) => a.fullName.localeCompare(b.fullName)).map(({ fullName, id: usuarioId }) => {
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
      const response = await sgdeaAxios.delete(`api/entes/eliminar-usuario-copia/${id}`)
      if (response.status == 204) {
        dataTableInterno.value = dataTableInterno.value.filter((e) => { return e.id !== item.id })
      }
    } else {
      dataTableInterno.value = dataTableInterno.value.filter((e) => { return e.usuario_id !== item.usuario_id })
      usuariosInternosCopia.value = usuariosInternosCopia.value.filter((e) => { return e.usuario_id !== item.usuario_id })
    }
    toast.success("El usuario fue eliminado correctamente")
  } catch (error) {
    console.error(error)
  }
}

const handleDeleteExternos = async (item) => {
  try {
    const id = item.id
    if (id) {
      const response = await sgdeaAxios.delete(`/entes/eliminar-usuario-copia/${id}`)
      if (response.status == 200) {
        dataTableExterno.value = dataTableExterno.value.filter((e) => { return e.id !== item.id })
      }
    } else {
      dataTableExterno.value = dataTableExterno.value.filter((e) => { return e.numero_documento !== item.numero_documento })
      usuariosExternosCopia.value = usuariosExternosCopia.value.filter((e) => { return e.numero_documento !== item.numero_documento })
    }
    toast.success("El usuario fue eliminado correctamente")
  } catch (error) {
    console.error(error)
  }
}

const sortOptions = (vals: any[]) => {
  return vals.sort(
    (leftItem: { label: string }, rightItem: { label: string }) => {
      const nombreA = leftItem.label.toLowerCase().trim();
      const nombreB = rightItem.label.toLowerCase().trim();

      if (nombreA < nombreB) return -1;
      if (nombreA > nombreB) return 1;
      return 0;
    }
  )
}

const onlyNumber = (event: {
  keyCode: any;
  which: any;
  preventDefault: () => void;
}) => {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if (keyCode >= 48 && keyCode <= 57) {
    return true;
  }
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

const filtrarOpciones = (val, update, abort) => {
  if(val === '') {
    return update(() => {
      funcionarioOptions.value = funcionarioOptionsDisplay.value;
    });
  }

  return update(() => {
    const opcionesFiltradas = funcionarioOptions.value.filter(opcion =>
      opcion.label.toLowerCase().includes(val.toLowerCase())
    );
    funcionarioOptions.value = opcionesFiltradas;
  });
}

const changeFormaEnvio = (value) => {
  if(value == 3 || value == 4) isDireccionRequired.value = true
  else isDireccionRequired.value = false
}

const changeTipoDocumento = (value) => {
  if(value == 12) isNumeroDocumento.value = true;
  else isNumeroDocumento.value = false;
}

const saveForm = () => {
  emit('save')
}

watch(
  () => usuario_externo.value.pais_id,
  async (value) => {
    //@ts-ignore
    let val = value.label as unknown as string;
    usuario_externo.value.departamento_id = "";
    usuario_externo.value.municipio_id = "";
    if (val.toLowerCase() == "colombia") {
      isntColombia.value = false;
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
    } else {
      usuario_externo.value.departamento_id = value;
      usuario_externo.value.municipio_id = value;
      isntColombia.value = true;
    }
  }
);

watch(
  () => usuario_externo.value.departamento_id,
  async (value) => {
    if (!isntColombia.value) {
      usuario_externo.value.municipio_id = "";
    }

    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
  }
);

watch(
  () => usuario_externo.value.pais_id,
  async (value) => {
    const { optionsDepartments } = await useDepartments(value.value);
    optionsDepartamentos.value = optionsDepartments.value;
  }
);

onMounted(() => {
  getDatosOptions()
})
</script>
