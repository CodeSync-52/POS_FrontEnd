<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4 mt-2"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.ArticleManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        unelevated
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewArticle"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-input
        dense
        style="min-width: 200px"
        outlined
        map-options
        v-model="filterSearch.name"
        label="Name"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.status"
        @update:model-value="filterSearch.status = $event.value"
        :options="statusOptions"
        label="Status"
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="handleArticleFilter"
        />
        <q-btn
          unelevated
          color=""
          :loading="isLoading"
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Export as CSV"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        tabindex="0"
        :loading="isLoading"
        :rows="ArticleData"
        :columns="ArticleColumn"
        row-key="name"
        v-model:defaultpagination="defaultpagination"
      >
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-status="props"
        >
          <q-td :props="props">
            <q-btn
              size="sm"
              dense
              flat
              unelevated
              :label="props.row.status"
              @click="handleEditStatusPopup(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-mstock="props">
          <q-td :props="props">
            {{ props.row.masterStock ?? 'Null' }}
          </q-td>
        </template>
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <div class="w-10 h-5">
              <img :src="props.row.productImage" alt="img" />
            </div>
          </q-td>
        </template>
        <template
          v-slot:header-cell-status
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.CategoryManagement,
              EActionPermissions.View
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.ArticleManagement,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="handleEditArticlePopup(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog v-model="isArticleStatusModalVisible">
    <article-status-modal
      :selected-status="selectedStatus"
      @updated-status="updatingStatus"
    />
  </q-dialog>
  <q-dialog v-model="isEditArticleModalVisible">
    <update-article-modal
      :selected-row="selectedRowData"
      @update-article="handleUpdateArticle"
    />
  </q-dialog>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IArticleInfo,
  getRoleModuleDisplayName,
  IUseArticleData,
} from 'src/interfaces';
import UpdateArticleModal from 'src/components/article-management/UpdateArticleModal.vue';
import ArticleStatusModal from 'src/components/article-management/ArticleStatusModal.vue';
import { useAuthStore } from 'src/stores';
import { IArticleData } from 'src/interfaces';
import { ArticleColumn, isPosError } from 'src/utils';
import { statusOptions } from 'src/constants/utils';
import {
  articleListApi,
  changeArticleStatus,
  updateProductApi,
} from 'src/services';
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const selectedStatus = ref('');
const selectedRowData = ref<IArticleData | null>(null);
const isArticleStatusModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.ArticleManagement);
const ArticleData = ref<IArticleData[]>([]);
const isLoading = ref(false);
const isEditArticleModalVisible = ref(false);
const defaultFilterValues = {
  name: null,
  status: null,
};
const pagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
};
const defaultpagination = ref<{
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}>(pagination);
const filterSearch = ref<IUseArticleData>(defaultFilterValues);
onMounted(() => {
  getArticleList();
});
const handleArticleFilter = () => {
  getArticleList();
};
const handleEditArticlePopup = (selectedRow: IArticleData) => {
  selectedRowData.value = selectedRow;
  isEditArticleModalVisible.value = true;
};
const handleEditStatusPopup = (row: IArticleData) => {
  selectedStatus.value = row.status;
  selectedRowData.value = row;
  isArticleStatusModalVisible.value = true;
};
const AddNewArticle = () => {
  router.push('/article/add-new');
};
const resetFilter = () => {
  filterSearch.value = {
    name: null,
    status: null,
  };
  getArticleList();
};
const handleUpdateArticle = async (updatedArticleInfo: IArticleInfo) => {
  if (isLoading.value) return;
  isLoading.value = true;
  let base64Image;
  const productId = selectedRowData.value?.productId ?? -1;
  const {
    name,
    description,
    categoryId,
    categoryName,
    productImage,
    wholeSalePrice,
    retailPrice,
    costPrice,
  } = updatedArticleInfo;

  if (productImage) {
    base64Image = await convertToBase64(productImage);
  }
  try {
    const res = await updateProductApi({
      productId,
      description,
      categoryId,
      image: base64Image,
      wholeSalePrice,
      retailPrice,
      costPrice,
      name,
    });
    if (res.type === 'Success') {
      filterSearch.value = defaultFilterValues;
      defaultpagination.value = pagination;
      getArticleList();
      $q.notify({
        message: res.message,
        color: 'green',
      });
      const selectedRow = selectedRowData.value;
      if (selectedRow) {
        selectedRow.categoryName = categoryName;
        selectedRow.categoryId = categoryId;
        selectedRow.costPrice = costPrice;
        selectedRow.description = description;
        selectedRow.name = name;
        selectedRow.retailPrice = retailPrice;
        selectedRow.wholeSalePrice = wholeSalePrice;
      }
    }
  } catch (e) {
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
  isEditArticleModalVisible.value = false;
};
const updatingStatus = async (updatedStatus: string, callback: () => void) => {
  if (updatedStatus === selectedStatus.value) {
    isArticleStatusModalVisible.value = false;
    return;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  const selectedProductId = selectedRowData.value?.productId ?? -1;
  try {
    const res = await changeArticleStatus(selectedProductId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value && selectedRowData.value.status === 'Active') {
        selectedRowData.value.status = 'InActive';
      } else if (
        selectedRowData.value &&
        selectedRowData.value.status === 'InActive'
      ) {
        selectedRowData.value.status = 'Active';
      }
    }
  } catch (e) {
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
  callback();
  isLoading.value = false;
  isArticleStatusModalVisible.value = false;
};
const getArticleList = async (defaultPaginationData?: {
  defaultpagination: Omit<typeof defaultpagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (defaultPaginationData) {
    defaultpagination.value = {
      ...defaultpagination.value,
      ...defaultPaginationData.defaultpagination,
    };
  }
  try {
    const res = await articleListApi({
      filterSearch: filterSearch.value,
      PageNumber: defaultpagination.value.page,
      PageSize: defaultpagination.value.rowsPerPage,
    });
    if (res.data) {
      ArticleData.value = res.data.items;
      defaultpagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
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
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result && typeof fileReader.result === 'string') {
        const resultParts = fileReader.result.split(',');
        if (resultParts.length === 2) {
          resolve(resultParts[1]);
        } else {
          reject(new Error('Invalid data URL format'));
        }
      }
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
};
</script>
