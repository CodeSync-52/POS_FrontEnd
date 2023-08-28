<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4 mt-2"
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
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewVariant"
      />
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="filteredRows"
        :columns="variantColumn"
        row-key="name"
        :filter="filter"
        v-model:pagination="pagination"
        @request="getVariantGroupList"
      >
        <template v-slot:top>
          <div class="font-medium text-lg"><span>Variant Group</span></div>
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
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.View
            )
          "
          v-slot:header-cell-variant
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.VariantManagement,
              EActionPermissions.View
            )
          "
          v-slot:body-cell-variant="props"
        >
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              @click="handleManageClick(props.row.variantGroupId)"
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
              :disable="
                !authStore.checkUserHasPermission(
                  EUserModules.VariantManagement,
                  EActionPermissions.Delete
                ) ||
                !authStore.checkUserHasPermission(
                  EUserModules.VariantManagement,
                  EActionPermissions.Update
                )
              "
              unelevated
              :label="props.row.status"
              class="hover:text-btn-primary"
              @click="handleStatusPopup(props.row)"
            />
          </q-td>
        </template>
        <template
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
          v-slot:header-cell-action
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
                text-color="white"
                class="bg-btn-primary hover:bg-btn-secondary"
                @click="onEditButtonClick(props.row)"
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
        :selected-row="selectedRowData?.variantGroupId"
      />
    </q-dialog>
    <q-dialog v-model="isVariantGroupStatusModalVisible">
      <variant-status-modal
        :selected-status="selectedRowData?.status"
        @updated-status="handleUpdateStatus"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { variantColumn } from 'src/pages/variant/utils';
import VariantManagementModal from 'src/components/variant-management/VariantManagementModal.vue';
import VariantStatusModal from 'src/components/variant-management/VariantStatusModal.vue';
import {
  EActionPermissions,
  EUserModules,
  IVariantData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import {
  variantGroupListApi,
  addVariantGroupApi,
  updateVariantGroupApi,
  variantGroupUpdateStatus,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const selectedVariant = ref<string>('');
const selectedRowData = ref<IVariantData | null>(null);
const pageTitle = getRoleModuleDisplayName(EUserModules.VariantManagement);
const isVariantModalVisible = ref<boolean>(false);
const variantData = ref<IVariantData[]>([]);
const isVariantGroupStatusModalVisible = ref(false);
const variantAction = ref<string>('');
const filter = ref('');
const isLoading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
onMounted(() => {
  getVariantGroupList();
});

const getVariantGroupList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
  if (isLoading.value) return;

  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await variantGroupListApi({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res.data) {
      variantData.value = res.data.items;
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
const handleStatusPopup = (selectedRow: IVariantData) => {
  selectedRowData.value = selectedRow;
  isVariantGroupStatusModalVisible.value = true;
};
const handleUpdateStatus = async (
  updatedStatus: string,
  callback: () => void
) => {
  if (updatedStatus === selectedRowData.value?.status) {
    isVariantGroupStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const variantGroupId = selectedRowData.value?.variantGroupId ?? -1;

    const res = await variantGroupUpdateStatus(variantGroupId);
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
  isVariantGroupStatusModalVisible.value = false;
};
const onEditButtonClick = (row: IVariantData) => {
  selectedRowData.value = row;
  selectedVariant.value = row.name;
  variantAction.value = 'Edit';
  isVariantModalVisible.value = true;
};
const AddNewVariant = () => {
  selectedVariant.value = '';
  variantAction.value = 'Add';
  isVariantModalVisible.value = true;
};
const handleManageClick = (id: number) => {
  router.push(`/variant/${id}`);
};
const updateOrAddVariant = async (
  name: string,
  action: string,
  callback: () => void
) => {
  if (isLoading.value) return;
  isLoading.value = false;
  try {
    const variantGroupId = selectedRowData.value?.variantGroupId ?? -1;
    const res = await (action === 'Add'
      ? addVariantGroupApi(name)
      : updateVariantGroupApi({ variantGroupId, name }));
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
    getVariantGroupList();
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
  selectedRowData.value = null;
  isVariantModalVisible.value = false;
  callback();
};
const filteredRows = ref<IVariantData[]>([]);
const filterChanged = ref(false);
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = variantData.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(variantData, setFilteredData);
</script>
