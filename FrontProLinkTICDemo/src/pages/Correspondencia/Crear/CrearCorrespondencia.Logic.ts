import { formatDate } from './../../../helpers/formtDate';
import { ref, onBeforeMount, Ref, watch, computed } from "vue";
import { useRouter } from 'vue-router';
import { routes } from '.';
import { FormBase, FormCorrespondency, Fields, FilesData } from "./interfaces";
import {
  alfanumericoMax50,
  alfanumericoMax250,
  opcionSeleccionada,
  esCorreoValido,
  esTelefonoValido,
  noVacio,
  noCeroNuloOVacio,
  esFechaValida,
  esHoraValida,
  esDireccionValida,
  opcionSeleccionadaRegion
} from "./Validators";
import { getDependencies, getDocumetalTypes, getIdTypes, getReceptionEnvironment, getProcedureTypes, makeProcedure } from '../API/endpointsData';
import service from '../../../services/Api';

export const useCrearCorrespondencia = () => {

  const routesData = ref([]);
  const router = useRouter();
  const files: Ref<FilesData> = ref({
    filesProcedure : null,
    filesDocumental : null,
    filesComunication : null
  })
  const formData: Ref<FormBase> = ref(new FormCorrespondency());
  const errorForm = ref(true);
  const opciones = ref([]);
  const opcionesConSecciones = ref([]);
  const showModal = ref(false);
  const errorModal = ref(false);
  const cancelModal = ref(false);
  const isLoading = ref(false);

  const filtrarOpciones = (val: string, update) => {

    if (val === '') {
      update(() => {
        opcionesConSecciones.value = opciones.value;
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase();
      opcionesConSecciones.value = opciones.value.filter(op => op.nombre.toLowerCase().includes(needle));
    })
  }

  const handleError = (val: string): true | string => {

    if(val === 'OK'){
      errorForm.value = false;
      return true;
    }
    else{
      errorForm.value = true;
      return val;
    }
  };

  const forms = ref([
      {
        header: { label: 'Destinatarios' },
        rows: [
          [
            { type: 'select', disabled: false, col: 6, label: 'Dependencia*', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: [], required: true, nameField: Fields.dependencia, rules: [opcionSeleccionada, noVacio]},
            { type: 'select', disabled: false, col: 6, label: 'Copiar a dependencia',labelSelector: "label", valueSelector: 'value', placeholder: 'Seleccione', options: [] , required: false, nameField: Fields.dependenciaCopia, rules: []}
          ],
          [
            { type: 'text', col: 6, label: 'Funcionario destinatario*', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.funcionario, rules: [alfanumericoMax50]},
            { type: 'text', col: 6, label: 'Funcionario destinatario copia', placeholder: 'Ingrese nombre' , required: false, nameField: Fields.funcionarioCopia, rules: [alfanumericoMax50]}
          ]
        ]
      },
      {
        header: { label: 'Comunicación' },
        rows: [
          [
            { type: 'select', disabled: false, col: 6, label: 'Tipo de trámite*', placeholder: 'Select Option', labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.tipoTramite, rules: [opcionSeleccionada, noVacio]},
            { type: 'file', col: 6, label: 'Cargue el documento', placeholder: 'file', required: false, referencia: 'filesProcedure'}
          ],
          [
            { type: 'select', disabled: false, col: 6, label: 'Tipo documental*', placeholder: 'Select Option',labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.tipodocumental, rules: [opcionSeleccionada, noVacio]},
            { type: 'file', col: 6, label: 'Cargue el documento', placeholder: 'file', required: false, referencia: 'filesDocumental'}
          ],
          [
            { type: 'select', disabled: false, col: 6, label: 'Tipo de comunicación*', placeholder: 'Select Option',labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.tipoComunicacion, rules: [opcionSeleccionada, noVacio]},
            { type: 'file', col: 6, label: 'Cargue el documento', placeholder: 'file', required: false, referencia: 'filesComunication'}
          ],
          [
            { type: 'checkbox', col: 12, label: 'Aplicar OCR al documento digitalizado', required: true, nameField: Fields.ocr}
          ],
          [
            { type: 'number', col: 6, label: 'Numero de folios*', placeholder: 'Ingrese número' , required: true, nameField: Fields.numerofolios, rules: [noCeroNuloOVacio]},
            { type: 'select', disabled: false, col: 6, label: 'Anexos*', placeholder: 'Seleccione',labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.anexos, rules: [opcionSeleccionada, noVacio]},
          ],
          [
            { type: 'textMultiLine', col: 12, label: 'Descripción anexos*', required: true, nameField: Fields.descripcionAnexos, rules: [alfanumericoMax250, noVacio]},
          ],
          [
            { type: 'number', col: 6, label: 'Numero de folios anexos*', placeholder: 'Ingrese número' , required: true, nameField: Fields.numeroFoliosAnexos, rules: [noCeroNuloOVacio]},
            { type: 'select', disabled: false, col: 6, label: 'Canal de recepción*', placeholder: 'Select Option',labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.canalRecepcion, rules: [opcionSeleccionada, noVacio]},
          ],
          [
            { type: 'text', col: 12, label: 'Asunto', placeholder: 'Ingrese asunto' , required: true, nameField: Fields.asunto, rules: [alfanumericoMax50, noVacio]},
          ],
          [
            { type: 'text', col: 6, label: 'Radicado de entidad remitente', placeholder: 'Ingrese entidad' , required: true, nameField: Fields.radicadoEntidadRemitente, rules: [alfanumericoMax50, noVacio]},
            { type: 'text', col: 6, label: 'Referenciar otro radicado', placeholder: 'Ingrese referencia' , required: true, nameField: Fields.referenciarOtroRadicado, rules: [alfanumericoMax50, noVacio]},
          ],
          [
            { type: 'date', col: 4, label: 'Fecha original de documento*', required: true, nameField: Fields.fechaOriginalDocumento, rules: [noVacio, esFechaValida]},
            { type: 'date', col: 4, label: 'Fecha de recepción*', required: true, nameField: Fields.fechaRecepcion, rules: [noVacio, esFechaValida]},
            { type: 'time', col: 4, label: 'Hora de recepción*', required: true, nameField: Fields.horaRecepcion, rules: [noVacio, esHoraValida]},
          ],
          [
            { type: 'text', col: 12, label: 'Número de radicado de entrada*', placeholder: 'Ingrese referencia' , required: true, nameField: Fields.numeroRadicadoEntrada, rules: [alfanumericoMax50, noVacio]},
          ],
        ]
      },
      {
        header: { label: 'Remitente' },
        rows:[
          [
            { type: 'select', disabled: false, col: 6, label: 'Tipo documento*', placeholder: 'Selecione',labelSelector: "label", valueSelector: 'value', options: [] , required: true, nameField: Fields.tipoDocumento, rules: [opcionSeleccionada, noVacio]},
            { type: 'text', col: 6, label: 'Número de identificación', placeholder: 'Ingrese número' , required: true, nameField: Fields.numeroDocumento, rules: [alfanumericoMax50, noVacio]},
          ],
          [
            { type: 'text', col: 6, label: 'Nombres*', placeholder: 'Ingrese nombres' , required: true, nameField: Fields.nombres, rules: [alfanumericoMax50, noVacio]},
            { type: 'text', col: 6, label: 'Apellidos*', placeholder: 'Ingrese apellidos' , required: true, nameField: Fields.apellidos, rules: [alfanumericoMax50, noVacio]},
          ],
          [
            { type: 'selectSection',disabled: true, col: 4, label: 'Pais*', labelSelector: "nombre", valueSelector: 'idPais' , placeholder: 'Seleccione', options: [] , required: false, nameField: Fields.pais, rules: [opcionSeleccionadaRegion, noVacio]},
            { type: 'select', disabled: true, col: 4, label: 'Departamento*', placeholder: 'Seleccione',labelSelector: "nombre", valueSelector: 'idDepartamento', options: [] , required: true, nameField: Fields.departamento, rules: [opcionSeleccionadaRegion, noVacio]},
            { type: 'select', disabled: true, col: 4, label: 'Ciudad*', placeholder: 'Seleccione',labelSelector: "nombre", valueSelector: 'idMunicipio', options: [] , required: true, nameField: Fields.ciudad, rules: [opcionSeleccionadaRegion, noVacio]},
          ],
          [
            { type: 'text', col: 12, label: 'Dirección*', placeholder: 'Ingrese dirección' , required: true, nameField: Fields.direccion, rules: [esDireccionValida, noVacio]},
          ],
          [
            { type: 'number', col: 4, label: 'Telefono*', placeholder: 'Ingrese número' , required: true, nameField: Fields.telefono, rules: [esTelefonoValido, noVacio, noCeroNuloOVacio]},
            { type: 'number', col: 4, label: 'Movil*', placeholder: 'Ingrese número' , required: true, nameField: Fields.movil, rules: [esTelefonoValido, noVacio, noCeroNuloOVacio]},
            { type: 'number', col: 4, label: 'Celular*', placeholder: 'Ingrese número' , required: true, nameField: Fields.celular, rules: [esTelefonoValido, noVacio, noCeroNuloOVacio]},
          ],
          [
            { type: 'text', col: 12, label: 'Correo electrónico*', placeholder: 'Ingrese correo' , required: true, nameField: Fields.email, rules: [esCorreoValido(handleError), noVacio]},
          ],
        ]
      }

      // Continue with other accordions' data structures
    ]
  )


  const handleFileChange = (value: string | null, typeFile: string) => {
    if (value && value.length > 0) {
      files.value[typeFile] = value[0];// Aquí puedes manejar el archivo como desees
    }
  }

  onBeforeMount(() => {
    getAllcountries();
    listDependencies();
    listDocumentals();
    listReceptionEnvironments();
    listIds();
    listProcedures();
    listComunications();
    listAnexos();
    routesData.value = routes;
  })

  watch(()=>opcionesConSecciones.value, (newValue) =>{
    forms.value[2].rows[2][0]['options'] = newValue;
  });

  watch(()=>formData.value.pais, (newValue)=>{
    getDepartments(newValue.idPais);
  });

  watch(()=>formData.value.departamento, (newValue)=>{
    getCities(newValue.idDepartamento);
  });

  const buttonEnabled = computed(()=>{
    return !(
      formData.value.dependencia.label !== ''
      && formData.value.tipoTramite.label !== ''
      && formData.value.tipodocumental.label !== ''
      && formData.value.tipoComunicacion.label !== ''
      && formData.value.numerofolios !== null
      && formData.value.anexos.label !== ''
      && formData.value.descripcionAnexos !== ''
      && formData.value.numeroFoliosAnexos !== null
      && formData.value.canalRecepcion.label !== ''
      && formData.value.asunto !== ''
      && formData.value.radicadoEntidadRemitente !== ''
      && formData.value.referenciarOtroRadicado !== ''
      && formData.value.fechaOriginalDocumento !== ''
      && formData.value.fechaRecepcion !== ''
      && formData.value.horaRecepcion !== ''
      && formData.value.numeroRadicadoEntrada !== ''
      && formData.value.tipoDocumento.label !== ''
      && formData.value.numeroDocumento !== ''
      && formData.value.nombres !== ''
      && formData.value.apellidos !== ''
      && formData.value.pais.nombre !== ''
      && ( formData.value.pais.idPais === 204 ? (formData.value.departamento.nombre !== '' && formData.value.ciudad.nombre !== ''): true)
      && formData.value.direccion !== ''
      && formData.value.telefono > 3000000
      && formData.value.movil > 3000000000
      && formData.value.celular > 3000000000
      && formData.value.email !== ''
      && !errorForm.value
      && files.value.filesProcedure !== null
      && files.value.filesDocumental !== null
      && files.value.filesComunication !== null

    )
  })

  const listDependencies = async () => {
    const response = await getDependencies();
    forms.value[0].rows[0][0]['options'] = response;
    forms.value[0].rows[0][1]['options'] = response;
  }

  const listDocumentals = async () => {
    const response = await getDocumetalTypes();
    forms.value[1].rows[1][0]['options'] = response;
  }

  const listReceptionEnvironments = async () => {
    const response = await getReceptionEnvironment();
    forms.value[1].rows[6][1]['options'] = response;
  }

  const listIds = async () => {
    const response = await getIdTypes();
    forms.value[2].rows[0][0]['options'] = response;
  }

  const listProcedures = async () => {
    const response = await getProcedureTypes();
    forms.value[1].rows[0][0]['options'] = response;
  }

  const listComunications = () => {
    forms.value[1].rows[2][0]['options'] = [
      {
        label: 'Interna',
        value: 1
      },
      {
        label: 'Externa',
        value: 2
      }
    ];
  }

  const listAnexos = () => {
    forms.value[1].rows[4][1]['options'] = [
      {
        label: 'Si',
        value: 1
      },
      {
        label: 'No',
        value: 2
      }
    ];
  }

  const getDepartments = async (idPais: number) => {
    if(idPais === 204){
      const response = await service.listDepartamento(idPais);
      forms.value[2].rows[2][1]['options'] = response;
      forms.value[2].rows[2][1]['disabled'] = false;
      forms.value[2].rows[2][1]['required'] = true;
    }
    else{
      forms.value[2].rows[2][1]['disabled'] = true;
      forms.value[2].rows[2][1]['required'] = false;
      formData.value.departamento = {idDepartamento: 0, nombre: ''};
      forms.value[2].rows[2][2]['disabled'] = true;
      forms.value[2].rows[2][2]['required'] = false;
      formData.value.ciudad = {idMunicipio: 0, nombre: ''};
    }
  }

  const getCities = async (idDept: number) => {

    if(formData.value.pais.idPais === 204 && idDept !== 0){
      const response = await service.listMunicipio(idDept);
      forms.value[2].rows[2][2]['options'] = response;
      forms.value[2].rows[2][2]['disabled'] = false;
      forms.value[2].rows[2][2]['required'] = true;
    }

  }

  const getAllcountries = async () => {

    const response = await service.listContinente();
    let listCountries = [];

    await Promise.all(response.map(async (value)=>{
      const responseCountry = await service.listPais(value.idContinente);
      listCountries = [...listCountries, ...responseCountry];
    }));
    opciones.value = listCountries;
    forms.value[2].rows[2][0]['options'] = listCountries;

  };

  const handleForm = async () =>{

    isLoading.value = true;
    const formDataToSend = new FormData();

    formDataToSend.append('file', files.value.filesProcedure, files.value.filesProcedure.name)
    formDataToSend.append('file', files.value.filesDocumental, files.value.filesDocumental.name)
    formDataToSend.append('file', files.value.filesComunication, files.value.filesComunication.name)
    formDataToSend.append('dependencia', formData.value.dependencia.value.toString());
    formDataToSend.append('funcionarioDestinatario', formData.value.funcionario);
    formDataToSend.append('dependenciaCopia', formData.value.dependenciaCopia.value? formData.value.dependenciaCopia.value.toString():'');
    formDataToSend.append('funcionarioDestinatariosCopia', formData.value.funcionarioCopia?formData.value.funcionarioCopia:'');
    formDataToSend.append('tipoTramite', formData.value.tipoTramite.value.toString());
    formDataToSend.append('tipoComunicacion', formData.value.tipoComunicacion.value.toString());
    formDataToSend.append('numeroDeFolios', formData.value.numerofolios.toString());
    formDataToSend.append('anexos', formData.value.anexos.value.toString());
    formDataToSend.append('descripcionDeAnexos', formData.value.descripcionAnexos);
    formDataToSend.append('numeroFoliosAnexos', formData.value.numeroFoliosAnexos.toString());
    formDataToSend.append('canalDeRecepcion', formData.value.canalRecepcion.value.toString());
    formDataToSend.append('asunto', formData.value.asunto);
    formDataToSend.append('radicadoDeEntidadRemitente', formData.value.radicadoEntidadRemitente);
    formDataToSend.append('referenciarOtroRadicado', formData.value.referenciarOtroRadicado);
    formDataToSend.append('fechaOriginalDelDocumento', formData.value.fechaOriginalDocumento);
    formDataToSend.append('fechaDeRecepcion', formData.value.fechaRecepcion);
    formDataToSend.append('horaDeRecepcion', formData.value.horaRecepcion);
    formDataToSend.append('numeroDeRadicadoDeEntrada', formData.value.numeroRadicadoEntrada);
    formDataToSend.append('tipoDeDocumentoRemitente', formData.value.tipoDocumento.value.toString());
    formDataToSend.append('numeroDeIdentificacionRemitente', formData.value.numeroDocumento);
    formDataToSend.append('nombresRemitente', formData.value.nombres);
    formDataToSend.append('apellidosRemitente', formData.value.apellidos);
    formDataToSend.append('paisRemitente', formData.value.pais.idPais.toString());
    formDataToSend.append('departamentoRemitente', formData.value.departamento.idDepartamento.toString());
    formDataToSend.append('ciudadRemitente', formData.value.ciudad.idMunicipio.toString());
    formDataToSend.append('direccionRemitente', formData.value.direccion);
    formDataToSend.append('telefonoRemitente', formData.value.telefono.toString());
    formDataToSend.append('movilRemitente', formData.value.movil.toString());
    formDataToSend.append('celularRemitente', formData.value.celular.toString());
    formDataToSend.append('correoElectronicoRemitente', formData.value.email);

    const response = await makeProcedure(formDataToSend);

    if(response.status === 200){
      isLoading.value = false;
      showModal.value = true;
    }
    else{
      isLoading.value = false;
      errorModal.value = true;
    }


  };

  const handleModal = () => {
    if (showModal.value) {
      showModal.value = false;
      router.push("/correspondencia");
    } else {
      errorModal.value = false;
    }
  };

  return{
    forms,
    routesData,
    formData,
    handleForm,
    filtrarOpciones,
    buttonEnabled,
    files,
    handleFileChange,
    handleModal,
    showModal,
    errorModal,
    cancelModal,
    router,
    isLoading,
  }
}
