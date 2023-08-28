<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.VariantManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        unelevated
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary text-signature"
        @click="addNewVariant"
      />
    </div>
    <div class="py-4">
      <q-table
        :rows="filteredRows"
        :columns="variantDetailsColumn"
        :loading="isLoading"
        row-key="name"
        :filter="filter"
        v-model:pagination="pagination"
        @request="getVariantList"
      >
        <template v-slot:top>
          <div class="font-medium text-lg"><span>Variant</span></div>
          <q-space />
          <q-input
            outlined
            dense
            debounce="300"
            color="btn-primary"
            label="Name"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.Delete
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.Update
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.Delete
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.Update
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                class="hover:text-btn-primary"
                @click="editVariant(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              :disable="
                !authStore.checkUserHasPermission(
                  EUserModules.VariantManagement,
                  EActionPermissions.Delete
                ) &&
                !authStore.checkUserHasPermission(
                  EUserModules.VariantManagement,
                  EActionPermissions.Update
                )
              "
              no-caps
              :label="props.row.status"
              @click="handleUpdateStatusPopup(props.row)"
            />
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
      />
    </q-dialog>
    <q-dialog v-model="isVariantStatusModalVisible">
      <variant-status-modal
        :selected-status="selectedRowData?.status"
        @updated-status="handleUpdateStatus"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import VariantDetailsModal from 'src/components/variant-management/VariantDetailsModal.vue';
import VariantStatusModal from 'src/components/variant-management/VariantStatusModal.vue';
import {
  EActionPermissions,
  EUserModules,
  IVariantDetailsData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { variantDetailsColumn } from './utils';
import { useQuasar } from 'quasar';
import { isPosError } from 'src/utils';
import {
  addVariantApi,
  changeVariantStatus,
  updateVariantApi,
  variantListApi,
} from 'src/services';
import { useAuthStore } from 'src/stores';
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const filter = ref('');
const isVariantDetailsModalVisible = ref<boolean>(false);
const variantDetailsRecord = ref<IVariantDetailsData[]>([]);
const variantAction = ref<string>('');
const isVariantStatusModalVisible = ref(false);
const isLoading = ref(false);
const variantGroupId = Number(router.currentRoute.value.params.id);
const variant = ref<{ displayName: string; name: string; id: number | null }>({
  displayName: '',
  name: '',
  id: null,
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const filteredRows = ref<IVariantDetailsData[]>([]);
const filterChanged = ref(false);
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = variantDetailsRecord.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(variantDetailsRecord, setFilteredData);
const selectedRowData = ref<IVariantDetailsData | null>(null);
onMounted(() => {
  getVariantList();
});
const addNewVariant = () => {
  variantAction.value = 'Add';
  variant.value.displayName = '';
  variant.value.name = '';
  isVariantDetailsModalVisible.value = true;
};
const handleUpdateStatusPopup = (selectedRow: IVariantDetailsData) => {
  selectedRowData.value = selectedRow;
  isVariantStatusModalVisible.value = true;
};
const handleUpdateStatus = async (
  updatedStatus: string,
  callback: () => void
) => {
  if (updatedStatus === selectedRowData.value?.status) {
    isVariantStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const variantId = selectedRowData.value?.variantId ?? -1;
    const res = await changeVariantStatus(variantId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value && selectedRowData.value.status === 'Active') {
        selectedRowData.value.status = 'InActive';
      } else if (
        selectedRowData.value &&
        selectedRowData.value.status === 'InActive'
      ) {
        selectedRowData.value.status = 'Active';
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  callback();
  isLoading.value = false;
  isVariantStatusModalVisible.value = false;
};
const editVariant = (selectedRow: IVariantDetailsData) => {
  selectedRowData.value = selectedRow;
  variant.value.name = selectedRow.name;
  variant.value.displayName = selectedRow.displayName;
  variantAction.value = 'Edit';
  isVariantDetailsModalVisible.value = true;
};
const updateOrAddVariant = async (
  name: string,
  displayName: string,
  action: string,
  callback: () => void
) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const variantId = selectedRowData.value?.variantId ?? -1;
    const res = await (action === 'Add'
      ? addVariantApi({ name, displayName, variantGroupId })
      : updateVariantApi({ variantId, name, displayName, variantGroupId }));
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      getVariantList();
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      $q.notify({
        message,
        color: 'red',
        icon: 'error',
      });
    }
  }

  isLoading.value = false;
  selectedRowData.value = null;
  isVariantDetailsModalVisible.value = false;
  callback();
  getVariantList();
};
const getVariantList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await variantListApi({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res.data) {
      variantDetailsRecord.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isLoading.value = false;
};
</script>
