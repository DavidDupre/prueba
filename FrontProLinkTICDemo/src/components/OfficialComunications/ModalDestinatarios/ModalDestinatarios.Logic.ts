import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useCustomEvents } from './events';
import { watch } from 'vue';
import { useOficialComunicationStore } from 'src/stores/comunicadosOficiales.store';
import { toast } from 'src/helpers/toast';


export const useModalDestinatariosLogic = ( emit: any ) => {

  const q = useQuasar();
  const store = useOficialComunicationStore();
  const {emitEventCloseModal, emitEventImportModal} = useCustomEvents();
  const isOpen = ref(store.usersDestinationModal);
  const selectedOption = ref<string | null>(null);
  const files = ref(null);
  const options = [{ label: 'Opción 1', value: '1' }, { label: 'Opción 2', value: '2' }, { label: 'Opción 3', value: '3' }];

  watch(()=>store.usersDestinationModal,(newVal)=>{
    isOpen.value = newVal;
  })

  const cancel = () => {
    emitEventCloseModal(emit);
  };

  const submit = () => {
    if(!files.value) {
      toast.error('Debe seleccionar una opción')
    } else {
      emitEventImportModal(emit, files.value);
    }
  };

  const onDrop = (event) => {
      const draggedFiles = event.dataTransfer.files;

      if (draggedFiles.length) {
        addFiles(draggedFiles[0]);
      }
  }

  const onDragOver = () => {
    // You can add visual cues here if you'd like
  }

  const onFilesSelected = (event) => {
    addFiles(event.target.files[0]);
  }

  const addFiles = (file) => {
    // Verificar si el archivo es de tipo Excel
    files.value = file;
  }

  return { isOpen, selectedOption, options, cancel, submit, onDragOver, onDrop, files, onFilesSelected };
}

