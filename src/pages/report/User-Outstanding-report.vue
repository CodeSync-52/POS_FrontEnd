<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">User OutStanding Balance Reports</span>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroupId"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.customerGroupId = $event.customerGroupId
        "
        :loading="isLoading"
        label="Select User Category"
        option-label="name"
        option-value="customerGroupId"
        color="btn-primary"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-checkbox
        v-model="filterSearch.includeZeroBalance"
        color="btn-primary"
        label="Include Zero Balance"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          :disable="
            filterSearch.customerGroupId !== null &&
            filterSearch.customerGroupId < 0
          "
          @click="getUserOutStandingBalanceReportList()"
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
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="reportData"
        :columns="outStandingReportColumn"
        :pagination="{ rowsPerPage: 0 }"
      >
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { IAccountReportData, ICustomerListResponse } from 'src/interfaces';
import { getCustomerGroupList } from 'src/services';
import { userOutStandingReportListApi } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { outStandingReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const reportData = ref<IAccountReportData[]>([]);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const filterSearch = ref<{
  customerGroupId: null | number;
  includeZeroBalance: boolean;
}>({
  customerGroupId: null,
  includeZeroBalance: false,
});

onMounted(() => {
  getCustomerListOption();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});

async function getCustomerListOption() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getCustomerGroupList({ status: 'Active' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupList.value = res?.data;
    }
    isLoading.value = false;
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
    isLoading.value = false;
  }
}

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    customerGroupId: null,
    includeZeroBalance: false,
  };
  getUserOutStandingBalanceReportList();
};

const getUserOutStandingBalanceReportList = async () => {
  if (isLoading.value) return;
  if (!filterSearch.value.customerGroupId) {
    let message = 'Please select user category';
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
    return;
  }
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await userOutStandingReportListApi(
      {
        customerGroupId: filterSearch.value.customerGroupId,
        includeZeroBalance: filterSearch.value.includeZeroBalance,
      },
      apiController.value
    );
    if (res?.data) {
      reportData.value = res.data?.list;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
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
