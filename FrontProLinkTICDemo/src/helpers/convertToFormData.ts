export function convertToFormData(object) {
    const formData = new FormData();

    Object.keys(object).forEach(key => {
        if (object[key] instanceof File) {
            // Añade archivos con su nombre original.
            formData.append(key, object[key], object[key].name);
        } else {
            // Añade strings y números directamente.
            formData.append(key, object[key].toString());
        }
    });

    return formData;
}