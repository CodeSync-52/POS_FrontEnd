<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-lg bg-btn-primary"
        unelevated
        color=" "
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :rows="variantRows"
        :column="variantColumn"
        row-key="name"
      >
        <template v-slot:body-cell-variant="props">
          <q-td :props="props">
            <span
              @click="handleManageClick(props.row)"
              class="hover:underline cursor-pointer hover:font-semibold"
              >Manage</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
              <q-btn size="sm" flat unelevated icon="delete" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <!-- <q-dialog
      v-model="showAddVariantPopup"
      @update:model-value="selectedGroup = undefined"
    >
      <add-user-modal :selected-user="selectedGroup" @user-add="handleUserAdd" />
    </q-dialog> -->

    <!-- <q-dialog v-model="isVariantManageModalVisible">
      <variant-management-modal :role-data-prop="variantManagementTableRows" />
    </q-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { variantColumn, variantRows } from './utils';
import VariantManagementModal from '../../components/variant-management/VariantManagementModal.vue';
import {
  EUserModules,
  IVariantGroup,
  getRoleModuleDisplayName,
} from 'src/interfaces';
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const showAddVariantPopup = ref(false);
const isVariantManageModalVisible = ref(false);
const variantManagementTableRows = ref<IVariantGroup>();
const selectedGroup = ref<IVariantGroup | undefined>();

const onEditButtonClick = (row: IVariantGroup) => {
  selectedGroup.value = {
    ...row,
  };
  showAddVariantModal(true);
};

const showAddVariantModal = (action: boolean) => {
  showAddVariantPopup.value = action;
};
const handleManageClick = (rowData: IVariantGroup) => {
  isVariantManageModalVisible.value = true;
  variantManagementTableRows.value = rowData;
};
</script>
