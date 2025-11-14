import { ref, Ref, computed, onBeforeMount } from 'vue';
import { FormBase, FormTypeDocumenatal, TypeDocumentalObject, GeneralResponse } from './interfaces';
import { formBaseCreate, formBaseEdit } from './interfaces';
import { useRouter } from "vue-router";
import { routesCreate } from "../"
import { useTypeDocumentalsStore } from 'src/stores/typesDocumentals.store';
import { createTypedocumental, editTypedocumental } from '../API/endpointsData';



export const useDocumentalTypesData = () => {
    const router = useRouter()
    const store = useTypeDocumentalsStore();
    const formData : Ref<FormBase> = ref(new FormTypeDocumenatal());
    const forms = ref([]);
    const isLoading : Ref<boolean> = ref(false);
    const showModal : Ref<boolean> = ref(false);
    const errorModal : Ref<boolean> = ref(false);
    const buttonLabel : Ref<string> = ref('');
    const cancelModal : Ref<boolean> = ref(false);
    const titlePage : Ref<string> = ref('')
    const crumbs = ref([]);

    const buttonEnabled = computed(()=>{
      return !(
        formData.value.nameTypeDocumental !== ''
        && formData.value.shortName !== ''
        && formData.value.documentType.label !== ''
        && formData.value.isIndexable !== null
        && formData.value.isGestionDocument !== null
        && formData.value.isTemplateDocument !== null
        && formData.value.initialsIndex !== ''
        && formData.value.description !== ''
        && formData.value.labelIndice !== null
        && formData.value.indexBlock !== null
        && formData.value.indexRequired !== null
        && formData.value.uniqueIndex !== null
        && formData.value.visibleIndice !== null
        && formData.value.accessIndex !== null
        && formData.value.editIndex !== null
        && formData.value.typeForm !== null
      )
    })

    onBeforeMount(()=>{
      if(store.isEdit){
        formData.value = new FormTypeDocumenatal({
          idTipologiaDocumental: store.dataEdit.idTipologiaDocumental,
          accessIndex: store.dataEdit.indexableIndice ,
          description: store.dataEdit.descripcion ,
          documentType: { label: store.dataEdit.codigoTipologiaDocumental, value: store.dataEdit.codigoTipologiaDocumental } ,
          editIndex: store.dataEdit.editableIndice ,
          indexBlock: store.dataEdit.bloqueoIndice ,
          labelIndice: store.dataEdit.labelIndice ,
          indexRequired: store.dataEdit.exigidoIndice ,
          initialsIndex: store.dataEdit.siglaIndice ,
          isGestionDocument: store.dataEdit.esUnDocumentoGestion ,
          isIndexable: store.dataEdit.esUnDocumentoIndexable ,
          isTemplateDocument: store.dataEdit.esUnDocumentoPlantilla ,
          nameTypeDocumental: store.dataEdit.nombre ,
          shortName: store.dataEdit.nombreCorto ,
          typeForm: store.dataEdit.esUnDocumentoPlantillaTipoFormulario ,
          uniqueIndex: store.dataEdit.unicoIndice ,
          visibleIndice: store.dataEdit.visibleIndice
        })
        titlePage.value = 'Editar Tipología Documental'
        buttonLabel.value = 'Editar'
        forms.value = formBaseEdit;
        crumbs.value = [
          ...routesCreate, {
            name: 'Editar'
          }
        ]
      }
      else{
        titlePage.value = 'Crear Tipología Documental'
        buttonLabel.value = 'Crear'
        forms.value = formBaseCreate;
        crumbs.value = [
          ...routesCreate, {
            name: 'Crear'
          }
        ]
      }

    })

    const handleSuccess = () => {
      router.push('/SGDA/administracion');
    }

    const handleCancel = () => {
      errorModal.value = false;
    }

    const submit = async () => {
      isLoading.value = true;
      const dataToSend = new TypeDocumentalObject({
        idTipologiaDocumental: formData.value.idTipologiaDocumental,
        estado: true ,
        nombre: formData.value.nameTypeDocumental ,
        codigoTipologiaDocumental: formData.value.documentType.label ,
        nombreCorto: formData.value.shortName ,
        siglaIndice: formData.value.initialsIndex ,
        descripcionIndice: formData.value.initialsIndex ,
        descripcion: formData.value.description ,
        esUnDocumentoGestion: formData.value.isGestionDocument ,
        esUnDocumentoIndexable: formData.value.isIndexable ,
        esUnDocumentoPlantilla: formData.value.isTemplateDocument ,
        labelIndice: formData.value.labelIndice ,
        bloqueoIndice: formData.value.indexBlock ,
        exigidoIndice: formData.value.indexRequired ,
        unicoIndice: formData.value.uniqueIndex ,
        visibleIndice: formData.value.visibleIndice ,
        indexableIndice: formData.value.accessIndex ,
        editableIndice: formData.value.editIndex ,
        esUnDocumentoPlantillaTipoFormulario: formData.value.typeForm ,
      })
      if(!store.isEdit)
      {
        delete dataToSend.idTipologiaDocumental
      }

      let response : GeneralResponse = {status: null, msg: ''};

      if(store.isEdit){
        response = await editTypedocumental(dataToSend);
      }
      else {
        response = await createTypedocumental(dataToSend);
      }

      if(response.status){
        showModal.value = true;
        isLoading.value = false;
      }
      else{
        errorModal.value = true;
        isLoading.value = false;
      }

    }

    return{
      forms,
      crumbs,
      formData,
      isLoading,
      showModal,
      errorModal,
      buttonLabel,
      cancelModal,
      buttonEnabled,
      titlePage,
      handleCancel,
      handleSuccess,
      submit,
    }
}
