import { defineStore } from 'pinia';

// @ts-ignore
export const useUbicationStore = defineStore('ubication', {
  state: () => ({
    stepOne: {},
    stepTwo: {},
    stepThree: {}
  }),
  actions: {
    async saveData(data: any, prefix: number) {
      switch (prefix) {
        case 1:
          this.stepOne = data
         break;
        case 2:
          this.stepTwo = data
          break;
        case 3:
          this.stepThree = data
          break;
        default:
          return data
      }
    },
  },
  persist: true
});
