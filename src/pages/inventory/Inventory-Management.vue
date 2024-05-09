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
          label="Add Custom Barcode"
          icon="add"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          to="/custom-barcode"
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

        <q-btn
          label="Download in Excel"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          @click="downloadCSVData"
        ></q-btn>
      </div>
    </div>
    <div
      class="row flex md:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-input
        maxlength="250"
        v-model="filterSearch.categoryName"
        dense
        readonly
        label="Select Category"
        outlined
        @click="addCategory"
        color="btn-primary"
      />
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
        multiple
        clearable
        dense
        map-options
        outlined
        v-model="filterSearch.ShopId"
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
        autofocus
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

      <div class="text-[16px] font-bold text-btn-primary pb-1 pr-4">
        Total Qty. : {{ totalAvailableQuantity }}
      </div>
      <div class="text-[16px] font-bold text-btn-primary pb-1 pr-4">
        Total Ret. Price : {{ totalRetailProce }}
      </div>

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
      </div>
    </div>
    <div class="py-4">
      <q-table
        :columns="InventoryBasicColumn"
        :rows="filteredInvDetailList"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getInventoryList"
      >
        <template v-slot:top-right>
          <div class="flex gap-2" v-if="InventoryListRecords.length > 0">
            <q-input
              v-model="filteredData.size"
              outlined
              dense
              label="Size"
              color="btn-primary"
              @change="filterSelectedShopDetailList"
            />
            <q-input
              v-model="filteredData.color"
              outlined
              dense
              label="Color"
              color="btn-primary"
              @change="filterSelectedShopDetailList"
            />
            <q-checkbox
              v-model="filteredData.excludeZeroQuantity"
              color="btn-primary"
              label="Exclude Zero Quantity"
              @change="filterSelectedShopDetailList"
            />
          </div>
        </template>

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
              class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden"
              :class="props.row.productImage ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.productImage || 'assets/default-image.png'"
                alt="img"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td>
            <q-btn
              v-if="
                authStore.loggedInUser?.rolePermissions.roleName !==
                EUserRoles.SuperAdmin.toLowerCase()
              "
              icon="content_copy"
              unelevated
              dense
              size="sm"
              @click="handleDuplicateInventory(props.row.inventoryId)"
            />
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
  <q-dialog v-model="isCategoryModalVisible">
    <article-category-modal @category-selected="handleSelectedCategory" />
  </q-dialog>
</template>

<script setup lang="ts">
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { exportFile, useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IArticleData,
  IInventoryListResponse,
  IShopResponse,
  getRoleModuleDisplayName,
  IInventoryFilterSearchWithShopId,
} from 'src/interfaces';
import {
  DuplicateInventory,
  GetArticleList,
  GetInventoryDetail,
  GetShopList,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { ITableItems, isPosError } from 'src/utils';
import { InventoryBasicColumn } from 'src/utils/inventory';
import { wrapCsvValue } from 'src/services/reports';
import moment from 'moment';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.InventoryManagement);
const InventoryListRecords = ref<IInventoryListResponse[]>([]);
const filteredInvDetailList = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const isCategoryModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const articleList = ref<IArticleData[]>([]);
const ShopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const filterSearch = ref<IInventoryFilterSearchWithShopId>({
  ProductId: null,
  ProductCode: null,
  ShopId: [],
  keyword: null,
  categoryName: '',
  CategoryId: null,
});
const tableItems = ref<ITableItems[][]>([]);
onMounted(async () => {
  getArticleList();
  await getShopList();

  filterSearch.value.ShopId?.push(...ShopData.value);
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 0,
});
const filteredData = ref<{
  size: string;
  color: string;
  excludeZeroQuantity: boolean;
}>({
  size: '',
  color: '',
  excludeZeroQuantity: true,
});
const totalAvailableQuantity = computed(() => {
  return filteredInvDetailList.value.reduce(
    (total, item) => total + item.quantity,
    0
  );
});

const totalRetailProce = computed(() => {
  return filteredInvDetailList.value.reduce(
    (total, item) => total + item.retailPrice,
    0
  );
});
const $q = useQuasar();
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  filterSearch.value.categoryName = selectedCategory.categoryName;
  filterSearch.value.CategoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const getShopList = async () => {
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
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
    const rowsPerPage =
      pagination.value.rowsPerPage === 0
        ? 10000000
        : pagination.value.rowsPerPage;
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetInventoryDetail(
      {
        // ShopId: filterSearch.value.ShopId?.map((shop) => shop.shopId).join(','),
        ShopId: filterSearch.value.ShopId
          ? filterSearch.value.ShopId.map((shop) => shop.shopId).join(',')
          : null,
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      InventoryListRecords.value = res.data.inventoryDetails;
      pagination.value.rowsNumber = res.data.totalCountInventoryDetails;
      tableItems.value = await convertArrayToPdfData(res.data.inventoryDetails);
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
    const res = await GetArticleList({
      PageNumber: 1,
      PageSize: 1000000,
      Status: 'Active',
      Name: productName,
      CategoryId: null,
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
const filterProduct = (val: string, update: CallableFunction) => {
  update(() => {
    getArticleList(val);
  });
};
const filterShop = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    ShopOptionData.value = ShopData.value.filter((v) =>
      v.name.toLowerCase().includes(needle)
    );
  });
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const filterSelectedShopDetailList = () => {
  filteredInvDetailList.value = InventoryListRecords.value.filter((item) => {
    let sizeMatch = true;
    let colorMatch = true;
    let excludeZero = true;
    if (filteredData.value.size) {
      sizeMatch =
        item.size
          ?.toLowerCase()
          ?.includes(filteredData.value.size.toLowerCase()) || false;
    }

    if (filteredData.value.color) {
      colorMatch =
        item.color
          ?.toLowerCase()
          .includes(filteredData.value.color.toLowerCase()) || false;
    }

    if (filteredData.value.excludeZeroQuantity) {
      excludeZero = item.quantity !== 0 ? true : false;
    }

    return sizeMatch && colorMatch && excludeZero;
  });
};
watch([filteredData, InventoryListRecords], filterSelectedShopDetailList, {
  deep: true,
});

watch(filteredData, async (newValue) => {
  if (!newValue) {
    filteredInvDetailList.value = InventoryListRecords.value;
  }
});
const downloadCSVData = () => {
  const selectedColumnsData = InventoryBasicColumn.filter(
    (col) => col.name !== 'productImage'
  );
  const content = [selectedColumnsData.map((col) => wrapCsvValue(col.label))]
    .concat(
      filteredInvDetailList.value.map((row: any) =>
        selectedColumnsData
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status = exportFile(
    `Inventory-Management-${moment().format('DD/MM/YYYY')}.csv`,
    content,
    'text/csv'
  );

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};

async function convertArrayToPdfData(array: IInventoryListResponse[]) {
  const tableStuff = [];
  const headerRow = [
    'Row#',
    'Article',
    'Shop Name',
    'Size',
    'Retail Price',
    'Available Quantity',
  ];
  tableStuff.push(headerRow);

  array.forEach((item: IInventoryListResponse, index: number) => {
    const row = [
      {
        text: index + 1,
      },
      { text: item.productName },
      { text: item.shopName },
      { text: item.size },
      { text: item.retailPrice },
      { text: item.quantity },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}

const handleDuplicateInventory = async (inventoryId: number) => {
  try {
    const res = await DuplicateInventory({
      inventoryId,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: 'Duplicate successfully',
        type: 'positive',
      });
    }
  } catch (error) {
    let message = '';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
</script>
