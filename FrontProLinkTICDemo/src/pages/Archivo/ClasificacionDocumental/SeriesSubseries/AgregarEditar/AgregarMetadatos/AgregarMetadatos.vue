<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card
      class="tw-rounded-lg tw-shadow-lg tw-px-10 tw-py-8 tw-bg-white tw-text-black"
      style="width: 1200px; max-width: 95vw"
    >
      <q-form ref="agregarForm" greedy @submit="guardarCambios">
        <div class="tw-mb-8">
          <h5
            class="tw-text-3xl tw-font-bold tw-text-modal-blue-main-title tw-mb-4"
          >
            Metadatos de Contenido
          </h5>
        </div>

        <div class="tw-flex tw-justify-center">
          <PickList
            v-model="products"
            listStyle="height: 400px"
            dataKey="id"
            breakpoint="1400px"
            class="tw-w-full"
          >
            <!-- Estilos aplicados a los encabezados -->
            <template #sourceheader>
              <span
                class="tw-font-semibold tw-text-lg tw-text-modal-blue-main-title"
              >
                Metadatos Disponibles
              </span>
            </template>

            <template #targetheader>
              <span
                class="tw-font-semibold tw-text-lg tw-text-modal-blue-main-title"
              >
                Metadatos Asignados
              </span>
            </template>

            <template #item="slotProps">
              <div class="flex flex-wrap p-2 align-items-center gap-3">
                <div class="flex-1 flex flex-column gap-2">
                  <span class="font-bold">{{ slotProps.item.nombre }}</span>
                </div>
              </div>
            </template>
          </PickList>
        </div>

        <!-- Botones -->
        <div class="tw-flex tw-justify-center tw-mt-6 tw-gap-6">
          <Button
            label="Guardar"
            type="primary"
            color="blue"
            class="tw-w-1/3"
            type-button="button"
            @click="guardarCambios"
            icon-right="circle-arrow-right"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import Button from "src/shared/components/Ui/Button/Button.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import PickList from "primevue/picklist";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  modelValue: boolean;
  idSerieSubserieValue: string;
  idSubserie: string;
}>();

const isOpen = ref(props.modelValue);
const products = ref<{ id: number; nombre: string }[][]>([[], []]);
const originalAsignados = ref<{ id: number; nombre: string }[]>([]);

const obtenerMetadatosDisponibles = async () => {
  try {
    const response = await sgdeaAxios.get(
      "/parametrizaciones/metadata?pageSize=500"
    );

    return response.data.data.elementos
      .filter((metadato: any) => metadato.estado === true)
      .map((metadato: any) => ({
        id: metadato.id,
        nombre: metadato.titulo,
      }));
  } catch (error) {
    toast.error("Error al cargar los metadatos disponibles.");
    return [];
  }
};

const obtenerMetadatosAsociados = async () => {
  const request = props.idSubserie
    ? `/archivo/record/metadatos?serieId=${props.idSerieSubserieValue}&subserieId=${props.idSubserie}`
    : `/archivo/record/metadatos?serieId=${props.idSerieSubserieValue}`;
  try {
    const response = await sgdeaAxios.get(request);
    const elementos = response.data || [];
    if (Array.isArray(elementos)) {
      return elementos.map((metadato: any) => ({
        id: metadato.metadatoId,
        nombre: metadato.nombre,
      }));
    }
    return [];
  } catch (error) {
    toast.error("Error al cargar los metadatos asociados.");
    return [];
  }
};

const cargarDatosMetadatos = async () => {
  try {
    const disponibles = await obtenerMetadatosDisponibles();
    const asignados = await obtenerMetadatosAsociados();
    originalAsignados.value = [...asignados];

    const disponiblesFiltrados = disponibles.filter(
      (d) => !asignados.some((a) => a.id === d.id)
    );

    products.value = [disponiblesFiltrados, asignados];
  } catch (error) {
    toast.error("Error al cargar los metadatos.");
  }
};

const guardarCambios = async () => {
  const nuevosAsignados = products.value[1];

  const asignadosAntes = originalAsignados.value.map((a) => a.id);
  const asignadosAhora = nuevosAsignados.map((a) => a.id);

  const agregados = nuevosAsignados.filter(
    (m) => !asignadosAntes.includes(m.id)
  );
  const eliminados = originalAsignados.value.filter(
    (m) => !asignadosAhora.includes(m.id)
  );

  try {
    if (agregados.length > 0) {
      const body = {
        metadatos: agregados.map((item) => ({
          metadatoId: item.id,
          valor: null,
        })),
        serieId: Number(props.idSerieSubserieValue),
        subserieId: Number(props.idSubserie),
      };

      await sgdeaAxios.post(
        `/archivo/record/metadatos`,
        body
      );

      toast.success("Metadatos asignados correctamente.");
    }

    if (eliminados.length > 0) {
      const idsEliminar = eliminados.map((item) => item.id);

      await sgdeaAxios.delete(
        `archivo/record/${props.idSerieSubserieValue}/metadatos`,
        { data: idsEliminar }
      );

      toast.success("Metadatos eliminados correctamente.");
    }

    if (agregados.length === 0 && eliminados.length === 0) {
      toast.success("No hubo cambios en los metadatos.");
    }

    isOpen.value = false;
    emit("update:modelValue", false);
  } catch (error) {
    toast.error("Error al guardar los cambios.");
  }
};

watch(
  () => props.modelValue,
  (value) => {
    isOpen.value = value;
    if (value) {
      cargarDatosMetadatos();
    }
  },
  { immediate: true }
);
</script>
