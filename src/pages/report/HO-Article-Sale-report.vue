<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">HO Article Sale Report</span>
      <download-pdf-excel />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        style="min-width: 240px"
        outlined
        v-model="filterSearch.purchaseFromCustomerGroup"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.purchaseFromCustomerGroup = $event.customerGroupId
        "
        :loading="isLoading"
        label="Sel. Purchase from user cat."
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
      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.purchaseFromCustomer"
        @update:model-value="filterSearch.purchaseFromCustomer = $event.userId"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="Sel. Purchase from user"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 240px"
        outlined
        v-model="filterSearch.saleToCustomerGroup"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.saleToCustomerGroup = $event.customerGroupId
        "
        :loading="isLoading"
        label="Sel. Sale to user Cat."
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

      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.saleToCustomer"
        @update:model-value="filterSearch.saleToCustomer = $event.userId"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="Sel. Sale to user"
        color="btn-primary"
      />
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        multiple
        outlined
        :options="articleList"
        v-model="filterSearch.ProductId"
        @filter="handleFilterArticles"
        :loading="isFetchingArticleList"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model="filterSearch.startDate"
        label="From"
        :max="filterSearch.endDate"
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
        :min="filterSearch.startDate"
        outlined
        color="btn-primary"
        dense
      />
      <div class="q-gutter-sm">
        <q-radio
          v-model="filterSearch.sortByQty"
          color="btn-primary"
          val="true"
          label="Sort by Qty"
        />
        <q-radio
          v-model="filterSearch.sortByQty"
          color="btn-primary"
          val="false"
          label="Sort by article"
        />
      </div>
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
        :columns="HOArticleReportColumn"
        :pagination="{ rowsPerPage: 0 }"
        ><template v-slot:body-cell-image="props">
          <q-td :props="props">
            <div
              class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
              :class="props.row.image ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.image || 'assets/default-image.png'"
                alt="img"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { date, useQuasar } from 'quasar';
import {
  IAccountReportData,
  IArticleData,
  ICustomerListResponse,
  IUserResponse,
} from 'src/interfaces';
import {
  articleListApi,
  getCustomerGroupList,
  getUserListApi,
} from 'src/services';
import { HOArticleSaleReportListApi } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { HOArticleReportColumn } from 'src/utils/reports';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { onMounted, onUnmounted, ref } from 'vue';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const articleList = ref<IArticleData[]>([]);
const reportData = ref<IAccountReportData[]>([]);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const options = ref<IUserResponse[]>([]);
const formattedFromDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const customerGroupList = ref<ICustomerListResponse[]>([]);
const isFetchingArticleList = ref(false);
const UserList = ref<IUserResponse[]>([]);
const filterSearch = ref<{
  purchaseFromCustomerGroup: null | number;
  purchaseFromCustomer: null | number;
  saleToCustomerGroup: null | number;
  saleToCustomer: null | number;
  includeZeroBalance: boolean;
  startDate: null | string;
  endDate: null | string;
  sortByQty: string;
  ProductId: IArticleData[];
}>({
  purchaseFromCustomerGroup: null,
  purchaseFromCustomer: null,
  saleToCustomerGroup: null,
  saleToCustomer: null,

  includeZeroBalance: false,
  startDate: formattedFromDate,
  endDate: formattedToDate,
  sortByQty: 'true',
  ProductId: [],
});

onMounted(() => {
  getCustomerListOption();
  getUserList();
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

const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    purchaseFromCustomerGroup: null,
    purchaseFromCustomer: null,
    saleToCustomerGroup: null,
    saleToCustomer: null,
    includeZeroBalance: false,
    startDate: formattedFromDate,
    endDate: formattedToDate,
    sortByQty: 'true',
    ProductId: [],
  };
  getUserOutStandingBalanceReportList();
};

const getUserOutStandingBalanceReportList = async () => {
  if (isLoading.value) return;
  if (!filterSearch.value.startDate || !filterSearch.value.endDate) {
    let message = 'Please select date range';
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
    const res = await HOArticleSaleReportListApi(
      {
        purchaseFromCustomer: filterSearch.value.purchaseFromCustomer ?? 0,
        purchaseFromCustomerGroup:
          filterSearch.value.purchaseFromCustomerGroup ?? 0,
        saleToCustomer: filterSearch.value.saleToCustomer ?? 0,
        saleToCustomerGroup: filterSearch.value.saleToCustomerGroup ?? 0,
        sortByQty: filterSearch.value.sortByQty === 'true' ? true : false,
        startDate: filterSearch.value.startDate,
        endDate: filterSearch.value.endDate,
        productIds: filterSearch.value.ProductId.map(
          (product) => product.productId
        ).join(','),
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
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({
      PageNumber: 1,
      PageSize: 1000000,
      Status: 'Active',
      Name: productName,
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
      }
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
  isFetchingArticleList.value = false;
};
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items.filter((x) => x.roleName === 'Customer');
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
  }
  isLoading.value = false;
};
</script>
