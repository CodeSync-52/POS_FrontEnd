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
            <div>
              <q-btn icon="info" color="btn-primary" flat unelevated dense
                ><q-tooltip class="bg-btn-primary text-sm" :offset="[10, 10]">
                  <div>
                    <p><strong>Shortcut Keys For Buttons</strong></p>
                    <p>Save (Ctrl + Enter)</p>
                    <p>Hold Sale (Ctrl + F3)</p>
                    <p>All Bills (Ctrl + F5)</p>
                    <p>Hold Bills (Ctrl + F6)</p>
                    <p>Shop Closing (Ctrl + F7)</p>
                    <p>Closed Record (Ctrl + F8)</p>
                  </div>
                </q-tooltip></q-btn
              >
            </div>
          </div>
        </div>
        <div class="md:flex justify-between">
          <div
            class="flex flex-col md:flex-row gap-2 md:gap-4 items-center q-mb-md"
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
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No Options Available
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              :loading="isLoading"
              dense
              class="max-w-[200px] min-w-[200px]"
              outlined
              map-options
              clearable
              v-model="shopSale.salePersonCode"
              popup-content-class="!max-h-[200px]"
              :options="roleDropdownOptions"
              @update:model-value="handleUpdateSalePersonCode($event)"
              option-label="fullName"
              option-value="userId"
              label="Sale Person"
              color="btn-primary"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No Options Available
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div
            class="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-end"
          >
            <div
              v-if="selectedInventoryData.length"
              class="flex flex-col md:flex-row items-center"
            >
              <span class="text-lg font-medium">Select Printing Template</span>
            </div>
            <div
              v-if="selectedInventoryData.length"
              class="text-center md:text-left"
            ></div>
          </div>
        </div>
        <div class="md:flex justify-between">
          <div
            class="q-gutter-y-xs flex flex-col items-center md:flex-row gap-3 mt-2 md:mt-0 md:gap-16 md:ml-2"
          >
            <div class="row gap-6 items-center">
              <span class="text-base">Select Articles</span>
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
          <div v-if="selectedInventoryData.length" class="mb-2">
            <div
              class="q-gutter-sm flex flex-col items-center md:flex-row justify-end"
            >
              <q-radio
                v-model="receipt.sampleType"
                :disable="receipt.isprintingDisable"
                color="btn-primary"
                val="first"
                label="Template 1"
                @click="presistValue('first')"
              />
              <q-radio
                v-model="receipt.sampleType"
                :disable="receipt.isprintingDisable"
                color="btn-primary"
                val="second"
                label="Template 2"
                @click="presistValue('second')"
              />
              <q-checkbox
                v-model="receipt.isprintingDisable"
                color="btn-primary"
                label="Disable Print"
                @update:model-value="presistValue"
              />
            </div>
          </div>
        </div>
        <div
          v-if="selectedInventoryData.length"
          class="flex flex-col justify-between"
        >
          <div class="my-4 w-full max-h-[200px] overflow-y-auto">
            <q-table
              auto-width
              :loading="isLoading"
              :rows="selectedInventoryData"
              :columns="saleShopSelectedGrnInventoryTableColumn"
              :rows-per-page-options="[0]"
              :visible-columns="
                authStore.loggedInUser?.isRetailDiscountAllowed
                  ? [
                      'productImage',
                      'productName',
                      'productCode',
                      'availableQuantity',
                      'retailPrice',
                      'dispatchQuantity',
                      'action',
                      'discount',
                    ]
                  : [
                      'productImage',
                      'productName',
                      'productCode',
                      'availableQuantity',
                      'retailPrice',
                      'dispatchQuantity',
                      'action',
                    ]
              "
              row-key="id"
            >
              <template v-slot:body-cell-productImage="props">
                <q-td :props="props">
                  <div
                    @click="handlePreviewImage(props.row.productImage)"
                    class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
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
                    class="w-[80px]"
                    color="btn-primary"
                  />
                  <span
                    v-if="props.row.errorMessage"
                    class="text-red text-sm"
                    >{{ props.row.errorMessage }}</span
                  >
                </q-td>
              </template>

              <template
                v-if="authStore.loggedInUser?.isRetailDiscountAllowed"
                v-slot:body-cell-discount="props"
              >
                <q-td :props="props">
                  <q-input
                    v-model="props.row.discount"
                    @update:model-value="
                      handleUpdateDiscount(
                        $event,
                        props.row,
                        authStore.loggedInUser?.discount ?? 0
                      )
                    "
                    :disable="props.row.isReturn"
                    type="number"
                    dense
                    min="0"
                    outlined
                    color="btn-primary"
                    class="w-[80px]"
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
          <div class="w-full mb-3">
            <div class="min-w-[200px] flex flex-wrap gap-3">
              <div>
                <span class="font-medium text-base">Total</span>
                <q-input
                  v-model="shopSalesTotalAmount"
                  type="number"
                  maxlength="250"
                  readonly
                  borderless
                  :input-style="{ fontSize: '16px', fontWeight: '500' }"
                  dense
                  color="btn-primary"
                />
              </div>
              <div>
                <span class="font-medium text-base">Discount</span>
                <q-input
                  v-model="shopSalesTotalDiscount"
                  @update:model-value="handleUpdateShopSaleDiscount($event)"
                  type="number"
                  maxlength="250"
                  readonly
                  :input-style="{ fontSize: '16px', fontWeight: '500' }"
                  borderless
                  dense
                  color="btn-primary"
                />
              </div>
              <div>
                <span class="font-medium text-base">Return</span>
                <q-input
                  v-model="shopSalesReturnItems"
                  type="number"
                  maxlength="250"
                  readonly
                  :input-style="{ fontSize: '16px', fontWeight: '500' }"
                  borderless
                  dense
                  color="btn-primary"
                />
              </div>
              <div>
                <span class="font-medium text-base text-btn-primary"
                  >Net Total</span
                >
                <q-input
                  v-model="shopSalesNetAmount"
                  type="number"
                  maxlength="250"
                  readonly
                  :input-style="{
                    fontSize: '25px',
                    fontWeight: '500',
                    color: 'var(--btn-primary)',
                  }"
                  borderless
                  dense
                  color=" btn-primary"
                />
              </div>
              <div>
                <span class="font-medium text-base">Cash Received</span>
                <q-input
                  v-model="cashReceived"
                  type="number"
                  maxlength="250"
                  outlined
                  dense
                  color="btn-primary"
                />
              </div>
              <div>
                <span class="font-medium text-base">Change</span>
                <q-input
                  v-model="cashReturn"
                  type="number"
                  maxlength="250"
                  readonly
                  borderless
                  dense
                  color="btn-primary"
                />
              </div>
            </div>
            <div class="max-w-[300px] mt-3 min-w-[200px] md:w-1/3">
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
          padding="3px 10px"
          color="btn-primary"
          label-position="left"
          icon="shopping_cart"
          label="Save"
          @click="handleAddShopSale()"
          :disable="isButtonDisable || isApiCall"
        />
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
      </q-fab>
      <div
        class="col-2 sm:w-[200px] px-2 !h-[calc(100vh-112px)] overflow-auto hidden lg:!block"
      >
        <div class="flex flex-nowrap flex-col h-full gap-3 lg:gap-4">
          <q-btn
            unelevated
            :disable="isButtonDisable || isApiCall"
            color=""
            @click="handleAddShopSale"
            class="rounded-[8px] icon_left min-h-fit bg-btn-primary hover:bg-btn-primary-hover w-full py-3 xl:py-4.5 md:text-[12px] lg:text-[10px] xl:text-[13px]"
            label="Save "
            icon="shopping_cart"
          />
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
            v-if="
              authStore.loggedInUser?.rolePermissions.roleName.toLowerCase() ===
                EUserRoles.ShopManager.toLowerCase() ||
              authStore.loggedInUser?.rolePermissions.roleName.toLowerCase() ===
                EUserRoles.ShopOfficer.toLowerCase() ||
              authStore.loggedInUser?.rolePermissions.roleName.toLowerCase() ===
                EUserRoles.SuperAdmin.toLowerCase()
            "
            unelevated
            icon="payments"
            color=""
            class="rounded-[8px] icon_left min-h-fit bg-btn-primary hover:bg-btn-primary-hover w-full py-3 xl:py-4.5 md:text-[12px] lg:text-[10px] xl:text-[13px]"
            label="Cash Closing Report"
            to="/cash-closing-report"
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

  <div ref="ReceiptToPrint" class="receipt hidden">
    <sale-receipt
      :receipt-detail="receiptDetail"
      :is-first-sample="receipt.sampleType"
    />
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { useQuasar } from 'quasar';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import InventoryListModal from 'src/components/inventory/Inventory-List-Modal.vue';
import OutsideClickContainer from 'src/components/common/Outside-Click-Container.vue';
import SaleReceipt from 'src/components/today-sale-summary/Sale-Receipt.vue';
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
  IUserResponse,
  IPreviewSaleResponse,
} from 'src/interfaces';
import {
  saleShopSelectedGrnInventoryTableColumn,
  buttons,
  printReceipt,
} from './utils';
import {
  GetArticleList,
  GetInventoryDetail,
  GetShopList,
  CreateSale,
  HoldSale,
  GetShopOfficers,
  GetSaleDetail,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
const authStore = useAuthStore();
const timeStamp = Date.now();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.SaleAndReturnManagement
);
const cashReceived = ref<number>(0);
const router = useRouter();
const shopData = ref<IShopResponse[]>([]);
const $q = useQuasar();
const isFetchingShopList = ref(false);
const isApiCall = ref(false);
const isFetchingRecords = ref(false);
const apiController = ref<AbortController | null>(null);
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');
const isInventoryListModalVisible = ref(false);
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
const roleDropdownOptions = ref<IUserResponse[]>([]);
const selectedInventoryData = ref<ISaleShopSelectedInventory[]>([]);
const receipt = ref<{
  sampleType: string;
  isprintingDisable: boolean;
}>({
  sampleType: localStorage.getItem('template_btn') || 'first',
  isprintingDisable: JSON.parse(
    localStorage.getItem('disable_template_btn') || 'false'
  ),
});
const receiptDetail = ref<null | IPreviewSaleResponse>(null);
const receiptItems = ref<ISaleShopSelectedInventory[]>([]);
const isSelectedShopDetailTableVisible = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const scannedLabel = ref('');
const scannedLabelInput = ref<null | HTMLDivElement>(null);
const scannedLabelLoading = ref(false);
const filterChanged = ref(false);
const isLoading = ref(false);
const ReceiptToPrint = ref<null | HTMLDivElement>(null);
const dispatchQuantityInput = ref<null | HTMLDivElement>(null);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
const selectedUser = ref<{ user: IUserResponse | null }>({
  user: null,
});
const filterSearch = ref<{
  keyword: string;
  ProductId: null | number;
  ShopId: number | null;
  ProductCode: string | null;
  categoryName: string;
  CategoryId: null;
}>({
  keyword: '',
  ProductId: null,
  ShopId: selectedShop.value.fromShop?.shopId ?? null,
  ProductCode: '',
  categoryName: '',
  CategoryId: null,
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
  salePersonCode: IUserResponse | null;
}>({
  comment: '',
  discount: 0,
  salePersonCode: selectedUser.value.user,
});

watch(selectedInventoryData, () => {
  scannedLabel.value = '';
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
  getShopOfficers();
});
const presistValue = (value: string | boolean) => {
  if (typeof value === 'string') {
    localStorage.setItem('template_btn', value);
  } else {
    localStorage.setItem('disable_template_btn', String(value));
  }
};
const handleActionKeys = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    if (
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
    } else if (e.key === 'F8') {
      router.push('/shop-account');
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
  if (button.name === 'shopSummary') {
    router.push('/shop-sale/shop-summary');
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
  if (button.name === 'shopAccount') {
    router.push('/shop-account');
  }
};
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const shopSalesTotalAmount = computed(() => {
  return selectedInventoryData.value.reduce((amount: number, row) => {
    if (row.isReturn) {
      return amount;
    } else {
      return amount + row.dispatchQuantity * row.retailPrice;
    }
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
const cashReturn = computed(() => {
  return cashReceived.value - shopSalesNetAmount.value;
});
const shopSalesNetAmount = computed(() => {
  const netAmount =
    shopSalesTotalAmount.value -
    shopSalesTotalDiscount.value -
    shopSalesReturnItems.value;
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
  getShopOfficers();
  shopSale.value.salePersonCode = null;
  shopSale.value.comment = '';
  selectedInventoryData.value = [];
  selectedShopDetailRecords.value = [];
};
const handleUpdateSalePersonCode = (newVal: IUserResponse) => {
  selectedUser.value.user = newVal;
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
          ShopId: selectedShop.value.fromShop?.shopId?.toString() ?? '-1',
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
  if (e.key === '+') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
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
  row: ISaleShopSelectedInventory,
  discountPercentage: number
) => {
  const retailPrice = row.retailPrice;
  const dispatchQuantity = row.dispatchQuantity;
  const dP = discountPercentage / 100;
  const discountAmount = retailPrice * dispatchQuantity * dP;

  if (newVal === null || newVal === '') {
    row.discount = 0;
  } else {
    const value = parseInt(newVal.toString());
    if (!value) {
      row.discount = 0;
    } else if (value > discountAmount) {
      row.discount = discountAmount;
    } else if (value < -1 * discountAmount) {
      row.discount = -1 * discountAmount;
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
  payload.forEach((item) => {
    if (!oldIdList.includes(item.inventoryId)) {
      selectedInventoryData.value.unshift({
        ...item,
        dispatchQuantity: 1,
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
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
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
    const res = await GetInventoryDetail(
      {
        ShopId: (selectedShop.value.fromShop?.shopId ?? -1).toString(),
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
  isApiCall.value = true;
  receiptItems.value = selectedInventoryData.value;
  if (selectedInventoryData.value.some((record) => record.retailPrice === 0)) {
    $q.notify({
      message:
        'Cannot Complete this sale. One or more items have a retailPrice of 0.',
      type: 'warning',
    });
    isApiCall.value = false;
    return;
  }
  if (
    selectedInventoryData.value.some(
      (record) => record.quantity <= 0 && !record.isReturn
    )
  ) {
    $q.notify({
      message:
        'Cannot Complete this sale. One or more items have a Available Quantity 0. Either make it return or delete it',
      type: 'warning',
    });
    isApiCall.value = false;
    return;
  }
  try {
    isLoading.value = true;
    const payload = {
      salePersonCode: shopSale.value?.salePersonCode?.userId?.toString() ?? '',
      shopId: selectedShop.value.fromShop?.shopId,
      comments: shopSale.value.comment,
      saleDetails: selectedInventoryData.value.map((record) => ({
        inventoryId: record.inventoryId,
        quantity: record.dispatchQuantity,
        discount: record.discount,
        isReturn: record.isReturn,
      })),
    };

    const addingSaleResponse = await CreateSale(payload);
    if (addingSaleResponse.type === 'Success') {
      const previewSaleResponse = await GetSaleDetail(
        addingSaleResponse.data.saleId
      );
      await (receiptDetail.value = previewSaleResponse.data);
      if (!receipt.value.isprintingDisable) {
        printReceipt(ReceiptToPrint);
      }
      $q.notify({
        message: addingSaleResponse.message,
        type: 'positive',
      });
      shopSale.value.salePersonCode = null;
      shopSale.value.comment = '';
      selectedInventoryData.value = [];
      selectedShopDetailRecords.value = [];
      receiptItems.value = [];
      receipt.value.sampleType = 'first';
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
    isApiCall.value = false;
  }
};
const handleHoldBill = async () => {
  if (selectedInventoryData.value.some((record) => record.isReturn)) {
    $q.notify({
      message: 'You cannot HOLD this bill, as it contains a Return Item.',
      type: 'warning',
    });
    return;
  }
  if (selectedInventoryData.value.some((record) => record.retailPrice === 0)) {
    $q.notify({
      message:
        'Cannot HOLD this sale. One or more items have a retailPrice of 0.',
      type: 'warning',
    });
    return;
  }
  try {
    isLoading.value = true;
    const payload = {
      salePersonCode: shopSale.value?.salePersonCode?.userId?.toString() ?? '',
      shopId: selectedShop.value.fromShop?.shopId,
      comments: shopSale.value.comment,
      saleDetails: selectedInventoryData.value.map((record) => ({
        inventoryId: record.inventoryId,
        quantity: record.dispatchQuantity,
        discount: record.discount,
      })),
    };
    const response = await HoldSale(payload);
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      shopSale.value.salePersonCode = null;
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
const getShopOfficers = async () => {
  isLoading.value = true;
  const requestFilter = {
    RoleName: 'ShopOfficer',
    ShopId: selectedShop.value.fromShop?.shopId ?? null,
    Status: 'Active',
    pageNumber: 1,
    pageSize: 1000,
  };
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();

    const res = await GetShopOfficers(requestFilter, apiController.value);

    if (res?.data) {
      roleDropdownOptions.value = res.data.items;
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
