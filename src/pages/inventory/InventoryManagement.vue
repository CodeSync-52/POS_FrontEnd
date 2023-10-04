<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.InventoryManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="router.push('/inventory/add-new')"
      />
    </div>
    <div
      class="row flex md:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
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
          @click="getInventoryList()"
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
    <div>
      <q-table
        :columns="InventoryListColumn"
        :rows="InventoryListRecords"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getInventoryList"
        ><template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IInventoryFilterSearch,
  IInventoryListResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { inventoryListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const pageTitle = getRoleModuleDisplayName(EUserModules.InventoryManagement);
const InventoryListRecords = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
onMounted(() => {
  getInventoryList();
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const $q = useQuasar();
const filterSearch = ref<IInventoryFilterSearch>({
  FromDate: null,
  ToDate: null,
});
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    FromDate: null,
    ToDate: null,
  };
  getInventoryList();
};
const getInventoryList = async (data?: {
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
    const res = await inventoryListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      InventoryListRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
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
</script>
