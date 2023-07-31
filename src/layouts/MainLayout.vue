<template>
  <q-layout view="lHh Lpr lFf">
    <div>
      <main-layout-header
        @toggle-left-drawer="handleToggleLeftDrawer"
        :isLeftDrawerOpen="leftDrawerOpen"
      />
      <main-layout-sidebar
        v-model="leftDrawerOpen"
        @update:model-value="leftDrawerOpen = $event"
      />
      <q-page-container>
        <div class="p-4">
          <router-view />
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import MainLayoutSidebar from 'src/components/main-layout/MainLayoutSidebar.vue';
import MainLayoutHeader from 'src/components/main-layout/MainLayoutHeader.vue';
import { ref } from 'vue';
const handleToggleLeftDrawer = (isLeftDrawerVisible: boolean) => {
  leftDrawerOpen.value = isLeftDrawerVisible;
};
const leftDrawerOpen = ref(true);
</script>
