<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Tutelas Radicadas</span>
    </div>
    <Table :TABLE_BODY="filteredTutelas" :TABLE_HEADER="columns" :pagination="pagination" :total-pages="totalPages"
           class="q-pa-md" key-id="idRadicado" select="multiple" @handlePageChange="handlePageChange"
           @handleRowsPerPageChange="handleRowsPerPageChange" @handle-edit-data="abrirDetalle" @search-change="handleSearch" @sortChange="handleSort"/>
  </q-card>
  <!-- este modal para la carga -->
  <q-dialog v-model="showModal">
    <q-card class="q-py-xl q-px-xl">
      <div class="q-mx-auto text-center">
        <p class="text-bold tw-text-xl q-mx-auto tw-border-[10px] tw-border-yellow-400 tw-rounded-full tw-w-24 q-pa-lg">
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
</template>

<script lang="ts" setup>
import { Tutelas } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Table from "src/pages/SGDA/ClasificacionDocumental/Tutelas/Table.vue";
import { useAuthStore } from "stores/auth.store";
import { toast } from "src/helpers/toast";
import { formatDateWithTimeAndMeridiem, formatDateWithTimeAndMeridiemWithInputFormat } from "src/helpers/formtDate";
const fullTutelaUrl = ref('');
const idRadicadoFilter = ref('');

async function handleSearch(searchTerm: string) {
  // Reiniciamos la paginación para mostrar los resultados desde la página 1
  pagination.value.page = 1;
  currPage.value = 0;

  // Actualizamos el valor del filtro
  idRadicadoFilter.value = searchTerm;

  // Volvemos a llamar a la función que trae los datos, ahora con el filtro aplicado
  await getAllTutelas();
}

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
  emit('pageChange', filteredTutelas.value)
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;

  await getAllTutelas(fullTutelaUrl.value);
  emit('rowsChange', filteredTutelas.value)
}

const emit = defineEmits(['pageChange', 'rowsChange'])
const router = useRouter();
const { getUserInfo } = useAuthStore();
const userInfo = ref()
const showModal = ref(false);
const allTutelas = ref([]);
const filteredTutelas = ref([])
const totalPages = ref(0)
const opForRadicados = ref()
const opForCoProc = ref()
const columns: any = [
  {
    name: "codigo",
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
    name: "fechaIngreso",
    label: "Notificación positiva",
    field: () => 'Test Value',
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
   name: "tiempoVencer",
   label: "Tiempo por Vencer",
   align: 'center',
   field: (row) => {
     if (row.tiempoVencer === "0 días 0 horas y 0 minutos") {
       return "Vencido";
     }
     // Agrega una coma después de "días" si la cadena contiene "días "
     // Por ejemplo: "0 días 0 horas..." se convierte en "0 días, 0 horas..."
     if (row.tiempoVencer.includes(' días ')) {
        return row.tiempoVencer.replace(' días ', ' días, ');
     }
     // Si no contiene "días", devuelve el valor original
     return row.tiempoVencer;
   },
   sortable: true,
 },
  {
    name: "fechaVencimiento",
    label: "Fecha de Vencimiento",
    align: 'center',
    field: "fechaVencimiento",
    sortable: true,
  },
  {
    name: "nombresAfectado",
    label: "Nombre - Identificación Afectado",
    field: (row) => row.nombresAfectado ? row.nombresAfectado + " - " + row.identificacionAfectado : '-',
    align: 'center',
    sortable: true,
  },
  {
    name: "nombresRemitente",
    label: "Nombre - Identificación Accionante",
    field: (row) => row.nombresRemitente ? row.nombresRemitente + " - " + row.identificacionRemitente : '-',
    align: 'center',
    sortable: true,
  },
  {
    name: "ciudad",
    label: "Ciudad - Departamento",
    align: 'center',
    field: (row) => row.ciudad + " / " + row.departamento,
    sortable: true,
  },
  {
    name: "etapaProcesal",
    label: "Tipo Trámite / Etapa Procesal",
    field: row => ((row.tipoTramite && row.etapaProcesal) ? ((row.tipoTramite || '-') + ' / ' + (row.etapaProcesal || '-')) : 'N/A'),
    align: 'center',
    sortable: true,
  },
  {
    name: "abogado",
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

function formatearFechaIngreso(fechaOriginal) {
  const [fecha, hora] = fechaOriginal.split(' ');

  const [anio, mes, dia] = fecha.split('-');
  const fechaFormateada = `${dia}/${mes}/${anio} ${hora}`;
  return fechaFormateada;
}


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

async function getAllTutelas(path?) {
  if (!path) {
    const rolesWithParam = ["Asignador Responsable", "Administrador de Trámite"];

    const rolParam = rolesWithParam.includes(userInfo.value.role)
      ? `&rol=${userInfo.value.role}`
      : "";
    path = `/tutela/info?usuario=${userInfo.value.username}${rolParam}`;
  }

  if (idRadicadoFilter.value) {
    path += `&idRadicado=${idRadicadoFilter.value}`;
  }

  path = path + `&page=${currPage.value}&size=${pagination.value.rowsPerPage}`
  const { data } = await sgdeaAxios.get<Tutelas[]>(path);
  // @ts-expect-error
  totalPages.value = data?.totalPages
  // @ts-expect-error
  allTutelas.value = data?.tutelas?.map((it) => ({
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
  return data
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
  // await sgdeaAxios.put(`/tutela/registrarCasoVisto/${userInfo.value.userid}/${idTutela}`)
}

const opEtapaProcesal = ref()
const opEP = ref()
const opOficinas = ref()
const opOfi = ref()

function filterByState(estado) {
  if (!estado) {
    filteredTutelas.value = allTutelas.value
  } else {
    filteredTutelas.value = allTutelas.value.filter((item) => item.estado == estado)
  }
}

defineExpose({
  getAllTutelas,
  filterByState
})
function handleSort(newPagination) {
  pagination.value = newPagination
  const { sortBy, descending } = newPagination

  if (sortBy) {
    filteredTutelas.value.sort((a, b) => {
      const fieldA = a[sortBy]
      const fieldB = b[sortBy]

      if (fieldA == null || fieldB == null) return 0

      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return descending ? fieldB - fieldA : fieldA - fieldB
      }

      return descending
        ? String(fieldB).localeCompare(String(fieldA))
        : String(fieldA).localeCompare(String(fieldB))
    })
  }
}
</script>

<style>
label {
  padding: 0px 10px;
}
</style>
