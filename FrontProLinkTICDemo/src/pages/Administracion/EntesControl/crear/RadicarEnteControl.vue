<template>
    <div class="tw-py-8">
        <a href="/entes-control" class="tw-text-orange-button" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="orange-7"/>
            <b>
                Volver
            </b>
        </a>

        <ComponentTitle class="q-mt-lg" title="Radicar Entes de Control" subtitle="Aquí podrás radicar los entes de control" classTitle="tw-font-bold tw-text-4xl"/>

        <q-form ref="enteControlForm" autofocus greedy @reset="cancelar" class="q-gutter-y-lg q-mt-lg">
            <q-card class="tw-rounded-xl" flat bordered>
                <q-expansion-item default-opened expand-separator>
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Remitente</b>
                        </div>
                    </template>


                        <div class="row q-col-gutter-md q-pb-md q-px-md">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <span class="text-weight-bold">Tipo de remitente *</span>
                                <q-select :rules="[selectRequired]" name="tipoRemitente" outlined v-model="enteControl.tipoRemitente" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'REM', label: 'Remitente'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <span class="text-weight-bold">Tipo de documento del remitente *</span>
                                <q-select :rules="[selectRequired]" name="tipoDocumentoRemitente" outlined v-model="enteControl.tipoDocumentoRemitente" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'REM', label: 'Remitente'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <span class="text-weight-bold">Número de documento del remitente</span>
                                <q-input :rules="[isRequired, v => maxLengthInput(15, v), Number(enteControl.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]" name="nroDocumentoRemitente" outlined v-model="enteControl.nroDocumentoRemitente" label="Inserte" dense />
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <span class="text-weight-bold">Nombre del remitente *</span>
                                <q-input :rules="[isRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]" name="nombreRemitente" outlined v-model="enteControl.nombreRemitente" label="Inserte" dense />
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <span class="text-weight-bold">País *</span>
                                <q-select :rules="[selectRequired]" name="pais" outlined v-model="enteControl.pais" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'COL', label: 'Colombia'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <span class="text-weight-bold">Departamento *</span>
                                <q-select :rules="[selectRequired]" name="departamento" outlined v-model="enteControl.departamento" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'BOG', label: 'Bogotá D.C'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <span class="text-weight-bold">Municipio *</span>
                                <q-select :rules="[selectRequired]" name="municipio" outlined v-model="enteControl.municipio" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'BOG', label: 'Bogotá D.C'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <span class="text-weight-bold">Dirección del remitente *</span>
                                <q-input :rules="[isRequired]" name="direccionRemitente" outlined v-model="enteControl.direccionRemitente" label="Inserte" dense />
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <span class="text-weight-bold">Teléfono</span>
                                <q-input :rules="[]" name="telefono" outlined v-model="enteControl.telefono" label="Inserte" dense />
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <span class="text-weight-bold">Correo electrónico del remitente *</span>
                                <q-input :rules="[isRequired]" name="correoRemitente" outlined v-model="enteControl.correoRemitente" label="Inserte" dense />
                            </div>
                        </div>
                </q-expansion-item>
            </q-card>

            <q-card class="tw-rounded-xl" flat bordered>
                <q-expansion-item default-opened expand-separator>
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Afectado</b>
                        </div>
                    </template>

                    <div class="row q-col-gutter-md q-pb-md q-px-md">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Tipo de documento del afectado *</span>
                            <q-select :rules="[selectRequired]" name="tipoDocumentoAfectado" outlined v-model="enteControl.tipoDocumentoAfectado" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'REM', label: 'Remitente'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Número de documento del afectado</span>
                            <q-input :rules="[isRequired, v => maxLengthInput(15, v), Number(enteControl.tipoDocumentoAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                                name="nroDocumentoAfectado" outlined v-model="enteControl.nroDocumentoAfectado" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Nombre del afectado *</span>
                            <q-input :rules="[isRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]" name="nombreAfectado" outlined v-model="enteControl.nombreAfectado" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">¿Pertenece a la comunidad LGBTI? *</span>
                            <q-select :rules="[selectRequired]" name="lgbt" outlined v-model="enteControl.perteneceLgbt" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'Si', label: 'Si'},
                                { value: 'No', label: 'No'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">Sexo *</span>
                            <q-select :rules="[selectRequired]" name="sexoAfectado" outlined v-model="enteControl.sexoAfectado" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'Femenino', label: 'Femenino'},
                                { value: 'Masculino', label: 'Masculino'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">Condición especial *</span>
                            <q-select :rules="[selectRequired]" name="condicionEspecial" outlined v-model="enteControl.condicionEspecial" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'No', label: 'No'}
                            ]"/>
                        </div>
                    </div>
                </q-expansion-item>
            </q-card>

            <q-card class="tw-rounded-xl" flat bordered>
                <q-expansion-item default-opened expand-separator>
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Medios de contacto</b>
                        </div>
                    </template>

                    <div class="row q-col-gutter-md q-pb-md q-px-md">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Correo electrónico del afectado</span>
                            <q-input :rules="[]" name="correoAfectado" outlined v-model="enteControl.correoAfectado" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Teléfono del afectado *</span>
                            <q-input :rules="[isRequired]" name="telefonoAfectado" outlined v-model="enteControl.telefonoAfectado" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Teléfono fijo del afectado *</span>
                            <q-input :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v), isRequired]" name="telefonoFijoAfectado" outlined v-model="enteControl.telefonoFijoAfectado" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">País de contacto</span>
                            <q-select :rules="[]" name="paisContacto" outlined v-model="enteControl.paisContacto" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'COL', label: 'Colombia'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">Departamento del afectado</span>
                            <q-select :rules="[]" name="departamentoAfectado" outlined v-model="enteControl.departamentoAfectado" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'BOG', label: 'Bogotá D.C'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <span class="text-weight-bold">Ciudad del contacto</span>
                            <q-select :rules="[]" name="ciudadContacto" outlined v-model="enteControl.ciudadContacto" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'BOG', label: 'Bogotá D.C'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Dirección del contacto *</span>
                            <q-input :rules="[isRequired]" name="direccionContacto" outlined v-model="enteControl.direccionContacto" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Medio que autoriza para envío de respuesta *</span>
                            <q-select :rules="[selectRequired]" name="medioAutorizacion" outlined v-model="enteControl.medioAutorizacion" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'Hey', label: 'Hey'}
                            ]"/>
                        </div>
                    </div>
                </q-expansion-item>
            </q-card>

            <q-card class="tw-rounded-xl" flat bordered>

                <q-expansion-item default-opened expand-separator>
                    <template v-slot:header>
                        <div class="col row">
                            <b class="tw-text-lg">Solicitud</b>
                        </div>
                    </template>

                    <div class="row q-col-gutter-md q-pb-md q-px-md">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Número de radicado de la entidad remitente</span>
                            <q-input :rules="[]" name="nroRadicadoEntidad" outlined v-model="enteControl.nroRadicadoEntidad" label="Inserte" dense />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <span class="text-weight-bold">Tipo de solicitud</span>
                            <q-select :rules="[]" name="tipoSolicitud" outlined v-model="enteControl.tipoSolicitud" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'NPI', label: 'NPI'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Detalle</span>
                            <q-input :rules="[]" name="Detalle" outlined v-model="enteControl.detalle" label="Inserte" dense type="textarea" />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Producto</span>
                            <q-select :rules="[]" name="producto" outlined v-model="enteControl.producto" label="Seleccione" dense map-options emit-value :options="[
                                { value: 'NPI', label: 'NPI'}
                            ]"/>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Observación</span>
                            <q-input :rules="[]" name="observacion" outlined v-model="enteControl.observacion" label="Inserte" dense type="textarea" />
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                            <span class="text-weight-bold">Adjunte los documentos</span>

                            <FileLoader v-model="enteControl.documento"/>
                        </div>
                    </div>
                </q-expansion-item>
            </q-card>

            <div class="col row justify-center q-gutter-x-md q-mt-md q-pb-xl">
                <q-btn color="accent" textColor="secondary" label="Cancelar"
                style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset"
                no-caps />

                <q-btn color="secondary" label="Radicar"
                style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="handleForm"/>
            </div>
        </q-form>
        <template v-if="modal">
            <MultiPurposeModal title="Entes de Control se ha radicado con éxito"
            code="Su solicitud se ha radicado con el código ENT-2023 873473223"
            subtitle="La respuesta será enviada en los plazos definidos por la ley al medio que nos indicó en su solicitud." prompt="Puede descargar la copia de esta solicitud aquí." type="success"
            :action="() => $router.push('/SGDA/entes-control')" action-label="Descargar solicitud"
            accept-label="Finalizar"/>
        </template>
    </div>
