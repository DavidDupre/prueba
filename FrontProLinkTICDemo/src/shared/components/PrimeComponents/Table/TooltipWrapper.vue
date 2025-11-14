<template>
  <div v-tooltip="tooltipConfig">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tooltip from 'primevue/tooltip'

export default defineComponent({
  name: 'TooltipWrapper',
  directives: {
    tooltip: Tooltip
  },
  props: {
    text: {
      type: String,
      required: true
    },
    tooltipClass: {
      type: String,
      default: 'custom-tooltip'
    }
  },
  computed: {
    tooltipConfig() {
      return {
        value: this.text,
        class: this.tooltipClass
      }
    }
  }
})
</script>

<style lang="css">
.custom-tooltip .p-tooltip-text {
  background-color: white;
  color: #222222;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.custom-tooltip .p-tooltip-arrow {
  border-top-color: #2b2b2b;
}
</style>

