<template>
  <q-card class="!max-w-[800px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium">
          Select {{ title ?? 'Inventory' }}
        </span>
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
            ref="productSelectInputRef"
            @popup-hide="handlePopupShow"
            dense
            autofocus
            use-input
            map-options
            clearable
            outlined
            @filter="filterProduct"
            :options="articleList"
            :loading="isFetchingArticle"
            v-model="filterSearch.ProductId"
            @update:model-value="filterSearch.ProductId = $event?.productId"
            label="Select Product"
            color="btn-primary"
            option-label="name"
            option-value="productId"
            @keydown.enter="handleEnterKey"
            ><template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
        <div class="col-12 col-sm-6">
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
              :disable="isBothInputsEmpty"
              @click="handleSelectedFilters"
            />
            <q-btn
              unelevated
              color=""
              class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
              label="Clear"
              @click="handleRemoveInventoryFilter"
            />
          </div>
        </div>
      </div>
      <q-table
        :columns="InventoryListColumn"
        @request="handlePagination($event.pagination)"
        :rows="selectedShopDetailList"
        :rows-per-page-options="[0]"
        v-model:pagination="InventoryPagination"
        row-key="inventoryId"
        selection="multiple"
        class="max-h-[400px]"
        v-model:selected="selectedShopRecords"
        align="left"
        :loading="isLoading"
        ><template v-slot:no-data>
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
                :src="props.row.productImage || 'assets/default-image.png'"
                alt="img"
              />
            </div>
          </q-td> </template
      ></q-table>
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
        @click="handleSaveSelectedInventory"
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { QSelect } from 'quasar';
import {
  IArticleData,
  IInventoryFilterSearch,
  IInventoryListResponse,
  IPagination,
} from 'src/interfaces';
import { InventoryListColumn } from 'src/utils/inventory';
import { onMounted, onUpdated, ref, computed } from 'vue';
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const selectedShopDetailList = ref<IInventoryListResponse[]>([]);
const articleList = ref<IArticleData[]>([]);
const InventoryPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});
const productSelectInputRef = ref<QSelect | null>(null);
const isLoading = ref(false);
const isFetchingArticleList = ref(false);
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
  keyword: null,
});
interface IProps {
  title?: string;
  isFetchingRecords: boolean;
  isFetchingArticle: boolean;
  articleRecords: IArticleData[];
  currentData: IInventoryListResponse[];
  inventoryList: IInventoryListResponse[];
  pagination: IPagination;
}
const props = withDefaults(defineProps<IProps>(), {
  isFetchingRecords: false,
  articleRecords: () => [],
  inventoryList: () => [],
  currentData: () => [],
});
const selectedShopRecords = ref<IInventoryListResponse[]>([
  ...props.currentData,
]);
onMounted(async () => {
  filterSearch.value.ProductId = null;
  filterSearch.value.ProductCode = null;
  selectedShopDetailList.value = [];
  selectedShopRecords.value = [];
  isLoading.value = false;
  emit('clear-filter');
  articleList.value = props.articleRecords;
  isFetchingArticleList.value = props.isFetchingArticle;
  InventoryPagination.value = props.pagination;
  isLoading.value = props.isFetchingRecords;
});
onUpdated(async () => {
  articleList.value = props.articleRecords;
  selectedShopDetailList.value = props.inventoryList;
  isLoading.value = props.isFetchingRecords;
});

const handlePopupShow = () => {
  // When the popup opens, blur the input
  if (productSelectInputRef.value) {
    productSelectInputRef.value.blur();
  }
};
const emit = defineEmits<{
  (event: 'handle-pagination', pagination: IPagination): void;
  (event: 'filter-article-list', val: string): void;
  (event: 'clear-filter'): void;
  (
    event: 'selected-inventory-filters',
    filters: IInventoryFilterSearch,
    callback: () => void
  ): void;
  (event: 'selected-data', payload: IInventoryListResponse[]): void;
}>();
const handleSelectedFilters = () => {
  isLoading.value = true;
  emit(
    'selected-inventory-filters',
    filterSearch.value,
    () => (isLoading.value = false)
  );
};
const handleEnterKey = async () => {
  if (filterSearch.value.ProductId !== null) {
    handleSelectedFilters();
  }
};
const handleRemoveInventoryFilter = () => {
  isLoading.value = true;
  filterSearch.value.ProductId = null;
  filterSearch.value.ProductCode = null;
  selectedShopDetailList.value = [];
  selectedShopRecords.value = [];
  isLoading.value = false;
  emit('clear-filter');
};
const filterProduct = (val: string, update: CallableFunction) => {
  update(() => {
    emit('filter-article-list', val);
  });
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const isBothInputsEmpty = computed(() => {
  return !filterSearch.value.ProductId && !filterSearch.value.ProductCode;
});
const handlePagination = (newVal: Omit<IPagination, 'rowsNumber'>) => {
  const selectedPagination = {
    ...newVal,
    rowsNumber: InventoryPagination.value.rowsNumber,
  };
  InventoryPagination.value = selectedPagination;
  emit('handle-pagination', selectedPagination);
};
const handleSaveSelectedInventory = () => {
  emit('selected-data', selectedShopRecords.value);
};
</script>
