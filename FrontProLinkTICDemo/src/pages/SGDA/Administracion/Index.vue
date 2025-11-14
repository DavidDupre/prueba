<template>
  <div style="font-size: 30px; font-weight: bold;">
    Módulo histórico
  </div>
  <q-form ref="CotizacionesForm" class="tw-mt-6" @submit="handleSearch">
    <q-card class="tw-pt-7 tw-pb-6 tw-rounded-2xl">
      <div class="row tw-flex tw-justify-between tw-items-center tw-gap-4 tw-px-8 tw-mb-4">
        <div style="font-size: 25px; font-weight: bold;">
          Filtrar por
        </div>
        <div>

          <q-btn class="tw-mb-4" color="primary" icon="fa-solid fa-sliders">
            <q-popup-proxy v-model="showModalAction" transition-hide="scale" transition-show="scale">
              <q-card class="tw-pt-7 tw-pb-6">
                <div class="row tw-gap-4 tw-px-8 [&>*]:tw-mr-4 tw-flex tw-justify-start tw-mb-4">
                  <div class="col-12 tw-flex tw-justify-between">
                    <!--                              <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
                    <!--                                <p class="tw-text-label tw-font-bold" style="color: black;">-->
                    <!--                                  Expediente-->
                    <!--                                </p>-->
                    <!--                                <q-input v-model="filtersSearch.expediente" :rules="[-->
                    <!--                                  (val) => !!val || 'Este campo es requerido',-->
                    <!--                                  (val) => val.length <= 100 || 'Máximo 100 caracteres permitidos',-->
                    <!--                                ]" dense outlined placeholder="Ingrese un texto"/>-->
                    <!--                              </div>-->
                    <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">
                      <p class="tw-text-label tw-font-bold" style="color: black;">
                        Siniestro
                      </p>
                      <q-input v-model="filtersSearch.siniestro" :rules="[
                                  (val) => !!val || 'Este campo es requerido',
                                  (val) => val.length <= 100 || 'Máximo 100 caracteres permitidos',
                                ]" dense outlined placeholder="Ingrese un texto"/>
                    </div>
                    <!--                              <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
                    <!--                                <p class="tw-text-label tw-font-bold" style="color: black;">-->
                    <!--                                  N° Factura-->
                    <!--                                </p>-->
                    <!--                                <q-input v-model="filtersSearch.factura" :rules="[-->
                    <!--                                  (val) => !!val || 'Este campo es requerido',-->
                    <!--                                  (val) => val.length <= 100 || 'Máximo 100 caracteres permitidos',-->
                    <!--                                ]" dense outlined placeholder="Ingrese un texto"/>-->
                    <!--                              </div>-->
                  </div>
                </div>

                <div class="row tw-gap-4 tw-px-8 [&>*]:tw-mr-4 tw-flex tw-justify-start tw-mb-4">
                  <div class="col-12 tw-flex tw-justify-between">
                    <!--                    <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
                    <!--                      <p class="tw-text-label tw-font-bold" style="color: black;">-->
                    <!--                        Fecha Radicado-->
                    <!--                      </p>-->
                    <!--                      <q-input v-model="filtersSearch.fechaInicial" :rules="[-->
                    <!--                                  (val) => !!val || 'La fecha es requerida',-->
                    <!--                                  (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Formato de fecha inválido (DD/MM/AAAA)',-->
                    <!--                                ]" dense label="dd/mm/aaaa" mask="##/##/####"-->
                    <!--                               outlined>-->
                    <!--                        <template v-slot:append>-->
                    <!--                          <q-icon class="cursor-pointer" name="event">-->
                    <!--                            <q-popup-proxy>-->
                    <!--                              <q-date v-model="filtersSearch.fechaInicial" mask="DD/MM/YYYY"/>-->
                    <!--                            </q-popup-proxy>-->
                    <!--                          </q-icon>-->
                    <!--                        </template>-->
                    <!--                      </q-input>-->
                    <!--                    </div>-->

                    <!--                              <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
                    <!--                                <p class="tw-text-label tw-font-bold" style="color: black;">-->
                    <!--                                  Fecha final-->
                    <!--                                </p>-->
                    <!--                                <q-input v-model="filtersSearch.fechaFinal" :rules="[-->
                    <!--                                  (val) => !!val || 'La fecha es requerida',-->
                    <!--                                  (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Formato de fecha inválido (DD/MM/AAAA)',-->
                    <!--                                ]" dense label="dd/mm/aaaa" mask="##/##/####"-->
                    <!--                                         outlined>-->
                    <!--                                  <template v-slot:append>-->
                    <!--                                    <q-icon class="cursor-pointer" name="event">-->
                    <!--                                      <q-popup-proxy>-->
                    <!--                                        <q-date v-model="filtersSearch.fechaFinal" mask="DD/MM/YYYY"/>-->
                    <!--                                      </q-popup-proxy>-->
                    <!--                                    </q-icon>-->
                    <!--                                  </template>-->
                    <!--                                </q-input>-->
                    <!--                              </div>-->

                    <!--                    <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
                    <!--                      <p class="tw-text-label tw-font-bold" style="color: black;">-->
                    <!--                        Fecha de Consulta-->
                    <!--                      </p>-->
                    <!--                      <q-input outlined v-model="filtersSearch.date3" mask="##/##/####" dense label="dd/mm/aaaa" :rules="[-->
                    <!--                        (val) => !!val || 'La fecha es requerida',-->
                    <!--                        (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Formato de fecha inválido (DD/MM/AAAA)',-->
                    <!--                      ]">-->
                    <!--                        <template v-slot:append>-->
                    <!--                          <q-icon name="event" class="cursor-pointer">-->
                    <!--                            <q-popup-proxy>-->
                    <!--                              <q-date v-model="filtersSearch.date3" mask="DD/MM/YYYY" />-->
                    <!--                            </q-popup-proxy>-->
                    <!--                          </q-icon>-->
                    <!--                        </template>-->
                    <!--                      </q-input>-->
                    <!--                    </div>-->
                  </div>
                </div>

                <div :class="customFilterSelected.length > 0
                            ? 'tw-border-t tw-border-gray-300'
                            : 'tw-border-t-0'
                            " class="row tw-px-8 tw-flex tw-justify-start">
                  <div :class="customFilterSelected.length > 0
                              ? 'tw-border-t tw-border-gray-300'
                              : 'tw-border-t-0'
                              " class="row tw-px-8 tw-flex tw-justify-start tw-w-full">
                    <div v-for="cf in customFilterSelected" :key="cf.value" class="col-4 [&>*]:tw-mr-4 tw-my-5">
                      <p class="tw-text-label">
                        {{ cf.label }}
                      </p>
                      <q-input v-if="cf.type === 'text'" v-model="filtersSearch[cf.value]" dense label="Inserte"
                               outlined/>
                      <q-input v-if="cf.type === 'date'" v-model="filtersSearch[cf.value]" class="tw-rounded-lg" dense
                               outlined
                               type="date"></q-input>
                    </div>
                  </div>
                </div>

                <div class="row tw-flex tw-justify-center tw-gap-2 col-12 [&>*]:tw-p-2">
                  <q-btn class="tw-rounded-lg tw-py-6 tw-px-2 tw-min-w-[120px]" color="accent" label="Limpiar filtros"
                         textColor="secondary" @click="resetForm"/>
                  <q-btn class="tw-rounded-lg tw-py-6 tw-px-2 tw-min-w-[120px]" color="primary" label="Aplicar"
                         @click="showModalAction = false"/>
                </div>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>

      <div class="row tw-gap-4 tw-px-8 [&>*]:tw-mr-4 tw-flex tw-justify-start tw-mb-4">
        <div class="col-12 tw-flex tw-justify-between">
          <div class="tw-flex-1 tw-bg-blue-500 tw-p-4 tw-font-bold">
            <p class="tw-text-label" style="color: black;">Número de radicado</p>
            <q-input v-model="filtersSearch.numeRad" dense label="Inserte" outlined
            />
          </div>
          <!--          <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">-->
          <!--            <label class="tw-w-full">-->
          <!--              <span class="tw-text-label tw-font-bold" style="color: black;">Tipo de documento</span>-->
          <!--              <q-select v-model="filtersSearch.tipoDocumento" :options="opTipoDocumento" class="tw-rounded-lg" dense-->
          <!--                        label="Seleccione" map-options outlined/>-->
          <!--            </label>-->
          <!--          </div>-->
          <div class="tw-flex-1 tw-bg-blue-500 tw-p-4">
            <p class="tw-text-label tw-font-bold" style="color: black;">Número de documento</p>
            <q-input v-model="filtersSearch.numeDoc" :rules="[
              val => !!val ? /^\d+$/.test(val) || 'Solo caracteres numéricos' : true,
            ]" dense label="Inserte" outlined/>
          </div>
        </div>
      </div>

      <div class="row tw-flex tw-justify-center tw-gap-2 col-12 [&>*]:tw-p-2">
        <q-btn class="tw-rounded-lg tw-py-6 tw-px-2 tw-min-w-[120px]" color="accent" label="Limpiar filtros"
               textColor="secondary" @click="resetForm"/>
        <q-btn class="tw-rounded-lg tw-py-6 tw-px-2 tw-min-w-[120px]" color="primary" label="Buscar" type="submit" :loading="handleSubmitIsLoading"/>
      </div>
    </q-card>
  </q-form>

  <section v-if="load">
    <p class="tw-text-2xl tw-font-bold tw-my-4">Detalle de los documentos</p>

    <div v-if="Object.keys(tramites).length > 0">
      <q-expansion-item v-for="(docs, tramite, index) in tramites" :key="index" :header-class="'bg-white'"
                        class="tw-m-4">
        <template v-slot:header>
          <q-item-section>
            <p><b>Trámite:</b> {{ labletramite[docs.tramite] }}</p>
            <p><b>Cantidad registros:</b> {{ docs.total }}</p>
          </q-item-section>

          <!--     <q-item-section v-for="(elm,position,index) in docs.docs" :key="elm.llave">
           <p>
              <b> Radicado :</b>  {{ elm.d }}
            </p>
          </q-item-section> -->
        </template>

        <q-card v-for="(elems, n) in docs.docs" :key="n" class="q-pa-md full-width">
          <!-- Contenedor tipo grid -->
          <div class="row full-width">
            <div class="col-6 q-pa-md">
              <div v-for="property in propertyKeys(elems).filter(key => labels[key])" :key="property">
                <div class="row full-width" style="border-bottom: 1px solid #E3E4E5">
                  <div class="col-6 q-pa-md">
                    <p class="tw-text-label tw-font-semibold">
                      {{ labels[property] }}
                    </p>
                  </div>
                  <div class="col-6 q-pa-md" style="display: flex;justify-content: end;">
                    <span>{{ elems[property] }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 q-pa-md">
              <div style="display: flex">
                <p class="tw-text-label tw-font-semibold">
                  Anexos
                </p>
              </div>
              <div class="row q-pa-md">
                <div v-for="imagen in elems['images']" :key="imagen" class="col-4 q-pa-md "
                     style="border: 1px solid #E3E4E5;border-radius: 10%;margin: 0 2%">
                  <img v-lazy :data-url="pdf" alt="pdf" style="width: 100%;  height: 10vh!important;"/>
                  <p class="text-subtitle2 text-grey-8 text-center"
                     style="font-size: 0.7rem!important; font-weight: 700!important;
                     word-break: break-all; text-align: center;">
                    {{ imagen.split('/')[1].replace("PDF", "pdf") }}
                  </p>
                </div>
              </div>
              <div style="display: flex; justify-content: end;">
                <q-btn class="tw-rounded-lg tw-py-6 tw-px-2 tw-min-w-[120px]" color="primary"
                       label=" Ver todos los anexos"
                       @click="openModal(elems?.llave)"/>
              </div>
            </div>
          </div>
          <q-separator spaced/>
        </q-card>
      </q-expansion-item>
    </div>
    <div v-else class="tw-flex tw-justify-center">
      <h2 class="tw-font-bold tw-text-2xl tw-py-5">
        No se encontraron documentos asociados
      </h2>
    </div>

    <q-dialog v-model="showModal" persistent>
      <q-card class="tw-w-full" style="max-width: 80vw; height: 95vh;">
        <div style="display: flex; justify-content: end">
          <q-btn color="primary" flat label="Cerrar" @click="clearselect"/>
        </div>
        <div class="row " style="display: flex;justify-content: center;align-items: center;width: 100%;height: 90vh;">
          <div class="col-3 scroll-y" style="height: 98%;">
            <div v-for="(image, index) in imagenes" :key="index" :label="image.archivo"
                 style="padding:5%;border: 2px solid #E3E4E5; border-radius: 10%; margin: 5% 12%; ; cursor: pointer;">
              <div class="col-12 q-pa-md tw-flex tw-justify-end" @click="selectImage(image.ruta)">
                <img v-lazy :data-url="pdf" alt="pdf" style="width: 100%; height: 10vh!important;"/>
              </div>
              <div>
                <p
                  class="text-subtitle2 text-grey-8 text-center"
                  style="font-size: 0.7rem!important; font-weight: 700!important;
                      word-break: break-all; text-align: center;">
                  {{ image.nombreArchivo.replace("PDF", "pdf") }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-9 tw-bg-gray-50" style="height: 98%;padding: 2%">
            <iframe
              v-if="selectedImage"
              :src="selectedImage"
              height="100%"
              width="100%"
            ></iframe>
            <div v-else class="tw-flex tw-h-full tw-justify-center tw-items-center">
              <h3 class="text-primary tw-font-semibold tw-my-5 tw-text-2xl">
                Seleccione un archivo para visualizar
              </h3>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {sgdeaAxios} from "src/services";
import {toast} from "src/helpers/toast";
import pdf from "assets/pdf.svg";

const filtersSearch = ref({
  numeRad: null,
  numeDoc: null,
  tipoDocumento: null,
  expediente: null,
  siniestro: null,
  factura: null,
  fechaInicial: null,
  fechaFinal: null
});
const filtersSearchRequired = ref({
  anoRad: null,
  codiSec: null,
  codiPat: null,
  nroRadicado: null,
});
const handleSubmitIsLoading = ref<boolean>(false)
const opTipoDocumento = ref([])
const customFilter = ref(null);
const customFilterSelected = ref([]);
const searchAll = ref(false);
const coreSelected = ref(null);
const coreOptions = ref();
const load = ref(false);
const tramites = ref({});
const showModal = ref(false);
const showModalAction = ref(false);
const imagenes = ref([]);
const selectedImage = ref();
const showDocs = ref(false);
const labels = ref({
  "fech_rad": "Fecha Radicado",
  "nume_sin": "Siniestro",
  "cant_hoj": "Cantidad De Hojas",
  "tini_rad": "Fecha Inicio Radicado",
  "tfin_rad": "Fecha Fin Radicado",
  "fech_fac": "Fecha Facturación",
  "obse_iss": "Observación",
  "nume_paq": "Número Paquete",
  "fech_reg": "Fecha Registro",
  "dire_emp": "Dirección Empresa",
  "tele_emp": "Teléfono Empresa",
  "tipo_tra": "Tipo Trámite",
  "ndoc_emp": "Número Documento",
  "razn_emp": "Destinatario",
  "dire_emp1": "Dirección",
  "cdep_emp": "Código Departamento",
  "ndep_emp": "Departamento",
  "cmun_emp": "Código Municipio",
  "nmun_emp": "Municipio",
  "tele_emp1": "Teléfono",
  "mail_emp": "Correo",
  "tdoc_rep": "Tipo Documento Representante",
  "ndoc_rep": "Número Documento Representante",
  "nomb_rep": "Nombre Representante",
  "carg_rep": "Cargo Representante",
  "nomb_tra": "Destinario",
  "tramite": "Trámite",
  "totimg": "Cantidad De Anexos",
  "llave": "Radicado",
});
const baseParams = {
  label: "Cantidad de Registro",
  value: 'cantidad',
  type: "text",
};
const customFilterOptions = ref([baseParams]);
const labletramite = {
  'tramites_de_pyp_2023': 'Promoción y Prevencion',
  'tramites_documentos_juridicos_2023': ' Juridicos',
  'tramites_procesamiento_de_correspondencia_2023': 'Correspondencia',
  'vicepresidencia_de_operaciones_2023': 'Vicepresidencia De Operaciones',
  'vicepresidencia_tecnica_-_tecnica_2023': 'Vicepresidencia Técnica',
  'vicepresidencia_tecnica_indemnizaciones_medica_2023': 'Vicepresidencia Técnica Indemnizaciones Medicas'
}

onMounted(async () => {
  const request = await axios.get(
    `https://solr-prod.proyectos-3t.tech/solr/admin/cores?action=STATUS&wt=json`
  );
  const cors = request.data.status;
  const corsNames = Object.keys(cors).map((m) => ({label: labletramite[m], value: m}));
  coreOptions.value = corsNames;
  await getDataOthers();
});

const inputRequired = (val: any) => (!!val ? true : "Campo requerido");

const handleSearch = async () => {
  handleSubmitIsLoading.value = true;
  const baseUrl = "https://solr-prod.proyectos-3t.tech/solr";
  load.value = false;
  if (!existFilters()) {
    toast.error("Debe completar un filtro para continuar");
    handleSubmitIsLoading.value = false;
  } else {
    const cantidad = filtersSearch.value[baseParams.value] ?? 100;
    if (!coreSelected.value) {
      const coresResponse = await axios.get(`${baseUrl}/admin/cores?action=STATUS&wt=json`);
      var cores = Object.keys(coresResponse.data.status)
      const queryEntries = getUrls(cores);
      const responses = await Promise.all(queryEntries.map(({url}) => axios.get(url)));

      interface GroupedItem {
        docs: any[];
        total: number;
      }

      const grouped: Record<string, GroupedItem> = {};

      responses.forEach((res, index) => {
        const core = queryEntries[index].core;
        const docs = res.data.response.docs;
        const total = res.data.response.numFound;
        if (!grouped[core]) {
          grouped[core] = {
            docs: [],
            total: 0
          };
        }

        grouped[core].docs.push(...docs);
        grouped[core].total += total;
      });

      tramites.value = Object.entries(grouped)
        .map(([core, {docs, total}]) => ({
          tramite: `${core}`,
          total: total,
          docs
        }))
        .filter(item => item.docs.length > 0);
    } else {
      // Consultar un core específico
      const queryUrl = `${baseUrl}/${coreSelected.value}/select?q=${query}&q.op=AND&rows=${cantidad}&wt=json&indent=true`;
      const {data: {response}} = await axios.get(queryUrl);

      tramites.value = [
        {
          tramite: coreSelected.value,
          docs: response.docs,
        },
      ];
    }

    load.value = true; // Indicar que la búsqueda ha finalizado
    handleSubmitIsLoading.value = false;
  }
};
const getUrls = (cores) => {
  return cores.flatMap((core) => {
    const baseUrl = "https://solr-prod.proyectos-3t.tech/solr";
    const entries: { core: string; url: string }[] = [];
    switch (core) {
      case 'vicepresidencia_tecnica_-_tecnica_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `nume_pol:${filtersSearch.value.numeDoc}`
          let numDoc_filter1 = `ndoc_emp:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numDoc_filter1}&rows=10000&useParams=`}
          )
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`;
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`}
          )
        }
        break;
      }
      case 'tramites_de_pyp_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `ndoc_afi:${filtersSearch.value.numeDoc}`
          let numeDoc_filter1 = `ndoc_emp:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter1}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.siniestro) {
          let siniestro_filter2 = `nume_sin:${filtersSearch.value.siniestro}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${siniestro_filter2}&rows=10000&useParams=`}
          );
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`
          entries.push({core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`})
        }
        break;
      }
      case 'vicepresidencia_tecnica_indemnizaciones_medica_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `ndoc_b01:${filtersSearch.value.numeDoc}`
          let numeDoc_filter1 = `ndoc_emp:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter1}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`
          entries.push({core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`})
        }
        break;
      }
      case 'tramites_procesamiento_de_correspondencia_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `ndoc_tra:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`
          entries.push({core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`})
        }
        break;
      }
      case 'tramites_documentos_juridicos_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `ndoc_tra:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.fechaInicial) {
          let fecha_filter2 = `fech_rad:${filtersSearch.value.fechaInicial}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${fecha_filter2}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`
          entries.push({core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`})
        }
        break;
      }
      case 'vicepresidencia_de_operaciones_2023': {
        if (filtersSearch.value.numeDoc) {
          let numeDoc_filter = `nume_doc_emp:${filtersSearch.value.numeDoc}`
          let numeDoc_filter1 = `ndoc_emp:${filtersSearch.value.numeDoc}`
          entries.push(
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter}&rows=10000&useParams=`},
            {core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${numeDoc_filter1}&rows=10000&useParams=`},
          );
        }
        if (filtersSearch.value.numeRad) {
          let filter = `llave:${filtersSearch.value.numeRad}`
          entries.push({core, url: `${baseUrl}/${core}/query?indent=true&q.op=OR&q=${filter}&rows=10000&useParams=`})
        }
        break;
      }
    }
    return entries;
  })
}

const existFilters = (): boolean => {
  const { numeRad, numeDoc, expediente, siniestro, factura, fechaInicial, fechaFinal } = filtersSearch.value;
  return Boolean(numeRad || numeDoc || expediente || siniestro || factura || fechaInicial || fechaFinal);
};

const propertyKeys = (elm: any) => Object.keys(elm);

const resetForm = () => {
  filtersSearchRequired.value = {
    anoRad: null,
    codiSec: null,
    codiPat: null,
    nroRadicado: null,
  };
  tramites.value = {}
  load.value = false;
  customFilter.value = null;
  customFilterSelected.value = [];
  searchAll.value = false;
  coreSelected.value = null;
  filtersSearch.value = {
    numeRad: null,
    numeDoc: null,
    tipoDocumento: null,
    expediente: null,
    siniestro: null,
    factura: null,
    fechaInicial: null,
    fechaFinal: null
  }
};

const openModal = async (llave) => {
  try {
    const response = await axios.get(`https://storage-prd.proyectos-3t.tech/api/auditorias?rutaPattern=${llave}`);
    // const response = {}
    // response['data'] = [
    //   {
    //     "nombreArchivo": "0120230601S8900396092100.PDF",
    //     "ruta": "https://storage.googleapis.com/positiva-sgda-prd-mig-info/2023/2023_06/VICEPRESIDENCIA%20DE%20OPERACIONES/RECAUDO_correo%20electr%C3%B3nico%20no%20certificado%20%28Cartera%20Preventiva%20u%20otro%20proceso%20determinado%20por%20POSITIVA%29/IMAGENES/2023010031960921/0120230601S8900396092100.PDF?GoogleAccessId=cloudstoragedev@positiva-sgda-prd-416417.iam.gserviceaccount.com&Expires=1744332544&Signature=rrkk2xzgsZtkhFxngGMbeMdgcAYSzIPAs0yXuEhRpk4yEmaUs3KaO%2BKlDw9BS4x9ZkqTmdSV3kOM7c1HnnxmMQ5gQ7DzpF38WWdQTULby8d%2BEOIH32d9KSMbd9qV6kkgTaKEYckHTn288F2fkFFM%2Bx1MI25eQt%2Bzcuzgn%2BN0NcWtUQTW%2FYE%2BpffTbED5rJNw%2Bd6pRaiTnSeGrtntDIrtRlzzLCyB3NipqfpAFocLCZSpE5WHGA3%2BIOltz6xKbHlg9gmDjfZ3yCJE5q0uQEI9w3iC4WFfwRPRN%2FSEsLXJQG2YT4n9IWRjZUOuFh66kr5fAdr4K6YolHPqUovMjQ25UA%3D%3D"
    //   },
    //   {
    //     "nombreArchivo": "0120230601S8900396092101.PDF",
    //     "ruta": "https://storage.googleapis.com/positiva-sgda-prd-mig-info/2023/2023_06/VICEPRESIDENCIA%20DE%20OPERACIONES/RECAUDO_correo%20electr%C3%B3nico%20no%20certificado%20%28Cartera%20Preventiva%20u%20otro%20proceso%20determinado%20por%20POSITIVA%29/IMAGENES/2023010031960921/0120230601S8900396092101.PDF?GoogleAccessId=cloudstoragedev@positiva-sgda-prd-416417.iam.gserviceaccount.com&Expires=1744332544&Signature=jGGTRKdJDmXVo9%2FvcvQhRMwwWSaa8u1Hju6SC1MXDT1SJ0LCX6GV20mMgx4D9xPg8hrNsEWg6E1eDYjd%2F4t3RITS7T4uN4ZjC8It3wh9kRqOdRzwZbYgykZWs5EYdrSqMUjUtoo%2FxYefvtX18ZL3bgti4AfRDw9ff0O4yGVsoAdgtWAGjQPNaXI9TjjINVsyzhlNAiYc2WpA7w2tY4FAvtwkCchAWdH9JHKi0AGF6sEmDouwjBeDVXsZjgfD7vHDwI5ECG%2B7Kqhlr9Z3qC07XxsMoHXq576kvCKo5%2BWSAWPJ%2B2iiYRaeupcDewIj77Hn6C%2F64a%2F8LLfvFhKzTkGZow%3D%3D"
    //   }
    // ]
    imagenes.value = response.data;
    showModal.value = true;
  } catch (error) {
    toast.error("Error al obtener anexos");
  }


};

const selectImage = (index) => {
  selectedImage.value = index;
};
const clearselect = () => {
  selectedImage.value = "";
  showModal.value = false;
};

const eventTramiteSelect = async (event: string | null) => {
  const newQuery = `https://solr-prod.proyectos-3t.tech/solr/${event}/query?q=*:*&q.op=OR&indent=true&rows=1`;
  const {
    data: {
      response: {
        docs: [doc],
      },
    },
  } = await axios.get(newQuery);


  const params = [];
  Object.keys(doc).map((v) => {
    if (v !== "_version_") {
      params.push({
        label: v,
        value: v,
        type: "text",
      });
    }
  });
  customFilter.value = [];
  customFilterOptions.value = [
    ...customFilterOptions.value,
    ...params
  ]
};


const addCustomFilter = (event: string | null) => {


  const selectedOption = customFilterOptions.value.find(
    (option) => option.value === event
  );
  if (

    !customFilterSelected.value.includes(selectedOption)
  ) {

    customFilterSelected.value.push(selectedOption);
  }

};

const getDataOthers = async () => {
  const {data: tipoDocsData} = (await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion"));
  opTipoDocumento.value = tipoDocsData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

}

</script>

<style scoped>
.document-divider {
  height: 5px;
  background-color: #8f8c8c;
  /* light gray color */
  margin: 20px 0;
  border-radius: 2px;
  width: 100%;
}

.document-card {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  /* light background color */
  border: 1px solid #e0e0e0;
  /* light border color */
  border-radius: 8px;
}

.q-btn {

  padding: 10px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}
</style>

