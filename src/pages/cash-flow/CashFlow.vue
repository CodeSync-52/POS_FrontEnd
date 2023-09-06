<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <router-link to="/cash-flow/add-new">
        <q-btn
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CashInCashOutManagement,
              EActionPermissions.Create
            )
          "
          unelevated
          label="Add New"
          icon="add"
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
        />
      </router-link>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-input
        v-model="filterSearch.FromDate"
        :max="filterSearch.ToDate"
        type="date"
        dense
        label="From Date"
        outlined
        color="btn-primary"
      />
      <q-input
        :min="filterSearch.FromDate"
        v-model="filterSearch.ToDate"
        type="date"
        dense
        outlined
        label="To Date"
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          :loading="isLoading"
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getCashFlowRecords()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :columns="cashFlowColumn"
        :rows="cashFlowRecords"
        v-model:pagination="pagination"
        align="left"
        :loading="isLoading"
        @request="getCashFlowRecords"
      >
        <template v-slot:body-cell-sourceUserName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.sourceUserName }}
          </q-td>
        </template>
        <template v-slot:body-cell-targetUserName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.targetUserName }}
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
  ICashFlowRecords,
} from 'src/interfaces';
import { cashFlowListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError, cashFlowColumn } from 'src/utils';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.CashInCashOutManagement
);
const isLoading = ref(false);
const $q = useQuasar();
const filterSearch = ref({
  FromDate: null,
  ToDate: null,
});
const cashFlowRecords = ref<ICashFlowRecords[]>([]);
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((item) => item === null)) return;
  filterSearch.value = {
    FromDate: null,
    ToDate: null,
  };
  getCashFlowRecords();
};
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const apiController = ref<AbortController | null>(null);
onMounted(() => {
  getCashFlowRecords();
});
const getCashFlowRecords = async (data?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
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
    const res = await cashFlowListApi(
      {
        filterSearch: filterSearch.value,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      cashFlowRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Cash Flow List';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isLoading.value = false;
};
</script>
