<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Cash Closing Report</span>
    <q-btn-dropdown
      dropdown-icon="arrow_downward"
      label="Download Report"
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
    >
      <q-list>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Download in PDF</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      style="min-width: 200px"
      outlined
      map-options
      :options="shopData"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
      v-model="selectedShop"
      popup-content-class="!max-h-[200px]"
      label="Select Shop"
      color="btn-primary"
      multiple
      clearable
      option-label="name"
      option-value="shopId"
    />
    <q-input
      v-model="filterSearch.fromDate"
      :max="filterSearch.toDate"
      label="From"
      type="date"
      style="min-width: 200px"
      outlined
      dense
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.toDate"
      :min="filterSearch.fromDate"
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
        @click="searchCashClosingReport()"
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
    <q-card
      class="my-8"
      v-for="(shopReport, shopIndex) in groupedReportData"
      :key="shopIndex"
    >
      <div class="px-4">
        <div class="Shop flex gap-6">
          <span class="font-medium md:text-lg">{{ shopReport.shop }} :</span>
          <div class="flex gap-3">
            <div class="md:flex gap-2 items-center">
              <span class="font-medium md:text-lg">Total Net Sale :</span>
              <span class="md:text-lg">
                {{ getTotalNetSale(shopReport.reports) }} ,</span
              >
            </div>
            <div class="md:flex gap-2 items-center">
              <span class="font-medium md:text-lg">Total Expense :</span>
              <span class="md:text-lg">
                {{ getTotalExpense(shopReport.reports) }} ,</span
              >
            </div>
          </div>
        </div>
        <div class="Details flex gap-6">
          <span class="font-medium md:text-lg"> Details :</span>
          <div class="flex gap-3">
            <div class="md:flex gap-2 items-center">
              <span class="font-medium md:text-lg">Unique User :</span>
              <span class="md:text-lg"> {{ '0' }} ,</span>
            </div>
          </div>
        </div>
      </div>
      <div class="py-4 px-2">
        <q-section
          v-for="(dateReport, dateIndex) in shopReport.reports"
          :key="dateIndex"
        >
          <div class="px-2">
            <div class="DateWiseShopDetail flex gap-6">
              <span class="font-medium md:text-lg">
                {{ date.formatDate(dateReport.date, 'YYYY-MM-DD') }}
              </span>
              <div class="flex gap-3">
                <div class="md:flex gap-2 items-center">
                  <span class="font-medium md:text-lg">Net Sale :</span>
                  <span class="md:text-lg"> {{ dateReport.netSale }} ,</span>
                </div>
                <div class="md:flex gap-2 items-center">
                  <span class="font-medium md:text-lg">Total Expense :</span>
                  <span class="md:text-lg">
                    {{ dateReport.totalExpense }} ,</span
                  >
                </div>
                <div class="md:flex gap-2 items-center">
                  <span class="font-medium md:text-lg"
                    >Remaining Expense :</span
                  >
                  <span class="md:text-lg">
                    {{ dateReport.remainingBalance }} ,</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="py-4">
            <q-table
              :loading="isLoading"
              tabindex="0"
              :rows="dateReport.submitToHODetails"
              align="left"
              :columns="cashClosingUserExpenseColumn"
              row-key="id"
              :rows-per-page-options="[0]"
              :pagination="{ rowsPerPage: 0 }"
              :hide-bottom="dateReport.submitToHODetails.length > 0"
            >
              <template v-slot:no-data>
                <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                  <q-icon name="warning" size="xs" />
                  <span class="text-md font-medium"> No Data available. </span>
                </div>
              </template>
            </q-table>
          </div>
        </q-section>
      </div>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IShopResponse, EUserRoles, ICashClosinReport } from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { cashClosingUserExpenseColumn } from 'src/utils/reports';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { GetCashClosingReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
});
const reportData = ref<ICashClosinReport[]>([]);
onMounted(async () => {
  await getShopList();
  const defaultShop = shopData.value.find(
    (shop) =>
      shop.shopId === (authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1)
  );
  selectedShop.value = defaultShop ? [defaultShop] : [];
});
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopData.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isFetchingShopList.value = false;
  }
};
const searchCashClosingReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopIds) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  } else if (!filterSearch.value.fromDate || !filterSearch.value.toDate) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select From and To Date',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    const res = await GetCashClosingReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      reportData.value = (res.data as ICashClosinReport[]).map((item) => ({
        shop: item.shop,
        netSale: item.netSale,
        totalExpense: item.totalExpense,
        remainingBalance: item.remainingBalance,
        date: item.date,
        submitToHODetails: item.submitToHODetails,
      }));
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
const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    selectedShop.value = [];
  }
  reportData.value = [];
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
const groupedReportData = computed(() => {
  const groupedByShop = reportData.value.reduce((acc, report) => {
    const existingShopIndex = acc.findIndex(
      (group) => group.shop === report.shop
    );
    if (existingShopIndex !== -1) {
      acc[existingShopIndex].reports.push(report);
    } else {
      acc.push({
        shop: report.shop,
        reports: [report],
      });
    }
    return acc;
  }, [] as { shop: string; reports: ICashClosinReport[] }[]);
  return groupedByShop;
});
const getTotalNetSale = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.netSale, 0);
};
const getTotalExpense = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.totalExpense, 0);
};
</script>
