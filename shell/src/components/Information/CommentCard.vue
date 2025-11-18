<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  authorName: string;
  status: string;
  comment: string;
  date: string;
  avatarColor?: string;
  avatarTextColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  avatarColor: 'orange',
  avatarTextColor: 'white',
});

// Obtener las iniciales del nombre
const authorInitials = computed(() => {
  const names = props.authorName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
});

// Formatear la fecha
const formattedDate = computed(() => {
  return props.date;
});
</script>

<template>
  <q-card 
    flat 
    bordered 
    class="comment-card"
  >
    <q-card-section class="comment-card__content">
      <div class="comment-card__header">
        <!-- Avatar con iniciales -->
        <q-avatar
          :color="avatarColor"
          :text-color="avatarTextColor"
          size="40px"
          class="comment-card__avatar"
        >
          {{ authorInitials }}
        </q-avatar>

        <!-- Información del autor -->
        <div class="comment-card__info">
          <h4 class="comment-card__author text-subtitle1 text-weight-medium q-mb-none">
            {{ authorName }}
          </h4>
          <p class="comment-card__status text-caption text-grey-7 q-mb-none">
            {{ status }}
          </p>
        </div>

        <!-- Fecha -->
        <div class="comment-card__date-wrapper">
          <span class="comment-card__date text-caption text-grey-8">
            {{ formattedDate }}
          </span>
        </div>
      </div>

      <!-- Comentario -->
      <div class="comment-card__body">
        <p class="comment-card__text text-body2 q-mb-none">
          {{ comment }}
        </p>
      </div>

    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.comment-card {
  
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;

  &__content {
    padding: 16px;

    @media (max-width: 600px) {
      padding: 12px;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    @media (max-width: 600px) {
      flex-wrap: wrap;
    }
  }

  &__avatar {
    flex-shrink: 0;
    font-weight: 600;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__author {
    color: #1a1a1a;
    font-size: 16px;
    line-height: 1.4;
    margin-bottom: 2px;

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }

  &__status {
    font-size: 12px;
    line-height: 1.4;
    color: #666;
  }

  &__date-wrapper {
    flex-shrink: 0;
    margin-left: auto;

    @media (max-width: 600px) {
      width: 100%;
      margin-left: 52px;
      margin-top: -4px;
    }
  }

  &__date {
    font-size: 13px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;

    @media (max-width: 600px) {
      font-size: 12px;
    }
  }

  &__body {
    padding-left: 52px;
    padding-right: 0;
    margin-bottom: 16px;

    @media (max-width: 600px) {
      padding-left: 0;
      margin-bottom: 12px;
    }
  }

  &__text {
    color: #4a4a4a;
    font-size: 14px;
    line-height: 1.6;
    text-align: justify;

    @media (max-width: 600px) {
      font-size: 13px;
      text-align: left;
    }
  }

  &__progress {
    margin: 0 -16px -16px;
    height: 4px;

    @media (max-width: 600px) {
      margin: 0 -12px -12px;
    }

    :deep(.q-linear-progress__track) {
      opacity: 1;
    }
  }
}
</style>