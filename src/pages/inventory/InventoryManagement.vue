<template>
  <div class="col-12 col-md-4">
    <div class="q-gutter-y-xs">
      <div class="row gap-6 items-center">
        <span class="text-base">Article</span>
        <q-btn
          icon="add"
          rounded
          dense
          @click="isArticleListModalVisible = true"
          color="btn-primary"
        />
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
    />
  </q-dialog>
  <q-dialog v-model="isInventoryManagementStepTwoVisible">
    <inventory-managment-step-2-modal />
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
import InventoryManagmentStep2Modal from 'src/components/common/InventoryManagmentStep2Modal.vue';
import {
  IArticleData,
  IPagination,
  ISelectedArticle,
  ISelectedArticleData,
} from 'src/interfaces';
import { articleListApi } from 'src/services';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
const isArticleListModalVisible = ref(false);
const isFilterChanged = ref(false);
const isFetchingArticleList = ref(false);
const isInventoryManagementStepTwoVisible = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticle = ref<ISelectedArticle[]>([]);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
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
  articleList.value;
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
onMounted(() => {
  getArticleList();
});
</script>
