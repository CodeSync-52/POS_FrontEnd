<template>
  <div class="col-12 col-md-4">
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.InventoryManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
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
      <q-markup-table
        v-for="(product, productIndex) in rowColumnData"
        :key="productIndex"
        class="q-mb-md"
      >
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
                  selectedInventoryPayload[
                    `${product.productId}-${firstItem.variantId}-${secondItem.variantId}`
                  ].stockQuantity = $event
                "
              >
              </q-input>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      {{ selectedArticle }}
      <div class="row q-gutter-x-sm justify-end items-center">
        <q-btn label="Cancel" color="btn-cancel" unelevated />
        <q-btn @click="mySaveFn" label="Save" unelevated color="btn-primary" />
      </div>
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
    <inventory-managment-step-2-modal
      :selected-article="selectedArticle"
      @selected-Variants="handleSelectedVariant"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
import InventoryManagmentStep2Modal from 'src/components/common/InventoryManagmentStep2Modal.vue';
import {
  EActionPermissions,
  EUserModules,
  IArticleData,
  IPagination,
  ISelectedArticle,
  ISelectedArticleData,
  getRoleModuleDisplayName,
  IVariantDetailsData,
  IProductWithVariantDTOs,
} from 'src/interfaces';
import { articleListApi, addInventoryApi } from 'src/services';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
const authStore = useAuthStore();
const isArticleListModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.InventoryManagement);
const isFilterChanged = ref(false);
const isFetchingArticleList = ref(false);
const isSelectionSingle = ref(true);
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

const selectedInventoryPayload = ref<Record<string, any>>({});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const $q = useQuasar();
window.addEventListener('keypress', function (e) {
  if (e.key === 'n' || e.key === 'N') {
    isArticleListModalVisible.value = true;
  }
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
  // articleList.value;
  // const selectedProducts= rowColumnData.value.map(product=>product.productId)
  return articleList.value.filter((item) => {
    const index = selectedArticleData.value.findIndex(
      (art) => art.productId === item.productId
    );
    return index === -1;
  });
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
  isInventoryManagementStepTwoVisible.value = false;
};
onMounted(() => {
  getArticleList();
});
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};

const mySaveFn = () => {
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
