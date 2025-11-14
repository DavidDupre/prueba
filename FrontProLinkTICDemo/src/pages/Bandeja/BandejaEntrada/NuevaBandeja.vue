<template>
  <section class="tw-p-4 tw-flex tw-flex-row tw-w-full">
    <main class="tw-w-full tw-p-0">
      <div class="tw-flex tw-justify-between">
        <h1 class="tw-text-3xl tw-font-bold">Mi Bandeja de Tareas</h1>
      </div>
      <section class="tw-flex tw-justify-center tw-mt-5">
        <div class="chart-container">
          <Chart ref="chartRef" :config="config" :key="dataDon" @click="changeBandeja" />
        </div>

        <div class="chart-container" :key="estadosKey" v-if="selectedBandeja">
          <Chart ref="chartRefStatus" :key="estadosKey" :config="configEstados" @click="changeFiltro" />
        </div>
      </section>
    </main>
  </section>

  <!-- Bandejas con v-show para mantener el estado sin recarga -->
  <div>
    <div v-show="selectedBandeja === 'PQRD'">
      <PQRD ref="bandejaPQRD" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Correspondencia'">
      <Correspondencia ref="bandejaCorrespondencia" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Comunicaciones Masivas'">
      <ComuMasivas ref="bandejaComuMasivas" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Facturas Administrativas'">
      <Facturacion ref="bandejaFacturacion" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Medicina Laboral'">
      <MedicinaLaboral ref="bandejaMedicina" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Comunicaciones Medicina'">
      <MLCOM ref="bandejaMedicinaCom" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Entes de Control'">
      <EntesDeControl ref="bandejaEntes" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Cuentas de Cobro'">
      <CuentasCobro ref="bandejaCuentas" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Comunicaciones Correspondencia'">
      <BandejaComuCorrespondencia ref="bandejaComuCorrespondencia" @pageChange="updateEstados"
        @rowsChange="updateEstados" />
    </div>
    <div v-show="selectedBandeja === 'Tutelas'">
      <BandejaTutelas ref="bandejaTutelas" @pageChange="updateEstados" @rowsChange="updateEstados" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Facturacion from "./BandejaFacturacion.vue";
import CuentasCobro from "./BandejaCTO.vue";
import PQRD from "./BandejaPQRD.vue";
import Correspondencia from "./BandejaCorrespondencia.vue";
import EntesDeControl from "./bandejaEntes.vue";
import MedicinaLaboral from "./bandejaMedicina.vue";
import ComuMasivas from "./BandejaComuMasivas.vue";
import MLCOM from "./bandejaMLCOM.vue";
import { nextTick, onMounted, ref } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import Chart from "src/components/Charts/chart_donuts.vue";
import BandejaComuCorrespondencia from "./BandejaComuCorrespondencia.vue";
import BandejaTutelas from "./BandejaTutelas.vue";
import { sgdeaAxios } from "src/services";

const showModal = ref(false);
const auth = useAuthStore();
const selectedBandeja = ref();
const savedEstadosAmount = ref({});
const bandejaFacturacion = ref();
const estadosKey = ref(0);
const bandejaCuentas = ref();
const bandejaPQRD = ref();
const bandejaEntes = ref();
const bandejaMedicina = ref();
const bandejaMedicinaCom = ref();
const bandejaCorrespondencia = ref();
const bandejaComuMasivas = ref();
const bandejaComuCorrespondencia = ref();
const bandejaTutelas = ref();

