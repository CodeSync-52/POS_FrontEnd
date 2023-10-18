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
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-input
        v-model="filterSearch.FromDate"
        label="From"
        style="min-width: 200px"
        type="date"
        :max="filterSearch.ToDate"
        outlined
        color="btn-primary"
        dense
      />
      <q-input
        v-model="filterSearch.ToDate"
        label="To"
        color="btn-primary"
        type="date"
        style="min-width: 200px"
        :min="filterSearch.FromDate"
        outlined
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getGrnList()"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :rows="GrnRecords"
        :columns="GrnTableColumn"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getGrnList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.GoodsReceiptNotes,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.GoodsReceiptNotes,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.GoodsReceiptNotes,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.GoodsReceiptNotes,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                flat
                unelevated
                dense
                size="sm"
                icon="check"
                color="green"
              />
              <q-btn
                flat
                unelevated
                dense
                size="sm"
                icon="cancel"
                color="red"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.name }}
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog v-model="isAddGRNModalVisible">
    <add-new-grn @selected-inventory="handleSelectedinventory" />
  </q-dialog>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import AddNewGrn from 'src/components/goods-receipt-notes/AddNewGrn.vue';
import {
  EActionPermissions,
  EUserModules,
  IGrnListFilter,
  IGrnRecords,
  IPagination,
  ISelectedPayload,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { addGrnApi, grnListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { GrnTableColumn } from 'src/utils';
import { onMounted, onUnmounted, ref } from 'vue';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.GoodsReceiptNotes);
const isAddGRNModalVisible = ref(false);
const $q = useQuasar();
const GrnRecords = ref<IGrnRecords[]>([]);
const isLoading = ref(false);
const filterSearch = ref<IGrnListFilter>({
  FromDate: null,
  ToDate: null,
});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const apiController = ref<AbortController | null>(null);
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ToDate: null,
    FromDate: null,
  };
  getGrnList();
};
onMounted(() => {
  getGrnList();
}),
  onUnmounted(() => {
    if (apiController.value) {
      apiController.value.abort();
    }
  });
const getGrnList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await grnListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      GrnRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Fetching Grn List';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isLoading.value = false;
};
const handleSelectedinventory = async (
  payload: ISelectedPayload,
  callback: () => void
) => {
  try {
    const res = await addGrnApi(payload);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
    }
  } catch (e) {
    let message = 'Unexpected error occurred adding Grn';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  callback();
  isAddGRNModalVisible.value = false;
  getGrnList();
};
</script>
