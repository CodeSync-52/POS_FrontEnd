<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Shop Stock Report</span>
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
        v-model="filterSearch.userData"
        @update:model-value="filterSearch.userData"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        label="Select Shop"
        color="btn-primary"
      />
      <q-input
        maxlength="250"
        v-model="filterSearch.categoryName"
        dense
        required
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
        @filter="handleFilterArticles"
        :options="articleList"
        v-model="filterSearch.ProductId"
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
      <q-checkbox
        v-model="filterSearch.excludeZeroStock"
        color="btn-primary"
        label="Exclude Zero Stock"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="getDataList()"
        />
        <!-- <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        /> -->
      </div>
      <q-dialog v-model="isCategoryModalVisible">
        <article-category-modal @category-selected="handleSelectedCategory" />
      </q-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import ArticleCategoryModal from 'src/components/article-management/Article-Category-Modal.vue';
import { IArticleData, IUserResponse } from 'src/interfaces';
import { GetArticleList, GetUsers } from 'src/services';
import { useQuasar } from 'quasar';
import { GetShopStockReport } from 'src/services/reports';
import { isPosError } from 'src/utils';
import { ref, onMounted } from 'vue';
import { CanceledError } from 'axios';
const isLoading = ref(false);
const $q = useQuasar();
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const isCategoryModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const UserList = ref<IUserResponse[]>([]);
const options = ref<IUserResponse[]>([]);
onMounted(() => {
  getUserList();
});
const addCategory = () => {
  isCategoryModalVisible.value = true;
};
const handleSelectedCategory = (selectedCategory: {
  categoryName: string;
  categoryId: number;
}) => {
  filterSearch.value.categoryName = selectedCategory.categoryName;
  filterSearch.value.categoryId = selectedCategory.categoryId;
  isCategoryModalVisible.value = false;
};
const filterSearch = ref<{
  userData: null | IUserResponse;
  categoryId: number | null;
  categoryName: string;
  shopId: number | null;
  excludeZeroStock: boolean;
  ProductId: IArticleData[];
}>({
  userData: null,
  categoryId: null,
  shopId: null,
  categoryName: '',
  excludeZeroStock: true,
  ProductId: [],
});
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
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
const getDataList = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetShopStockReport(
      {
        shopId: filterSearch.value.userData?.shopId ?? null,
        categoryId: filterSearch.value.categoryId,
        productIds: filterSearch.value.ProductId.map(
          (product) => product.productId
        ).join(','),
        excludeZeroStock: filterSearch.value.excludeZeroStock,
      },
      apiController.value
    );
    return res;
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
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = UserList.value.filter((x) => x.roleName === 'Customer');
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
</script>
