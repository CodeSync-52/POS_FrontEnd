<template>
  <q-card class="min-w-[320px] w-full !max-w-[800px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> Add New GRN</span>
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
          <div class="text-base mb-1"><span>From Shop</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            :options="shopOptionRecords"
            :loading="isLoading"
            use-input
            dense
            map-options
            outlined
            disable
            v-model="selectedShop.fromShop"
            @update:model-value="selectedShop.fromShop = $event"
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
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>To Shop</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            :options="shopOptionRecords"
            :loading="isLoading"
            use-input
            dense
            class="w-full"
            clearable
            map-options
            outlined
            v-model="selectedShop.toShop"
            @update:model-value="selectedShop.toShop = $event"
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
        </div>
      </div>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>Filter by Product</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            class="min-w-[220px]"
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
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>Filter by Product Code</span></div>
          <q-input
            v-model="filterSearch.ProductCode"
            maxlength="250"
            outlined
            dense
            color="btn-primary"
            label="Product Code"
          />
        </div>
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
              @click="inventoryDetailList()"
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
      </div>
      <div v-if="isSelectedShopDetailTableVisible" class="w-full pt-4">
        <q-table
          :columns="selectedShopDetailRecordsColumn"
          @update:selected="handleChangeSelectedShopRecord"
          :rows="selectedShopDetailRecords"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedShopRecords"
          align="left"
          :loading="isFetchingRecords"
          ><template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
          <template v-slot:body-cell-dispatchedQuantity="props">
            <q-td :props="props">
              <q-input
                v-if="
                  selectedInventoryPayload[
                    `${props.row.id}-${props.row.productId}-${props.row.variantId_1}-${props.row.variantId_2}`
                  ]
                "
                type="number"
                label="Select Quantity"
                outlined
                dense
                :disable="!selectedShopRecords.includes(props.row)"
                :min="0"
                :max="props.row.quantity"
                v-model="
                  selectedInventoryPayload[
                    `${props.row.id}-${props.row.productId}-${props.row.variantId_1}-${props.row.variantId_2}`
                  ].quantity
                "
                @update:model-value="
                  handleUpdateQuantity(
                    $event,
                    props.row.id,
                    props.row.quantity,
                    props.row.productId,
                    props.row.variantId_1,
                    props.row.variantId_2
                  )
                "
                class="min-w-[100px]"
                color="btn-primary"
              />
              <div v-else>0</div>
            </q-td>
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
            </q-td> </template
        ></q-table>
      </div>
      <div v-else class="w-full mx-auto">
        <q-spinner size="3rem" color="btn-primary" class="mx-auto" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="Cancel" color="btn-cancel" unelevated v-close-popup />

      <q-btn
        label="Save"
        unelevated
        :disable="isSavingGrnButtonDisabled"
        color="btn-primary"
        :loading="isSavingNewGrn"
        @click="handleSaveNewGrn"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  IArticleData,
  IGrnDetails,
  IInventoryFilterSearch,
  IInventoryListResponseWithId,
  ISelectedPayload,
  IShopResponse,
} from 'src/interfaces';
import { articleListApi, inventoryDetailApi, shopListApi } from 'src/services';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { InventoryListColumn } from 'src/utils/inventory';
import { useAuthStore } from 'src/stores';
const selectedShop = ref<{
  fromShop: IShopResponse | null;
  toShop: IShopResponse | null;
}>({
  fromShop: null,
  toShop: null,
});
const $q = useQuasar();
const authStore = useAuthStore();
const selectedShopDetailRecordsColumn = InventoryListColumn.concat({
  name: 'dispatchedQuantity',
  label: 'Dispatched Quantity',
  align: 'left',
  field: (row) => row.quantity,
});
const selectedShopDetailRecords = ref<IInventoryListResponseWithId[]>([]);
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedShopRecords = ref<IInventoryListResponseWithId[]>([]);
const isSelectedShopDetailTableVisible = ref(false);
const selectedPreviewImage = ref('');
const isFetchingRecords = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedInventoryPayload = ref<Record<string, IGrnDetails>>({});
const isSavingNewGrn = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
});

