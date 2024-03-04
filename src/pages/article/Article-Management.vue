<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
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
      class="row flex lg:justify-end md:justify-center sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
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
        maxlength="250"
        label="Name"
        autofocus
        @keyup.enter="handleFilterSearch"
        style="min-width: 200px"
        dense
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
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
              ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Edit Status
              </q-tooltip></q-btn
            >
          </q-td>
        </template>
        <template v-slot:body-cell-mstock="props">
          <q-td :props="props">
            {{ props.row.masterStock ?? '-' }}
          </q-td>
        </template>
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <div
              @click="handlePreviewImage(props.row.productImage)"
              class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
              :class="props.row.productImage ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.productImage || 'assets/default-image.png'"
                alt="img"
              />
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
          <q-td
            class="flex items-center !h-[65px] justify-center"
            :props="props"
          >
            <router-link
              :to="`/article/${props.row.productId}/update`"
              class="flex gap-2 flex-nowrap"
            >
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                class="!px-[5px] hover:text-btn-primary"
              >
                <q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Article
                </q-tooltip></q-btn
              >
            </router-link>
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-category="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.categoryName }}
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
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
  <q-dialog v-model="isPreviewImageModalVisible">
    <q-card class="min-w-[400px]">
      <q-card-section>
        <div class="w-full max-h-[350px] overflow-hidden">
          <img :src="selectedPreviewImage" alt="image" class="mx-auto" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import ArticleStatusModal from 'src/components/article-management/ArticleStatusModal.vue';
import { useAuthStore } from 'src/stores';
import { IArticleData } from 'src/interfaces';
import { ArticleColumn, isPosError } from 'src/utils';
import { articleListApi, changeArticleStatus } from 'src/services';
import { statusOptions } from 'src/constants';
import { CanceledError } from 'axios';
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const selectedStatus = ref('');
const selectedRowData = ref<IArticleData | null>(null);
const isArticleStatusModalVisible = ref(false);
const pageTitle = getRoleModuleDisplayName(EUserModules.ArticleManagement);
const ArticleData = ref<IArticleData[]>([]);
const isLoading = ref(false);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
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
const handleEditStatusPopup = (row: IArticleData) => {
  selectedStatus.value = row.status;
  selectedRowData.value = row;
  isArticleStatusModalVisible.value = true;
};
const AddNewArticle = () => {
  router.push('/article/add-new');
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
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await articleListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
        Name: filterSearch.value.articleName?.trim(),
        Status: filterSearch.value.status,
      },
      apiController.value
    );
    if (res.data) {
      ArticleData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
</script>