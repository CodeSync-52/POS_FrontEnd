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
      <div class="row q-col-gutter-md mb-4">
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>Filter by Product</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            class="min-w-[220px]"
            use-input
            dense
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
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1">
            <span>Filter by Product Code</span>
          </div>
          <q-input
            v-model="filterSearch.ProductCode"
            maxlength="250"
            outlined
            clearable
            dense
            color="btn-primary"
            label="Product Code"
          />
        </div>
      </div>
      <div class="row items-center q-col-gutter-md mb-2">
        <div class="col-12">
          <div
            class="flex justify-center md:justify-end w-full items-end h-full gap-2"
          >
            <q-btn
              unelevated
              :loading="isLoading"
              color=""
              class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
              icon="search"
              label="Search"
              @click="handleSearchArticles"
            />
            <q-btn
              unelevated
              color=""
              class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
              label="Clear"
            />
          </div>
        </div>
      </div>
      <q-table
        :columns="InventoryListColumn"
        :rows="selectedShopDetailRecords"
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
import { articleListApi, inventoryDetailApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { ref } from 'vue';

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
  rowsPerPage: 10000,
  rowsNumber: 0,
});
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const isFetchingArticleList = ref(false);
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
  keyword: null,
});
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
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({
      PageNumber: 1,
      PageSize: 10000,
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
</script>
