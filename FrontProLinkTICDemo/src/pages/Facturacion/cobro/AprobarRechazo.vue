<template>
  <div class="q-py-lg">
    <a href="/facturacion/cuentas-cobro/radicadas" class="tw-text-primary" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b>
        Volver
      </b>
    </a>

    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-flex-col">
        <ComponentTitle class="q-mt-lg" :title="'Cuenta de cobro #' + initialData.sec ?? ''"
          classTitle="tw-font-bold tw-text-4xl" />

        <q-chip square :ripple="false"
          class="tw-border-[0.5px] tw-border-solid tw-border-[#0049ff] tw-bg-[#e5edff] tw-text-[#2c3948] tw-rounded-lg tw-mr-auto">
          Asignada
        </q-chip>
      </div>
    </div>

    <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
      <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
        <q-tab :key="tab.key" :name="tab.key" :ripple="false" class="tw-px-2" v-for="tab in uiTabs"
          @click="event => handleSwitchTab(event, tab)">
          <q-chip :icon="tab.icon" square :ripple="false"
            style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
            {{ tab.name }}
          </q-chip>
        </q-tab>
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="infoGeneral" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Información básica radicación</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
              <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                <p class="titles">Dependencia</p>
                <p>346456456</p>
                <p class="titles">Tipo de trámite</p>
                <p>Cuenta de cobro o documento equivalente soporte</p>
                <p class="titles">Tipo de documento</p>
                <p>Cédula de ciudadanía</p>
                <p class="titles">Primer apellido</p>
                <p>Pérez</p>
                <p class="titles">Primer nombre</p>
                <p>Luis</p>
              </div>

              <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                <p class="titles">Responsable del proceso</p>
                <p>Juan Vargas</p>
                <p class="titles">Canal de recepción</p>
                <p>Correo electrónico</p>
                <p class="titles">Número de identificación</p>
                <p>38482342</p>
                <p class="titles">Segundo apellido</p>
                <p>Forero</p>
                <p class="titles">Otros nombres</p>
                <p>No aplica</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Información documento soporte equivalente</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">

              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Tipo de bien o servicio</p>
                <p>Lorem ipsum</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Observación</p>
                <p>Lorem ipsum dolor sit amet consectetur adipiscing, elit aliquet tempor purus vehicula
                  dignissim ac, tristique elementum suspendisse ullamcorper cursus. Elementum fermentum
                  inceptos accumsan conubia donec in pharetra eget, sociis interdum netus varius ultrices
                  a leo.</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Valor</p>
                <p>$ 250,000</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Valor en letras</p>
                <p>Doscientos cincuenta mil</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Aprobador</p>
                <p>Luis Pérez</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Campos automáticos al radicar</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">FECHA / sistema a radicar</p>
                <p>2024/06/15</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Hora de inicio</p>
                <p>14:45</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Estado de trámite</p>
                <p>Activo</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Solicitud</b>
              </div>
            </template>

            <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>

            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>

              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>

              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>
            </div>
          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="rechazar" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Rechazar</b>
              </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-mt-sm">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <span class="text-weight-bold">Motivo de Rechazo *</span>
                <q-select v-model="form.motivoRechazo" input-debounce="0" label="Seleccione"
                  :options="optionsMotivoRechazo" dense outlined class="tw-rounded-lg">
                </q-select>
              </div>

              <template v-if="form.motivoRechazo.value.trim().toLowerCase() === 'otro'">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <CommentTextArea v-model="form.otroMotivoRechazo" :is-required="true" :max-length="1000" label="Comentario"/>
                </div>
              </template>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <CommentTextArea v-model="form.comentario" :is-required="true" :max-length="1000" label="Comentario"/>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <div class="col row justify-center q-gutter-x-md q-my-md">
          <q-btn color="accent" textColor="secondary" label="Cancelar"
            style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset" no-caps />

          <q-btn @click="handleRechazar" color="primary" label="Rechazar"
            style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps />
        </div>
      </q-tab-panel>

      <q-tab-panel name="aprobar" class="q-pa-none">

      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { sgdeaAxios } from 'src/services';
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
import { SelectInput } from 'src/interfaces';
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";
import { toast } from 'src/helpers/toast';


const router = useRouter();
const route = useRoute();
const initialData = ref({});
const tab = ref('infoGeneral')

