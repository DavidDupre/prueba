
export const useCustomEvents = () => {
    const emitEventCloseModal = (emit: any, value: any) => {
        emit('closeModal', value);
    }
    return {
        emitEventCloseModal,
    }
}
