<template>
  <div>
    <div class="row justify-between q-col-gutter-x-lg">
      <div class="col-xs-12 col-md-10">
        <div
          class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
        >
          <span class="text-lg font-medium">{{ pageTitle }}</span>
          <div class="text-base flex items-center gap-1">
            <span class="text-[18px] font-semibold">
              {{ moment(timeStamp).format('LL') }}
            </span>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row gap-2 md:gap-4 items-center q-mb-md"
        >
          <q-input
            v-model="shopSale.salePersonCode"
            ref="salePersonCodeInput"
            class="max-w-[200px] min-w-[200px]"
            maxlength="250"
            outlined
            dense
            color="btn-primary"
            label="Sale Person Code"
            @keydown="dialogClose"
          />
          <q-select
            :loading="isFetchingShopList"
            popup-content-class="!max-h-[200px]"
            :options="shopData"
            class="max-w-[200px] min-w-[200px]"
            use-input
            dense
            map-options
            outlined
            :disable="
              authStore.loggedInUser?.rolePermissions.roleName !==
              EUserRoles.SuperAdmin.toLowerCase()
            "
            v-model="selectedShop.fromShop"
            @update:model-value="handleUpdateFromShop($event)"
            label="Select Shop"
            color="btn-primary"
            option-label="name"
            option-value="shopId"
          />
        </div>
        <div
          class="q-gutter-y-xs flex flex-col items-center md:flex-row gap-2 md:gap-16"
        >
          <div class="row gap-6 items-center">
            <span class="text-base">Add Articles</span>
            <q-btn
              icon="add"
              rounded
              dense
              unelevated
              color="btn-primary"
              @click="isInventoryListModalVisible = true"
            />
          </div>
          <outside-click-container @outside-click="handleOutsideClick">
            <q-input
              autofocus
              ref="scannedLabelInput"
              class="min-w-[200px] max-w-[200px]"
              v-model="scannedLabel"
              :loading="scannedLabelLoading"
              outlined
              dense
              @keydown="dialogClose"
              label="Scan label"
              color="btn-primary"
            />
          </outside-click-container>
        </div>
        <div
          v-if="selectedInventoryData.length"
          class="flex flex-col justify-between"
        >
          <div class="py-4 w-full">
            <q-table
              auto-width
              :loading="isLoading"
              :rows="selectedInventoryData"
              :columns="saleShopSelectedGrnInventoryTableColumn"
              :rows-per-page-options="[0]"
              row-key="id"
            >
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
                        props.row.productImage || 'assets/default-image.png'
                      "
                      alt="img"
                    />
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-dispatchQuantity="props">
                <q-td :props="props">
                  <q-input
                    type="number"
                    v-model="props.row.dispatchQuantity"
                    ref="dispatchQuantityInput"
                    :min="0"
                    :max="!props.row.isReturn ? props.row.quantity : Infinity"
                    @update:model-value="
                      handleUpdatedispatchQuantity($event, props.row)
                    "
                    dense
                    outlined
                    class="w-[150px]"
                    color="btn-primary"
                  />
                  <span
                    v-if="props.row.errorMessage"
                    class="text-red text-sm"
                    >{{ props.row.errorMessage }}</span
                  >
                </q-td>
              </template>
              <template v-slot:body-cell-discount="props">
                <q-td :props="props">
                  <q-input
                    v-model="props.row.discount"
                    @update:model-value="
                      handleUpdateDiscount($event, props.row)
                    "
                    :disable="props.row.isReturn"
                    type="number"
                    dense
                    outlined
                    color="btn-primary"
                    class="w-[150px]"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="flex min-w-[72px]">
                    <q-btn
                      dense
                      size="sm"
                      icon="delete"
                      flat
                      unelevated
                      color="red"
                      @click="handleRemoveSelectedInventoryRecord(props.row)"
                    >
                      <q-tooltip class="bg-red" :offset="[10, 10]">
                        Delete Article
                      </q-tooltip>
                    </q-btn>
                    <div>
                      <q-toggle
                        checked-icon="autorenew"
                        color="red"
                        unchecked-icon="clear"
                        size="sm"
                        v-model="props.row.isReturn"
                        @click="handleReturnMode(props.row)"
                      />
                      <q-tooltip class="bg-red" :offset="[10, 10]">
                        Return Item
                      </q-tooltip>
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                  <q-icon name="warning" size="xs" />
                  <span class="text-md font-medium"> No data available.</span>
                </div>
              </template>
            </q-table>
          </div>
          <div
            class="w-full flex flex-col gap-1 md:flex-row items-center md:items-start justify-center md:justify-between mb-3"
          >
            <div class="max-w-[300px] min-w-[200px] md:w-1/3">
              <q-input
                v-model="shopSale.comment"
                maxlength="250"
                outlined
                dense
                color="btn-primary"
                label="Comments"
                @keydown="dialogClose"
              />
            </div>
            <div class="max-w-[300px] min-w-[200px] flex flex-col gap-2">
              <q-input
                v-model="shopSalesTotalAmount"
                type="number"
                maxlength="250"
                disable
                outlined
                dense
                color="btn-primary"
                label="Total"
              />
              <q-input
                v-model="shopSalesTotalDiscount"
                @update:model-value="handleUpdateShopSaleDiscount($event)"
                type="number"
                maxlength="250"
                disable
                outlined
                dense
                color="btn-primary"
                label="Discount"
              />
              <q-input
                v-model="shopSalesReturnItems"
                type="number"
                maxlength="250"
                disable
                outlined
                dense
                color="btn-primary"
                label="Return"
              />
              <q-input
                v-model="shopSalesNetAmount"
                type="number"
                maxlength="250"
                disable
                outlined
                dense
                color="btn-primary"
                label="Net Total"
              />
            </div>
          </div>
        </div>
      </div>
      <q-fab
        vertical-actions-align="right"
        color="btn-primary"
        direction="up"
        class="lg:!hidden sm:fixed bottom-1 end-1"
      >
        <q-fab-action
          v-for="(button, index) in buttons"
          :key="index"
          @click="handleButtonClick(button)"
          :disable="button.name === 'holdBill' && isButtonDisable"
          label-position="left"
          padding="3px 10px"
          color="btn-primary"
          :icon="button.icon"
          :label="button.label"
        />
        <q-fab-action
          padding="3px 10px"
          color="btn-primary"
          label-position="left"
          icon="shopping_cart"
          label="Save (Ctrl + Enter)"
          @click="handleAddShopSale()"
          :disable="isButtonDisable"
        />
      </q-fab>
      <div
        class="col-2 sm:w-[200px] px-2 !h-[calc(100vh-112px)] overflow-auto hidden lg:!block"
      >
        <div class="flex flex-nowrap flex-col h-full gap-3 lg:gap-4">
          <q-btn
            v-for="(button, index) in buttons"
            @click="handleButtonClick(button)"
            :key="index"
            :disable="button.name === 'holdBill' && isButtonDisable"
            unelevated
            color=""
            :label="button.label"
            :icon="button.icon"
            class="rounded-[8px] icon_left min-h-fit bg-btn-primary hover:bg-btn-primary-hover w-full py-3 xl:py-4.5 md:text-[12px] lg:text-[10px] xl:text-[13px]"
          />
          <q-btn
            unelevated
            :disable="isButtonDisable"
            color=""
            @click="handleAddShopSale"
            class="rounded-[8px] icon_left min-h-fit bg-btn-primary hover:bg-btn-primary-hover w-full py-3 xl:py-4.5 md:text-[12px] lg:text-[10px] xl:text-[13px]"
            label="Save (Ctrl + Enter)"
            icon="shopping_cart"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="isPreviewImageModalVisible">
      <q-card class="max-w-[400px]">
        <q-card-section>
          <div class="min-w-[2rem]">
            <img
              class="w-full h-full object-cover"
              :src="selectedPreviewImage"
              alt="img"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isInventoryListModalVisible">
      <inventory-list-modal
        title="Articles"
        :is-fetching-article="isFetchingArticleList"
        :isFetchingRecords="isFetchingRecords"
        :article-records="articleList"
        :current-data="selectedInventoryData"
        :pagination="pagination"
        @filter-article-list="handleFilterArticle"
        @selected-data="handleSelectedData"
        @handle-pagination="handlePagination"
        @clear-filter="handleClearFilters"
        :inventory-list="selectedShopDetailRecords"
        @selected-inventory-filters="handleSelectedInventoryFilters"
      />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import InventoryListModal from 'src/components/inventory/InventoryListModal.vue';