const chartRef = ref(null);
const chartRefStatus = ref(null);
const rolesPermitidos = [
  "Gestionador",
  "Revisor",
  "Aprobador",
  "Administrador de trámite",
];
const rolesPermitidosCom = [
  "Gestionador",
  "Revisor",
  "Aprobador",
  "Administrador de trámite",
  "Asignador Responsable",
  "Asignador",
];
const tieneRolPermitido = rolesPermitidos.some((role) =>
  auth.userInfo.role.includes(role)
);
const tieneRolPermitidoCom = rolesPermitidosCom.some((role) =>
  auth.userInfo.role.includes(role)
);
const dataDon = ref(0);
const isExternoOrProveedor = ref(false);
const savedData = ref<Record<string, any[]>>({});
const dataChart = ref({
  labels: [],
  datasets: [
    {
      label: "Unidades",
      data: [],
      backgroundColor: [
        "rgb(255, 99, 132)", // Red
        "rgb(54, 162, 235)", // Blue
        "rgb(255, 205, 86)", // Yellow
        "rgb(75, 192, 192)", // Teal
        "rgb(153, 102, 255)", // Purple
        "rgb(255, 159, 64)", // Orange
        "rgb(201, 203, 207)", // Grey
        "rgb(255, 99, 71)", // Tomato
        "rgb(255, 140, 0)", // Dark Orange
        "rgb(0, 128, 0)", // Green
        "rgb(0, 0, 255)", // Blue
        "rgb(255, 20, 147)", // Deep Pink
        "rgb(255, 228, 196)", // Bisque
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(240, 230, 140)", // Khaki
        "rgb(128, 0, 128)", // Purple
      ],
      hoverOffset: 4,
    },
  ],
});

const dataChartEstados = ref({
  labels: [],
  datasets: [
    {
      label: "Unidades",
      data: [],
      backgroundColor: [
        "rgb(255, 99, 132)", // Red
        "rgb(54, 162, 235)", // Blue
        "rgb(255, 205, 86)", // Yellow
        "rgb(75, 192, 192)", // Teal
        "rgb(153, 102, 255)", // Purple
        "rgb(255, 159, 64)", // Orange
        "rgb(201, 203, 207)", // Grey
        "rgb(255, 99, 71)", // Tomato
        "rgb(255, 140, 0)", // Dark Orange
        "rgb(0, 128, 0)", // Green
        "rgb(0, 0, 255)", // Blue
        "rgb(255, 20, 147)", // Deep Pink
        "rgb(255, 228, 196)", // Bisque
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(240, 230, 140)", // Khaki
        "rgb(128, 0, 128)", // Purple
      ],
      hoverOffset: 4,
    },
  ],
});

const totalTextPluginEstados = {
  id: "totalText",
  beforeDraw(chart: any) {
    const { ctx, width, height } = chart;
    const total = dataChartEstados.value.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0
    );

    ctx.save();
    ctx.font = "bold 2.5rem Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = `${total}`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(`${total}`, width / 2 - 5, height / 2);
    ctx.restore();
  },
};

const totalTextPlugin = {
  id: "totalTextPluginEstados",
  beforeDraw(chart: any) {
    const { ctx, width, height } = chart;
    const total = dataChart.value.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0
    );

    ctx.save();
    ctx.font = "bold 2.5rem Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(` ${total}`, width / 2 - 10, height / 2);
    ctx.restore();
  },
};

const config = ref({
  type: "doughnut",
  data: dataChart.value, // Aquí no hay problema, pero si hay errores, usar watchEffect
  options: {
    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      totalText: true,
    },
  },
  plugins: [totalTextPlugin],
});

const configEstados = ref({
  type: "doughnut",
  data: dataChartEstados.value,
  options: {
    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      totalTextPluginEstados: true,
    },
  },
  plugins: [totalTextPluginEstados],
});

onMounted(async () => {
  await userData();
  await getInitialData();
});


const userData = async () => {
  const response = await sgdeaAxios.get(`/usuarios/${auth.userInfo.userid}`);
  if (response.status === 200 || response.status === 201) {
    isExternoOrProveedor.value =
      response.data.tipoUsuario === "Externo" ||
      response.data.tipoUsuario === "Proveedor";
  }
};

const getRoleType = () => {
  const role = auth.$state.userInfo.role?.toLowerCase() || '';

  switch (true) {
    case role.includes("administrador") || role.includes("asignador"):
      return "ASIGNADOR";
    case role.includes("revisor"):
      return "REVISOR";
    case role.includes("gestionador_escalador"):
      return "GESTIONADOR_ESCALADOR";
    case role.includes("aprobador"):
      return "APROBADOR";
    default:
      return auth.$state.userInfo.role?.toUpperCase() || '';
  }
};

