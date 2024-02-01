<template>
  <div>
    <div
      v-if="!isPrintingBarcodeScreenVisible"
      class="flex flex-col md:flex-row justify-between items-center q-mb-md gap-3"
    >
      <q-btn
        unelevated
        color="btn-cancel"
        label="Go Back"
        @click="router.go(-1)"
      />
      <div class="q-gutter-md flex flex-col md:flex-row">
        <q-btn
          v-if="!rowColumnData.length"
          label="Custom Label"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          @click="handleCustomLabel"
        />
        <q-btn
          label="Add New Article"
          icon="add"
          unelevated
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
          @click="handleAddArticle"
        />
      </div>
    </div>
    <div v-if="!showBarcodeScreen">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <div class="text-base mb-1"><span>From Shop</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            :options="shopOptionRecords"
            :loading="isShopLoading"
            use-input
            dense
            map-options
            outlined
            disable
            v-model="selectedShop.FromShop"
            @update:model-value="selectedShop.FromShop = $event"
            label="From Shop"
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
            :loading="isShopLoading"
            use-input
            dense
            class="w-full"
            disable
            map-options
            outlined
            v-model="selectedShop.ToShop"
            @update:model-value="selectedShop.ToShop = $event"
            label="To Shop"
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
      <div
        class="flex flex-col gap-2"
        v-for="(product, productIndex) in rowColumnData"
        :key="productIndex"
      >
        <div class="row justify-between items-center">
          <span
            >Product Id:
            <span class="font-semibold">{{ product.productId }}</span></span
          >
          <q-btn
            icon="close"
            unelevated
            dense
            size="sm"
            @click="handleRemoveProduct(product)"
          />
        </div>
        <q-markup-table class="">
          <thead align="left">
            <tr>
              <th>
                <div class="row items-center gap-1">
                  <div class="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      class="w-full h-full object-cover"
                      :src="
                        getImageUrl(product.productImage) ||
                        'assets/default-image.png'
                      "
                      alt="img"
                    />
                  </div>
                  <div class="flex flex-col">
                    <span
                      >Product:
                      <span class="font-semibold">{{
                        product.productName
                      }}</span></span
                    >
                    <div>
                      <span>Available Stock: </span>
                      <span class="font-semibold">
                        {{ product.masterStock }}
                      </span>
                    </div>
                    <div>
                      <span>Retail Price: </span>
                      <span class="font-semibold">
                        {{ product.retailPrice }}
                      </span>
                    </div>
                  </div>
                </div>
              </th>
              <th
                v-for="(header, headerIndex) in product.firstVariantSelection"
                :key="headerIndex"
              >
                {{ header.displayName }}
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(
                secondItem, secondItemIndex
              ) in product.secondVariantSelection"
              :key="secondItemIndex"
            >
              <td>{{ secondItem.displayName }}</td>
              <td
                v-for="(
                  firstItem, firstItemIndex
                ) in product.firstVariantSelection"
                :key="firstItemIndex"
              >
                <q-input
                  type="number"
                  dense
                  color="btn-primary"
                  outlined
                  min="0"
                  v-model="
                    selectedInventoryPayload[
                      `${product.productId}-${firstItem.variantId}-${secondItem.variantId}`
                    ].stockQuantity
                  "
                  @update:model-value="
                    handleUpdateQuantity(
                      $event,
                      product.productId,
                      firstItem.variantId,
                      secondItem.variantId
                    )
                  "
                />
              </td>
              <td>{{ selectedInventoryTotalQuantity(product, secondItem) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <span class="text-xm font-medium text-[#f60707fb]">
          {{
            getStockMessage(
              selectedInventoryPayload,
              product.productId,
              product.masterStock
            )
          }}</span
        >
      </div>
      <div
        v-if="rowColumnData.length"
        class="row q-gutter-x-sm justify-end items-center"
      >
        <q-btn
          @click="handleSaveInventory"
          :loading="isPrintingBarcode"
          label="Save"
          unelevated
          :disable="InValidStock"
          color="btn-primary"
        />
      </div>
    </div>
    <div v-if="isPrintingBarcodeScreenVisible" class="column gap-3">
      <div
        class="flex flex-col md:flex-row items-center justify-center md:justify-between"
      >
        <div class="flex items-center gap-1">
          <span class="text-lg font-semibold">Printed Barcodes:</span>
          <q-spinner v-if="isPrintingBarcode" size="2rem" color="btn-primary" />
        </div>
        <q-btn
          :label="
            showfirstBarcodePreview
              ? 'Show Second Preview '
              : 'Show First Preview'
          "
          :disable="isPrintingBarcode"
          color="btn-primary"
          unelevated
          @click="handleToggleBarcodePreview"
        />
      </div>
      <div ref="printedDiv" class="overflow-auto h-[calc(100vh_-_224px)]">
        <div
          class="print:grid-cols-1 grid-parent grid md:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          <div
            v-for="(barcode, index) in selectedProductBarcodes"
            :key="barcode.productCode"
            class="mx-auto grid-item"
          >
            <q-card-section>
              <div
                class="grid grid-cols-1 h-[85px] gap-3 min-w-[210px] max-w-[210px]"
              >
                <div
                  class="rounded-lg p-0.5 overflow-hidden shadow-[0px_0px_3px_1px_rgba(0,0,0,0.2)]"
                >
                  <div
                    :class="
                      showfirstBarcodePreview
                        ? 'firstBarcodeContainer grid grid-cols-[2fr_5fr] font-semibold'
                        : 'secondBarcodeContainer flex flex-col font-semibold items-center'
                    "
                  >
                    <div
                      :class="
                        showfirstBarcodePreview
                          ? 'firstBarcodeLabel flex flex-col justify-center items-center gap-2'
                          : 'secondBarcodeLabel flex justify-center gap-2'
                      "
                    >
                      <span
                        v-for="labelPiece in barcode.productCode
                          .split(',')[0]
                          .split('-')"
                        :key="labelPiece"
                      >
                        {{ labelPiece }}
                      </span>
                    </div>
                    <div class="min-w-[155px] max-w-[155px]">
                      <img
                        :id="`barcode-image-${index}`"
                        :class="`barcode-` + barcode.productCode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn
          label="Go Back"
          unelevated
          color="btn-cancel"
          @click="isPrintingBarcodeScreenVisible = false"
        />
        <q-btn
          @click="printBarcodes"
          v-if="isPrintBarcodeButtonVisible"
          label="Print Barcodes"
          color="btn-primary"
          unelevated
        />
      </q-card-actions>
    </div>

    <q-dialog v-model="isArticleListModalVisible">
      <article-list-modal
        @handle-pagination="handlePagination"
        @selected-data="selectedData"
        @filtered-rows="handleFilterRows"
        :article-list="articleListComputed"
        :pagination="pagination"
        :current-data="
          selectedArticleData.map((item) => ({
            productId: item.productId !== null ? item.productId : -1,
            productName: item?.productName || '',
            productImage: item.productImage || '',
            masterStock: item.masterStock ?? 0,
            retailPrice: item.retailPrice ?? 0,
          }))
        "
        :is-fetching-article-list="isFetchingArticleList"
        :is-selection-single="isSelectionSingle"
      />
    </q-dialog>

    <q-dialog v-model="isInventoryManagementStepTwoVisible">
      <select-variant-modal
        :selected-article="selectedArticle"
        @selected-variants="handleSelectedVariant"
      />
    </q-dialog>
    <q-dialog v-model="isCustomLabelModalVisible">
      <custom-label
        :is-articles-loading="isFetchingArticleList"
        :selected-article="selectedArticle"
        :article-list="articleListComputed"
        :pagination="pagination"
        @selected-custom="handleCustomSelectedLabel"
      />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import JsBarcode from 'jsbarcode';
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
import SelectVariantModal from 'src/components/inventory/SelectVariantModal.vue';
import CustomLabel from 'src/components/inventory/CustomLabel.vue';
import { useAuthStore } from 'src/stores';
import {
  IArticleData,
  IPagination,
  IProductWithVariantDTOs,
  ISelectedArticleWithMasterStockAndRetailPrice,
  ISelectedArticleData,
  IVariantDetailsData,
  IShopResponse,
} from 'src/interfaces';
import {
  addInventoryApi,
  articleListApi,
  viewGrnApi,
  shopListApi,
} from 'src/services';
import { isPosError } from 'src/utils';
const router = useRouter();
const isSelectionSingle = ref(true);
const isFilterChanged = ref(false);
const authStore = useAuthStore();
const isFetchingArticleList = ref(false);
const isPrintingBarcodeScreenVisible = ref(false);
const isInventoryManagementStepTwoVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticle = ref<ISelectedArticleWithMasterStockAndRetailPrice[]>(
  []
);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
const showfirstBarcodePreview = ref(true);
const isShopLoading = ref(false);
const rowColumnData = ref<
  {
    firstVariantSelection: IVariantDetailsData[] | null;
    secondVariantSelection: IVariantDetailsData[] | null;
    productId: number | null;
    productName: string | null;
    productImage: string | null;
    masterStock: number;
    retailPrice: number;
  }[]
>([]);

const selectedInventoryPayload = ref<
  Record<
    string,
    { variantId_1: number; variantId_2: number; stockQuantity: number }
  >
>({});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const isArticleListModalVisible = ref(false);
const isCustomLabelModalVisible = ref(false);
const selectedId = ref<number>(-1);
const isPrintingBarcode = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const $q = useQuasar();
const selectedShop = ref<{
  FromShop: IShopResponse | null;
  ToShop: IShopResponse | null;
}>({
  FromShop: null,
  ToShop: null,
});
const InValidStock = ref(false);
const selectedProductBarcodes = ref<{ productCode: string }[]>([]);
window.addEventListener('keypress', function (e) {
  if (e.key === 'n' || e.key === 'N') {
    isArticleListModalVisible.value = true;
  }
});
window.addEventListener('keydown', function (event) {
  if (
    isPrintBarcodeButtonVisible.value &&
    event.ctrlKey &&
    (event.key === 'p' || event.key === 'P')
  ) {
    event.preventDefault();
    printBarcodes();
  }
});
const isPrintBarcodeButtonVisible = ref(false);
onMounted(() => {
  if (router.currentRoute.value.fullPath.includes('add-custom')) {
    isCustomLabelModalVisible.value = true;
  } else if (router.currentRoute.value.fullPath.includes('add-new/')) {
    selectedId.value = Number(router.currentRoute.value.params.id);
    handlePreviewGrn();
  } else {
    isArticleListModalVisible.value = true;
  }
  selectedShop.value.FromShop = {
    shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
    closingBalance: 0,
    status: '',
    isWareHouse: '',
    name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
    phone: '',
    address: '',
    code: '',
  };
  selectedShop.value.ToShop = {
    shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
    closingBalance: 0,
    status: '',
    isWareHouse: '',
    name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
    phone: '',
    address: '',
    code: '',
  };
  getArticleList();
  getShopList();
});
const printedDiv = ref<null | HTMLDivElement>(null);
const printBarcodes = () => {
  let header_string =
    '<html><head><title>' + document.title + '</title></head><body>';
  let footer_string = '</body></html>';
  let new_string = printedDiv.value?.innerHTML;
  let printWindow = window.open('', '_blank');
  if (printWindow) {
    let stylesheets =
      '<style>' +
      '.grid-parent { .grid-container {display: grid !important; gap:1rem;grid-template-columns: auto; margin-left:auto;margin-right:auto} }' +
      '.grid-item {page-break-after:always;width:280px;margin-top:0.3rem;margin-bottom:0.7rem; font-size:1.1rem;margin-left:auto;margin-right:auto;padding: 0.34rem;text-align: center; }' +
      '.firstBarcodeLabel {display:flex;gap:1rem;flex-direction:column;align-items:center;justify-content:center;margin-left:0.3rem}' +
      '.firstBarcodeContainer {display:flex;align-items:center;justify-content:center;}' +
      '.secondBarcodeLabel {display:flex;gap:1rem;align-items:center;justify-content:center;}' +
      '</style>';
    printWindow.document.write(
      header_string + stylesheets + new_string + footer_string
    );
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
  return false;
};
const handleAddArticle = () => {
  selectedProductBarcodes.value = [];
  isArticleListModalVisible.value = true;
};
const handleCustomLabel = () => {
  getArticleList();
  selectedProductBarcodes.value = [];
  isCustomLabelModalVisible.value = true;
};
const handleToggleBarcodePreview = () => {
  showfirstBarcodePreview.value = !showfirstBarcodePreview.value;
  setBarcodeProps();
};
const handleRemoveProduct = (selectedProduct: {
  firstVariantSelection: IVariantDetailsData[] | null;
  secondVariantSelection: IVariantDetailsData[] | null;
  productId: number | null;
  productName: string | null;
  productImage: string | null;
}) => {
  const selectedProductIndex = rowColumnData.value.findIndex(
    (product) => selectedProduct.productId === product.productId
  );
  rowColumnData.value.splice(selectedProductIndex, 1);
  setProductKeys();
};
const shopOptionRecords = computed(() => {
  let idList: number[] = [];
  if (selectedShop.value.FromShop) {
    idList.push(selectedShop.value.FromShop.shopId);
  }
  if (selectedShop.value.ToShop) {
    idList.push(selectedShop.value.ToShop.shopId);
  }
  if (idList.length > 0) {
    return shopData.value.filter((shop) => !idList.includes(shop.shopId));
  }
  return shopData.value;
});
const getShopList = async () => {
  isShopLoading.value = true;
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
    isShopLoading.value = false;
  }
};
const handleFilterRows = (filterChanged: boolean) => {
  if (filterChanged) {
    isFilterChanged.value = filterChanged;
    setTimeout(() => {
      isFilterChanged.value = false;
    }, 200);
  }
};
const articleListComputed = computed(() => {
  const selectedItemIdList = rowColumnData.value.map((item) => item.productId);
  return articleList.value.filter(
    (item) => !selectedItemIdList.includes(item.productId)
  );
});
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  getArticleList();
};
const getArticleList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isFilterChanged.value) return;
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await articleListApi({
      PageNumber: 1,
      PageSize: 2000,
      Status: 'Active',
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
        pagination.value.rowsNumber = res.data.totalItemCount;
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

function getStockMessage(
  selectedInventoryPayload: Record<
    string,
    { variantId_1: number; variantId_2: number; stockQuantity: number }
  >,
  productId: number | null,
  masterStock: number
) {
  const totalStock = Object.keys(selectedInventoryPayload)
    .filter((key) => key.split('-')[0] === productId?.toString())
    .reduce(
      (total, key) => total + selectedInventoryPayload[key].stockQuantity,
      0
    );
  InValidStock.value = totalStock > masterStock;
  return totalStock > masterStock
    ? 'Selected Quantity cannot be greater than Available Stock'
    : '';
}
const selectedData = (
  payload: {
    productId: number;
    productName?: string;
    productImage: string | null;
    masterStock: number;
    retailPrice: number;
  }[]
) => {
  if (payload.length > 1) {
    let message = 'You can not select more then 1 article!';
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
    return;
  } else {
    isArticleListModalVisible.value = false;
    selectedArticle.value = payload;
    if (selectedArticle.value.length === 1) {
      isInventoryManagementStepTwoVisible.value = true;
    }
  }
};

const handleUpdateQuantity = (
  newVal: string | number | null,
  productId: number | null,
  firstVariantId: number,
  secondVariantId: number
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (val > 0 && productId) {
      selectedInventoryPayload.value[
        `${productId}-${firstVariantId}-${secondVariantId}`
      ].stockQuantity = val;
    } else if (val < 0 || !val) {
      selectedInventoryPayload.value[
        `${productId}-${firstVariantId}-${secondVariantId}`
      ].stockQuantity = 0;
    }
  }
};
const handleCustomSelectedLabel = (
  payload: {
    productLabel: string | null;
    productBarcode: string | null;
    quantity: number | null;
  },
  callback: () => void
) => {
  if (payload.productBarcode !== null && payload.quantity !== null) {
    const modifiedArray = modifyArray([
      { productCode: payload.productBarcode, quantity: payload.quantity },
    ]);
    selectedProductBarcodes.value = modifiedArray;
    showBarcodeScreen.value = true;
    isPrintingBarcodeScreenVisible.value = true;
    setBarcodeProps();
    callback();
  }
  isCustomLabelModalVisible.value = false;
};

const handleSelectedVariant = (
  payload: {
    firstVariantSelection: IVariantDetailsData[] | null;
    secondVariantSelection: IVariantDetailsData[] | null;
  },
  productId: number,
  productName: string,
  productImage: string,
  masterStock: number,
  retailPrice: number
) => {
  if (showBarcodeScreen.value) {
    selectedInventoryPayload.value = {};
    showBarcodeScreen.value = false;
  }
  rowColumnData.value = [
    ...rowColumnData.value,
    {
      firstVariantSelection: payload.firstVariantSelection,
      secondVariantSelection: payload.secondVariantSelection,
      productId,
      productName,
      productImage,
      masterStock,
      retailPrice,
    },
  ];
  setProductKeys();
  isInventoryManagementStepTwoVisible.value = false;
};
function setProductKeys() {
  const oldData = { ...selectedInventoryPayload.value };
  selectedInventoryPayload.value = {};
  rowColumnData.value.forEach((product) => {
    product.firstVariantSelection?.forEach((variantA) => {
      product.secondVariantSelection?.forEach((variantB) => {
        const key = `${product.productId}-${variantA.variantId}-${variantB.variantId}`;
        selectedInventoryPayload.value[key] = {
          variantId_1: variantA.variantId,
          variantId_2: variantB.variantId,
          stockQuantity: oldData[key]?.stockQuantity || 0,
        };
      });
    });
  });
}
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const showBarcodeScreen = ref(false);
const handleSaveInventory = () => {
  const selectedInventorylist: IProductWithVariantDTOs[] = [];
  Object.keys(selectedInventoryPayload.value).forEach((key) => {
    const productId = Number(key.split('-')[0]);
    const index = selectedInventorylist.findIndex(
      (item) => item.productId === productId
    );
    if (index === -1) {
      selectedInventorylist.push({
        productId,
        variantStocks: [selectedInventoryPayload.value[key]],
      });
    } else {
      selectedInventorylist[index].variantStocks.push(
        selectedInventoryPayload.value[key]
      );
    }
  });
  handleAddInventory(selectedInventorylist);
};

const handleAddInventory = async (
  productWithVariantDTOs: IProductWithVariantDTOs[]
) => {
  const shopId = authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
  try {
    const res = await addInventoryApi({
      shopId,
      productWithVariantDTOs,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
      selectedId.value = res.data;
      handlePreviewGrn();

      rowColumnData.value = [];
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Add Inventory';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'positive',
    });
  }
};
const progressbar = ref<number[]>([]);
const setBarcodeProps = (callback?: () => void) => {
  isPrintBarcodeButtonVisible.value = false;
  isPrintingBarcode.value = true;
  progressbar.value = [];
  let index = 0;

  const generateBarcode = () => {
    if (index < selectedProductBarcodes.value.length) {
      const barcode = selectedProductBarcodes.value[index];
      showfirstBarcodePreview.value
        ? JsBarcode(
            `#barcode-image-${index}`,
            barcode.productCode.split(',')[0],
            {
              format: 'CODE128',
              width: 1.25,
              height: 55,
              displayValue: true,
              textPosition: 'top',
              text: 'KIT Shoes',
              textAlign: 'right',
              fontOptions: 'bold',
            }
          )
        : JsBarcode(
            `#barcode-image-${index}`,
            barcode.productCode.split(',')[0],
            {
              format: 'CODE128',
              width: 1.25,
              height: 55,
              displayValue: false,
              text: '',
            }
          );
      progressbar.value = [(index + 1) / selectedProductBarcodes.value.length];

      setTimeout(() => {
        index++;
        generateBarcode();
      }, 0);
    } else {
      $q.notify({
        message: 'Barcode Generation Completed',
        type: 'positive',
      });
      if (callback) {
        callback();
      }
      isPrintingBarcode.value = false;
      isPrintBarcodeButtonVisible.value = true;
    }
  };
  setTimeout(() => {
    generateBarcode();
  }, 0);
};
function modifyArray(inputArray: { productCode: string; quantity: number }[]) {
  const modifiedArray: { productCode: string }[] = [];
  inputArray.forEach((item) => {
    const { productCode, quantity } = item;

    for (let i = 0; i < quantity; i++) {
      modifiedArray.push({ productCode });
    }
  });

  return modifiedArray;
}
const handlePreviewGrn = async () => {
  try {
    const res = await viewGrnApi(selectedId.value);
    if (res.type === 'Success') {
      const selectedGrnDetails: { productCode: string; quantity: number }[] =
        res.data.grnDetails.map((records) => ({
          productCode: records.productCode,
          quantity: records.quantity,
        }));
      const modifiedArray = modifyArray(selectedGrnDetails);
      selectedProductBarcodes.value = modifiedArray;
      showBarcodeScreen.value = true;
      isPrintingBarcodeScreenVisible.value = true;
      setBarcodeProps();
    }
  } catch (e) {
    let message = 'Unexpected error occurred Preview Grn';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
};

const selectedInventoryTotalQuantity = (
  product: {
    firstVariantSelection: IVariantDetailsData[] | null;
    secondVariantSelection: IVariantDetailsData[] | null;
    productId: number | null;
    productName: string | null;
    productImage: string | null;
    masterStock: number;
  },
  secondItem: IVariantDetailsData
): number => {
  if (!product.firstVariantSelection) {
    return 0;
  }
  return product.firstVariantSelection.reduce(
    (total: number, firstItem: IVariantDetailsData) => {
      const key = `${product.productId}-${firstItem.variantId}-${secondItem.variantId}`;
      const stockQuantity =
        selectedInventoryPayload.value[key]?.stockQuantity || 0;
      return total + stockQuantity;
    },
    0
  );
};
</script>
