<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Best Selling Article Report</span>
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
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="selectedMonth"
      :options="monthOptions"
      map-options
      multiple
      clearable
      popup-content-class="!max-h-[200px]"
      label="Select Month"
      option-label="name"
      option-value="monthId"
      color="btn-primary"
    >
    </q-select>
    <q-select
      :loading="isLoading"
      class="min-w-[250px]"
      dense
      popup-content-class="!max-h-[200px]"
      map-options
      outlined
      clearable
      v-model="user"
      :options="userList"
      label="Select User"
      color="btn-primary"
      option-label="fullName"
      option-value="userId"
      ><template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template></q-select
    >
    <div class="flex gap-6">
      <div class="q-gutter-sm">
        <div class="flex items-center gap-2 font-[500] text-base">
          <span>Top Products Count</span>
          <q-input
            v-model="topProductCount"
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
          @click="searchBestSellingArticleReport()"
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
    <div id="shop-article-quantity-sale" class="container mx-auto mt-2">
      <div class="md:flex">
        <div
          v-for="item in reportData"
          :key="item.year"
          class="mb-8 border p-2 md:w-1/3"
        >
          <div
            class="my-4 flex flex-row items-center justify-center gap-2 px-1"
          >
            <div class="text-lg font-bold">
              <div>{{ item.year }}</div>
            </div>
          </div>
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Article
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Image
                </th>
                <th class="border border-gray-300 bg-gray-100 px-4 py-2">
                  Sale Qty
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="details in item.details" :key="details.productId">
                <td class="border border-gray-300 px-4 py-2">
                  {{ details.article }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <div
                    class="max-h-[90px] max-w-[90px] min-w-[2rem] overflow-hidden mx-auto"
                  >
                    <img
                      class="w-full h-full object-cover"
                      :src="details.image || 'assets/default-image.png'"
                      alt="img"
                    />
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  {{ details.saleQty }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">
                  Total
                </td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center font-bold"
                ></td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center font-bold"
                >
                  {{ calculateTotalSaleQty(item.details) }}
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
  IBestSellingArticleReportData,
  IBestSellingArticle,
  IUserResponse,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { monthOptions } from 'src/utils/reports';
import { GetUsers } from 'src/services';
import { GetBestSellingArticleReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const reportData = ref<IBestSellingArticleReportData[]>([]);
const selectedShop = ref<IShopResponse[]>([]);
const userList = ref<IUserResponse[]>([]);
const selectedMonth = ref<IBestSellingArticle[]>([]);
const topProductCount = ref(50);
const user = ref<IUserResponse | null>(null);
onMounted(async () => {
  await getShopList();
  getUserList();
  if (
    authStore.loggedInUser?.rolePermissions.roleName ===
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName ===
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    const defaultShop = shopData.value.find(
      (shop) =>
        shop.shopId === (authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1)
    );
    selectedShop.value = defaultShop ? [defaultShop] : [];
  } else {
    selectedShop.value = shopData.value.length > 0 ? shopData.value : [];
  }
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
const getUserList = async () => {
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res.data) {
      userList.value = res.data.items.filter(
        (user) =>
          user.status === 'Active' &&
          user.roleName === 'Customer' &&
          user.customerGroup === 'Shoe Makers'
      );
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
  }
};
const searchBestSellingArticleReport = async () => {
  isLoading.value = true;
  if (!selectedShop.value?.map((shop) => shop.shopId).join(',')) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  } else if (!selectedMonth.value?.map((month) => month.monthId).join(',')) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Months',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    const res = await GetBestSellingArticleReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      months: selectedMonth.value?.map((month) => month.monthId).join(','),
      topProductCount: topProductCount.value,
      userId: user.value?.userId ?? 0,
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
  selectedMonth.value = [];
  topProductCount.value = 50;
  user.value = null;
};
const calculateTotalSaleQty = (details: { saleQty: number }[]) => {
  return details.reduce((total, item) => total + item.saleQty, 0);
};
</script>
