<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-2 md:items-center sm:items-center mb-4"
  >
    <span class="text-lg font-medium">Bills</span>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.selectStatus"
      :options="billStatusOptionList"
      map-options
      popup-content-class="!max-h-[200px]"
      label="Status"
      option-label="name"
      option-value="customerGroupId"
      color="btn-primary"
    >
    </q-select>
    <q-select
      dense
      style="min-width: 200px"
      outlined
      map-options
      v-model="filterSearch.shopId"
      popup-content-class="!max-h-[200px]"
      label="Shop ID"
      color="btn-primary"
    />
    <q-input
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.invoiceNumber"
      label="Invoice Number"
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.startDate"
      :max="filterSearch.endDate"
      :min="filterSearch.endDate"
      label="From"
      type="date"
      style="min-width: 200px"
      outlined
      dense
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.endDate"
      label="To"
      type="date"
      style="min-width: 200px"
      outlined
      color="btn-primary"
      dense
    />
    <div class="flex lg:justify-end sm:justify-center items-end gap-2">
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
        icon="search"
        label="Search"
        @click="searchBills()"
      />
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
        label="Clear"
        @click="handleResetFilter()"
      />
    </div>
  </div>
  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="saleList"
      align="left"
      :columns="shopAllBillsTableColumn"
      row-key="id"
      v-model:pagination="pagination"
      @request="searchBills"
    >
      <template v-slot:no-data>
        <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
          <q-icon name="warning" size="xs" />
          <span class="text-md font-medium"> No data available. </span>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { shopAllBillsTableColumn, billStatusOptionList } from './utils';
import { getSaleListApi } from 'src/services';
import { ISaleListResponse } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { CanceledError } from 'axios';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Date = date.subtractFromDate(timeStamp, { date: 1 });
const formattedFromDate = date.formatDate(past1Date, 'YYYY-MM-DD');
const saleList = ref<ISaleListResponse[]>([]);
const apiController = ref<AbortController | null>(null);
const isLoading = ref(false);
const $q = useQuasar();
const filterSearch = ref<{
  selectStatus: null | string;
  shopId: null | string;
  invoiceNumber: null | string;
  startDate: null | string;
  endDate: null | string;
}>({
  selectStatus: null,
  shopId: null,
  invoiceNumber: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const searchBills = async (paginationData?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isLoading.value = true;
  if (paginationData) {
    pagination.value = {
      ...pagination.value,
      ...paginationData.pagination,
    };
  }
  const rowsPerPage =
    pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await getSaleListApi(
      {
        filterSearch: {
          statusId: filterSearch.value.selectStatus,
          shopId: filterSearch.value.shopId,
          invoiceNumber: filterSearch.value.invoiceNumber,
          fromDate: filterSearch.value.startDate,
          toDate: filterSearch.value.endDate,
        },
        pageNumber: pagination.value.page,
        pageSize: rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      saleList.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    selectStatus: null,
    shopId: null,
    invoiceNumber: null,
    startDate: null,
    endDate: null,
  };
  searchBills();
};
</script>
