<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.GoodsReceiptNotes,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="isAddGRNModalVisible = true"
      />
    </div>
  </div>
  <q-dialog v-model="isAddGRNModalVisible">
    <add-new-grn />
  </q-dialog>
</template>
<script setup lang="ts">
import AddNewGrn from 'src/components/goods-receipt-notes/AddNewGrn.vue';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useAuthStore } from 'src/stores';
import { ref } from 'vue';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.GoodsReceiptNotes);
const isAddGRNModalVisible = ref(false);
</script>