async function getInitialData() {
  showModal.value = true;
  // @ts-expect-error
  const modulosUsuario = [useAuthStore().$state.userInfo.modulo];

  const newSeries = [];
  const newLabels = [];

  try {
    // @ts-expect-error
    await Promise.allSettled(
      modulosUsuario.map(async (modulo) => {
        if (modulo === "Tutelas" || modulo === "Todos") {
          selectedBandeja.value = "Tutelas";
          await nextTick();
          const data = await bandejaTutelas.value.getAllTutelas();
          if (data.tutelas && data.tutelas?.length) {
            newLabels.push("Tutelas");
            newSeries.push(data.totalElements);
            savedEstadosAmount.value["Tutelas"] = countPropertyOccurrences(
              "estado",
              data?.tutelas
            );
            savedData.value["Tutelas"] = data.data;
          }
          selectedBandeja.value = null;
        }

        if (
          (modulo == "Facturas Administrativas" || modulo == "Todos") &&
          !auth.$state.userInfo.role?.toLowerCase().includes("publicador")
        ) {
          selectedBandeja.value = "Facturas Administrativas";
          await nextTick();
          const data = await bandejaFacturacion.value.getData(0, 100);

          if (data?.data && data?.data?.length) {
            let total = data.total;
            let estados = countPropertyOccurrences("estado", data?.data);

            // Si es Asignador Responsable, filtramos el total
            if (auth.userInfo.role === "Asignador Responsable") {
              total = ["En asignación", "Por asignar"].reduce((sum, estado) => {
                return sum + (estados[estado] || 0);
              }, 0);
            }

            newSeries.push(total);
            newLabels.push("Facturas Administrativas");
            savedEstadosAmount.value["Facturas Administrativas"] = estados;
            savedData.value["Facturas Administrativas"] = data.data;
          }
          selectedBandeja.value = null;
        }
        if (
          (modulo == "Facturas Administrativas" || modulo == "Todos") &&
          !auth.$state.userInfo.role?.toLowerCase().includes("publicador")
        ) {
          selectedBandeja.value = "Cuentas de Cobro";
          await nextTick();
          const data = await bandejaCuentas.value.getItems(0, 100);
          if (data.data && data.data?.length) {
            newSeries.push(data.total);
            newLabels.push("Cuentas de Cobro");
            savedEstadosAmount.value["Cuentas de Cobro"] =
              countPropertyOccurrences("estado", data?.data);
            savedData.value["Cuentas de Cobro"] = data.data;
          }
          selectedBandeja.value = null; // Reset the selected bandeja
        }

        if (modulo == "PQRD" || modulo == "Todos") {
          selectedBandeja.value = "PQRD";
          await nextTick();

          let counterData = await bandejaPQRD.value.getData(0, 100, "", "", true);

          let hasData = counterData.totalContadores > 0;
          let fullData = null;

          if (!hasData) {
            fullData = await bandejaPQRD.value.getData(0, 100, "", "", false);
            hasData = fullData.total > 0;
          }

          if (hasData) {
            const estadosCount = {};

            if (counterData.contadores && counterData.contadores.length > 0) {
              counterData.contadores.forEach(contador => {
                estadosCount[contador.estado] = contador.contador;
              });
            }

            else if (fullData?.data?.length > 0) {
              const countedEstados = countPropertyOccurrences("estado", fullData.data);
              Object.assign(estadosCount, countedEstados);
              counterData.total = fullData.total;
            }

            newSeries.push(counterData.total);
            newLabels.push("PQRD");
            savedEstadosAmount.value["PQRD"] = estadosCount;

            if (!fullData) {
              fullData = await bandejaPQRD.value.getData(0, 100, "", "", false);
            }
            savedData.value["PQRD"] = fullData.data;
          }

          selectedBandeja.value = null;
        }

        if (modulo === "Correspondencia" || modulo === "Todos") {
          selectedBandeja.value = "Correspondencia";
          await nextTick();

          // Determina el path según el rol del usuario
          const isPublicador = auth.$state.userInfo.role
            ?.toLowerCase()
            .includes("publicador");

          const path = isPublicador
            ? "/correspondencia/bandejaPublicador"
            : `/correspondencia/bandeja/${getRoleType()}`;

          try {
            const data = await bandejaCorrespondencia.value.fetchData(path);
            newSeries.push(data.total);
            newLabels.push("Correspondencia");
            savedEstadosAmount.value["Correspondencia"] =
            countPropertyOccurrences("estado", data?.data);
            savedData.value["Correspondencia"] = data.data;
          } catch (error) {
            console.error(error);
          }

          selectedBandeja.value = null; // Reset the selected bandeja
        }

        if (tieneRolPermitidoCom) {
          if (modulo == "Comunicaciones Masivas" || modulo == "Todos") {
            selectedBandeja.value = "Comunicaciones Masivas";
            await nextTick();
            const data =
              await bandejaComuMasivas.value.getTramitesComunicacionales(0, 100);

            if (data.data && data.data?.length) {
              newSeries.push(data.total);
              newLabels.push("Comunicaciones Masivas");
              savedEstadosAmount.value["Comunicaciones Masivas"] =
                countPropertyOccurrences("estado", data?.data);
              savedData.value["Comunicaciones Masivas"] = data.data;
            }

            selectedBandeja.value = null; // Reset the selected bandeja
          }
        }

        if (modulo == "Entes de Control" || modulo == "Todos") {
          selectedBandeja.value = "Entes de Control";
          await nextTick();

          // Primera llamada para contadores
          let counterData = await bandejaEntes.value.getData(true, true);

          let hasData = counterData.contadores?.length > 0 || counterData.total > 0;
          let fullData = null;

          if (!hasData) {
            // Segunda llamada para verificación con datos reales
            fullData = await bandejaEntes.value.getData(true, false);
            hasData = fullData.data?.length > 0;
          }

          if (hasData) {
            const estadosCount = {};

            // Procesamos contadores si existen
            if (counterData.contadores?.length > 0) {
              counterData.contadores.forEach(contador => {
                if (contador.estado) {
                  estadosCount[contador.estado] = contador.contador;
                }
              });
            }
            // Si no hay contadores pero sí datos completos, contamos manualmente
            else if (fullData?.data?.length > 0) {
              const countedEstados = countPropertyOccurrences("estado", fullData.data);
              Object.assign(estadosCount, countedEstados);
            }

            newSeries.push(counterData.total || fullData?.data?.length || 0);
            newLabels.push("Entes de Control");
            savedEstadosAmount.value["Entes de Control"] = estadosCount;

            // Obtenemos todos los datos si no los tenemos ya
            if (!fullData) {
              fullData = await bandejaEntes.value.getData(true, false);
            }
            savedData.value["Entes de Control"] = fullData.data;
          }

          selectedBandeja.value = null;
        }

        if (modulo == "Medicina Laboral" || modulo == "Todos") {
          selectedBandeja.value = "Medicina Laboral";
          await nextTick();

          let counterData = await bandejaMedicina.value.sendFilters(0, 100000, true);

          let hasData = counterData.contadoresEstado?.length > 0;
          let fullData = null;

          if (!hasData) {
            fullData = await bandejaMedicina.value.sendFilters(0, 20, false);
            hasData = fullData.data?.length > 0;
          }

          if (hasData) {
            const estadosCount = {};

            if (counterData.contadoresEstado?.length > 0) {
              counterData.contadoresEstado.forEach(contador => {
                if (contador.estado) {
                  estadosCount[contador.estado] = contador.contador;
                }
              });
            }
            else if (fullData?.data?.length > 0) {
              const countedEstados = countPropertyOccurrences("estado", fullData.data);
              Object.assign(estadosCount, countedEstados);
            }

            const total = counterData.contadoresEstado?.reduce((sum, item) => sum + (item.contador || 0), 0)
              || fullData?.data?.length
              || 0;

            newSeries.push(total);
            newLabels.push("Medicina Laboral");
            savedEstadosAmount.value["Medicina Laboral"] = estadosCount;

            if (!fullData) {
              fullData = await bandejaMedicina.value.sendFilters(0, 20, false);
            }
            savedData.value["Medicina Laboral"] = fullData.data;
          }

          selectedBandeja.value = null;
        }

        if (tieneRolPermitido) {
          if (modulo == "ComunicacionML" || modulo == "Todos" || isExternoOrProveedor.value) {
            selectedBandeja.value = "Comunicaciones Medicina";
            await nextTick();

            // Primera llamada para contadores
            let counterData = await bandejaMedicinaCom.value.sendFilters(0, 100, true);

            let hasData = counterData.contadores?.length > 0 || counterData.total > 0;
            let fullData = null;

            if (!hasData) {
              // Segunda llamada para verificación con datos reales
              fullData = await bandejaMedicinaCom.value.sendFilters(0, 100, false);
              hasData = fullData.data?.length > 0;
            }

            if (hasData) {
              const estadosCount = {};

              // Procesamos contadores si existen
              if (counterData.contadores?.length > 0) {
                counterData.contadores.forEach(contador => {
                  if (contador.estado) {
                    estadosCount[contador.estado] = (estadosCount[contador.estado] || 0) + contador.contador;
                  }
                });
              }
              // Si no hay contadores pero sí datos completos, contamos manualmente
              else if (fullData?.data?.length > 0) {
                const countedEstados = countPropertyOccurrences("estado", fullData.data);
                Object.assign(estadosCount, countedEstados);
              }

              newLabels.push("Comunicaciones Medicina");
              newSeries.push(counterData.total || fullData?.data?.length || 0);
              savedEstadosAmount.value["Comunicaciones Medicina"] = estadosCount;

              // Obtenemos todos los datos si no los tenemos ya
              if (!fullData) {
                fullData = await bandejaMedicinaCom.value.sendFilters(0, 100, false);
              }
              savedData.value["Comunicaciones Medicina"] = fullData.data;
            }

            selectedBandeja.value = null;
          }
        }

        if (tieneRolPermitidoCom) {
          if (modulo === "Correspondencia" || modulo === "Todos") {
            selectedBandeja.value = "Comunicaciones Correspondencia";
            await nextTick();
            const data = await bandejaComuCorrespondencia.value.sendFilters(0, 100);
            if (data.data && data.data?.length) {
              // Filtrar los ELIMINADA antes de contar
              const filteredData = data.data.filter(item => item.estado !== "ELIMINADA");
              newLabels.push("Comunicaciones Correspondencia");
              newSeries.push(filteredData.length);
              savedEstadosAmount.value["Comunicaciones Correspondencia"] =
                countPropertyOccurrences("estado", filteredData);
              savedData.value["Comunicaciones Correspondencia"] = filteredData;
            }
            selectedBandeja.value = null;
          }
        }
      })
    );

    dataChart.value.labels.push(...newLabels);
    dataChart.value.datasets[0].data = [
      ...dataChart.value.datasets[0].data,
      ...newSeries,
    ];
    dataDon.value++;
  } catch (error) {
    console.error(error);
  } finally {
    // Hide loading modal when everything is done
    showModal.value = false;
  }
}

