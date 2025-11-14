<template>
    <q-card-section>
        <q-table flat :rows="solicitudes" :columns="columms" table-header-class="text-black text-h6"
            class="full-width !tw-h-[410px] my-sticky-header-table" row-key="id" virtual-scroll :pagination="pagination"
            rows-per-page-label="Páginas">
            <template v-slot:body-cell-acciones="scope">
                <q-td>
                    <div class="tw-flex tw-items-center tw-justify-end">
                        <q-btn :disable="scope.row.solicitudRechazada" class="tw-w-32 tw-h-7" dense icon="close" :color="scope.row.solicitudRechazada ? 'grey-2' : 'red-2'" label="Rechazar"
                            text-color="black"
                            @click="showModalRechazarRadicado = true; idAsignacionRechazar = scope.row.idAsignacion" />
                        <q-btn :disable="scope.row.solicitudRechazada" d class="tw-w-32 tw-h-7 tw-ml-2" dense icon="done" :color="scope.row.solicitudRechazada ? 'grey-2' : 'green-1'" label="Aceptar"
                            text-color="black" @click="aceptarRechazo(scope.row.idAsignacion)" />
                    </div>
                </q-td>
            </template>
        </q-table>
        <q-dialog v-model="showModalRechazarRadicado" backdrop-color="rgba(0, 0, 0, 0.5)" persistent>
            <q-card class="tw-w-[45%] mx-auto tw-rounded-md">
                <div class="tw-flex tw-justify-center tw-mt-3">
                    <span class="tw-rounded-[100px] tw-flex tw-justify-center"
                        style="background-color: #F6F6F9; width: 82px; height: 82px">
                        <img v-lazy :data-url="require('src/assets/error.svg')" alt="check" />
                    </span>
                </div>
                <q-form ref="formRechazar" greedy>
                    <q-card-section class="tw-px-8">
                        <div class="tw-text-sm tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4 flex tw-justify-center">
                            ¿Desea rechazar la solicitud de inactivación del trámite?</div>
                            <CommentTextArea v-model="motivoRechazo" :is-required="true" :max-length="1000" :min-length="10"
                    label="Motivo De Rechazo" />
                    </q-card-section>
                    <div class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3">
                        <q-btn flat label="Cancelar" color="secondary" class="tw-w-[35%] tw-h-10"
                            @click="showModalRechazarRadicado = false" />
                        <q-btn label="Aceptar" color="secondary" class="tw-w-[35%] tw-h-10"
                            @click="rechazar(idAsignacionRechazar)" />
                    </div>
                </q-form>
            </q-card>
        </q-dialog>
    </q-card-section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { columms } from "./data";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { InfoGeneral, UserByRolAndIdOfficinaI } from "../types";
import { sgdeaAxios } from "src/services";
import { useRoute } from "vue-router";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const props = defineProps<{ informacionGeneral: InfoGeneral }>();

const route = useRoute();

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 8
});
const showModalRechazarRadicado = ref(false);
const motivoRechazo = ref("")
const formRechazar = ref();
const solicitudes = ref([])
const idAsignacionRechazar = ref()
const users = ref<UserByRolAndIdOfficinaI[]>([])
const ente_id = route.params.id;

onMounted(() => {
    getUserBYOfficinas();
});

const aceptarRechazo = (idAsignacion: number) => {
    sgdeaAxios.patch(`/api/entes/consolidador/aprobarRechazo/${idAsignacion}`)
        .then(response => {
            if (response.status === 200) {
                toast.success('Se acepto la solicitud de inactivación del trámite de manera exitosa');
                newTrazabilidad('aceptado')
                getSolicitudes()
            }
        })
        .catch(error => {
            toast.error('Error al aceptar la solicitud de inactivación del trámite');
        })
}

const rechazar = async (idAsignacion: number) => {
    if (await formRechazar.value.validate()) {
        sgdeaAxios.patch(`/api/entes/consolidador/rechazarRechazo/${idAsignacion}`)
            .then(response => {
                if (response.status === 200) {
                    showModalRechazarRadicado.value = false
                    toast.success("Se rechazó la solicitud de inactivación del trámite")
                    newTrazabilidad('rechazado', motivoRechazo.value)
                    getSolicitudes()
                }
            })
            .catch(error => {
                toast.error('Error al rechazar la solicitud de inactivación del trámite');
            }).finally(()=>{
                motivoRechazo.value = ""
            })

    } else {
        toast.error(
            "Para continuar, asegúrese de que todos los campos requeridos estén completos"
        );
    }
};

const newTrazabilidad = async (status: string, comentario = "") => {

    await crearTrazabilidad({
        proceso: `ENTC${props.informacionGeneral.id}`,
        secuencia: props.informacionGeneral.nroRadicado,
        estado: props.informacionGeneral.estado.estado,
        descripcion: `Usuario: ${useAuthStore().$state.userInfo.name}, Ha ${status} la solicitud de inactivación del trámite clonado
        Motivo: ${comentario}`,
        comentario: comentario,
        nombre: useAuthStore().$state.userInfo.name,
        accion: `Se ha ${status} la solicitud de inactivación del trámite clonado`,
        tramite: "Entes de Control",
    });
};

const getSolicitudes = () => {
    const url = `api/entes/consolidador/solicitudesRechazo/${ente_id}`;
    sgdeaAxios.get(url)
        .then((res) => {
            solicitudes.value = res.data.map(solicitud => {
                const user = users.value.find(user => user.id === solicitud.idGestionador)
                return {
                    idAsignacion: solicitud.idAsignacion,
                    motivoRechazo: solicitud.motivoRechazo,
                    cargo: getOneUserAprobadorByRol(user.usuarioRelaciones),
                    nombre: `${user.firstname} ${user.lastname}`,
                    oficina: user.usuarioRelaciones[0].seccionSubSeccion.nombre,
                    estado: solicitud.estado,
                    solicitudRechazada: solicitud.solicitudRechazada
                }
            });

        })
        .catch((err) => {
            toast.error("Ha ocurrido un error al buscar las solicitudes");
        });
};

const getUserBYOfficinas = (rol = "Gestionador") => {
    const url = `roles/usuarios?rol=${rol}`;
    sgdeaAxios.get<UserByRolAndIdOfficinaI[], any>(url).then((res) => {
        users.value = res.data
        getSolicitudes();
    }).catch((err) => {
        toast.error("Ha ocurrido un error al buscar los usuarios");
    });
};

const getOneUserAprobadorByRol = (users: any) => {
    const user = users.find((user) =>
        user.rol.nombre.toLowerCase().includes("gestionador")
    );
    return user?.rol.nombre;
};
</script>
