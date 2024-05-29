<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-xl font-medium">Shop Wise Stock Transfer Report</span>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
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
          <q-radio
            v-model="filterSearch.sortBySale"
            color="btn-primary"
            val="true"
            label="Sort by Sale"
          />
          <q-radio
            v-model="filterSearch.sortBySale"
            color="btn-primary"
            val="false"
            label="Sort by Stock"
          />
        </div>
      </div>
      <div class="flex lg:justify-end sm:justify-center items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="searchShopwiseStockTransferReport()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter()"
        />
      </div>
    </div>
    <div id="shop-article-quantity-sale" class="container mx-auto mt-2">
      <div>
        <div
          v-for="item in shopwiseStockTransferResponse"
          :key="item.productId"
          class="mb-8 border p-2"
        >
          <div class="my-4 flex flex-row items-center gap-2 px-1">
            <div>
              <img
                :src="item.image ?? ''"
                alt="Product Image"
                class="w-16 h-16 my-2"
              />
            </div>
            <div class="text-lg font-bold">
              <div>{{ item.article }}</div>
              <div>Retail Price: {{ item.retailPrice }}</div>
              <div
                v-if="
                  authStore.loggedInUser?.rolePermissions.roleName ===
                  EUserRoles.SuperAdmin.toLowerCase()
                "
              >
                WholeSale Price: {{ item.wholeSalePrice }}
              </div>
            </div>
          </div>
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Shop Name
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Stock
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Sale Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="shopDetail in item.shopDetail" :key="shopDetail.shop">
                <td class="border border-gray-300 px-4 py-2">
                  {{ shopDetail.shop }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ shopDetail.stock }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ shopDetail.saleQuantity }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">
                  Total
                </td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center font-bold"
                >
                  {{ item.totalStock }}
                </td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center font-bold"
                >
                  {{ item.totalSale }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IShopwiseStockTransferReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { GetShopwiseStockTransferReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const shopwiseStockTransferResponse = ref<IShopwiseStockTransferReportData[]>(
  []
);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
  sortBySale: string;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
  sortBySale: 'true',
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
const searchShopwiseStockTransferReport = async () => {
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
    const res = await GetShopwiseStockTransferReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      sortBySale: filterSearch.value.sortBySale === 'true' ? true : false,
    });
    if (res.data) {
      shopwiseStockTransferResponse.value = res.data;
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
  shopwiseStockTransferResponse.value = [];
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
</script>
