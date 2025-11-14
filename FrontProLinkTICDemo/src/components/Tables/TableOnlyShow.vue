<template>
  <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
    <div class="tw-bg-white q-mt-lg tw-rounded-md">
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Aprobador
      </p>

      <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
        <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER"
          table-header-class="text-black text-h6 " class="sizes q-mr-md"
          style="border-radius: 15px; min-height: auto; max-height: 400px; max-width: 50%; ">
          <template v-slot:bottom>
          </template>
        </q-table>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
    TABLE_BODY: any[],
    TABLE_HEADER: any[],
}>(), {
})

</script>