</template>

<script lang="ts" setup>
import ComponentTitle from "components/ComponentTitle/ComponentTitle.vue";
import FileLoader from "components/FormFields/FileLoader.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IEnteControl } from ".";
import {
  onlyNumbers,
  alphanumeric,
  minLengthInput,
  maxLengthInput,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { toast } from "src/helpers/toast";

const router = useRouter()

const enteControlForm = ref()
const modal = ref(false)

const enteControl = ref<IEnteControl>({
    tipoRemitente: '',
    tipoDocumentoRemitente: '',
    nroDocumentoRemitente: '',
    nombreRemitente: '',
    pais: '',
    departamento: '',
    municipio: '',
    direccionRemitente: '',
    telefono: '',
    correoRemitente: '',
    tipoDocumentoAfectado: '',
    nroDocumentoAfectado: '',
    nombreAfectado: '',
    perteneceLgbt: '',
    sexoAfectado: '',
    condicionEspecial: '',
    correoAfectado: '',
    telefonoAfectado: '',
    telefonoFijoAfectado: '',
    paisContacto: '',
    departamentoAfectado: '',
    ciudadContacto: '',
    direccionContacto: '',
    medioAutorizacion: '',
    nroRadicadoEntidad: '',
    tipoSolicitud: '',
    detalle: '',
    producto: ''
})

const handleForm = async () => {

    const success = enteControlForm.value.validate();
    if(success) {
        function fakeRequest(data) {
            return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ data: { ...data, response: 'Respuesta fake' } })
            }, 1000)
            })
        }

        try {
            const res = await fakeRequest({...enteControl.value});

            aftermath({ status: 201 });
            modal.value = true
        } catch(error) {
            console.error(error)
        }
        return
    }
}

