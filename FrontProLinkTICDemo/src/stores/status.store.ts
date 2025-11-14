import { defineStore } from "pinia";
//import { TypeDocumentalObject, TypeDocumentalObjectBase } from 'src/pages/SGDA/Administracion/crear/interfaces';

// @ts-ignore

interface TypeState {
  state: string;
  taskId: string;
}

export const useStateStore = defineStore("stateTutelas", {
  state: () => ({
    state: "",
    taskId: "",
  }),
  actions: {
    async setDataState(data: TypeState) {
      const { state, taskId } = data;
      this.state = state;
      this.taskId = taskId;
    },
    getTutelaState() {
      return this.state
    }
  },
  persist: true,
});
