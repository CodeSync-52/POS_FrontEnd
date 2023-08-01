<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-lg bg-btn-primary text-white"
        unelevated
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :rows="variantRows"
        :columns="variantColumn"
        row-key="name"
        binary-state-sort
      >
        <template v-slot:body-cell-group="props">
          <q-td :props="props">
            {{ props.row.group }}
            <q-popup-edit v-model="props.row.group" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell-variant="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              @click="handleManageClick(props.row.group)"
              label="Manage"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn size="sm" dense flat unelevated :label="props.row.status" />
            <q-popup-edit
              v-model="props.row.status"
              title="Update Status"
              buttons
              v-slot="scope"
            >
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
              <q-btn size="sm" dense flat unelevated icon="delete" />
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
import { variantColumn, variantRows } from 'src/pages/variant/utils';
import { useRouter } from 'vue-router';
// import VariantManagementModal from '../../components/variant-management/VariantManagementModal.vue';
import {
  EUserModules,
  IVariantData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
const router = useRouter();
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const showAddVariantPopup = ref(false);
// const isVariantManageModalVisible = ref(false);
// const variantManagementTableRows = ref<IVariantData>();
const selectedGroup = ref<IVariantData | undefined>();
const onEditButtonClick = (row: IVariantData) => {
  selectedGroup.value = {
    ...row,
  };
  showAddVariantModal(true);
};
const showAddVariantModal = (action: boolean) => {
  showAddVariantPopup.value = action;
};
const handleManageClick = (id: string) => {
  router.push(`/variant/${id}`);
};
// rowData: IVariantData
// isVariantManageModalVisible.value = true;
// variantManagementTableRows.value = rowData;
</script>