const cancelar = () => {
  enteControl.value = {
    tipoRemitente: '',
    tipoDocumentoRemitente: '',
    nroDocumentoRemitente: '',
    nombreRemitente: '',
    pais: '',
    departamento: '',
    municipio: '',
    direccionRemitente: '',
    telefono: '',
    correoRemitente: '',
    tipoDocumentoAfectado: '',
    nroDocumentoAfectado: '',
    nombreAfectado: '',
    perteneceLgbt: '',
    sexoAfectado: '',
    condicionEspecial: '',
    correoAfectado: '',
    telefonoAfectado: '',
    telefonoFijoAfectado: '',
    paisContacto: '',
    departamentoAfectado: '',
    ciudadContacto: '',
    direccionContacto: '',
    medioAutorizacion: '',
    nroRadicadoEntidad: '',
    tipoSolicitud: '',
    detalle: '',
    producto: ''
  }
  router.push('/SGDA/entes-control')
}

function aftermath(res: any) {
  if (res.status == 201 || res.status == 200) {
    toast.success('El ente de control se ha creado exitosamente');
  } else {
    toast.error('Debe diligenciar los campos obligatorios para radicar esta solicitud.')
  }
}

const isRequired = (val: string) => !!val || 'El campo es obligatorio'
const selectRequired = (val: string) => !!val || 'Debe seleccionar una opción'
</script>
