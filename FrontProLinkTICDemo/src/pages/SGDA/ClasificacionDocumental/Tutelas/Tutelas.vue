<template>
    <main class="q-py-md">
        <!-- <a href="/home" class="text-primary q-mb-md block" style="text-decoration: none;">
        <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
        <b>
          Volver
        </b>
      </a> -->
        <BreadCrumbs :crumbs="routes"></BreadCrumbs>
        <div class="tw-flex tw-justify-between tw-pt-4">
            <h1 class="tw-text-3xl tw-font-bold">Bandeja de Entrada</h1>
            <!--  <q-btn class="tw-w-42 tw-h-12 flex" @click="router.push('/tutelas/radicar')"><q-icon name="add" class="q-mr-xs"
          size="20px" />Radicar
        tutela</q-btn> -->
        </div>
        <q-card flat>
            <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
                <template v-slot:header>
                    <div class="col row">
                        <b class="tw-text-lg">Filtrar por</b>
                    </div>
                </template>
                <div class="row q-px-md">

                    <!--                        <div class="col-4">-->
                    <!--                            <label class="q-px-md tw-text-label">Número del proceso-->
                    <!--                                <q-input outlined label="Inserte" dense emit-value v-model="formulario.proceso" />-->
                    <!--                            </label>-->
                    <!--                        </div>-->

                    <!--                        <div class="col-4">-->
                    <!--                            <label class="q-px-md tw-text-label">Oficina-->
                    <!--                                <q-select outlined label="Seleccione" dense emit-value v-model="formulario.oficina" />-->
                    <!--                            </label>-->
                    <!--                        </div>-->

                    <!--                        <div class="col-4">-->
                    <!--                            <label class="q-px-md tw-text-label">Etapa procesal-->
                    <!--                                <q-select outlined label="Seleccione" dense emit-value v-model="formulario.etapa" />-->
                    <!--                            </label>-->
                    <!--                        </div>-->
                    <div class="col-4">

                        <label class="q-px-md tw-text-label">Número de Radicado
                            <q-select v-model="formulario.idRadicado" outlined dense use-input hide-selected emit-value
                                map-options fill-input label="Búsqueda" input-debounce="0" :options="radicadoOptions"
                                @filter="filterRa" hint="Escriba al menos 4 dígitos para buscar"
                                :rules="[v => maxLengthInput(50, v), alphanumeric]"
                                @input-value="v => addValue(v, 'idRadicado')">
                                <template v-slot:prepend>
                                    <q-icon name="search" />
                                </template>
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin resultados
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </label>
                    </div>
                    <div class="col-4">
                        <label class="q-px-md tw-text-label">Código del Proceso
                            <q-select v-model="formulario.codigoProceso" outlined dense use-input hide-selected
                                emit-value map-options fill-input input-debounce="0" label="Búsqueda"
                                :options="coProcOptions" @filter="filterCoProc"
                                hint="Escriba al menos 2 dígitos para buscar"
                                :rules="[v => maxLengthInput(50, v), alphanumeric]"
                                @input-value="v => addValue(v, 'codigoProceso')">
                                <template v-slot:prepend>
                                    <q-icon name="search" />
                                </template>
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin resultados
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </label>
                    </div>
                    <div class=" col-4">
                        <label class="q-px-md tw-text-label">Oficina
                            <q-select outlined label="Inserte" @filter="filterOfi" use-input dense emit-value
                                map-options v-model="formulario.oficina" :options="opOfi">
                                <template v-slot:prepend>
                                    <q-icon name="search" />
                                </template>
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin resultados
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </label>
                    </div>
                    <div class="col-4">
                        <label class="q-px-md tw-text-label">Etapa Procesal
                            <q-select outlined label="Inserte" use-input dense emit-value map-options @filter="filterFn"
                                v-model="formulario.idEtapaProcesal" :options="opEP">
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin resultados
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </label>
                    </div>
                    <div class="col-4">
                        <label class="q-px-md tw-text-label">Fecha de Radicado
                            <!-- <q-input dense outlined v-model="formulario.fecha" label="Inserte">
                                <template v-slot:append>
                                  <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-date v-model="formulario.fecha" mask="DD/MM/YYYY">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                        </div>
                                      </q-date>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                            </q-input> -->
                            <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa"
                                v-model:input-data-prop="formulario.fecha" />
                        </label>
                    </div>

                    <!--                        <div class="col-4">-->
                    <!--                            <label class="q-px-md tw-text-label">Registros asignados-->
                    <!--                                <q-input outlined label="Inserte" dense emit-value v-model="formulario.registros" />-->
                    <!--                            </label>-->
                    <!--                        </div>-->
                </div>

                <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
                    <q-btn label="Limpiar Filtros" type="reset" style="width: 240px" text-color="black" color="accent"
                        class="tw-rounded-xl tw-h-12" @click="toClearFilters" />

                    <q-btn @click="filterService" label="Buscar" text-color="white" style="width: 240px" color="primary"
                        class="tw-rounded-xl tw-h-12 tw-p-2" />
                </div>
            </q-expansion-item>
        </q-card>

        <div class="q-mt-xl">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
                Listado de Tutelas Radicadas
            </p>
            <Table class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="filteredTutelas" key-id="idRadicado"
                :total-pages="totalPages" @handle-edit-data="abrirDetalle" select="multiple" :pagination="pagination"
                @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange"
                msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" />
        </div>

        <!-- maneja errores
        <alertError text="" />
        -->

        <!-- este modal para la carga -->
        <q-dialog v-model="showModal">
            <q-card class="q-py-xl q-px-xl">
                <div class="q-mx-auto text-center">
                    <p
                        class="text-bold tw-text-xl q-mx-auto tw-border-[10px] tw-border-yellow-400 tw-rounded-full tw-w-24 q-pa-lg">
                        20%
                    </p>
                </div>
                <q-card-section class="text-h6 tw-max-w-sm text-center text-weight-bold">
                    Consultando información
                </q-card-section>
                <p class="tw-max-w-xs text-center tw-text-lg">
                    Espere un momento por favor
                </p>
            </q-card>
        </q-dialog>
    </main>
