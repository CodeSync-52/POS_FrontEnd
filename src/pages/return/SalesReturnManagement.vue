<template>
  <div>
    <div class="flex  justify-between">

      <div class="w-[80%]">
        <div
          class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4">
          <span class="text-xl font-medium">{{ pageTitle }}</span>
          <div class="text-base flex items-center gap-1">
            <span class="text-[18px] font-semibold">
              {{ moment(timeStamp).format('LL') }}
            </span>
          </div>
        </div>
        <div class="flex justify-center md:justify-between">
          <div class="flex justify-center md:gap-8">
            <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
              label="User" />

            <q-select :loading="isFetchingShopList" popup-content-class="!max-h-[200px]" :options="shopData"
              class="my-3 max-w-[200px] min-w-[200px]" use-input dense map-options outlined :disable="authStore.loggedInUser?.rolePermissions.roleName !==
                EUserRoles.SuperAdmin.toLowerCase()" v-model="selectedShop.fromShop"
              @update:model-value="handleUpdateFromShop($event)" label="Select Shop" color="btn-primary"
              option-label="name" option-value="shopId"></q-select>
          </div>

          <div class="my-3 max-w-[300px] min-w-[250px]">
            <q-input v-model="filterSearch.ProductCode" maxlength="250" outlined dense color="btn-primary"
              label="Remaining Balance" />
          </div>

        </div>
      
            <div class="Inventtory_Tabel">
            <div class="q-gutter-y-xs row gap-10">
              <div class="row gap-6 items-center justify-center min-w-[175px] max-w-[200px] my-3">
                <span class="text-base">Add Inventory</span>
                <q-btn icon="add" rounded dense unelevated color="btn-primary"
                  @click="isInventoryListModalVisible = true" />
              </div>
              <outside-click-container @outside-click="handleOutsideClick">
                <q-input autofocus ref="scannedLabelInput" class="min-w-[200px] max-w-[200px] my-3" v-model="scannedLabel"
                  :loading="scannedLabelLoading" outlined dense @keydown="dialoagClose" label="Scan label"
                  color="btn-primary" />
              </outside-click-container>
            </div>

            <div v-if="selectedInventoryData.length" class="py-4 q-gutter-y-md">
              <q-table :rows="selectedInventoryData" :columns="selectedGrnInventoryTableColumn">
                <template v-slot:no-data>
                  <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                    <q-icon name="warning" size="xs" />
                    <span class="text-md font-medium"> No data available.</span>
                  </div>
                </template>
                <template v-slot:body-cell-productImage="props">
                  <q-td :props="props">
                    <div @click="handlePreviewImage(props.row.productImage)"
                      class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
                      :class="props.row.productImage ? 'cursor-pointer' : ''">
                      <img class="w-full h-full object-cover" :src="getImageUrl(props.row.productImage) ||
                        'assets/default-image.png'
                        " alt="img" />
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-dispatchQuantity="props">
                  <q-td :props="props">
                    <q-input type="number" v-model="props.row.dispatchQuantity" :min="0" :max="props.row.quantity"
                      @update:model-value="
                        handleUpdatedispatchQuantity($event, props.row)
                        " dense outlined class="w-[150px]" color="btn-primary" />
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div>
                      <q-btn dense size="sm" icon="delete" flat unelevated color="red"
                        @click="handleRemoveSelectedInventoryRecord(props.row)">
                        <q-tooltip class="bg-red" :offset="[10, 10]">
                          Delete Article
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div class="flex justify-end gap-2">
                <q-btn label="Save" flat :loading="isSavingNewGrn" unelevated color="signature" :disable="isButtonDisable"
                  class="bg-btn-primary hover:bg-btn-primary-hover" @click="handleSaveGrn" />
              </div>
            </div>
          </div>
          
        <q-dialog v-model="isPreviewImageModalVisible">
          <q-card class="max-w-[400px]">
            <q-card-section>
              <div class="min-w-[2rem]">
                <img class="w-full h-full object-cover" :src="selectedPreviewImage" alt="img" />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-dialog v-model="isInventoryListModalVisible">
          <inventory-list-modal :is-fetching-article="isFetchingArticleList" :isFetchingRecords="isFetchingRecords"
            :article-records="articleList" :current-data="selectedInventoryData" :pagination="pagination"
            @filter-article-list="handleFilterArticle" @selected-data="handleSelectedData"
            @handle-pagination="handlePagination" :inventory-list="selectedShopDetailRecords"
            @selected-inventory-filters="handleSelectedInventoryFilters"
            @removed-inventory-filters="handleRemoveInventoryFilter" />
        </q-dialog>




        <div class="w-full flex justify-center md:justify-end">
          <div class="max-w-[300px] min-w-[250px]">
            <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-2" outlined dense color="btn-primary"
              label="Total" />
            <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
              label="Discount" />
            <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
              label="Net Total" />
          </div>
        </div>
      </div>

      <div class="w-[17%] relative">
        <div class="sticky top-20">
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Cancel Receipt" icon="close" />
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Create Return" icon="cached" />
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Hold Sale" icon="hourglass_empty" />
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Show Hold Sale" icon="visibility" />
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Today sale" icon="trending_up" />
          <q-btn unelevated @click="showNotif" color=""
            class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Close Balance" icon="paid" />
          <q-btn unelevated @keydown.enter="handleEnterKey" @click="showNotif" color=""
            class="rounded-[8px] icon_left border bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]"
            label="Save" icon="shopping_cart" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.icon_left>:nth-child(2) {
  justify-content: flex-start;
  flex-wrap: nowrap;
  @media (min-width: 992px){
    margin-left: 1rem;
   }
}
</style>

