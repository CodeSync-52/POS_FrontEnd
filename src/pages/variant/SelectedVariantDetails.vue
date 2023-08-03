<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-3xl font-semibold"
        >{{ pageTitle }} : {{ selectedGroupName }}</span
      >
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-lg bg-btn-primary text-signature"
        @click="addNewVariant"
      />
    </div>
    <div class="py-4">
      <q-table
        flat
        bordered
        :rows="variantDetailsRecord"
        :columns="variantDetailsColumn"
        row-key="name"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="editVariant(props.row)"
              />
              <q-btn
                size="sm"
                dense
                flat
                unelevated
                icon="delete"
                @click="handleDeleteVariant(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog
      @update:model-value="selectedRowData = null"
      v-model="isVariantDetailsModalVisible"
    >
      <variant-details-modal
        :variant="variant"
        :variant-action="variantAction"
        @name-changed="updateOrAddVariant"
        @delete-record="deletingVariant"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import VariantDetailsModal from 'src/components/variant-management/VariantDetailsModal.vue';
import {
  EUserModules,
  IVariantDetailsData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { variantDetailsColumn, variantDetailsData } from './utils';
import { useQuasar } from 'quasar';
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const router = useRouter();
const $q = useQuasar();
const isVariantDetailsModalVisible = ref<boolean>(false);
const variantDetailsRecord = ref<IVariantDetailsData[]>(variantDetailsData);
const selectedGroupName = router.currentRoute.value.params.id;
const variantAction = ref<string>('');
const variant = ref<{ fullName: string; label: string; id: string }>({
  fullName: '',
  label: '',
  id: '',
});
const selectedRowData = ref<IVariantDetailsData | null>(null);
const addNewVariant = () => {
  variantAction.value = 'Add';
  variant.value.fullName = '';
  variant.value.label = '';
  isVariantDetailsModalVisible.value = true;
};
const editVariant = (selectedRow: IVariantDetailsData) => {
  selectedRowData.value = selectedRow;
  variant.value.fullName = selectedRow.fullName;
  variant.value.label = selectedRow.label;
  variantAction.value = 'Edit';
  isVariantDetailsModalVisible.value = true;
};
const handleDeleteVariant = (selectedRow: IVariantDetailsData) => {
  selectedRowData.value = selectedRow;
  variantAction.value = 'Delete';
  variant.value.id = selectedRow.id;
  isVariantDetailsModalVisible.value = true;
};
const updateOrAddVariant = async (
  newName: string,
  newLabel: string,
  callback: () => void
) => {
  if (selectedRowData.value) {
    await new Promise((res) => {
      setTimeout(() => res({ newName, newLabel }), 3000);
    });
  } else {
    await new Promise((res) => {
      setTimeout(() => res({ newName, newLabel }), 3000);
    });
  }
  selectedRowData.value = null;
  isVariantDetailsModalVisible.value = false;
  callback();
};
const deletingVariant = async (id: string, callback: () => void) => {
  if (selectedRowData.value) {
    try {
      await new Promise((res) => {
        setTimeout(() => res(id), 3000);
        selectedRowData.value = null;
        isVariantDetailsModalVisible.value = false;
        $q.notify({
          message: 'The selected variant is deleted successfully',
          color: 'green',
        });
      });
      callback();
    } catch (e) {
      $q.notify({
        message: 'Unexpected Error',
        color: 'red',
      });
    }
  }
};
</script>
