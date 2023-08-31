<template>
  <div class="">
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{
        isEdit
          ? 'Update Receipt'
          : isReceiptPreview
          ? 'Preview Receipt'
          : 'Add New Receipt'
      }}</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="UserList"
                :loading="isLoading"
                dense
                map-options
                outlined
                v-model="addNewReceipt.userId"
                @update:model-value="addNewReceipt.userId = $event.userId"
                label="User ID"
                color="btn-primary"
                option-label="fullName"
                option-value="userId"
                :disable="isEdit || isReceiptPreview"
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template></q-select
              >
            </div>
          </div>
          <div v-if="!isReceiptPreview" class="col-12 col-md-6">
            <div class="q-gutter-y-xs">
              <div class="row gap-6 items-center">
                <span class="text-base">Article</span>
                <q-btn
                  icon="add"
                  rounded
                  dense
                  @click="handleSelectArticle"
                  color="btn-primary"
                />
              </div>
            </div>
          </div>
        </div>
        <q-table
          v-if="selectedArticleData.length > 0"
          :loading="isLoading"
          tabindex="0"
          :rows="selectedArticleData"
          align="left"
          :columns="selectedArticleColumn"
          row-key="name"
        >
          <template v-slot:body-cell-action="props" v-if="!isReceiptPreview">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  @click="saveUpdatedData(props.row)"
                  v-if="
                    isEdit &&
                    authStore.checkUserHasPermission(
                      EUserModules.ReceiptManagement,
                      EActionPermissions.Update
                    )
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  :disable="props.row.quantity < 1"
                  icon="check"
                  color="green"
                />
                <q-btn
                  v-if="
                    !isEdit ||
                    (isEdit &&
                      authStore.checkUserHasPermission(
                        EUserModules.ReceiptManagement,
                        EActionPermissions.Delete
                      ))
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="delete"
                  color="red"
                  @click="onDeleteButtonClick(props.row)"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:header-cell-action v-if="isReceiptPreview">
            <q-th> </q-th>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-input
                  :disable="
                    (isEdit &&
                      !authStore.checkUserHasPermission(
                        EUserModules.ReceiptManagement,
                        EActionPermissions.Update
                      )) ||
                    isReceiptPreview
                  "
                  v-model="props.row.quantity"
                  type="number"
                  filled
                  :min="1"
                  color="btn-primary"
                  style="max-width: 200px"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row items-center justify-end">
        <q-btn
          :label="isReceiptPreview ? 'Close' : 'Go Back'"
          color="btn-cancel hover:bg-btn-cancel-hover"
          @click="cancelNewReceipt"
        />
        <q-btn
          v-if="!isReceiptPreview && !isEdit"
          :disable="
            addNewReceipt.userId === null ||
            selectedArticleData.length === 0 ||
            !selectedArticleData.every((item) => item.quantity) ||
            selectedArticleData.some(
              (item) => item.quantity && item.quantity < 0
            )
          "
          label="Save"
          @click="saveNewReceipt"
          :loading="isAddingPurchase"
          color="btn-primary"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isArticleListModalVisible">
      <article-list-modal
        @handle-pagination="handlePagination"
        @selected-data="selectedData"
        :article-list="articleListComputed"
        :pagination="pagination"
        @filtered-rows="handleFilterRows"
        :current-data="
          selectedArticleData.map((item) => ({
            productId: item.productId !== null ? item.productId : -1,
            productName: item?.productName || '',
          }))
        "
        :is-fetching-article-list="isFetchingArticleList"
      />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleListModal from 'src/components/receipt-management/ArticleListModal.vue';
import {
  getUserListApi,
  createNewReceipt,
  editReceiptRow,
  articleListApi,
  addReceiptRow,
  deleteReceiptRow,
  getReceiptData,
} from 'src/services';
import {
  EActionPermissions,
  EUserModules,
  IAddNewReceipt,
  IArticleData,
  IPagination,
  IUserManagementData,
} from 'src/interfaces';
import { CanceledError } from 'axios';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { ISelectedArticleData } from 'src/interfaces';
import { selectedArticleColumn } from 'src/utils';
import { useAuthStore } from 'src/stores';
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const isAddingPurchase = ref(false);
const isReceiptPreview = ref(false);
const selectedArticleData = ref<ISelectedArticleData[]>([]);
const isArticleListModalVisible = ref(false);
const isFilterChanged = ref(false);
const handleSelectArticle = () => {
  isArticleListModalVisible.value = true;
};
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  getArticleList();
};
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const selectedData = (
  payload: { productId: number; productName?: string }[]
) => {
  const newIdList = payload.map((item) => item.productId);
  selectedArticleData.value = selectedArticleData.value.filter(
    (item) => item.productId && newIdList.includes(item.productId)
  );
  const oldIdList = selectedArticleData.value.map((item) => item.productId);
  payload.forEach((item) => {
    if (!oldIdList.includes(item.productId)) {
      selectedArticleData.value.push({ ...item, quantity: 0 });
      if (isEdit.value) {
        addReceiptRow({
          productId: item.productId,
          quantity: 0,
          purchaseId: selectedId.value,
        })
          .then((res) => {
            $q.notify({
              message: 'Row added successfully',
              type: 'positive',
            });
            const index = selectedArticleData.value.findIndex(
              (art) => art.productId === item.productId
            );
            if (index !== -1) {
              selectedArticleData.value[index].purchaseDetailId = res.data;
            }
            getReceiptDataFromApi(selectedId.value);
          })
          .catch((e) => {
            console.error(e);
            $q.notify({
              message: 'There was an error adding row',
              type: 'negative',
            });
            getReceiptDataFromApi(selectedId.value);
          });
      }
    }
  });

  isArticleListModalVisible.value = false;
};

