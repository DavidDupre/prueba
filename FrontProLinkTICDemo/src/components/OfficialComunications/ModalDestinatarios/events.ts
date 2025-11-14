export const useCustomEvents = () => {
  const emitEventCloseModal = (emit: any) => {
      emit('closeModal');
  }
  const emitEventImportModal = (emit: any, value: any) => {
      emit('importModal', value);
  }

  return {
      emitEventCloseModal, emitEventImportModal,
  }
}
