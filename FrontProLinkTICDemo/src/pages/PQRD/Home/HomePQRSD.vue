<template>
  <div class="tw-relative tw-mb-[70px]">
    <!-- <img :src="Banner" alt="banner"> -->
    <div class="tw-absolute tw-top-[22%] xl:tw-top-[22%] lg:tw-left-[8%]">
      <p class="tw-text-[45px] tw-font-bold tw-text-white">¡Bienvenido a Positiva!</p>
      <p class="tw-text-xl tw-leading-4 tw-text-white tw-mt-2">
        It is a long established fact that a reader will be distracted <br />by the
        readable content of a page when looking at its layout.
      </p>

      <div class="tw-flex tw-gap-4 tw-mt-4 tw-mt-[5%] xl:tw-mt-[3%] 2xl:tw-mt-[5%]">
        <div class="card tw-flex tw-flex-col tw-gap-2 tw-justify-start tw-bg-white tw-py-4 tw-w-[200px]
        xl:tw-w-[210px] 2xl:tw-w-[270px] tw-h-[130px] tw-pl-4"
             v-for="{title, icon, number} in items">
        <span class="tw-bg-secondary tw-py-1.5 tw-px-2 tw-rounded tw-w-[30px]">
          <q-icon :name="icon" color="white"/>
        </span>
          <p>{{ title }}</p>
          <p class="tw-font-bold tw-text-[28px] tw-text-lg">{{ number }}</p>
        </div>
      </div>
    </div>
  </div>
  <p class="tw-font-bold tw-text-lg tw-px-6">En positiva puedes</p>
  <div class="tw-flex tw-gap-x-8">

    <div class="tw-flex tw-gap-4 tw-mt-[5%] xl:tw-mt-[3%] 2xl:tw-mt-[5%]">
      <div class="card-two tw-bg-[#EAECF0] tw-flex tw-items-center tw-gap-2 tw-justify-start tw-bg-white tw-py-4 tw-w-[300px] xl:tw-w-[310px] 2xl:tw-w-[370px] tw-h-[110px] tw-pl-4"
      >
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
        <div class="">
          <p>Radicar una nueva PQRSD</p>
          <span class="tw-flex tw-cursor-pointer">
            <p class="tw-font-bold tw-text-md tw-text-lg"  @click="router.push('/sistema-pqrsd')">Radicar PQRSD</p>
            <q-icon name="chevron_right" size="sm"></q-icon>
          </span>

        </div>

      </div>
    </div>

    <div class="tw-flex tw-gap-4 tw-mt-[5%] xl:tw-mt-[3%] 2xl:tw-mt-[5%]">
      <div class="card-two tw-bg-[#EAECF0] tw-flex tw-items-center tw-gap-2 tw-justify-start tw-bg-white tw-py-4 tw-w-[300px] xl:tw-w-[310px] 2xl:tw-w-[370px] tw-h-[110px] tw-pl-4"
      >
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
        <div>
          <p>Consultar el esrado de tu PQRSD</p>
          <span class="tw-flex tw-items-center tw-cursor-pointer" @click="router.push('/consultar-pqrsd')">
             <p class="tw-font-bold tw-text-md tw-text-lg">Consultar mis PQRSD</p>
            <q-icon name="chevron_right" size="sm"></q-icon>
          </span>

        </div>

      </div>
    </div>
  </div>

</template>


<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import Banner from "assets/banner.svg";

const router = useRouter()

const items = ref([
  {
    title: 'PQRS radicadas',
    number: 5,
    icon: 'person_add'
  },
  {
    title: 'PQRS resueltas',
    number: 5,
    icon: 'group_remove'
  },
  {
    title: 'PQRS en trámite',
    number: 5,
    icon: 'attach_file'
  },
  {
    title: 'PRQRS rechazadas',
    number: 5,
    icon: 'forum'
  }
])
</script>

<style scoped lang="scss">
.card {
  border-radius: 10px 50px 10px 30px;
}

.card-two {
  border-radius: 10px 50px 10px 30px;
}
</style>
