import { defineStore } from 'pinia';

export const useLastTutelaStore = defineStore({
    id: 'lastTutela',
    state: () => ({
        data: {}
    }),
    getters: {

    },
    actions: {
        saveTutela(state) {
            return this.data = state
        },
        getTutela() {
            return this.data
        }
    },
});
