<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewVariant"
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :rows="variantData"
        :columns="variantColumn"
        row-key="name"
      >
        <template v-slot:body-cell-variant="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              @click="handleManageClick(props.row.group)"
              label="Manage"
              class="hover:text-btn-primary"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              size="sm"
              dense
              flat
              unelevated
              :label="props.row.status"
              class="hover:text-btn-primary"
            />
            <q-popup-edit
              v-model="props.row.status"
              title="Update Status"
              buttons
              v-slot="scope"
            >
              <div class="flex column gap-2">
                <q-radio
                  v-model="scope.value"
                  val="Active"
                  label="Active"
                  color="btn-primary"
                  dense
                  autofocus
                />
                <q-radio
                  v-model="scope.value"
                  val="InActive"
                  dense
                  label="InActive"
                  autofocus
                  color="btn-primary"
                />
              </div>
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
              <q-btn
                size="sm"
                dense
                flat
                unelevated
                icon="delete"
                color="red"
                @click="handleDeleteVariant(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog
      @update:model-value="selectedRowData = null"
      v-model="isVariantModalVisible"
    >
      <variant-management-modal
        :variant="selectedVariant"
        :variant-action="variantAction"
        @name-changed="updateOrAddVariant"
        :selected-row="selectedRowData?.id"
        @delete-record="deletingVariant"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { variantColumn, variantRows } from 'src/pages/variant/utils';
import VariantManagementModal from 'src/components/variant-management/VariantManagementModal.vue';
import {
  EUserModules,
  IVariantData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
const router = useRouter();
const $q = useQuasar();
const selectedVariant = ref<string>('');
const selectedRowData = ref<IVariantData | null>(null);
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const isVariantModalVisible = ref<boolean>(false);
const variantData = ref(variantRows);
const variantAction = ref<string>('');
const onEditButtonClick = (row: IVariantData) => {
  selectedVariant.value = row.group;
  variantAction.value = 'Edit';
  isVariantModalVisible.value = true;
};
const AddNewVariant = () => {
  selectedVariant.value = '';
  variantAction.value = 'Add';
  isVariantModalVisible.value = true;
};
const handleManageClick = (id: string) => {
  router.push(`/variant/${id}`);
};
const updateOrAddVariant = async (newName: string, callback: () => void) => {
  if (selectedRowData.value) {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  } else {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  }
  selectedRowData.value = null;
  isVariantModalVisible.value = false;
  callback();
};
const handleDeleteVariant = (selectedRow: IVariantData) => {
  variantAction.value = 'Delete';
  selectedRowData.value = selectedRow;
  isVariantModalVisible.value = true;
};

const deletingVariant = async (id: string, callback: () => void) => {
  if (selectedRowData.value) {
    try {
      await new Promise((res) => {
        setTimeout(() => res(id), 3000);
        selectedRowData.value = null;
        isVariantModalVisible.value = false;
        $q.notify({
          message: 'The selected row is deleted successfully',
          color: 'green',
        });
      });
    } catch (e) {
      $q.notify({
        message: 'Unexpected Error',
        color: 'red',
      });
    }
    callback();
  }
};
</script>