</template>

<script lang="ts" setup>
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import {fourthFormatDate, dateForFilter, formatDateWithTimeAndMeridiemWithInputFormat} from "src/helpers/formtDate";
import { Tutelas } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Table from "./Table.vue";
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { useAuthStore } from "stores/auth.store";
import {
    homePhoneNumber,
    phoneFormat,
    mobilePhonNumber,
    validationEmail,
    maxLengthInput,
    inputRequired,
    minLengthInput,
    alphanumeric
} from 'src/helpers/validations';
import { toast } from "src/helpers/toast";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
const fullTutelaUrl = ref('');
onMounted(async () => {
    userInfo.value = await getUserInfo();
    fullTutelaUrl.value = `/tutela/info?usuario=${userInfo.value.username}` +
        (userInfo.value.role === "Asignador Responsable" ? `&rol=${userInfo.value.role}` : "");

    await getAllTutelas(fullTutelaUrl.value);
    const { data } = (await sgdeaAxios.get("/tutela/listadoEtapaProcesal"));
    opEtapaProcesal.value = data?.map((item: any) => ({
        label: capitalizarPalabrasExceptoDe(item.nombre),
        value: item.id,
        descripcion: item.descripcion
    })).filter((item) => item.label != 'Duplicado');
    opEP.value = opEtapaProcesal.value
    const dataOfi = (await sgdeaAxios.get("/oficinas/all"));
    opOficinas.value = dataOfi.data?.map((item: any) => ({
        label: item.nombre,
        value: item.id,
        dependencia: item.dependencia
    }));
    opOfi.value = opOficinas.value
});
let pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0
});

const currPage = ref(0)

const handlePageChange = async (page: number) => {
    pagination.value.page = page
    currPage.value = page <= 0 ? 0 : page - 1;

    await getAllTutelas(fullTutelaUrl.value);
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
    pagination.value.rowsPerPage = rowsPerPage;

    await getAllTutelas(fullTutelaUrl.value);
}

const router = useRouter();
const formulario = ref({
    idRadicado: "",
    codigoProceso: "",
    oficina: "",
    idEtapaProcesal: "",
    fecha: "",
    registros: "",
});

