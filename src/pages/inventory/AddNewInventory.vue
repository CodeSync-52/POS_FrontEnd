<template>
  <div>
    <div
      v-if="!isPrintingBarcodeScreenVisible"
      class="flex flex-col md:flex-row justify-between items-center q-mb-md gap-3"
    >
      <q-btn unelevated color="btn-cancel" label="Go Back" to="/inventory" />
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
      <div v-for="(product, productIndex) in rowColumnData" :key="productIndex">
        <div class="row justify-between mb-2 items-center">
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
        <q-markup-table class="q-mb-md">
          <thead align="left">
            <tr>
              <th>
                <div class="row items-center gap-1">
                  <span
                    >Product:
                    <span class="font-semibold">{{
                      product.productName
                    }}</span></span
                  >
                  <div class="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      class="h-full object-cover"
                      :src="
                        getImageUrl(product.productImage) ||
                        'assets/default-image.png'
                      "
                      alt="img"
                    />
                  </div>
                </div>
              </th>
              <th
                v-for="(header, headerIndex) in product.firstVariantSelection"
                :key="headerIndex"
              >
                {{ header.displayName }}
              </th>
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
                >
                </q-input>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
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
          :disable="isSaveButtonDisable"
          color="btn-primary"
        />
      </div>
    </div>
    <div v-if="isPrintingBarcodeScreenVisible" class="column gap-3">
      <div
        class="flex flex-col md:flex-row items-center justify-center md:justify-between"
      >
        <span class="text-lg font-semibold">Printed Barcodes:</span>
        <q-btn
          :label="
            showfirstBarcodePreview
              ? 'Show Second Preview '
              : 'Show First Preview'
          "
          color="btn-primary"
          unelevated
          @click="handleToggleBarcodePreview"
        />
      </div>
      <div class="overflow-auto h-[calc(100vh_-_224px)]">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="barcode in selectedProductBarcodes"
            :key="barcode.productCode"
            class="mx-auto"
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
                        ? 'grid grid-cols-[2fr_5fr] font-semibold'
                        : 'flex flex-col font-semibold items-center'
                    "
                  >
                    <div
                      :class="
                        showfirstBarcodePreview
                          ? 'flex flex-col justify-center items-center gap-2'
                          : 'flex justify-center gap-2'
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
                        id="barcode-image"
                        :class="'barcode-' + barcode.productCode"
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
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
import SelectVariantModal from 'src/components/inventory/SelectVariantModal.vue';
import CustomLabel from 'src/components/inventory/CustomLabel.vue';
import { useAuthStore } from 'src/stores';
import {
  IArticleData,
  IPagination,
  IProductWithVariantDTOs,
  ISelectedArticle,
  ISelectedArticleData,
  IVariantDetailsData,
} from 'src/interfaces';
import { addInventoryApi, articleListApi } from 'src/services';
import { isPosError } from 'src/utils';
import { computed, nextTick, onMounted, ref } from 'vue';
import JsBarcode from 'jsbarcode';
const isSelectionSingle = ref(true);
const isFilterChanged = ref(false);
const authStore = useAuthStore();
const isFetchingArticleList = ref(false);
const isPrintingBarcodeScreenVisible = ref(false);
const isInventoryManagementStepTwoVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticle = ref<ISelectedArticle[]>([]);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
const showfirstBarcodePreview = ref(true);
const rowColumnData = ref<
  {
    firstVariantSelection: IVariantDetailsData[] | null;
    secondVariantSelection: IVariantDetailsData[] | null;
    productId: number | null;
    productName: string | null;
    productImage: string | null;
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
const isPrintingBarcode = ref(false);
const $q = useQuasar();
const selectedProductBarcodes = ref<{ productCode: string }[]>([]);
window.addEventListener('keypress', function (e) {
  if (e.key === 'n' || e.key === 'N') {
    isArticleListModalVisible.value = true;
  }
});

onMounted(() => {
  isArticleListModalVisible.value = true;
  getArticleList();
});
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
const isSaveButtonDisable = computed(() => {
  const validations = Object.values(selectedInventoryPayload.value).map(
    (payload) => payload.stockQuantity === 0
  );
  return validations.some((validations) => validations === true);
});
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
const selectedData = (
  payload: {
    productId: number;
    productName?: string;
    productImage: string | null;
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
    nextTick(() => {
      setBarcodeProps();
      callback();
    });
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
  productImage: string
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
      rowColumnData.value = [];
      const modifiedArray = modifyArray(res.data);
      selectedProductBarcodes.value = modifiedArray;
      showBarcodeScreen.value = true;
      isPrintingBarcodeScreenVisible.value = true;
      nextTick(() => {
        setBarcodeProps();
      });
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
const setBarcodeProps = () => {
  progressbar.value = [];
  selectedProductBarcodes.value.forEach((barcode, index) => {
    nextTick(() => {
      showfirstBarcodePreview.value
        ? JsBarcode('#barcode-image', barcode.productCode.split(',')[0], {
            format: 'CODE128',
            width: 1,
            height: 40,
            displayValue: true,
            textPosition: 'top',
            text: 'KIT Shoes',
            textAlign: 'right',
            fontOptions: 'bold',
          })
        : JsBarcode('#barcode-image', barcode.productCode.split(',')[0], {
            format: 'CODE128',
            width: 1,
            height: 40,
            displayValue: false,
            text: '',
          });
    });
    progressbar.value.push(index + 1);
    console.log(progressbar.value);
  });
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
</script>
