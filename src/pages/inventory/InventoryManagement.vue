<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <div
        class="flex flex-col items-center justify-center md:flex-row q-gutter-sm"
      >
        <q-btn
          v-if="
            (authStore.checkUserHasPermission(
              EUserModules.InventoryManagement,
              EActionPermissions.Create
            ) &&
              authStore.loggedInUser?.rolePermissions.roleName ===
                EUserRoles.SuperAdmin.toLowerCase()) ||
            authStore.loggedInUser?.rolePermissions.roleName ===
              EUserRoles.Admin.toLowerCase()
          "
          label="Add Custom Barcode"
          icon="add"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          to="/inventory/add-custom"
        />
        <q-btn
          v-if="
            (authStore.checkUserHasPermission(
              EUserModules.InventoryManagement,
              EActionPermissions.Create
            ) &&
              authStore.loggedInUser?.rolePermissions.roleName ===
                EUserRoles.SuperAdmin.toLowerCase()) ||
            authStore.loggedInUser?.rolePermissions.roleName ===
              EUserRoles.Admin.toLowerCase()
          "
          label="Add New"
          icon="add"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          to="/inventory/add-new"
        />
      </div>
    </div>
    <div
      class="row flex md:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-input
        v-model="filterSearch.ProductCode"
        maxlength="250"
        outlined
        dense
        color="btn-primary"
        label="Product Code"
      />
      <q-select
        popup-content-class="!max-h-[200px]"
        class="max-w-[220px] min-w-[220px]"
        @filter="filterShop"
        :options="ShopOptionData"
        :loading="isLoading"
        use-input
        dense
        map-options
        outlined
        v-model="filterSearch.ShopId"
        @update:model-value="filterSearch.ShopId = $event.shopId"
        label="Select Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >
      <q-select
        popup-content-class="!max-h-[200px]"
        class="max-w-[220px] min-w-[220px]"
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
    <div class="py-4">
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
  </div>
  <q-dialog v-model="isPreviewImageModalVisible">
    <q-card class="min-w-[400px]">
      <q-card-section>
        <div class="w-full max-h-[350px] overflow-hidden">
          <img :src="selectedPreviewImage" alt="image" class="mx-auto" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IArticleData,
  IInventoryFilterSearch,
  IInventoryListResponse,
  IShopResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { articleListApi, inventoryDetailApi, shopListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.InventoryManagement);
const InventoryListRecords = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const articleList = ref<IArticleData[]>([]);
const ShopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
onMounted(() => {
  getArticleList();
  getShopList();
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
  ProductCode: null,
  ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
});
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ProductId: null,
    ProductCode: null,
    ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
  };
  getInventoryList();
};
const getShopList = async () => {
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      ShopData.value = response.data.items;
      ShopOptionData.value = response.data.items;
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
    isLoading.value = false;
  }
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
        ShopId: filterSearch.value.ShopId,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      InventoryListRecords.value = res.data.inventoryDetails;
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
const filterShop = (val: string, update: any) => {
  update(() => {
    const needle = val.toLowerCase();
    ShopOptionData.value = ShopData.value.filter((v) =>
      v.name.toLowerCase().includes(needle)
    );
  });
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
</script>
