<template>
  <div v-if="props.mlData" class="card-grid">
    <q-card
      v-for="(version, index) in props.mlData"
      :key="index"
      class="tw-mb-4 tw-p-4 card-item"
    >
      <h2 class="tw-text-base">Versión: {{ version.version }}</h2>
      <q-card-section class="content">
        <strong>Contenido anterior:</strong>

        <p
          v-html="
            index > 0
              ? extractSpanContent(props.mlData[index - 1].htmlContent).replace(
                  /\n/g,
                  '<br>'
                )
              : 'No registra'
          "
        ></p>
      </q-card-section>
      <q-card-section class="content">
        <strong>Contenido nuevo:</strong>
        <p
          v-html="
            highlightDifference(
              index > 0
                ? extractSpanContent(props.mlData[index - 1].htmlContent || props.mlData[index - 1].contenido)
                : 'No registra',
              extractSpanContent(version.htmlContent || version.contenido).replace(/\n/g, '<br>')
            ).replace(/\n/g, '<br>')
          "
        ></p>
      </q-card-section>

      <div class="actions">
        <q-separator />
        <q-card-actions horizontal align="around">
          <q-card-actions vertical>
            <strong>Usuario:</strong>
            <p>{{ version.usuario }}</p>
          </q-card-actions>
          <q-card-actions vertical>
            <strong>Rol:</strong>
            <p>{{ version.rol }}</p>
          </q-card-actions>
        </q-card-actions>
      </div>
    </q-card>
  </div>
  <template v-else >
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ "No existe data por el momento" }}
          </span>
        </div>
      </template>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import NoData from "src/assets/filterImage.svg";
const props = defineProps<{
  mlData: any;
}>();

function extractSpanContent(htmlContent: string) {
  if (!htmlContent) {
    return "No registra";
  }

  const regex = /<span class="restricted-editing-exception">(.*?)<\/span>/g;
  const matches = [];
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    const spanContent = match[1].trim();
    matches.push(spanContent);
  }
  if (matches.length > 0) {
    return matches.join("\n");
  } else {
    // Eliminar todas las etiquetas HTML
    const textOnly =  htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const asuntoRegex = /Asunto\s*:\s*(.*)/i;
    const asuntoMatch = asuntoRegex.exec(textOnly);

    return asuntoMatch ? asuntoMatch[1].trim() : "No registra";
  }

}

function highlightDifference(oldContent: string, newContent: string) {
  if (oldContent === "No registra" || newContent === "No registra") {
    return newContent;
  }

  // Dividir contenido en palabras
  const oldParts = oldContent.split(/\s+/); // Dividir por espacio
  const newParts = newContent.split(/\s+/); // Dividir por espacio

  let highlightedContent = '';

  // Comparar partes y resaltar las que son diferentes
  for (let i = 0; i < newParts.length; i++) {
    if (oldParts[i] !== newParts[i]) {
      highlightedContent += `<span style="background-color:#97fca8;">${newParts[i]}</span> `;
    } else {
      highlightedContent += `${newParts[i]} `;
    }
  }

  return highlightedContent.trim(); // Retornar el contenido resaltado
}


</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-item {
  max-width: 100%; /* Asegura que la tarjeta no se salga de los límites */
  box-sizing: border-box; /* Hace que el padding no aumente el ancho total */
}
.card-item .content p {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.content {
  flex-grow: 1;
}

.actions {
  margin-top: auto;
}
</style>
