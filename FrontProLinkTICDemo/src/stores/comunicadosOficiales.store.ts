import { defineStore } from 'pinia';

// @ts-ignore
export const useOficialComunicationStore = defineStore('oficialComunications', {
    state: () => ({
      optionSelected: null,
      isEnabledform: false,
      currentState: 1,
      usersDestinationModal: false,
    }),
    actions: {
        async enableForm(optionSelected: any, enabled: boolean) {
          //const response = await service.login(username, password)
          this.optionSelected = optionSelected;
          this.isEnabledform = enabled;
        },
        async disabledForm() {
          this.optionSelected = null;
          this.isEnabledform = false;
        },
        async nextStep(currentState: number) {
          if(currentState < 4){
            this.currentState = currentState + 1;
          }
        },
        async previousState(currentState: number) {
          if(currentState > 0){
            this.currentState = currentState - 1;
          }
        },
        async initialState(){
          this.currentState = 1;
        },
        async openModal(){
          this.usersDestinationModal = true;
        },
        async closeModal(){
          this.usersDestinationModal = false;
        }
    },
    persist: false
});
