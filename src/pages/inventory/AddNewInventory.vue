<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <q-btn
        unelevated
        color="btn-cancel"
        label="Go Back"
        @click="router.push('/inventory')"
      />

      <q-btn
        label="Add New Article"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="isArticleListModalVisible = true"
      />
    </div>
    <div
      v-if="Object.values(rowColumnData).some((variant) => variant !== null)"
    >
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
      <div class="row q-gutter-x-sm justify-end items-center">
        <q-btn label="Cancel" color="btn-cancel" unelevated />
        <q-btn
          @click="handleSaveInventory"
          label="Save"
          unelevated
          color="btn-primary"
        />
      </div>
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
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
import SelectVariantModal from 'src/components/inventory/SelectVariantModal.vue';
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const isSelectionSingle = ref(true);
const isFilterChanged = ref(false);
const isFetchingArticleList = ref(false);
const isInventoryManagementStepTwoVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticle = ref<ISelectedArticle[]>([]);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
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
const $q = useQuasar();
const router = useRouter();
window.addEventListener('keypress', function (e) {
  if (e.key === 'n' || e.key === 'N') {
    isArticleListModalVisible.value = true;
  }
});
onMounted(() => {
  isArticleListModalVisible.value = true;
  getArticleList();
});
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
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
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
const handleSelectedVariant = (
  payload: {
    firstVariantSelection: IVariantDetailsData[] | null;
    secondVariantSelection: IVariantDetailsData[] | null;
  },
  productId: number,
  productName: string,
  productImage: string
) => {
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
  selectedInventoryPayload.value = {};
  rowColumnData.value.forEach((product) => {
    product.firstVariantSelection?.forEach((variantA) => {
      product.secondVariantSelection?.forEach((variantB) => {
        selectedInventoryPayload.value[
          `${product.productId}-${variantA.variantId}-${variantB.variantId}`
        ] = {
          variantId_1: variantA.variantId,
          variantId_2: variantB.variantId,
          stockQuantity: 0,
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
  const shopId = 1;
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
      router.push('/inventory');
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
</script>
