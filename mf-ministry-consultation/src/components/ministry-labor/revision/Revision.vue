<template>
    <div>
      <!-- Selector de Estado - Solo visible en modo desarrollo -->
      <div class="q-mb-md" v-if="false">
        <q-card flat bordered>
          <q-card-section class="q-py-sm">
            <div class="row items-center q-gutter-md">
              <div class="text-subtitle2 text-grey-8">Estado del Proceso:</div>
              
            </div>
          </q-card-section>
        </q-card>
      </div>
  
      <!-- Badge de Estado -->
      <div class="q-mb-md">
        <q-card flat class="container_background">
          <q-card-section class="q-py-sm">
            <div class="row items-center q-gutter-md">
              <div class="text-subtitle2 text-grey-8">Estado:</div>
              
            </div>
          </q-card-section>
        </q-card>
      </div>
  
      <!-- Navigation Tabs -->
      <NavigationBar :tabs="NAVIGATION_TABS"  default-tab="general" />
      
    </div>
  </template>
  
  <script setup lang="ts">

  import NavigationBar from '@shell/components/NavigationBar.vue';
  import { NAVIGATION_TABS } from '../../../constants/ministry-labor/revision';
  
  


  
 
  </script>
  
  <style lang="scss" scoped>
  .page-container {
    width: 100%;
  }
  
  .welcome-message {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
  
    p {
      margin: 0;
      color: #616161;
    }
  }
  </style>
  