import OutsideClickContainer from 'src/components/common/OutsideClickContainer.vue';
import {
  IArticleData,
  IInventoryFilterSearch,
  IPagination,
  ISaleShopSelectedInventory,
  getRoleModuleDisplayName,
  EUserModules,
  IInventoryListResponse,
  IShopResponse,
  EUserRoles,
} from 'src/interfaces';
import { saleShopSelectedGrnInventoryTableColumn, buttons } from './utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  articleListApi,
  inventoryDetailApi,
  shopListApi,
  addShopSaleManagementApi,
  holdBillApi,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const timeStamp = Date.now();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.SaleAndReturnManagement
);
const router = useRouter();
const shopData = ref<IShopResponse[]>([]);
const $q = useQuasar();
const isFetchingShopList = ref(false);
const isFetchingRecords = ref(false);
const apiController = ref<AbortController | null>(null);
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');
const isInventoryListModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
const selectedInventoryData = ref<ISaleShopSelectedInventory[]>([]);
const isSelectedShopDetailTableVisible = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const scannedLabel = ref('');
const scannedLabelInput = ref<null | HTMLDivElement>(null);
const scannedLabelLoading = ref(false);
const filterChanged = ref(false);
const isLoading = ref(false);
const salePersonCodeInput = ref<null | HTMLDivElement>(null);
const dispatchQuantityInput = ref<null | HTMLDivElement>(null);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
const filterSearch = ref<{
  keyword: string;
  ProductId: null | number;
  ShopId: number | null;
  ProductCode: string | null;
}>({
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
const shopSale = ref<{
  comment: string;
  discount: number;
  salePersonCode: null | string;
}>({
  comment: '',
  discount: 0,
  salePersonCode: null,
});
onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keydown', handleActionKeys);
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
  getShopList();
});
const handleActionKeys = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.key === 'F1') {
      router.push('/shop-sale/return-sales');
    } else if (
      e.key === 'F3' &&
      selectedInventoryData.value.length &&
      selectedInventoryData.value.every(
        (record) => record.dispatchQuantity !== 0
      )
    ) {
      handleHoldBill();
    } else if (e.key === 'F5') {
      router.push('/shop-sale/all-bills');
    } else if (e.key === 'F6') {
      router.push('/shop-sale/hold-bills');
    } else if (e.key === 'F7') {
      router.push('/shop-sale/today-sale-summary');
    } else if (
      e.key === 'Enter' &&
      selectedInventoryData.value.length &&
      selectedInventoryData.value.every(
        (record) => record.dispatchQuantity !== 0
      )
    ) {
      handleAddShopSale();
    }
  }
};
const handleButtonClick = (button: { name: string }): void => {
  if (button.name === 'showReturnSales') {
    router.push('/shop-sale/return-sales');
  }
  if (button.name === 'todaySaleSummary') {
    router.push('/shop-sale/today-sale-summary');
  }
  if (button.name === 'showAllBill') {
    router.push('/shop-sale/all-bills');
  }
  if (button.name === 'showHoldBill') {
    router.push('/shop-sale/hold-bills');
  }
  if (button.name === 'holdBill') {
    handleHoldBill();
  }
};
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const shopSalesTotalAmount = computed(() => {
  return selectedInventoryData.value.reduce((amount: number, row) => {
    return amount + row.dispatchQuantity * row.retailPrice;
  }, 0);
});
const shopSalesTotalDiscount = computed(() => {
  return selectedInventoryData.value.reduce((amount: number, row) => {
    return amount + row.discount * row.dispatchQuantity;
  }, 0);
});
const shopSalesReturnItems = computed(() => {
  if (selectedInventoryData.value.some((toggle) => toggle.isReturn)) {
    return selectedInventoryData.value
      .filter((row) => row.isReturn)
      .reduce((amount: number, row) => {
        return amount + row.retailPrice * row.dispatchQuantity;
      }, 0);
  } else {
    return 0;
  }
});
const shopSalesNetAmount = computed(() => {
  const totalAmount = selectedInventoryData.value.reduce(
    (amount: number, row) => {
      return amount + row.dispatchQuantity * row.retailPrice;
    },
    0
  );
  const netAmountBeforeReturns = totalAmount - shopSalesTotalDiscount.value;
  const returnItemsAmount = shopSalesReturnItems.value;
  const netAmount = netAmountBeforeReturns - returnItemsAmount;
  return netAmount;
});
const handleUpdateShopSaleDiscount = (newValue: string | null | number) => {
  if (typeof newValue === 'string') {
    const value = parseInt(newValue);
    if (!value || value < 0) {
      shopSale.value.discount = 0;
    } else if (value > shopSalesTotalAmount.value) {
      shopSale.value.discount = shopSalesTotalAmount.value;
    } else {
      shopSale.value.discount = value;
    }
  }
};
const handleUpdateFromShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShop = newVal;
  filterSearch.value.ShopId = newVal.shopId;
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};

