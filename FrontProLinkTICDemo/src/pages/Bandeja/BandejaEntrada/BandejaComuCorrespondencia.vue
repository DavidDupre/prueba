<template>
    <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
        <div class="flex items-center justify-between q-px-md row row col-12">
            <span class="text-weight-bold text-h6" style="color: #2c3948">
                Listado de Comunicaciones Correspondencia
            </span>
        </div>

        <div class="show-table-icons">
            <TableComuCorrespondencia class="q-pa-md"
                :TABLE_HEADER="isPublicador ? renderColumnsPublicador() : renderColumns()" :TABLE_BODY="dataTable"
                key-id="idRadicacion" @handle-edit-data="handleEditData" select="multiple"
                msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
                @update:filas="handleRowsPerPageChange" @update:pages="handlePageChange"
                :totalPages="dataTableTotalRows" :isLoading="loadingTable" @update:search="handleSearch" />
        </div>
    </q-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import moment from "moment";
import TableComuCorrespondencia from "src/pages/Correspondencia/ComunicacionMasiva/tableComuCorrespondencia.vue";
import { useRouter } from "vue-router";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";

const emit = defineEmits(['pageChange', 'rowsChange']);
const loadingTable = ref(false);
const auth = useAuthStore();
const dataTable = ref([]);
const dataTableTotalRows = ref(0);
const router = useRouter();
const isPublicador = computed(() => auth.$state.userInfo.role === "Publicador")
const searchTerm = ref("");

const allData = ref([])
const renderColumnsPublicador = () => {
    const columns = [
        {
            name: "radicadoEntrada",
            label: "Radicado de Entrada",
            field: "radicadoEntrada",
            sortable: true,
        },
        {
            name: "radicadoSalida",
            label: "Radicado de Salida",
            field: "radicadoSalida",
            sortable: true,
        },
        {
            name: "tipoTramite",
            label: "Tipo de Trámite",
            field: "tipoTramite",
            sortable: true,
        },
        {
            name: "destinatario",
            label: "Destinatario",
            field: "destinatario",
            sortable: true,
        },
        {
            name: "fechaEnvio",
            label: "Fecha de Envío",
            field: "fechaEnvio",
            sortable: true,
        },
        {
            name: "canalEnvio",
            label: "Canal de envío",
            field: "canalEnvio",
            sortable: true,
        },
        {
            name: "estado",
            label: "Estado",
            field: "estado",
            sortable: true,
        },
        {
            name: "tiempoAsignado",
            label: "Tiempo Asignado",
            field: (row) => `${row.tiempoAsignado.unidad} ${row.tiempoAsignado.medida}`,
            sortable: true,
        },
        {
            name: "tiempoPorVencer",
            label: "Tiempo por Vencer",
            field: (row) =>
                row?.tiempoPorVencer
                    ? row.tiempoPorVencer < 0
                        ? "Vencido"
                        : row.tiempoPorVencer + " " + (row?.tiempoAsignado.medida === 'DIAS' ? 'Días' : 'Horas')
                    : "-",
            sortable: true,
        },
        {
            name: "fechaVencimiento",
            label: "Fecha de Vencimiento",
            field: (row) => row.fechaVencimiento || "-",
            sortable: true,
        },
        {
            name: "nombre",
            label: "Nombre",
            field: "nombre",
            sortable: true,
        },
        {
            name: "documento",
            label: "Documento",
            field: "documento",
            sortable: true,
        },
        {
            name: "acciones",
            label: "Acciones",
            field: "acciones",
        },
        {
            name: "trazabilidad",
            label: "Trazabilidad",
            field: "trazabilidad",
        }
    ];

    return columns;
};
const filasGrilla = ref()

const formulario = ref({
    idRadicado: '',
    idTipoTramite: '',
    idEstado: '',
    tiempoPorVencer: '',
    idDepartamento: '',
    idCiudad: ''
});

const filterService = async () => {
    const entries = Object.entries(formulario.value);
    const body = filterEmptyValues(entries);
    body['size'] = filasGrilla.value || 20
    body['page'] = 0
    body['usuario'] = auth.$state.userInfo.userid
    body['idOficina'] = auth.$state.userInfo.oficina

    const role = auth.$state.userInfo.role
    const isAdminOrAsignador = role.toLowerCase().includes('administrador') || role.toLowerCase().includes('asignador')
    if (body.hasOwnProperty('tiempoPorVencer') && isAdminOrAsignador) {
        allData.value = []
        return;
    }

    // @ts-ignore
    sendFilters(0, 20);
}

function filterEmptyValues(entries) {
    const body = {};
    entries.forEach(([key, value]) => {
        if (value) {
            body[key] = value;
        }
    });
    return body;
}
let isGestionador = ref(false);
const getCanalType = () => {
    if (isGestionador.value) {
        return "Canal de Radicación";
    }

    return "Canal de Recepción"
};