const { getUserInfo } = useAuthStore();
const userInfo = ref()
const showModal = ref(false);
const allTutelas = ref([]);
const filteredTutelas = ref([])
const radicadoOptions = ref()
const totalPages = ref(0)
const opForRadicados = ref()
const opForCoProc = ref()
const coProcOptions = ref()
const columns = [
    {
        name: "codigoProceso",
        label: "Código del Proceso",
        field: "codigo",
        align: 'center',
        sortable: true,
    },
    {
        name: "nombreJuzgado",
        label: "Nombre del Juzgado",
        field: 'nombreJuzgado',
        sortable: true,
        align: 'center',
    },
    {
        name: "canal",
        label: "Canal de Radicación",
        field: "canal",
        align: 'center',
        sortable: true,
    },
    {
        name: "idRadicado",
        label: "Radicado",
        field: "idRadicado",
        align: 'center',
        sortable: true,
    },
    {
        name: "fechaRadicacion",
        label: "Fecha de Radicación",
        field: "fechaRadicacion",
        align: 'center',
        sortable: true,
    },
    {
        name: "tiempoAsignado",
        label: "Tiempo Asignado",
        align: 'center',
        field: (row) => row.tiempoAsignado != '' ? row.tiempoAsignado : '-',
        sortable: true,
    },
    {
        name: "tiempoPorVencer",
        label: "Tiempo por Vencer",
        align: 'center',
        field: (row) => (row.tiempoVencer == "0 días y 0 horas") ? 'Vencido' : (row.tiempoVencer !== '' ? row.tiempoVencer : '-'),
        sortable: true,
    },
    {
        name: "fecha",
        label: "Fecha de Vencimiento",
        align: 'center',
        field: "fechaVencimiento",
        sortable: true,
    },
    {
        name: "nombreAfectado",
        label: "Nombre - Identificación Afectado",
        field: (row) => row.nombresAfectado ? row.nombresAfectado + " - " + row.identificacionAfectado : '-',
        align: 'center',
        sortable: true,
    },
    {
        name: "nombreRemitente",
        label: "Nombre - Identificación Accionante",
        field: (row) => row.nombresRemitente ? row.nombresRemitente + " - " + row.identificacionRemitente : '-',
        align: 'center',
        sortable: true,
    },
    {
        name: "municipio",
        label: "Ciudad - Departamento",
        align: 'center',
        field: (row) => row.ciudad + " / " + row.departamento,
        sortable: true,
    },
    // {
    //     name: "tiempoPorVencer2",
    //     label: "Tiempo por vencer",
    //     field: "tiempoPorVencer2",
    //     sortable: true,
    // },
    {
        name: "etapaProcesal",
        label: "Tipo Trámite / Etapa Procesal",
        field: row => ((row.tipoTramite && row.etapaProcesal) ? ((row.tipoTramite || '-') + ' / ' + (row.etapaProcesal || '-')) : 'N/A'),
        align: 'center',
        sortable: true,
    },
    {
        name: "abogadoTramitador",
        label: "Abogado Responsable",
        align: 'center',
        field: row => (row.abogado || '-'),
        sortable: true,
    },
    {
        name: "asignaciones",
        label: "Escalado",
        field: "asignaciones",
        align: 'center',
        sortable: false,
    },
    // {
    //     name: 'escaladores',
    //     label: 'Escalador(es)',
    //     field: 'escaladores',
    //     align: 'center',
    //     sortable: true
    // },
    {
        name: "trazabilidad",
        label: "Trazabilidad",
        field: "trazabilidad",
        align: 'center',
        sortable: false,
    },
    {
        name: "estado",
        label: "Estado",
        field: "estado",
        sortable: false,
        align: "center",
    },
    {
        name: "acciones",
        label: "Acciones",
        field: "acciones",
        sortable: false,
        align: "center",
    },
];

function formatearFecha(fechaOriginal) {
    const partes = fechaOriginal.split(' ');
    const fecha = partes[0];
    const hora = partes[1];

    const [dia, mes, anio] = fecha.split('-');
    const fechaFormateada = `${dia}/${mes}/${anio} ${hora}`;

    return fechaFormateada;
}


const capitalizarPalabrasExceptoDe = (texto) => {
    const palabras = texto.split(' ');
    for (let i = 0; i < palabras.length; i++) {
        if (palabras[i] !== "de") {
            palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].substring(1);
        }
    }
    return palabras.join(' ');
}