const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
const handleKeyPress = async (e: KeyboardEvent) => {
  if (e.key === 'n' || e.key === 'N') {
    isInventoryListModalVisible.value = true;
  } else if (e.key === 'Enter' && !isInventoryListModalVisible.value) {
    const target = e.target as HTMLInputElement;
    if (scannedLabel.value.length > 0) {
      filterSearch.value.ProductCode = target.value;
      if (scannedLabelLoading.value) return;
      scannedLabelLoading.value = true;
      try {
        const res = await inventoryDetailApi({
          ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
          PageNumber: pagination.value.page,
          PageSize: pagination.value.rowsPerPage,
          filterSearch: filterSearch.value,
        });
        if (res.type === 'Success' && res.data.inventoryDetails.length > 0) {
          const selectedProduct = selectedInventoryData.value.find((record) => {
            return (
              res.data.inventoryDetails[0].inventoryId === record.inventoryId
            );
          });
          if (
            selectedProduct &&
            selectedInventoryData.value.includes(selectedProduct) &&
            selectedProduct.quantity > selectedProduct.dispatchQuantity
          ) {
            selectedProduct.dispatchQuantity += 1;
          } else if (!selectedProduct) {
            selectedInventoryData.value.unshift({
              ...res.data.inventoryDetails[0],
              dispatchQuantity: 1,
              discount: 0,
            });
          } else {
            $q.notify({
              message:
                'Dispatch quantity can not be greater than available quantity.',
              type: 'negative',
            });
          }
          scannedLabel.value = '';
          if (scannedLabelInput.value) scannedLabelInput.value.focus();
        } else if (res.data.inventoryDetails.length === 0) {
          let message = 'No record found!';
          $q.notify({
            message,
            type: 'negative',
          });
          scannedLabelLoading.value = false;
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
      scannedLabelLoading.value = false;
    }
  }
};
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !isInventoryListModalVisible.value) {
    window.addEventListener('keypress', handleKeyPress);
  } else if (e.key === 'Tab' && !e.shiftKey) {
    window.addEventListener('keypress', handleKeyPress);
  } else if (e.key === 'Tab' && e.shiftKey) {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const dialogClose = (e: KeyboardEvent) => {
  if (e.key === 'n' || e.key === 'N') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
// const handleUpdatedispatchQuantity = (
//   newVal: string | number | null,
//   selectedRecord: ISaleShopSelectedInventory
// ) => {
//   if (typeof newVal === 'string') {
//     const val = parseInt(newVal);
//     if (!val || val < 0) {
//       selectedRecord.dispatchQuantity = 0;
//       selectedRecord.errorMessage = '';
//     } else if (
//       val >
//       selectedRecord.quantity + (selectedRecord.alreadyDispatchedQuantity ?? 0)
//     ) {
//       selectedRecord.dispatchQuantity =
//         0 + (selectedRecord.alreadyDispatchedQuantity ?? 0);
//       selectedRecord.errorMessage = 'Invalid Quantity !';
//       $q.notify({
//         message: `Product ${selectedRecord.productName} ${selectedRecord.productCode} quantity is more than the available quantity. Please add the quantity again!`,
//         color: 'red',
//         icon: 'warning',
//       });
//     } else {
//       selectedRecord.dispatchQuantity = val;
//       selectedRecord.errorMessage = '';
//     }
//   }
// };

const handleUpdatedispatchQuantity = (
  newVal: string | number | null,
  selectedRecord: ISaleShopSelectedInventory
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val < 0) {
      selectedRecord.dispatchQuantity = 0;
      selectedRecord.errorMessage = '';
    } else if (!selectedRecord.isReturn && val > selectedRecord.quantity) {
      selectedRecord.dispatchQuantity = 0;
      selectedRecord.errorMessage = 'Invalid Quantity !';
      $q.notify({
        message: `Product ${selectedRecord.productName} ${selectedRecord.productCode} quantity is more than the available quantity. Please add the quantity again!`,
        color: 'red',
        icon: 'warning',
      });
    } else {
      selectedRecord.dispatchQuantity = val;
      selectedRecord.errorMessage = '';
    }
  }
};

const handleFilterArticle = (searchedArticle: string) => {
  getArticleList(searchedArticle);
};
const handleClearFilters = () => {
  selectedShopDetailRecords.value = [];
};
const handleSelectedInventoryFilters = (
  selectedInventoryFilters: IInventoryFilterSearch,
  callback: () => void
) => {
  filterSearch.value.ProductCode = selectedInventoryFilters.ProductCode;
  filterSearch.value.ProductId = selectedInventoryFilters.ProductId;
  inventoryDetailList().then(() => callback());
};
const handleUpdateDiscount = (
  newVal: string | number | null,
  row: ISaleShopSelectedInventory
) => {
  if (newVal === null || newVal === '') {
    row.discount = 0;
  } else {
    const value = parseInt(newVal.toString());
    if (!value) {
      row.discount = 0;
    } else {
      row.discount = value;
    }
  }
};
const handleReturnMode = (row: ISaleShopSelectedInventory) => {
  if (row.isReturn) {
    row.discount = 0;
  } else if (!row.isReturn) {
    row.dispatchQuantity = 0;
  }
};
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  inventoryDetailList();
};
const handleSelectedData = (payload: IInventoryListResponse[]) => {
  const oldIdList = selectedInventoryData.value.map((item) => item.inventoryId);
  const filteredOldIdList = oldIdList.filter((oldId) =>
    payload.map((record) => record.inventoryId).includes(oldId)
  );
  selectedInventoryData.value = selectedInventoryData.value.filter((item) =>
    filteredOldIdList.includes(item.inventoryId)
  );
  payload.forEach((item) => {
    if (!oldIdList.includes(item.inventoryId)) {
      selectedInventoryData.value.push({
        ...item,
        dispatchQuantity: 0,
        discount: 0,
        isReturn: false,
      });
    }
  });
  isInventoryListModalVisible.value = false;
};
const handleRemoveSelectedInventoryRecord = (
  selectedRow: IInventoryListResponse
) => {
  const selectedRecordIndex = selectedInventoryData.value.findIndex(
    (record) => selectedRow.inventoryId === record.inventoryId
  );
  selectedInventoryData.value.splice(selectedRecordIndex, 1);
};
const isButtonDisable = computed(() => {
  const validations = [
    !selectedInventoryData.value.length,
    selectedInventoryData.value.some((record) => record.dispatchQuantity === 0),
  ];
  return validations.some((validation) => validation);
});
//------------------------------------------------------------ Api---------------------------------------------------------
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
const inventoryDetailList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
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
const handleAddShopSale = async () => {
  const res = isPersonCodeEmpty();
  if (!res) return;
  if (selectedInventoryData.value.every((record) => record.isReturn)) {
    $q.notify({
      message: 'You cannot Save this Bill, as it contains only Return Item.',
      type: 'warning',
    });
    return;
  }
  try {
    isLoading.value = true;
    const payload = {
      salePersonCode: shopSale.value.salePersonCode,
      shopId: selectedShop.value.fromShop?.shopId,
      comments: shopSale.value.comment,
      saleDetails: selectedInventoryData.value.map((record) => ({
        inventoryId: record.inventoryId,
        quantity: record.dispatchQuantity,
        discount: record.discount,
        isReturn: record.isReturn,
      })),
    };
    const response = await addShopSaleManagementApi(payload);
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      shopSale.value.salePersonCode = '';
      shopSale.value.comment = '';
      selectedInventoryData.value = [];
      selectedShopDetailRecords.value = [];
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
const isPersonCodeEmpty = () => {
  const personCode = shopSale.value.salePersonCode;
  if (!personCode || personCode.trim() === '') {
    $q.notify({
      message: 'Sale Person Code is required.',
      type: 'negative',
    });
    salePersonCodeInput.value?.focus();
    return false;
  }
  return true;
};
const handleHoldBill = async () => {
  const res = isPersonCodeEmpty();
  if (!res) return;
  if (selectedInventoryData.value.some((record) => record.isReturn)) {
    $q.notify({
      message: 'You cannot HOLD this bill, as it contains a Return Item.',
      type: 'warning',
    });
    return;
  }
  try {
    isLoading.value = true;
    const payload = {
      salePersonCode: shopSale.value.salePersonCode,
      shopId: selectedShop.value.fromShop?.shopId,
      comments: shopSale.value.comment,
      saleDetails: selectedInventoryData.value.map((record) => ({
        inventoryId: record.inventoryId,
        quantity: record.dispatchQuantity,
        discount: record.discount,
      })),
    };
    const response = await holdBillApi(payload);
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      shopSale.value.salePersonCode = '';
      shopSale.value.comment = '';
      selectedInventoryData.value = [];
      selectedShopDetailRecords.value = [];
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
<style scoped lang="scss">
.icon_left > :nth-child(2) {
  justify-content: flex-start;
  flex-wrap: nowrap;
  text-align: start;

  @media (min-width: 992px) {
    margin-left: 1rem;
  }
}
</style>