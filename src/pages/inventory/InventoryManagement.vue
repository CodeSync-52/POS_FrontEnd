<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.InventoryManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="router.push('/inventory/add-new')"
      />
    </div>
    <div
      class="row flex md:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        class="max-h-[200px]"
        @filter="filterProduct"
        :options="articleList"
        :loading="isFetchingArticleList"
        use-input
        dense
        map-options
        outlined
        v-model="filterSearch.ProductId"
        @update:model-value="filterSearch.ProductId = $event.productId"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getInventoryList()"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
        />
      </div>
    </div>
    <div>
      <q-table
        :columns="InventoryListColumn"
        :rows="InventoryListRecords"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getInventoryList"
        ><template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IArticleData,
  IInventoryFilterSearch,
  IInventoryListResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { articleListApi, inventoryDetailApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const pageTitle = getRoleModuleDisplayName(EUserModules.InventoryManagement);
const InventoryListRecords = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const articleList = ref<IArticleData[]>([]);
onMounted(() => {
  getInventoryList();
  getArticleList();
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const $q = useQuasar();
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
});
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ProductId: null,
  };
  getInventoryList();
};
const getInventoryList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
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
    const res = await inventoryDetailApi(
      {
        ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      // if (Object.values(filterSearch.value).some((item) => item !== null)) {
      InventoryListRecords.value = res.data.inventoryDetails;
      // pagination.value.rowsNumber = res.data.totalItemCount;
      // } else {
      //   InventoryListRecords.value = [];
      // }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isLoading.value = false;
};
const isFetchingArticleList = ref(false);
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({
      PageNumber: 1,
      PageSize: 50,
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
const filterProduct = (val: string, update: any) => {
  update(() => {
    getArticleList(val);
  });
};
</script>
