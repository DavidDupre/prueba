  <template>
  <q-dialog v-model="open" persistent>
    <q-card style="max-width: 1000px;" :class="['tw-px-3 ', downloadFile ? 'tw-h-[510px] tw-w-[500px]' : 'tw-h-[auto] tw-w-[700px]']">
      <div class="tw-flex tw-justify-center tw-mt-3">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center" v-if="isSuccess"
                style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
            <img v-lazy :data-url="Check" alt="check" width="40">
          </span>

        <span class="tw-rounded-[100px] tw-flex tw-justify-center" v-else
              style="background-color: #F6F6F9; width: 82px; height: 82px">
            <img v-lazy :data-url="InterrogationModal" alt="check" />
          </span>

      </div>
      <q-card-section class="flex column justify-center items-center">
        <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
          {{ title }}
        </p>

<!--        <q-card-section v-if="isRevisor" class="tw-px-0 tw-pt-4">-->
<!--          <p class="tw-text-[16px] tw-text-modal-grey-subtitle tw-font-bold tw-ml-2">Gestionador</p>-->
<!--          <p class="tw-text-md q-mt-sm tw-text-modal-grey-subtitle tw-ml-4">{{ gestionador }}</p>-->
<!--        </q-card-section>-->

        <p :class="['tw-text-[18px] text-center tw-mt-3', downloadFile ? 'tw-w-[370px]' : '']">{{ text }}</p>

        <div v-if="downloadFile">
          <p class="tw-text-2xl text-center tw-font-bold q-mt-lg tw-mb-3">{{ titleDownloadFile }}</p>

          <div
            class="tw-w-[380px] tw-p-1 tw-flex tw-justify-center tw-items-center tw-border-[1px] tw-border-gray-200 tw-gap-x-4">
            <img v-lazy :data-url="EXCEL" alt="">
            <span class="tw-text-md tw-w-[280px]">{{ textDownloadFile }}</span>
            <q-icon name="file_download" color="#969EAF" @click="handleIcon" class="tw-cursor-pointer">
            </q-icon>
          </div>


        </div>
        <div class="tw-flex tw-mt-8">
          <q-btn :label="textButtonCancel ? textButtonCancel : 'Cancelar'" color="accent" text-color="black"
                 v-if="cancelButton" class="tw-p-3" style="width: 200px; height: 50px;" flat @click="hideModal" v-close-popup/>

                 <q-btn :label="textButtonCancel2 ? textButtonCancel2 : 'Cancelar'" color="accent" text-color="black"
                 v-if="cancelButton2" class="tw-p-3 tw-ml-4" style="width: 200px; height: 50px;" flat @click="handleButtonCancele" v-close-popup/>

          <q-btn :label="textButton" style="width: 200px; height: 50px;" text-color="white" color="secondary" v-close-popup
                 class="tw-rounded-xl tw-p-3  tw-ml-4" @click="handleButton"/>
        </div>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import Check from '../../assets/check.svg';
import EXCEL from "assets/excel.svg"
import InterrogationModal from "src/assets/interrogation-modal.svg";

const props = defineProps<{
  title: string,
  text?: string,
  isSuccess?: boolean,
  textButton: string,
  textButtonCancel?: string,
  textButtonCancel2?:string,
  cancelButton?: boolean,
  cancelButton2?: boolean,
  modelValue: boolean,
  downloadFile?: boolean
  titleDownloadFile?: string,
  textDownloadFile?: string,
  persistent?: boolean,
  isRevisor?: boolean,
  gestionador?: string
}>()

const emit = defineEmits(['closeModal', 'handleAccept','handleCancel', 'update:modelValue', 'handleDownloadFile'])

function hideModal() {
  emit('closeModal')
}

function handleButton() {
  emit('handleAccept')

}

function handleButtonCancele (){
  emit('handleCancel')
}
function handleIcon() {
  emit('handleDownloadFile')
}

const open = computed({
  get() {
    return props.modelValue
  },
  set(value) {

    emit('update:modelValue', value)
  }
})


</script>