//
const bandejasCargadas = ref(new Set());

const changeBandeja = (event) => {
  if (chartRef.value) {
    const chartData = chartRef.value.getChartDataAtEvent(event);
    if (chartData) {
      const bandeja = chartData.label;
      selectedBandeja.value = bandeja;
      estadosKey.value++;

      // Ya fue cargada, solo mostrar sin recargar
      if (bandejasCargadas.value.has(bandeja)) {
        updateChartEstados(bandeja);
        return;
      }

      // Si no fue cargada, no hacemos fetch nuevo aquí (ya fue hecho en mounted)
      updateChartEstados(bandeja);
      bandejasCargadas.value.add(bandeja);
    }
  }
};

const changeFiltro = (event) => {
  const chartData = chartRefStatus.value.getChartDataAtEvent(event);

  if (
    selectedBandeja.value == "Facturas Administrativas" &&
    auth.userInfo.role === "Asignador Responsable"
  ) {
    // Solo permitimos filtrar por los estados permitidos
    if (["En asignación", "Por asignar"].includes(chartData.label)) {
      bandejaFacturacion.value.filterByState(chartData.label);
    }
  }
  if (selectedBandeja.value == "Facturas Administrativas") {
    // Validación adicional para Gestionador
    if (
      auth.userInfo.role === "Gestionador" &&
      ["En asignación", "Por asignar"].includes(chartData.label)
    ) {
      return; // No hace nada si intenta filtrar por estados no permitidos
    }
    bandejaFacturacion.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Facturas Administrativas") {
    bandejaFacturacion.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Cuentas de Cobro") {
    bandejaCuentas.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "PQRD") {
    bandejaPQRD.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Correspondencia") {
    bandejaCorrespondencia.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Comunicaciones Masivas") {
    bandejaComuMasivas.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Entes de Control") {
    bandejaEntes.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Medicina Laboral") {
    bandejaMedicina.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Comunicaciones Medicina") {
    bandejaMedicinaCom.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Comunicaciones Correspondencia") {
    bandejaComuCorrespondencia.value.filterByState(chartData.label);
  } else if (selectedBandeja.value == "Tutelas") {
    bandejaTutelas.value.filterByState(chartData.label);
  }
};

