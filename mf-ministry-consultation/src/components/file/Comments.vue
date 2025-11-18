<template>
  <!-- Botón en la parte superior derecha -->
  <div class="row justify-end q-mb-lg" style="width: 100%; padding: 20px">
    <component-button
      :colorButton="'secondary'"
      :colorText="'white'"
      :class="'q-mb-md'"
      text="Agregar comentario"
      @click="showDialog = true"
      style="width: 120px; height: 42px"
    />
  </div>
  <div class="q-pa-xl container_background" style="position: relative">
    <div class="comments-list">
      <CommentCard
        v-for="comment in comments"
        :key="comment.id"
        :author-name="comment.authorName"
        :status="comment.status"
        :comment="comment.comment"
        :date="comment.date"
        :avatar-color="comment.avatarColor"
        class="q-mb-md"
      />
    </div>

    <!-- Modal MultiInputDialog -->
    <MultiInputDialog
      v-if="showDialog"
      title="Agregar Comentarios"
      subtitle="Escribe aquí notas con sugerencias o descripciones para que los demás colaboradores visualicen:"
      :action="onAddComment"
      accept-label="Agregar"
      cancelar-label="Cancelar"
      input="textarea-length"
      label="Comentarios"
      :options="[]"
      :cancelarAction="onCloseDialog"
      :modelValue="commentText"
      @update:modelValue="
        (value) => {
          commentText = value;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MultiInputDialog from '@shell/components/MultiInputDialog.vue';
import CommentCard from '@shell/components/Information/CommentCard.vue';
import type { Comment } from '@shell/interface/information/comment';
import ComponentButton from '@shell/components/ComponentButton.vue';
const comments = ref<Comment[]>([
  // {
  //   id: 1,
  //   authorName: 'Angel Samuel Pardo Torres',
  //   status: 'Etapa original. Por asignar',
  //   comment:
  //     'Lorem ipsum dolor sit amet consectetur adipiscing elit in hendrerit, nulla potenti neque inceptos fermentum canque lacus facilisi eu, id turpis ridiculus tempor tortor sociosqu velit ad. Sociosqu iaculis per et curabitur dictumst ligula praesent quis convallis potenti suspendisse justo, nulla aliquet sociis vehicula tristique orci vitae commodo lectus tincidunt consequat imperdiet, varius rhoncus pellentesque canque dictum faucibus in mattis purus eras risus. Eleifend massa enim dictumst dictum nunc conubia ullamcorper vitae mollis sedales, ridiculus malesuada eget in integer consequat suscipit ligula nibh nulla curabitur venenatis aenean augue pulvinar praesent orci lacinia a sed.',
  //   date: '17/10/2025 16:55',
  //   avatarColor: 'orange',
  // },
  // {
  //   id: 2,
  //   authorName: 'María Fernández López',
  //   status: 'En revisión',
  //   comment:
  //     'Este es un comentario de ejemplo para mostrar cómo se vería con otro usuario y diferente estado en el sistema.',
  //   date: '18/10/2025 09:30',
  //   avatarColor: 'blue',
  // },
  // {
  //   id: 3,
  //   authorName: 'Carlos Rodríguez',
  //   status: 'Aprobado',
  //   comment:
  //     'Comentario adicional para demostrar la funcionalidad responsive del componente en diferentes tamaños de pantalla.',
  //   date: '18/10/2025 14:15',
  //   avatarColor: 'green',
  // },
]);

const showDialog = ref(false);
const commentText = ref('');

function onCloseDialog() {
  showDialog.value = false;
  commentText.value = '';
}

function onAddComment() {
  if (commentText.value && commentText.value.trim()) {
    const newComment: Comment = {
      id: comments.value.length + 1,
      authorName: 'Usuario Actual',
      status: 'Nuevo comentario',
      comment: commentText.value,
      date: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      avatarColor: 'purple',
    };
    comments.value.unshift(newComment);
    commentText.value = '';
  }
}
</script>

<style scoped lang="scss">
.comments-container {
  max-width: 1000px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;

  @media (max-width: 600px) {
    padding: 8px;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
