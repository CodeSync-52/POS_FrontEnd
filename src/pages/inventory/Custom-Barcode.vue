<template>
  <div>
    <div class="mb-4 row justify-between items-center"></div>
    <q-card flat>
      <q-card-section>
        <div class="q-gutter-y-xs row gap-10">
          <div class="row gap-6 items-center">
            <span class="text-base">Add Inventory</span>
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
              @keydown="dialoagClose"
              label="Scan label"
              color="btn-primary"
            />
          </outside-click-container>
        </div>

        <div v-if="selectedInventoryData.length" class="py-4 q-gutter-y-md">
          <q-table
            :rows="selectedInventoryData"
            hide-pagination
            v-model:pagination="selectedInventoryPagination"
            :columns="selectedBarcodeTableColumn"
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
                  class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
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
            <template v-slot:body-cell-quantity="props">
              <q-td :props="props">
                <q-input
                  type="number"
                  v-model="props.row.dispatchQuantity"
                  :min="0"
                  @update:model-value="
                    handleUpdatedispatchQuantity($event, props.row)
                  "
                  dense
                  outlined
                  class="w-[150px]"
                  color="btn-primary"
                />
                <span v-if="props.row.errorMessage" class="text-red text-sm">{{
                  props.row.errorMessage
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div>
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
                </div>
              </q-td>
            </template>
          </q-table>
          <div @click="showTotalDetails" class="font-bold text-[16px] text-end">
            Total:
            {{ grandTotal }}
          </div>
          <div class="flex justify-end gap-2">
            <q-btn
              label="Generate Barcode"
              flat
              :loading="isSavingNewGrn"
              unelevated
              color="signature"
              class="bg-btn-primary hover:bg-btn-primary-hover"
              @click="handleSaveGrne"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
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
        :is-fetching-article="isFetchingArticleList"
        :isFetchingRecords="isFetchingRecords"
        :article-records="articleList"
        :current-data="selectedInventoryData"
        :pagination="pagination"
        @filter-article-list="handleFilterArticle"
        @selected-data="handleSelectedData"
        @handle-pagination="handlePagination"
        :inventory-list="selectedShopDetailRecords"
        @clear-filter="handleClearFilters"
        @selected-inventory-filters="handleSelectedInventoryFilters"
        @removed-inventory-filters="handleRemoveInventoryFilter"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import InventoryListModal from 'src/components/inventory/Barcode-List-Modal.vue';
import OutsideClickContainer from 'src/components/common/Outside-Click-Container.vue';
import {
  IArticleData,
  IInventoryFilterSearch,
  IShopResponse,
  IInventoryListResponse,
  IPagination,
  IInventoryListResponseWithDispatchQuantity,
} from 'src/interfaces';
import {
  CreateGRN,
  GetArticleList,
  GetInventoryDetail,
  GetShopList,
} from 'src/services';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { selectedBarcodeTableColumn } from 'src/utils/grn';
import { useAuthStore } from 'src/stores';
import { useRouter } from 'vue-router';
const selectedShop = ref<{
  fromShop: IShopResponse | null;
  toShop: IShopResponse | null;
}>({
  fromShop: null,
  toShop: null,
});
const grandTotal = computed(() => {
  return selectedInventoryData.value.reduce(
    (total: number, row: IInventoryListResponseWithDispatchQuantity) => {
      if (row.dispatchQuantity) {
        return total + Number(row.dispatchQuantity);
      }
      return total;
    },
    0
  );
});
const $q = useQuasar();
const authStore = useAuthStore();
const router = useRouter();
const isInventoryListModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const isSelectedShopDetailTableVisible = ref(false);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const isFetchingRecords = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const scannedLabel = ref('');
const scannedLabelInput = ref<null | HTMLDivElement>(null);
const scannedLabelLoading = ref(false);
const isSavingNewGrn = ref(false);
const filterChanged = ref(false);
const selectedInventoryData = ref<IInventoryListResponseWithDispatchQuantity[]>(
  []
);
const selectedInventoryPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: -1,
  rowsNumber: 0,
};
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
  rowsNumber: 0,
});
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
  keyword: null,
  categoryName: '',
  CategoryId: null,
});
const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
watch(selectedInventoryData, () => {
  // Clear the scannedLabel whenever selectedInventoryData changes
  scannedLabel.value = '';
});
const totalDetails = computed(() => {
  return selectedInventoryData.value.map((item) => ({
    code: item.productCode.split(',')[0],
    quantity: item.dispatchQuantity,
  }));
});
const showTotalDetails = () => {
  console.log(totalDetails.value, 'aaaaaaaaaaaaaa');
};
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  getShopList();
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
});

onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const handleKeyPress = async (e: KeyboardEvent) => {
  if (e.key === '+') {
    isInventoryListModalVisible.value = true;
  } else if (e.key === 'Enter' && !isInventoryListModalVisible.value) {
    const target = e.target as HTMLInputElement;
    if (scannedLabel.value.length > 0) {
      filterSearch.value.ProductCode = target.value;
      if (scannedLabelLoading.value) return;
      scannedLabelLoading.value = true;
      try {
        const res = await GetInventoryDetail({
          ShopId:
            authStore.loggedInUser?.userShopInfoDTO.shopId?.toString() ?? '-1',
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
          } else if (
            !selectedProduct &&
            res.data.inventoryDetails[0].quantity > 0
          ) {
            selectedInventoryData.value.unshift({
              ...res.data.inventoryDetails[0],
              dispatchQuantity: 1,
            });
          } else {
            $q.notify({
              message:
                'Dispatch quantity can not be greater than avaible quantity.',
              type: 'negative',
            });
          }
          scannedLabel.value = '';
          if (scannedLabelInput.value) scannedLabelInput.value.focus();
        } else if (res.data.inventoryDetails.length === 0) {
          let message = 'No record found! Kindly select manually';
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
  if (e.key === 'Tab' && !e.shiftKey) {
    window.addEventListener('keypress', handleKeyPress);
  } else if (e.key === 'Tab' && e.shiftKey) {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const dialoagClose = (e: KeyboardEvent) => {
  if (e.key === '+') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const handleUpdatedispatchQuantity = (
  newVal: string | number | null,
  selectedRecord: IInventoryListResponseWithDispatchQuantity
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val < 0) {
      selectedRecord.dispatchQuantity = 0;
      selectedRecord.errorMessage = '';
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
const handleRemoveInventoryFilter = async (
  selectedInventoryFilters: IInventoryFilterSearch,
  callback: () => void
) => {
  if (!Object.values(filterSearch.value).every((filter) => filter === null)) {
    filterSearch.value.ProductCode = null;
    filterSearch.value.ProductId = null;
    selectedInventoryFilters.ProductCode = null;
    selectedInventoryFilters.ProductId = null;
    inventoryDetailList().then(() => callback());
  }
};
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  inventoryDetailList();
};

const handleSelectedData = (payload: IInventoryListResponse[]) => {
  const oldIdList = selectedInventoryData.value.map((item) => item.inventoryId);
  payload.forEach((item) => {
    if (!oldIdList.includes(item.inventoryId)) {
      selectedInventoryData.value.unshift({ ...item, dispatchQuantity: 0 });
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

const handleSaveGrne = async () => {
  const zeroQuantityRecords = selectedInventoryData.value.filter(
    record => record.dispatchQuantity === 0
  );

  if (zeroQuantityRecords.length > 0) {
    $q.notify({
      message: 'Quantity must be greater than 0.',
      type: 'negative',
    });
    return;
  } }

// const handleSaveGrn = async () => {
//   const selectedInventoryDataPayload = {
//     fromShopId: selectedShop.value.fromShop?.shopId ?? -1,
//     toShopId: selectedShop.value.toShop?.shopId ?? -1,
//     grnDetails: selectedInventoryData.value.map((record) => ({
//       productId: record.productId,
//       variantId_1: record.variantId_1,
//       variantId_2: record.variantId_2,
//       quantity: record.dispatchQuantity,
//     })),
//   };
//   isSavingNewGrn.value = true;
//   try {
//     const res = await CreateGRN(selectedInventoryDataPayload);
//     if (res.type === 'Success') {
//       $q.notify({
//         message: res.message,
//         type: 'positive',
//       });
//     }
//   } catch (e) {
//     let message = 'Unexpected error occurred adding Grn';
//     if (isPosError(e)) {
//       message = e.message;
//     }
//     $q.notify({
//       message,
//       type: 'negative',
//     });
//   }
//   isSavingNewGrn.value = false;
//   router.push('/goods-receipt');
// };
// const isButtonDisable = computed(() => {
//   const validations = [
//     selectedInventoryData.value.some((record) => record.dispatchQuantity === 0),
//     selectedShop.value.toShop?.shopId === undefined,
//   ];
//   return validations.some((validation) => validation);
// });

const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
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
  if (filterChanged.value) return;
  isFetchingRecords.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
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
        PageSize: rowsPerPage,
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

const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
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
