<template>
  <q-card class="!max-w-[800px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> Select Articles </span>
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>

      <div
        v-if="selectedShopDetailRecords.length > 0"
        class="row q-col-gutter-md mb-4"
      >
        <q-input
          class="min-w-[200px] max-w-[200px]"
          v-model="filteredData.size"
          outlined
          dense
          label="Size"
          color="btn-primary"
          @change="filterSelectedShopDetailList"
        />
        <q-input
          class="min-w-[200px] max-w-[200px]"
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
      <div class="row reverse q-col-gutter-md mb-4">
        <div class="col-12 col-sm-6">
          <div
            class="flex justify-center md:justify-end w-full items-end h-full gap-2"
          >
            <!-- <q-btn
              unelevated
              :loading="isLoading"
              color=""
              class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
              icon="search"
              label="Search"
              :disable="!filterSearch.ProductId"
              @click="handleSearchArticles"
            /> -->
            <q-btn
              unelevated
              color=""
              class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
              label="Clear"
              @click="handleRemoveInventoryFilter"
            />
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>Filter by Product</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            class="min-w-[220px]"
            ref="productSelectInputRef"
            @popup-hide="handlePopupShow"
            use-input
            dense
            autofocus
            map-options
            clearable
            outlined
            :options="articleList"
            v-model="filterSearch.ProductId"
            @filter="handleFilterArticles"
            :loading="isFetchingArticleList"
            @update:model-value="filterSearch.ProductId = $event?.productId"
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
        </div>
      </div>
      <q-table
        :columns="InventoryListColumn"
        :rows="filteredShopDetailList"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        v-model:selected="selected"
        row-key="inventoryId"
        selection="multiple"
        class="max-h-[400px]"
        align="left"
        :loading="isLoading"
      >
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available.</span>
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
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        label="Cancel"
        flat
        unelevated
        color="signature"
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleSaveSelectedInventory"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import {
  IArticleData,
  IInventoryFilterSearch,
  IInventoryListResponse,
  IPagination,
  ISaleInfo,
} from 'src/interfaces';
import { GetArticleList, GetInventoryDetail } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { ref, watch, onMounted } from 'vue';
import { QSelect } from 'quasar';
const productSelectInputRef = ref<QSelect | null>(null);
const $q = useQuasar();
const authStore = useAuthStore();
const articleList = ref<IArticleData[]>([]);
const selected = ref([]);
const apiController = ref<AbortController | null>(null);
const isFetchingRecords = ref(false);
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100000,
  rowsNumber: 0,
});
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
const filteredShopDetailList = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const isFetchingArticleList = ref(false);
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
  keyword: null,
  CategoryId: null,
  categoryName: '',
});
onMounted(async () => {
  window.addEventListener('keydown', handleActionKeys);
});
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const emit = defineEmits<{
  (event: 'selected-data', payload: ISaleInfo[]): void;
}>();
const handleSaveSelectedInventory = () => {
  emit('selected-data', selected.value);
};
const handleSearchArticles = () => {
  inventoryDetailList();
};
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const handlePopupShow = () => {
  if (productSelectInputRef.value) {
    if (filterSearch.value.ProductId !== null) {
      handleSearchArticles();
    }
  }
};
const handleActionKeys = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.key === 's' || e.key === 'S') {
      handleSaveSelectedInventory();
    }
  }
};
const handleRemoveInventoryFilter = () => {
  isLoading.value = true;
  filterSearch.value.ProductId = null;
  selectedShopDetailRecords.value = [];
  isLoading.value = false;
};
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
const inventoryDetailList = async (data?: {
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
    const res = await GetInventoryDetail(
      {
        ShopId:
          authStore.loggedInUser?.userShopInfoDTO.shopId?.toString() ?? '-1',
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      selectedShopDetailRecords.value = res.data.inventoryDetails;
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
const filteredData = ref<{
  size: string;
  color: string;
  excludeZeroQuantity: boolean;
}>({
  size: '',
  color: '',
  excludeZeroQuantity: true,
});
const filterSelectedShopDetailList = () => {
  filteredShopDetailList.value = selectedShopDetailRecords.value.filter(
    (item) => {
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
    }
  );
};
watch([filteredData, selectedShopDetailRecords], filterSelectedShopDetailList, {
  deep: true,
});

watch(filteredData, (newValue) => {
  if (!newValue) {
    filteredShopDetailList.value = selectedShopDetailRecords.value;
  }
});
</script>
