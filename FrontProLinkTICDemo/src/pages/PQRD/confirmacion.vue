<script setup lang="ts">

import { ref, reactive } from 'vue'

const props = defineProps(
  {
    default: String,

    digitCount: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  });

const digits = reactive([])

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}

const otpCont = ref(null)

const handleKeyDown = function (event, index) {
  if (event.key !== "Tab" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft"
  ) {
    event.preventDefault();
  }

  if (event.key === "Backspace") {
    digits[index] = null;

    if (index != 0) {
      (otpCont.value.children)[index - 1].focus();
    }

    return;
  }

  if ((new RegExp('^([0-9])$')).test(event.key)) {
    digits[index] = event.key;

    if (index != props.digitCount - 1) {
      (otpCont.value.children)[index + 1].focus();
    }
  }
}

</script>

<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-text-center">
    <div>
      <q-icon name="email" class="tw-rounded-full tw-text-[34px] tw-w-[60px] tw-h-[60px]" color="blue"
        style="border: 5px solid var(--primary)"></q-icon>
    </div>

    <div>
      <h4 class="tw-text-black tw-text-[24px] text-bold">Correo de verificacion</h4>

      <p class="tw-text-2xl tw-text-label tw-font-normal tw-text-[#2C3948]">
        Enviamos un codigo de confirmaciona su correo *******. <br />
        Si tarda mucho en recibirlo, revise su bandeja de correos no deseados.
      </p>
    </div>
  </div>

  <div class='tw-flex tw-flex-row tw-gap-10 tw-w-full tw-justify-center tw-items-center tw-mx-auto tw-mt-8 '
    ref="otpCont">
    <q-input type="text" class="input tw-text-[150px] tw-w-[150px] tw-h-[200px]" v-for="(el, index) in digits"
      :key="el + index" v-model="digits[index]" input-style="height: 120px;" style="
      .q-field__control {
        margin-top: 100%;
      }
      " :autofocus="index === 0" maxlength="1" @keydown="handleKeyDown($event, index)">
    </q-input>
  </div>
</template>

<style lang="scss">
.input .q-field__control {
  height: 70%;
  padding-left: 25%;
}
</style>
