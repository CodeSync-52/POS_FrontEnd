<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <router-link to="/return/add-new">
        <q-btn
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.SaleAndReturnManagement,
              EActionPermissions.Create
            )
          "
          unelevated
          label="Add New"
          icon="add"
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
        />
      </router-link>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        :loading="isFetchingShopList"
        popup-content-class="!max-h-[200px]"
        :options="shopData"
        class="max-w-[200px] min-w-[200px]"
        use-input
        dense
        map-options
        outlined
        v-model="selectedShop.fromShop"
        @update:model-value="handleUpdateShop($event)"
        label="Select Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >
      <q-select
        dense
        outlined
        :options="['', '']"
        style="min-width: 200px"
        v-model="filterSearch.ProductId"
        label="Select Product"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.ProductCode"
        maxlength="250"
        outlined
        label="Product Code"
        autofocus
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.keyword"
        maxlength="250"
        outlined
        label="Keyword"
        autofocus
        dense
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getInventoryDetailList()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :rows="ShopDetailRecords"
        v-model:pagination="pagination"
        @request="getInventoryDetailList"
        :columns="InventoryListColumn"
        :loading="isFetchingRecords"
      >
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
        <template v-slot:body-cell-productImage="props">
          <q-td :props="props">
            <div
              @click="handlePreviewImage(props.row.productImage)"
              class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
              :class="props.row.productImage ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="
                  getImageUrl(props.row.productImage) ||
                  'assets/default-image.png'
                "
                alt="img"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isPreviewImageModalVisible">
      <q-card class="min-w-[400px]">
        <q-card-section>
          <div class="w-full max-h-[350px] overflow-hidden">
            <img
              :src="selectedPreviewImage"
              alt="image"
              class="mx-auto w-full h-full bg-contain"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IInventoryListResponse,
  IShopResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { inventoryDetailApi, shopListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { ref, onMounted, onUnmounted } from 'vue';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.SaleAndReturnManagement
);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
const filterSearch = ref({
  wholeSaleStatus: '',
  keyword: '',
  ProductId: null,
  ShopId: selectedShop.value.fromShop?.shopId ?? null,
  ProductCode: '',
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const ShopDetailRecords = ref<IInventoryListResponse[]>([]);
const shopData = ref<IShopResponse[]>([]);
const $q = useQuasar();
const isFetchingShopList = ref(false);
const isFetchingRecords = ref(false);
const isPreviewImageModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const selectedPreviewImage = ref('');

onMounted(() => {
  getShopList();
  if (selectedShop.value)
    selectedShop.value.fromShop = {
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      closingBalance: 0,
      status: '',
      isWareHouse: '',
      name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
      phone: '',
      address: '',
      code: '',
    };
  getInventoryDetailList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const handleUpdateShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShop = newVal;
  filterSearch.value.ShopId = newVal.shopId;
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
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
const getInventoryDetailList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isFetchingRecords.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    if (isFetchingRecords.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await inventoryDetailApi(
      {
        ShopId:
          filterSearch.value.ShopId ??
          authStore.loggedInUser?.userShopInfoDTO.shopId ??
          -1,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      ShopDetailRecords.value = res.data.inventoryDetails;
      pagination.value.rowsNumber = res.data.totalCountInventoryDetails;
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
  isFetchingRecords.value = false;
};
</script>
