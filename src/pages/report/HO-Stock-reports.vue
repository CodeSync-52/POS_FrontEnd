<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">HO Stock Reports</span>
      <download-pdf-excel />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="User"
        color="btn-primary"
      />
      <q-input
        maxlength="250"
        v-model="filterSearch.categoryName"
        dense
        readonly
        label="Select Category"
        outlined
        @click="addCategory"
        color="btn-primary"
      />
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        multiple
        outlined
        :options="articleList"
        v-model="filterSearch.ProductId"
        @filter="handleFilterArticles"
        :loading="isFetchingArticleList"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div class="q-gutter-sm">
        <q-radio
          v-model="filterSearch.sortByStock"
          color="btn-primary"
          val="true"
          label="Sort by stock"
        />
        <q-radio
          v-model="filterSearch.sortByStock"
          color="btn-primary"
          val="false"
          label="Sort by article"
        />
      </div>
      <q-checkbox
        v-model="filterSearch.includeZeroStock"
        color="btn-primary"
        label="Include Zero Stock"
      />
      <q-checkbox
        v-model="filterSearch.showOnlyZeroStock"
        color="btn-primary"
        label="Show Only Zero Stock"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getReceiptList()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="reportData"
        :columns="HOStockReportColumn"
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body-cell-productImage="props">
          <q-td :props="props">
            <div
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
    </div>
    <q-dialog v-model="isCategoryModalVisible">
      <article-category-modal @category-selected="handleSelectedCategory" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { useQuasar } from 'quasar';
import {
  IAccountReportData,
  IArticleData,
  IUserResponse,
} from 'src/interfaces';
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { articleListApi, getUserListApi } from 'src/services';
import { HOStockReportListApi } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { HOStockReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const UserList = ref<IUserResponse[]>([]);
const $q = useQuasar();
const options = ref<IUserResponse[]>([]);
const reportData = ref<IAccountReportData[]>([]);
const isFetchingArticleList = ref(false);
const isCategoryModalVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const filterSearch = ref<{
  userId: null | number;
  categoryId: number | null;
  categoryName: string;
  sortByStock: string;
  includeZeroStock: boolean;
  showOnlyZeroStock: boolean;
  ProductId: IArticleData[];
}>({
  userId: null,
  categoryId: null,
  categoryName: '',
  sortByStock: 'false',
  includeZeroStock: true,
  showOnlyZeroStock: true,
  ProductId: [],
});

onMounted(() => {
  getUserList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items.filter((x) => x.roleName === 'Customer');
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isLoading.value = false;
};
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userId: null,
    categoryId: null,
    categoryName: '',
    sortByStock: 'false',
    includeZeroStock: true,
    showOnlyZeroStock: true,
    ProductId: [],
  };
  getReceiptList();
};

const getReceiptList = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await HOStockReportListApi(
      {
        userId: filterSearch.value.userId,
        categoryId: filterSearch.value.categoryId,
        productIds: filterSearch.value.ProductId.map(
          (product) => product.productId
        ).join(','),
        includeZeroStock: filterSearch.value.includeZeroStock,
        showOnlyZeroStock: filterSearch.value.showOnlyZeroStock,
        sortByStock: filterSearch.value.sortByStock === 'true' ? true : false,
      },
      apiController.value
    );
    if (res?.data) {
      reportData.value = res.data?.list;
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
  isLoading.value = false;
};
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({
      PageNumber: 1,
      PageSize: 1000000,
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

const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  filterSearch.value.categoryName = selectedCategory.categoryName;
  filterSearch.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
</script>