async function getAllTutelas(path) {
    path = path + `&page=${currPage.value}&size=${pagination.value.rowsPerPage}`
    const { data } = await sgdeaAxios.get<Tutelas[]>(path);
    totalPages.value = data.totalPages
    allTutelas.value = data.tutelas.map((it) => ({
        ...it,
        id: it.idRadicado,
    })).sort((a, b) => {
        // @ts-ignore
        const tiempoVencerA = a.tiempoVencer;
        // @ts-ignore
        const tiempoVencerB = b.tiempoVencer;

        if (tiempoVencerA == 'Vencido' || tiempoVencerB == 'Vencido') {
            return 0;
        }

        const [valorA, unidadA] = (tiempoVencerA || '').split(' ');
        const [valorB, unidadB] = (tiempoVencerB || '').split(' ');

        if (unidadA == 'dias' || unidadB == 'dias') {
            return 0;
        }

        const numValorA = parseInt(valorA);
        const numValorB = parseInt(valorB);

        return (numValorA < 24 && numValorB < 24) ? (numValorA - numValorB) : (numValorA < 24 ? -1 : (numValorB < 24 ? 1 : 0));
    });
    let lastSort = allTutelas.value.sort((a, b) => {
        if (a.tiempoVencer != '' && b.tiempoVencer != '' && a.tiempoVencer != 'N/A' && b.tiempoVencer != 'N/A') {
            let numA = parseInt(a.tiempoVencer.match(/-?\d+/)[0]);
            let unitA = a.tiempoVencer.match(/[a-zA-Z]+/)[0];

            let numB = parseInt(b.tiempoVencer.match(/-?\d+/)[0]);
            let unitB = b.tiempoVencer.match(/[a-zA-Z]+/)[0];

            if (unitA === unitB) {
                return numA - numB;
            } else {
                return unitA === 'H' ? -1 : 1;
            }
        } else {
            return 1
        }

    });

    filteredTutelas.value = lastSort
    opForRadicados.value = allTutelas.value.map((data) => ({
        label: data.idRadicado,
        value: data.idRadicado
    }))
    const codigoMap = new Map();

    allTutelas.value.forEach((data) => {
        const codigo = data.codigo;
        if (!codigoMap.has(codigo)) {
            codigoMap.set(codigo, true);
        }
    });
    const uniqueCodigos = Array.from(codigoMap.keys());
    opForCoProc.value = uniqueCodigos.map((codigo) => ({
        label: codigo,
        value: codigo
    }));

    const dataFormateada = filteredTutelas.value.map((item) => ({
        ...item,
        fechaVencimiento: formatDateWithTimeAndMeridiem(item.fechaVencimiento),
        fechaRadicacion: formatDateWithTimeAndMeridiemWithInputFormat(item.fechaRadicacion),
        fechaIngreso: formatDateWithTimeAndMeridiem(item.fechaIngreso),
    }));

    filteredTutelas.value = dataFormateada
}

const abrirDetalle = async (id, tab, idTutela) => {
    if (useAuthStore().$state.userInfo.role == "Asignador Responsable") {
        try {
            const reclamo = await sgdeaAxios.put(`/tutela/reclamar-radicado-asignador/${idTutela}?userId=${userInfo.value.userid}`)
            if (reclamo.status == 200) {
                toast.success("En proceso de asignación")
                if (tab == 'docRelacionado') {
                    router.push((`/tutelas/bandeja/detalle/${id}?tab=docRelacionado`))
                } else if (tab == 'docSalida') {
                    router.push((`/tutelas/bandeja/detalle/${id}?tab=docSalida`))
                } else {
                    router.push(`/tutelas/bandeja/detalle/${id}`)
                }
            } else {
                toast.error("Este radicado ya esta reclamado")
            }
        } catch (error) {
            if (error.request.status == 304) {
                if (tab == 'docRelacionado') {
                    router.push((`/tutelas/bandeja/detalle/${id}?tab=docRelacionado`))
                } else if (tab == 'docSalida') {
                    router.push((`/tutelas/bandeja/detalle/${id}?tab=docSalida`))
                } else {
                    router.push(`/tutelas/bandeja/detalle/${id}`)
                }
            } else {
                toast.error("Este radicado ya esta reclamado")
            }

        }
    } else {
        if (tab == 'docRelacionado') {
            router.push((`/tutelas/bandeja/detalle/${id}?tab=docRelacionado`))
        } else if (tab == 'docSalida') {
            router.push((`/tutelas/bandeja/detalle/${id}?tab=docSalida`))
        } else {
            router.push(`/tutelas/bandeja/detalle/${id}`)
        }
    }
    await sgdeaAxios.put(`/tutela/registrarCasoVisto/${userInfo.value.userid}/${idTutela}`)
}