const optionsMotivoRechazo: SelectInput[] = [
  {
    label: 'El valor remitido a través de XML no coincide con el valor de la representación gráfica.',
    value: 'El valor remitido a través de XML no coincide con el valor de la representación gráfica.',
  },
  {
    label: 'Los servicios cobrados, no coinciden con los del valor de la factura o cuenta de cobro.',
    value: 'Los servicios cobrados, no coinciden con los del valor de la factura o cuenta de cobro.',
  },
  {
    label: 'El número de la factura ya se encuentra radicada en la base de datos de POSITIVA.',
    value: 'El número de la factura ya se encuentra radicada en la base de datos de POSITIVA.',
  },
  {
    label: 'La fecha de la factura o cuenta de cobro debe ser del mismo mes que se va a gestionar no se reciben facturas de meses anteriores.',
    value: 'La fecha de la factura o cuenta de cobro debe ser del mismo mes que se va a gestionar no se reciben facturas de meses anteriores.',
  },
  {
    label: 'Otro',
    value: 'Otro',
  },
];

interface UITab {
  key: string;
  icon: string;
  name: string;
}

const uiTabs: UITab[] = [
  {
    key: 'infoGeneral',
    icon: 'info',
    name: 'Información general',
  },
  {
    key: 'aprobar',
    icon: 'task_alt',
    name: 'Aprobar'
  },
  {
    key: 'rechazar',
    icon: 'cancel',
    name: 'Rechazar'
  },
];

const cuentaCobroNotFound = (id?: number | string) => {
  let message = 'Cuenta de cobro no existe';

  if (Boolean(id)) {
    message = 'Cuenta de cobro con id ' + id + ' no existe.'
  }

  toast.error(message);

  router.replace('/facturacion/cuentas-cobro');
}

const getData = async () => {
  const idParams = route.params.id as string
  if (!idParams) cuentaCobroNotFound(idParams)

  try {
    const id = parseInt(idParams)
    const response = await sgdeaAxios.get('/facturacion/geCto/' + id);

    if (response.status !== 200) cuentaCobroNotFound(id);

    // guardara data en el estado
    initialData.value = response.data.cto;
  } catch (error) {
    cuentaCobroNotFound(idParams)
  }
}

const handleRechazar = async () => {
  try {
    const id = route.params?.id as string

    if (!id) return;

    let motivo = ''

    if (form.value.motivoRechazo.value.trim().toLowerCase() === 'otro') {
      motivo = form.value.otroMotivoRechazo
    } else {
      motivo = form.value.motivoRechazo.value;
    }

    const response = await sgdeaAxios.put('/facturacion/actualizarEstadoCuentasCobro/' + id, {
      estado: "Rechazado",
      motivo,
    });

    if (response.status === 200) {
      toast.success('Trámite rechazado correctamente.');
      router.push('/facturacion/cuentas-cobro/radicadas')
    } else {
      toast.error('Ocurrió un problema al rechazar.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Ocurrió un problema al rechazar.');
  }
}

const form = ref({
  motivoRechazo: {
    label: '',
    value: '',
  },
  otroMotivoRechazo: '',
  comentario: ''
});

const handleSwitchTab = async (_, currentTab: UITab) => {
  if (currentTab.key === 'aprobar') {
    tab.value = 'infoGeneral'

    try {
      const id = route.params?.id as string

      if (!id) return;


      let motivo = ''

      if (form.value.motivoRechazo.value.trim().toLowerCase() === 'otro') {
        motivo = form.value.otroMotivoRechazo
      } else {
        motivo = form.value.motivoRechazo.value;
      }

      const response = await sgdeaAxios.put('/facturacion/actualizarEstadoCuentasCobro/' + id, {
        estado: "Aprobado",
        motivo
      });

      if (response.status === 200) {
        const mensaje = response.data.mensaje;
        let notifyType = '';
        let notifyMessage = '';
        switch (mensaje) {
          case 'Aprobacion exitosa':
            notifyType = 'positive';
            notifyMessage = 'Trámite aprobado correctamente.';
            break;
          case 'El id buscado no existe':
          case 'el estado no es Por aprobar':
            notifyType = 'negative';
            notifyMessage = 'Ocurrió un problema al aprobar el trámite. ' + mensaje;
            break;
        }

        if (notifyType && notifyMessage) {
          if (notifyType === 'positive') {
            toast.success(notifyMessage);
          } else {
            toast.error(notifyMessage);
          }
        }
      } else {
        toast.error('Ocurrió un problema al aprobar el trámite.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un problema al aprobar el trámite.');
    }
  }
}

onMounted(getData)
</script>
