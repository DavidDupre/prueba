import { ref } from 'vue';
import { useCustomEvents } from './events';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useOficialComunicationStore } from 'src/stores/comunicadosOficiales.store';
import { toast } from 'src/helpers/toast';


export const useModalLogic = ( emit: any ) => {

  const router = useRouter();
  const store = useOficialComunicationStore();
  const {emitEventCloseModal} = useCustomEvents();
  const isOpen = ref(true);
  const selectedOption = ref<string | null>(null);
  const options = [{ label: 'Entrada', value: '1' }, { label: 'Salida', value: '2' }, { label: 'Interno', value: '3' }];

  const cancel = () => {
    isOpen.value = false;
    store.initialState();
    router.push({ path: '/home' });
  };

  const submit = () => {
    if(!selectedOption.value) {
      toast.error('Debe seleccionar una opción');
    } else {
      isOpen.value = false;
      store.initialState();
      emitEventCloseModal(emit, selectedOption.value);
    }
  };

  onMounted(()=>{
    store.initialState();
  })

  return { isOpen, selectedOption, options, cancel, submit };
}