async function toClearFilters(): void {
    formulario.value = {
        idRadicado: "",
        codigoProceso: "",
        oficina: "",
        idEtapaProcesal: "",
        fecha: "",
        registros: "",
    }

    await getAllTutelas(fullTutelaUrl.value);
}

const opEtapaProcesal = ref()
const opEP = ref()
const opOficinas = ref()
const opOfi = ref()

const filterService = () => {
    const entries = Object.entries(formulario.value);
    if (entries.every(([_, val]) => !val)) {
        toast.error('Por favor, seleccione al menos un filtro.');
        return;
    }
    let path = `/tutela/info?page=${pagination.value.page}&size=${pagination.value.rowsPerPage}&usuario=${userInfo.value.username}`;
    if (userInfo.value.role === "Asignador Responsable") {
    path += `&rol=${userInfo.value.role}`;
    }

    entries.forEach(([key, value]) => {
        if (value) {
            if (key == 'fecha') {
                value = dateForFilter(value)
            }
            //@ts-ignore
            path = typeof value === 'string' || typeof value === 'number' ? `${path}${key}=${value}&` : `${path}${key}=${value.label}&`
        }
    });
    // Elimina el último '&' si existe
    path = path.endsWith('&') ? path.slice(0, -1) : path;
    getAllTutelas(path)
}

// const filter = () => {

//   const entries = Object.entries(formulario.value);

//   let filteration = allTutelas.value;

//   entries.forEach(([key, value]) => {
//     if (value) {
//       if (key === "estado") {
//         filteration = filteration.filter((x) => x[key] === value);
//       } else if (key === "fecha") {
//         filteration = filteration.filter(x => x[key] === secondFormatDate(value))
//       } else {
//         filteration = filteration.filter((x) =>
//           x[key].toLowerCase().includes(value.toLowerCase())
//         );
//       }
//     } else {
//       filteredTutelas.value = filteration;
//     }
//   });
//   filteredTutelas.value = filteration;
// };

const routes = [
    {
        name: "Inicio",
        to: "/home",
    },
    {
        name: "Tutelas",
    },
    {
        name: "Tutelas radicadas",
    },
];

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterFn = (val, update) => {
    if (val === '') {
        update(() => {
            opEP.value = opEtapaProcesal.value
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        opEP.value = opEtapaProcesal.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

const filterOfi = (val, update) => {
    if (val === '') {
        update(() => {
            opOfi.value = opOficinas.value
        })
        return
    }

    const needle = normalizeString(val);
    update(() => {
        opOfi.value = opOficinas.value.filter(v => {
            return normalizeString(v.label).indexOf(needle) > -1;
        });
    });
}

const filterRa = (val, update, abort) => {
    if (val.length < 4) {
        abort()
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        radicadoOptions.value = opForRadicados.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
    })
}

const filterCoProc = (val, update, abort) => {
    if (val.length < 2) {
        abort()
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        coProcOptions.value = opForCoProc.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
    })
}

const calcularFechaVencimiento = (date) => {
    const fecha = new Date(date);
    const fechaActual = new Date();
    const diferencia = fecha.getTime() - fechaActual.getTime();
    const diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return diasFaltantes > 0 ? diasFaltantes > 1 ? diasFaltantes + ' Dias' : diasFaltantes + ' Dia' : 'Vencido'
}

const calcularTiempoAsignado = (dateVencimiento, dataRadicacion) => {
    const fechaRadicacion = new Date(dataRadicacion);
    const fechaVencimiento = new Date(dateVencimiento);
    const diferencia = fechaVencimiento.getTime() - fechaRadicacion.getTime();
    const diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return diasFaltantes > 0 ? diasFaltantes > 1 ? diasFaltantes + ' Dias' : diasFaltantes + ' Dia' : 0
}

const addValue = (value, type) => {
    formulario.value[type] = value
}

</script>

<style>
label {
    padding: 0px 10px;
}
</style>