const emit = defineEmits<{
  (
    event: 'selected-inventory',
    payload: ISelectedPayload,
    callback: () => void
  ): void;
}>();
onMounted(() => {
  getShopList();
  getArticleList();
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
  inventoryDetailList();
});
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ProductId: null,
    ProductCode: null,
    ShopId: null,
  };
  inventoryDetailList();
};
const filterProduct = (val: string, update: CallableFunction) => {
  update(() => {
    getArticleList(val);
  });
};
const handleChangeSelectedShopRecord = (
  selectedRecord: readonly IInventoryListResponseWithId[]
) => {
  const keysToDelete = Object.keys(selectedInventoryPayload.value);
  selectedRecord.forEach((record) => {
    const key = `${record.id}-${record.productId}-${record.variantId_1}-${record.variantId_2}`;
    if (keysToDelete.includes(key)) {
      keysToDelete.splice(keysToDelete.indexOf(key), 1);
    }
    if (selectedInventoryPayload.value[key] === undefined) {
      selectedInventoryPayload.value[key] = {
        productId: record.productId,
        variantId_1: record.variantId_1,
        variantId_2: record.variantId_2,
        quantity: 0,
      };
    }
  });
  keysToDelete.forEach((key) => {
    delete selectedInventoryPayload.value[key];
  });
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
  }
};
const getImageUrl = (base64Image: string) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const handleSaveNewGrn = () => {
  const payload = {
    fromShopId: selectedShop.value.fromShop?.shopId ?? -1,
    toShopId: selectedShop.value.toShop?.shopId ?? -1,
    grnDetails: Object.values(selectedInventoryPayload.value).map(
      (records) => records
    ),
  };
  isSavingNewGrn.value = true;
  emit('selected-inventory', payload, () => (isLoading.value = false));
};
const handleUpdateQuantity = (
  newVal: string | number | null,
  id: number,
  quantity: number,
  productId: number,
  variantId_1: number,
  variantId_2: number
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val < 0) {
      selectedInventoryPayload.value[
        `${id}-${productId}-${variantId_1}-${variantId_2}`
      ].quantity = 0;
    } else if (val > quantity) {
      selectedInventoryPayload.value[
        `${id}-${productId}-${variantId_1}-${variantId_2}`
      ].quantity = quantity;
    } else {
      selectedInventoryPayload.value[
        `${id}-${productId}-${variantId_1}-${variantId_2}`
      ].quantity = val;
    }
  }
};
const isSavingGrnButtonDisabled = computed(() => {
  const validations = [
    selectedShop.value.fromShop === null,
    Object.values(selectedInventoryPayload.value).some(
      (payload) => payload.quantity === 0
    ),
    Object.keys(selectedInventoryPayload.value).length === 0,
    selectedShop.value.toShop === null,
  ];
  return validations.some((validation) => validation === true);
});
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
const inventoryDetailList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isFetchingRecords.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await inventoryDetailApi({
      ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
      filterSearch: filterSearch.value,
    });
    if (res.data) {
      selectedShopDetailRecords.value = res.data.inventoryDetails.map(
        (record, index) => {
          return { ...record, id: index + 1 };
        }
      );
      isSelectedShopDetailTableVisible.value = true;
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
const shopOptionRecords = computed(() => {
  let idList: number[] = [];
  if (selectedShop.value.fromShop) {
    idList.push(selectedShop.value.fromShop.shopId);
  }
  if (selectedShop.value.toShop) {
    idList.push(selectedShop.value.toShop.shopId);
  }
  if (idList.length > 0) {
    return shopData.value.filter((shop) => !idList.includes(shop.shopId));
  }
  return shopData.value;
});
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
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
</script>
