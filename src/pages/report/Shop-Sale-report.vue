<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Date Wise Shop Sale Report</span>
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
        authStore.loggedInUser?.rolePermissions.roleName !==
        EUserRoles.SuperAdmin.toLowerCase()
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
        @click="searchShopSaleReport()"
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
      class="max-h-[39.5vh] lg:max-h-[55vh] 3xl:max-h-[65vh]"
      :loading="isLoading"
      tabindex="0"
      :rows="reporttList"
      align="left"
      :columns="shopsaleReportColumn"
      row-key="id"
      @request="searchShopSaleReport()"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            unelevated
            dense
            size="sm"
            icon="visibility"
            color="green"
            @click="router.push(`/shop-account/${props.row.shopAccountId}`)"
          >
            <q-tooltip class="bg-green" :offset="[10, 10]">
              Preview Bill
            </q-tooltip>
          </q-btn>
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
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IDateWiseShopReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { shopsaleReportColumn } from 'src/utils/reports';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { GetDateWiseShopSaleReport } from 'src/services/reports';
const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const reporttList = ref<IDateWiseShopReportData[]>([]);
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past7Date = date.subtractFromDate(timeStamp, { date: 7 });
const formattedFromDate = date.formatDate(past7Date, 'YYYY-MM-DD');
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
const searchShopSaleReport = async () => {
  try {
    const res = await GetDateWiseShopSaleReport({
      shopIds: selectedShop.value!.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      reporttList.value = (res.data as { list: [] }).list;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Add Cash Flow';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
};
const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName ===
    EUserRoles.SuperAdmin.toLowerCase()
  ) {
    selectedShop.value = [];
    reporttList.value = [];
  } else {
    reporttList.value = [];
  }
};
</script>