const onDeleteButtonClick = async (row: ISelectedArticleData) => {
  const tempIndex = selectedArticleData.value.findIndex(
    (x) => x.productId === row.productId
  );
  if (tempIndex != -1 && row.productId !== null) {
    selectedArticleData.value.splice(tempIndex, 1);
    if (isEdit.value && row.purchaseDetailId !== undefined) {
      try {
        await deleteReceiptRow({
          purchaseDetailId: row.purchaseDetailId,
          purchaseId: selectedId.value,
        });
        $q.notify({
          type: 'positive',
          message: 'Row deleted successfully',
        });
      } catch (e) {
        $q.notify({
          message: 'There was an error deleting row',
          type: 'negative',
        });
      }
    }
  }
};
const addNewReceipt = ref<IAddNewReceipt>({
  userId: null,
  productList: [],
});
const $q = useQuasar();
const UserList = ref<IUserManagementData[]>([]);
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      UserList.value = res.data.items;
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
const cancelNewReceipt = () => {
  router.push('/receipt');
};
const saveNewReceipt = async () => {
  if (isAddingPurchase.value) return;
  isAddingPurchase.value = true;
  const productList = selectedArticleData.value.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity || 0,
    };
  });
  addNewReceipt.value.productList = productList;
  try {
    await createNewReceipt({
      data: addNewReceipt.value,
    });
    router.push('/receipt');
  } catch (e) {
    let message = 'There was an unexpected error';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  isAddingPurchase.value = false;
};
const isEdit = ref(false);
const isFetchingArticleList = ref(false);
const articleList = ref<IArticleData[]>([]);
const handleFilterRows = (filterChanged: boolean) => {
  if (filterChanged) {
    isFilterChanged.value = filterChanged;
    setTimeout(() => {
      isFilterChanged.value = false;
    }, 200);
  }
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
const selectedId = ref<number | string>(-1);
const getReceiptDataFromApi = async (selectedItemId: string | number) => {
  getReceiptData(selectedItemId).then((res) => {
    addNewReceipt.value.userId = res.data.userId;
    selectedArticleData.value = res.data.purchaseDetails;
  });
};
onMounted(() => {
  getUserList();
  getArticleList();
  const selectedItemId = route.params?.id;
  if (selectedItemId && typeof selectedItemId === 'string') {
    if (router.currentRoute.value.path.includes('preview')) {
      isEdit.value = false;
      isReceiptPreview.value = true;
    } else {
      isReceiptPreview.value = false;
      isEdit.value = true;
    }
    selectedId.value = selectedItemId;
    getReceiptDataFromApi(selectedItemId);
  } else {
    isReceiptPreview.value = false;
    isEdit.value = false;
  }
});
const articleListComputed = computed(() => {
  if (!isEdit.value) return articleList.value;
  return articleList.value.filter((item) => {
    const index = selectedArticleData.value.findIndex(
      (art) => art.productId === item.productId
    );
    return index === -1;
  });
});
async function saveUpdatedData(row: ISelectedArticleData) {
  try {
    if (
      !row.purchaseDetailId ||
      row.quantity === null ||
      row.quantity === undefined
    ) {
      $q.notify({
        message: 'There has been an unexpected error',
        type: 'negative',
      });
      return;
    }
    const res = await editReceiptRow({
      purchaseId: selectedId.value,
      purchaseDetailId: row.purchaseDetailId,
      quantity: row.quantity,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: 'Updated Row successfuly',
        type: 'positive',
      });
    }
  } catch (e) {
    let message = 'There was an error updating row';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
    getReceiptDataFromApi(selectedId.value);
  }
}
</script>