const renderColumns = () => {
    const estadosRadicadoSalida = ["Devolucion", "Publicacion rechazada", "Por Publicar", "Publicado", "Publicacion cerrada", "Aprobado"]

    const columns = [
        {
            name: "canal",
            label: getCanalType(),
            field: (row) =>
                row.tipoTramite === "Comunicación Interna" ? "Comunicación" : "Ventanilla",
            sortable: true,
        },
        {
            name: "idRadicacion",
            label: "Radicado",
            field: (row) => estadosRadicadoSalida.includes(row.estado) ? row.documentos?.radicadoSalidaAprobar : row.idRadicacion || "-",
            sortable: true,
            align: "center",
        },
        {
            name: "fechaRadicacion",
            label: "Fecha de Radicación",
            field: "fechaRadicacion",
            sortable: true,
            format: (value) => (value !== "" ? formatDateWithTimeAndMeridiem(value) : "-"),
            align: "center",
        },
        {
            name: "tiempoAsignado",
            label: "Tiempo Asignado",
            field: (row) =>
                row?.tiempoAsignado
                    ? `${row.tiempoAsignado} ${row.tipoTiemposAsignado === 'DIA' ? (row.tiempoAsignado === 1 ? 'Día' : 'Días') : (row.tiempoAsignado === 1 ? 'Hora' : 'Horas')}`
                    : "-",
            sortable: true,
            align: "center",
        },
        {
            name: "tiempoPorVencer",
            label: "Tiempo por Vencer",
            field: (row) =>
                row?.tiempoXVencer
                    ? row.tiempoXVencer < 0
                        ? "Vencido"
                        : row.tiempoXVencer + " " + (row?.tipoTiemposAsignado === 'DIA' ? 'Días' : 'Horas')
                    : "-",
            sortable: true,
            align: "center",
        },
        {
            name: "fecha",
            label: "Fecha de Vencimiento",
            field: (row) =>
                row?.fechaVencimiento
                    ? moment(row.fechaVencimiento).format("DD/MM/YYYY")
                    : "-",
            sortable: true,
            align: "center",
        },
        {
            name: "nombreAfectado",
            label: "Afectado",
            field: (row) =>
                row?.nombreAfectado && row?.documentoAfectado
                    ? row?.nombreAfectado + " - " +  row?.documentoAfectado
                    : "-",
            sortable: true,
            align: "center",
        },
        {
            name: "nombreRemitente",
            label: "Remitente",
            field: (row) =>
                row?.nombreRemitente && row?.documentoRemitente
                    ? row?.nombreRemitente + " - " +  row?.documentoRemitente 
                    : "-",
            sortable: true,
            align: "center",
        },
        {
            name: "municipio",
            label: "Ciudad - Departamento",
            align: "center",
            field: (row) =>
                row.pais
                    ? (row?.ciudad || row?.pais) +
                    " - " +
                    (row?.departamento || row?.pais)
                    : "-",
            sortable: true,
        },
        {
            name: "etapaProcesal",
            label: "Tipo Trámite",
            field: (row) => row?.tipoTramite || "-",
            sortable: true,
            align: "center",
        },
        {
            name: "trazabilidad",
            label: "Trazabilidad",
            field: "trazabilidad",
            align: "center",
        },
        {
            name: "estado",
            label: "Estado",
            field: "estado",
            sortable: true,
            align: "center",
        },
        {
            name: "acciones",
            label: "Acciones",
            field: "acciones",
            align: "center",
        },
    ];

    return columns;
};

onMounted(() => {
    const rolUser = auth.$state.userInfo.role
    if ((rolUser).toLowerCase().includes('gestionador')) {
        // @ts-ignore
        // formulario.value.idTipoTramite = 6
        isGestionador.value = true;
        renderColumns();
        filterService();
    } else {
        sendFilters(0, 20);
    }
});

const sendFilters = async (page: number, size: number, search = "") => {
    try {
        loadingTable.value = true;
        const bodyParam = {
            rol: auth.userInfo.role,
            userId: auth.userInfo.userid,
            size,
            page,
            buscador: search // Agregar parámetro de búsqueda
        };

        const response = await sgdeaAxios.get('/correspondencia/comunicacion/listadoComunicaciones', {
            params: bodyParam,
        });

        if (response.status === 200) {
            const filteredData = response.data.content.filter(item => item.estado !== "ELIMINADA");

            dataTable.value = filteredData.map(item => ({
                ...item,
                fechaRadicacion: item.fechaRadicacion || "-",
                estado: item.estado || "-",
                actions: "-",
                id: item?.idRadicacion || item?.radicadoEntrada,
                idTramite: item.id
            }));

            dataTableTotalRows.value = response.data.totalPages;
            allData.value = dataTable.value;

            if (auth.$state.userInfo.role === 'Asignador Responsable') {
                allData.value = dataTable.value.filter(radicado => radicado.estado === 'Por asignar');
            }
        }

        loadingTable.value = false;
        return { data: dataTable.value, total: response.data.totalElements || 0 };
    } catch (error) {
        loadingTable.value = false;
        console.error(error);
    }
};

let searchTimeout;
const handleSearch = (term: string) => {
    searchTerm.value = term;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        sendFilters(0, filasGrilla.value || 20, term);
    }, 500); // 500ms de delay
};

const handlePageChange = async (event) => {
    await sendFilters(event.page - 1, event.rowsPerPage, searchTerm.value);
    emit('rowsChange', dataTable.value);
};
const handleEditData = async ({ id, estado, idTramite }) => {
    if (estado === 'CREADA') {
        router.push({
            path: `/correspondencia/detalles-comunicaciones`,
            query: { id: id, isCreada: 'true' }
        });
    } else {
        router.push({
            path: `/correspondencia/detalle/${id}`,
            query: { isComunicacion: 'true', idTramite }
        });
    }
};;

const handleRowsPerPageChange = async (event) => {
    await sendFilters(event.page, event.rowsPerPage, searchTerm.value);
    emit('rowsChange', dataTable.value);
};

const filterByState = (estado) => {
    const filteredAllData = allData.value.filter(item => item.estado !== "ELIMINADA");

    if (!estado) {
        dataTable.value = filteredAllData;
    } else {
        dataTable.value = filteredAllData.filter((item) => item.estado === estado);
    }
};

defineExpose({
    sendFilters,
    filterByState
});
</script>
