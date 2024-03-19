<template>
  <q-layout view="lHh Lpr lFf">
    <div>
      <main-layout-header @toggle-left-drawer="handleToggleLeftDrawer" />
      <main-layout-sidebar
        v-model="leftDrawerOpen"
        @update:model-value="leftDrawerOpen = $event"
      />
      <q-page-container>
        <div class="p-6">
          <router-view />
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import MainLayoutSidebar from 'src/components/main-layout/Main-Layout-Sidebar.vue';
import MainLayoutHeader from 'src/components/main-layout/Main-Layout-Header.vue';
import { ref } from 'vue';
const handleToggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const leftDrawerOpen = ref(false);
</script>
