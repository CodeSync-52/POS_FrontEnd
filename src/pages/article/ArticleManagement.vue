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
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
        @click="AddNewArticle"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
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
      <q-input
        v-model="filterSearch.articleName"
        outlined
        label="Name"
        dense
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
          @click="handleFilterSearch"
        />
        <q-btn
          unelevated
          color=""
          :loading="isLoading"
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
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
        v-model:pagination="pagination"
        @request="getArticleList"
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
              color="hover:text-btn-primary"
              class="hover:text-btn-primary"
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
            <div
              @click="handlePreviewImage(props.row.productImage)"
              v-if="props.row.productImage"
              class="cursor-pointer max-w-[2.5rem] h-[40px] min-w-[2.5rem] overflow-hidden rounded-full"
            >
              <img
                class="w-full h-full object-cover"
                :src="getImageUrl(props.row.productImage)"
                alt="img"
              />
            </div>
            <span v-else> none </span>
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
                text-color="white"
                class="bg-btn-primary hover:bg-btn-secondary"
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
  <q-dialog v-model="isPreviewImageModalVisible">
    <q-card class="min-w-[400px]">
      <q-card-section>
        <div class="w-full max-h-[350px] overflow-hidden">
          <img :src="selectedPreviewImage" alt="image" />
        </div>
      </q-card-section>
    </q-card>
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
} from 'src/interfaces';
import UpdateArticleModal from 'src/components/article-management/UpdateArticleModal.vue';
import ArticleStatusModal from 'src/components/article-management/ArticleStatusModal.vue';
import { useAuthStore } from 'src/stores';
import { IArticleData } from 'src/interfaces';
import { ArticleColumn, isPosError } from 'src/utils';
import {
  articleListApi,
  changeArticleStatus,
  updateProductApi,
} from 'src/services';
import { statusOptions } from 'src/constants';
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
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const resetFilter = () => {
  filterSearch.value = {
    articleName: null,
    status: null,
  };
  getArticleList();
};
const filterSearch = ref<{
  articleName: null | string;
  status: string | null;
}>({
  articleName: null,
  status: null,
});
onMounted(() => {
  getArticleList();
});
const handleFilterSearch = () => {
  getArticleList();
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
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
const getArticleList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await articleListApi({
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
      Name: filterSearch.value.articleName,
      Status: filterSearch.value.status,
    });
    if (res.data) {
      ArticleData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