function updateChartEstados(bandeja) {
  // Usamos SOLO los contadores guardados, no combinamos con datos crudos
  const estados = savedEstadosAmount.value[bandeja] || {};

  let keys = Object.keys(estados);
  let values = Object.values(estados);

  // Filtramos según el rol del usuario
  if (auth.userInfo.role === "Gestionador") {
    keys = keys.filter((key) =>
      key !== "Por asignar" &&
      key !== "Por publicar" &&
      key !== "ELIMINADA" &&
      key !== "Publicacion" &&
      key !== "PUBLICACION"
    );
    values = keys.map((key) => estados[key]);
  }

  if (auth.userInfo.role === "Aprobador") {
    keys = keys.filter((key) =>
      key !== "Por revisar"
    );
    values = keys.map((key) => estados[key]);
  }
  // Actualizamos la gráfica
  dataChartEstados.value.labels = keys;
  dataChartEstados.value.datasets[0].data = values;
  // Forzamos actualización del componente
  estadosKey.value++;
}

function countPropertyOccurrences(propertyName, objectsArray) {
  // Initialize an empty object to store the counts
  const occurrences = {};
  let propertyArray;

  if (propertyName.includes(".")) {
    propertyArray = propertyName.split(".");
  }

  if (objectsArray && objectsArray.length > 0) {
    // Iterate over each object in the array
    for (const obj of objectsArray) {
      // Get the value of the specified property
      const value = propertyArray
        ? obj[propertyArray[0]][propertyArray[1]]
        : obj[propertyName];
      // If the value is not null or undefined, proceed
      if (value !== null && value !== undefined) {
        // If the value is already a key in the occurrences object, increment its count
        if (occurrences[value]) {
          occurrences[value]++;
        } else {
          // Otherwise, add the value as a key with an initial count of 1
          occurrences[value] = 1;
        }
      }
    }
  }

  return occurrences;
}
function updateEstados(data) {
  let estados = countPropertyOccurrences("estado", data);

  if (selectedBandeja.value === "Facturas Administrativas") {
    const estadosFiltrados = {};

    Object.keys(estados).forEach((estado) => {
      if (auth.userInfo.role === "Asignador Responsable") {
        if (["En asignación", "Por asignar"].includes(estado)) {
          estadosFiltrados[estado] = estados[estado];
        }
      } else if (auth.userInfo.role === "Gestionador") {
        if (!["En asignación", "Por asignar"].includes(estado)) {
          estadosFiltrados[estado] = estados[estado];
        }
      } else if (auth.userInfo.role === "Aprobador") {
        if (estado === "Por aprobar") {
          // Solo incluir estado "Por aprobar"
          estadosFiltrados[estado] = estados[estado];
        }
      } else {
        estadosFiltrados[estado] = estados[estado]; // Otros roles ven todos
      }
    });

    estados = estadosFiltrados;
  }
}
</script>

<style>
.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  height: 30vh;
  width: 30vw;
}

.bandeja-container {
  display: none;
}

.bandeja-container[v-show="true"] {
  display: block;
}
</style>
