<template>
  <div class="q-gutter-md">

    <SectionGrid title="Información general " :data="generalInformation" />
    <q-separator class="q-my-md" color="grey-4" />
    <SectionGrid title="Juzgado remitente" :data="referringCourt" />
    <q-separator class="q-my-md" color="grey-4" />
    <SectionGrid title="Datos del demandante" :columns="1" :data="plaintiffData" />
    <q-separator class="q-my-md" color="grey-4" />
    <SectionGrid title="Datos del causante" :columns="1" :data="causativeData" />
    <q-separator class="q-my-md" color="grey-4" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SectionGrid from '@shell/components/Information/SectionGrid.vue';

// Información general
const generalInformation = [
  { label: 'Tipo de Reclamo', value: 'Demanda' },
  { label: 'Estado', value: 'Estado establecido' },
  { label: 'Nombre demandante', value: 'Rubén De Morales' },
  { label: 'Abogado demandado', value: 'Francisco Javier Betión' },
  { label: 'Fecha de radicación', value: '15/04/2025' }
];

// Juzgado remitente
const referringCourt = ref([
  { label: 'Tipo de proceso', value: 'Demanda' },
  { label: 'Juzgado', value: 'Juzgado 001 Francisco Morales' },
  { label: 'Código del proceso', value: 'SJS3472Y3450000322' },
  { label: 'País', value: 'Colombia' },
  { label: 'Departamento', value: 'Bogotá D.C.' },
  { label: 'Municipio', value: 'Bogotá D.C.' },
  { label: 'Dirección Juzgado', value: 'Calle 4 N. 3-44, Piso 1' },
  { label: 'Celular Juzgado', value: '35284717' },
  { label: 'E-Mail Juzgado', value: 'jipoWB@auxjudicial.gov.co' },
  { label: 'Fecha ingreso del correo', value: 'Colombia' }
]);

// Detalle de la solicitud (en la imagen "Detalle de la demanda" y datos de demandante y causante)
const plaintiffData = ref([

  { label: 'Tipo de documento', value: 'Cédula de ciudadanía' },
  { label: 'Número de documento', value: '123456789' },
  { label: 'Primer nombre', value: 'Luis' },
  { label: 'Segundo nombre', value: '-' },
  { label: 'Primer apellido', value: 'Ramírez' },
  { label: 'Segundo apellido', value: '-' },
  { label: 'Género', value: 'Masculino' },
  { label: 'Condición especial', value: 'Adulto mayor' },


]);

const causativeData = ref([

  { label: 'Tipo de documento', value: 'Cédula de ciudadanía' },
  { label: 'Número de documento', value: '123456789' },
  { label: 'Primer nombre', value: 'Pepe' },
  { label: 'Segundo nombre', value: 'Luis' },
  { label: 'Primer apellido', value: 'Ramírez' },
  { label: 'Segundo apellido', value: '-' },
  { label: 'Género', value: 'Masculino' },
  { label: 'Condición especial', value: 'Adulto mayor' },

]);

const DemendDetail = ref([

  {
    label: 'Detalle de la demanda',
    value: `Lorem ipsum dolor sit amet consectetur adipiscing elit. Integer aliquet, pulvinar...`
  }
]);


const handleEdit = (section: string) => {
  console.log(`Editing section: ${section}`);
};
</script>
<style scoped>
.text-caption {
  font-size: 0.75rem;
  line-height: 1.25rem;
}
</style>