<script setup lang="ts">
import InventoryListModal from 'src/components/inventory/InventoryListModal.vue';
import OutsideClickContainer from 'src/components/common/OutsideClickContainer.vue';
import {
  IArticleData,
  IInventoryFilterSearch,
  IPagination,
  IInventoryListResponseWithDispatchQuantity,
} from 'src/interfaces';
import {
  articleListApi,
} from 'src/services';
import { selectedGrnInventoryTableColumn } from 'src/utils/grn';


import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  // EActionPermissions,
  EUserModules,
  IInventoryListResponse,
  IShopResponse,
  getRoleModuleDisplayName,
  EUserRoles,
} from 'src/interfaces';
import { inventoryDetailApi, shopListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { ref, onMounted, onUnmounted, computed, } from 'vue';
const authStore = useAuthStore();
const timeStamp = Date.now();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.SaleAndReturnManagement
);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
const filterSearch = ref<{keyword:string,ProductId: null | number,ShopId:number | null,ProductCode:string | null}>({
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
const apiController = ref<AbortController | null>(null);
const isPreviewImageModalVisible = ref(false);
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
const handleUpdateFromShop = (newVal: IShopResponse) => {
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

const showNotif = () => {
  // const $q = useQuasar();
  // $q.notify({
  //         spinner: QSpinnerGears,
  //         message: 'Button Perfectly Working...',
  //         timeout: 2000
  //       })
  alert("Button Working Perfectly...'")
};

const handleEnterKey = () => {
  showNotif();
};

// window.addEventListener('keydown', function(e) {
//     if (e.key == "Enter") {
//       showNotif();
//     }
//   });

// const handleKeyDown = (event) => {
//   // Check if Ctrl key is pressed and F1 key is pressed
//   if (event.key === 'F1') {
//     showNotif();
//   }
// };




// import { useRouter } from 'vue-router';
// const router = useRouter();
const isInventoryListModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
// const isLoading = ref(false);
// const ShopOptionData = ref<IShopResponse[]>([]);
const isSelectedShopDetailTableVisible = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const scannedLabel = ref('');
const scannedLabelInput = ref<null | HTMLDivElement>(null);
const scannedLabelLoading = ref(false);
const isSavingNewGrn = ref(false);
const filterChanged = ref(false);
const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
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
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
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
  if (e.key === 'n' || e.key === 'N') {
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
    } else if (val > selectedRecord.quantity) {
      selectedRecord.dispatchQuantity = selectedRecord.quantity;
    } else {
      selectedRecord.dispatchQuantity = val;
    }
  }
};
const handleFilterArticle = (searchedArticle: string) => {
  getArticleList(searchedArticle);
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
const selectedInventoryData = ref<IInventoryListResponseWithDispatchQuantity[]>(
  []
);
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
      selectedInventoryData.value.push({ ...item, dispatchQuantity: 0 });
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
const handleSaveGrn = async () => {
  const selectedInventoryDataPayload = {
    fromShopId: selectedShop.value.fromShop?.shopId ?? -1,
    grnDetails: selectedInventoryData.value.map((record) => ({
      productId: record.productId,
      variantId_1: record.variantId_1,
      variantId_2: record.variantId_2,
      quantity: record.dispatchQuantity,
    })),
  };
  isSavingNewGrn.value = true;
  try {
    console.log(selectedInventoryDataPayload)
  } catch (e) {
    let message = 'Unexpected error occurred adding Grn';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isSavingNewGrn.value = false;
};
const isButtonDisable = computed(() => {
  const validations = [
    selectedInventoryData.value.some((record) => record.dispatchQuantity === 0),
  ];
  return validations.some((validation) => validation);
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
</script>