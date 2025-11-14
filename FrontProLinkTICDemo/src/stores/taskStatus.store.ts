import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    status: "",
  }),
  actions: {
    taskStatus(newStatus) {
      this.status = newStatus;
    },
  },
});