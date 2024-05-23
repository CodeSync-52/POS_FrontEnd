<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Article Commission Report</span>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      outlined
      style="min-width: 200px; max-width: 200px"
      use-input
      @filter="filterFn"
      v-model="filterSearch.shopId"
      @update:model-value="filterSearch.shopId = $event.shopId"
      :options="shopListRecords"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
      map-options
      option-value="shopId"
      popup-content-class="!max-h-[200px]"
      option-label="name"
      label="Select Shop"
      color="btn-primary"
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
        @click="articleComissionReport()"
      />
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
        label="Clear"
        @click="handleResetFilter()"
      />
    </div>

    <div id="article_comission_report" class="container mx-auto mt-2">
      <div
        v-for="item in comissionReportData"
        :key="item.date"
        class="mb-8 border p-2"
      >
        <div class="my-4 flex flex-row items-center gap-2 px-1">
          <span class="text-lg font-bold"> {{ item.date }}</span>
        </div>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                PairSale
              </th>
              <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                Comission
              </th>
              <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comissionDetail in item.comissionDetails"
              :key="comissionDetail.pairSale"
            >
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ comissionDetail.pairSale }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ comissionDetail.comission }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ comissionDetail.total }}
              </td>
            </tr>
            <tr>
              <td
                class="border border-gray-300 px-4 py-2 text-center font-bold"
              >
                P.Total :{{ item.totalPairs }}
              </td>
              <td
                class="border border-gray-300 px-4 py-2 text-center font-bold"
              ></td>
              <td
                class="border border-gray-300 px-4 py-2 text-center font-bold"
              >
                G.Total :{{ item.totalValue }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IShopResponse, EUserRoles, IComissionReport } from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { GetComissionReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const shopListRecords = ref<IShopResponse[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const comissionReportData = ref<IComissionReport[]>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopId: number | null;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopId: null,
});
onMounted(async () => {
  await getShopList();
  filterSearch.value.shopId =
    authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
});
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
    });
    if (response.data) {
      shopListRecords.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred while fetching shop list';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
};
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    shopListRecords.value = shopListRecords.value.filter((v) =>
      v.name?.toLowerCase().includes(needle)
    );
  });
};
const articleComissionReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopId) {
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
    const res = await GetComissionReport({
      shopId: filterSearch.value.shopId,
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      comissionReportData.value = res.data;
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
    filterSearch.value.shopId = null;
  }
  comissionReportData.value = [];
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
</script>
