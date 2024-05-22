<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Shelf Article Sale Report</span>
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
    <div class="flex gap-6">
      <div class="q-gutter-sm">
        <div class="flex items-center gap-2 font-[500] text-base">
          <span>Sale Quantity Less Than</span>
          <q-input
            v-model="filterSearch.SaleQuantity"
            type="number"
            style="max-width: 70px"
            outlined
            dense
            color="btn-primary"
          />
        </div>
      </div>
      <div class="flex lg:justify-end sm:justify-center items-end gap-2">
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="searchShelfArticleSaleReport()"
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
  </div>
  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="reportData"
      align="left"
      :columns="shelfArticleSaleReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="searchShelfArticleSaleReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportData.length > 0"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <div
            class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
            :class="props.row.image"
          >
            <img
              class="w-full h-full object-cover"
              :src="props.row.image || 'assets/default-image.png'"
              alt="img"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
          <q-icon name="warning" size="xs" />
          <span class="text-md font-medium"> No data available. </span>
        </div>
      </template>
      <template v-if="reportData.length" v-slot:bottom-row>
        <q-tr class="sticky bottom-0 bg-white">
          <q-td colspan="2" class="text-bold"> Total </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('retailPrice') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('totalSale') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('totalStock') }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IShelfArticleSaleReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { shelfArticleSaleReportColumn } from 'src/utils/reports';
import { GetShelfArticleSaleReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const reportData = ref<IShelfArticleSaleReportData[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
  SaleQuantity: number;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
  SaleQuantity: 5,
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
const searchShelfArticleSaleReport = async () => {
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
    const res = await GetShelfArticleSaleReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      saleQuantity: filterSearch.value.SaleQuantity,
    });
    if (res.data) {
      reportData.value = res.data;
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
  } finally {
    isLoading.value = false;
  }
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
  filterSearch.value.SaleQuantity = 5;
};
const calculateTotal = (columnName: keyof (typeof reportData.value)[0]) => {
  return reportData.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
</script>
