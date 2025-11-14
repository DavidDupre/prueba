import {ref, Ref} from 'vue'

  export interface IModal {
    name: string;
    state: boolean;
  }

export class ModalManager {
  constructor(

  ) {}

      public modals: Ref<IModal[]> = ref([
        {
          name: 'modal1',
          state: false
        },
        ])


    public handleModal(name: string): void | string {
      const item = this.modals.value.find((instance: IModal) => {
        instance.name == name;
      })
      if(item) {
        item.state = !item.state
        return;
      } else {
        return 'No existe este modal'
      }
    }
}
