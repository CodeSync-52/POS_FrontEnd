<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4 w-full"
    >
      <span class="text-lg font-medium">
        Variant : {{ variantGroupName }}
      </span>
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
        hide-pagination
        v-model:pagination="pagination"
      >
        <template v-slot:top>
          <div
            class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4 w-full"
          >
            <div class="font-medium text-lg"><span>Variant</span></div>
            <q-input
              maxlength="250"
              outlined
              dense
              debounce="300"
              color="btn-primary"
              label="Name"
              autofocus
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
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
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Variant
                </q-tooltip></q-btn
              >
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
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
              :label="props.row.status"
              @click="handleUpdateStatusPopup(props.row)"
              class="hover:text-btn-primary"
              ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Edit Status
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-displayName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.displayName }}
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
} from 'src/interfaces';
import { variantDetailsColumn } from './utils';
import { useQuasar } from 'quasar';
import { isPosError } from 'src/utils';
import {
  addVariantApi,
  changeVariantStatus,
  updateVariantApi,
  variantListByIdApi,
} from 'src/services';
import { useAuthStore } from 'src/stores';
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
const variantGroupName = router.currentRoute.value.params.name;
const variantGroupStatus = router.currentRoute.value.params.status;
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
    row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(variantDetailsRecord, setFilteredData);
const selectedRowData = ref<IVariantDetailsData | null>(null);
onMounted(() => {
  getSelectedVariantDetails();
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
  if (
    action === 'Edit' &&
    selectedRowData.value?.name === name &&
    selectedRowData.value?.displayName === displayName
  ) {
    isVariantDetailsModalVisible.value = false;
    callback();
    return;
  }
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
      getSelectedVariantDetails();
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
  getSelectedVariantDetails();
};
const getSelectedVariantDetails = async () => {
  try {
    const res = await variantListByIdApi({
      status: variantGroupStatus,
      variantGroupId,
    });
    if (res.type === 'Success') {
      variantDetailsRecord.value = res.data;
    }
  } catch (e) {
    let message = 'Error Occurred During Fetching variant Group Details';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
</script>
