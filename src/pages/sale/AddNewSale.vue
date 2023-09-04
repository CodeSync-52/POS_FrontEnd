<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ action }} Sale</span>
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div v-if="action !== 'Add New'" class="row q-col-gutter-md q-mb-md">
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Created By"
              v-model="selectedSaleRecord.createdBy"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              outlined
              type="date"
              disable
              label="Created Date"
              dense
              v-model="selectedSaleRecord.createdDate"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              type="number"
              dense
              label="Discount"
              v-model="selectedSaleRecord.discount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              type="number"
              dense
              label="Net Amount"
              v-model="selectedSaleRecord.netAmount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              type="number"
              label="Outstanding Balance"
              v-model="selectedSaleRecord.outStandingBalance"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              type="number"
              label="Total Amount"
              v-model="selectedSaleRecord.totalAmount"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Total Quantity"
              v-model="selectedSaleRecord.totalQuantity"
            />
          </div>
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              label="Updated Date"
              v-model="selectedSaleRecord.updatedDate"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="UserList"
                :loading="isLoading"
                dense
                map-options
                outlined
                v-model="selectedSaleRecord.userId"
                @update:model-value="addNewSale.userId = $event.userId"
                label="User Name"
                color="btn-primary"
                option-label="fullName"
                option-value="userId"
                :disable="action !== 'Add New'"
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
          <div v-if="action !== 'Preview'" class="col-12 col-md-4">
            <div class="q-gutter-y-xs">
              <div class="row gap-6 items-center">
                <span class="text-base">Article</span>
                <q-btn
                  icon="add"
                  rounded
                  dense
                  color="btn-primary"
                  @click="isArticleListModalVisible = true"
                />
              </div>
            </div>
          </div>
          <div v-if="action === 'Add New'" class="col-12 col-md-4">
            <q-input
              dense
              outlined
              label="Outstanding Balance"
              disable
              v-model="addNewSale.userOutstandingBalance"
            />
          </div>
        </div>
        <q-table
          v-if="selectedArticleData.length > 0"
          :loading="isLoading"
          tabindex="0"
          :rows="selectedArticleData"
          align="left"
          :columns="selectedSalesArticleColumn"
          row-key="name"
        >
          <template v-slot:body-cell-action="props" v-if="action !== 'Preview'">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  @click="saveUpdatedData(props.row)"
                  v-if="
                    action === 'Edit' &&
                    authStore.checkUserHasPermission(
                      EUserModules.SalesManagement,
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
                    action !== 'Edit' ||
                    (action === 'Edit' &&
                      authStore.checkUserHasPermission(
                        EUserModules.SalesManagement,
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
          <template v-slot:header-cell-action v-if="action === 'Preview'">
            <q-th> </q-th>
          </template>
          <template v-slot:body-cell-totalAmount="props">
            <q-td :props="props">
              {{ props.row.quantity * props.row.unitWholeSalePrice }}
            </q-td>
          </template>
          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="2" />
              <q-td>
                <div>
                  Total Quantity:
                  {{ saleGenerationTotalQuantity }}
                </div>
              </q-td>
              <q-td colspan="2" />
              <q-td>
                <div>
                  Total Amount:
                  {{ saleGenerationTotalAmount }}
                </div>
              </q-td>
            </q-tr>
            <q-tr :props="props">
              <q-td colspan="5" />
              <q-td>
                <div>
                  Discount:
                  {{ selectedSaleRecord.discount }}
                </div>
              </q-td>
            </q-tr>
            <q-tr :props="props">
              <q-td colspan="5" />
              <q-td>
                <div>
                  Net Total:
                  {{ saleGenerationNetAmount(selectedArticleData) }}
                </div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <div class="flex gap-2 flex-nowrap">
                <q-input
                  :disable="
                    (action === 'Edit' &&
                      !authStore.checkUserHasPermission(
                        EUserModules.SalesManagement,
                        EActionPermissions.Update
                      )) ||
                    action === 'Preview'
                  "
                  v-model="props.row.quantity"
                  @update:model-value="
                    props.row.quantity =
                      typeof $event === 'string' ? parseFloat($event) : $event
                  "
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
      <q-card-actions align="right" class="q-gutter-x-sm">
        <router-link to="/sale">
          <q-btn
            unelevated
            :label="
              action === 'Preview'
                ? 'Close'
                : action === 'Edit'
                ? 'Go Back'
                : 'Cancel'
            "
            color="btn-cancel hover:bg-btn-cancel-hover"
          />
        </router-link>
        <q-btn
          v-if="action === 'Add New'"
          :disable="
            addNewSale.userId === null ||
            selectedArticleData.length === 0 ||
            !selectedArticleData.every((item) => item.quantity) ||
            selectedArticleData.some(
              (item) => item.quantity && item.quantity < 0
            )
          "
          unelevated
          label="Save"
          @click="saveNewReceipt"
          :loading="isAddingSale"
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
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import moment from 'moment';
import { CanceledError } from 'axios';
import { useAuthStore } from 'src/stores';
import {
  EActionPermissions,
  EUserModules,
  IArticleData,
  IPagination,
  ISelectedSalesDetailData,
  IAddNewSale,
  ISelectedWholeSaleArticleData,
  IWholeSaleDetailsData,
  IUserResponse,
} from 'src/interfaces';
import { isPosError, selectedSalesArticleColumn } from 'src/utils';
import {
  addWholeSaleApi,
  addWholeSaleDetailApi,
  articleListApi,
  deleteWholeSaleDetailApi,
  getUserListApi,
  updateWholeSaleDetailApi,
  wholeSaleDetailApi,
} from 'src/services';
import ArticleListModal from 'src/components/common/ArticleListModal.vue';
const selectedSaleRecord = ref<ISelectedSalesDetailData>({
  createdBy: '',
  createdById: 0,
  createdDate: '',
  discount: 0,
  fullName: '',
  netAmount: 0,
  outStandingBalance: 0,
  totalAmount: 0,
  totalQuantity: 1,
  updatedBy: null,
  updatedDate: '',
  userId: null,
  wholeSaleDetails: [],
  wholeSaleStatus: '',
});
const isArticleListModalVisible = ref(false);
const action = ref('');
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const $q = useQuasar();
const UserList = ref<IUserResponse[]>([]);
const isFetchingArticleList = ref(false);
const isFilterChanged = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticleData = ref<ISelectedWholeSaleArticleData[]>([]);
const selectedId = ref<number>(-1);
const isAddingSale = ref(false);
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const addNewSale = ref<IAddNewSale>({
  userId: null,
  userDiscount: 0,
  userOutstandingBalance: 0,
  productList: [],
});
watch(addNewSale.value, (newVal: IAddNewSale) => {
  const selectedUser = UserList.value.find(
    (row) => newVal.userId === row.userId
  );
  if (selectedUser) {
    addNewSale.value.userOutstandingBalance = selectedUser.outStandingBalance;
    addNewSale.value.userDiscount = selectedUser.discount;
    selectedSaleRecord.value.discount = selectedUser.discount;
  }
});
onMounted(() => {
  const route = router.currentRoute.value;
  if (route.params.id && typeof route.params.id === 'string') {
    if (route.fullPath.includes('preview')) {
      action.value = 'Preview';
    } else {
      action.value = 'Edit';
    }
    selectedId.value = Number(route.params.id);
    getSelectedWholesaleDetail(selectedId.value);
  } else {
    action.value = 'Add New';
  }
  getUserList();
  getArticleList();
});
const handleFilterRows = (filterChanged: boolean) => {
  if (filterChanged) {
    isFilterChanged.value = filterChanged;
    setTimeout(() => {
      isFilterChanged.value = false;
    }, 200);
  }
};
const handlePagination = (selectedPagination: IPagination) => {
  pagination.value = selectedPagination;
  getArticleList();
};
const articleListComputed = computed(() => {
  if (action.value !== 'Edit') return articleList.value;
  return articleList.value.filter((item) => {
    const index = selectedArticleData.value.findIndex(
      (art) => art.productId === item.productId
    );
    return index === -1;
  });
});
const saveNewReceipt = async () => {
  if (isAddingSale.value) return;
  isAddingSale.value = true;
  const productList = selectedArticleData.value.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity || 0,
    };
  });
  addNewSale.value.productList = productList;
  try {
    await addWholeSaleApi({
      userId: addNewSale.value.userId,
      productList: addNewSale.value.productList,
    });
    router.push('/sale');
  } catch (e) {
    let message = 'There was an unexpected error adding sale';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      icon: 'error',
      color: 'red',
      message,
    });
  }
  isAddingSale.value = false;
};
const selectedData = (
  payload: {
    productId: number;
    productName?: string;
    unitWholeSalePrice?: number;
  }[]
) => {
  if (action.value !== 'Edit') {
    const newIdList = payload.map((item) => item.productId);
    selectedArticleData.value = selectedArticleData.value.filter(
      (item) => item.productId && newIdList.includes(item.productId)
    );
  }
  const oldIdList = selectedArticleData.value.map((item) => item.productId);
  payload.forEach((item) => {
    if (!oldIdList.includes(item.productId)) {
      selectedArticleData.value.push({
        ...item,
        quantity: 0,
        totalAmount: 0,
        wholeSaleDetailId: -1,
      });
      if (action.value === 'Edit') {
        addWholeSaleDetailApi({
          productId: item.productId,
          quantity: 0,
          wholeSaleId: selectedId.value,
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
              selectedArticleData.value[index].wholeSaleDetailId = res.data;
            }
            getSelectedWholesaleDetail(selectedId.value);
          })
          .catch((e) => {
            console.error(e);
            $q.notify({
              message: 'There was an error adding row',
              type: 'negative',
            });
            getSelectedWholesaleDetail(selectedId.value);
          });
      }
    }
  });

  isArticleListModalVisible.value = false;
};
const onDeleteButtonClick = async (row: ISelectedWholeSaleArticleData) => {
  const tempIndex = selectedArticleData.value.findIndex(
    (x) => x.productId === row.productId
  );
  if (tempIndex != -1 && row.productId !== null) {
    selectedArticleData.value.splice(tempIndex, 1);
    if (action.value === 'Edit' && row.wholeSaleDetailId !== undefined) {
      try {
        await deleteWholeSaleDetailApi(row.wholeSaleDetailId);
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
    let message = 'Unexpected Error Occurred Fetching Article List';
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
const getUserList = async () => {
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
};
const saleGenerationTotalQuantity = computed(() => {
  if (action.value === 'Edit') {
    return selectedSaleRecord.value.wholeSaleDetails.reduce(
      (total: number, row: IWholeSaleDetailsData) => {
        return total + Number(row.quantity);
      },
      0
    );
  } else {
    return selectedArticleData.value.reduce(
      (total: number, row: ISelectedWholeSaleArticleData) => {
        return total + Number(row.quantity);
      },
      0
    );
  }
});
const saleGenerationTotalAmount = computed(() => {
  if (action.value === 'Edit') {
    return selectedSaleRecord.value.wholeSaleDetails.reduce(
      (total: number, row: IWholeSaleDetailsData) => {
        return total + row.quantity * row.unitWholeSalePrice;
      },
      0
    );
  } else {
    return selectedArticleData.value.reduce(
      (total: number, row: ISelectedWholeSaleArticleData) => {
        if (row.quantity && row.unitWholeSalePrice) {
          return total + row.quantity * row.unitWholeSalePrice;
        }
        return total;
      },
      0
    );
  }
});
const saleGenerationNetAmount = (table: ISelectedWholeSaleArticleData[]) => {
  return table.reduce((total: number, row: ISelectedWholeSaleArticleData) => {
    if (row.quantity && row.unitWholeSalePrice) {
      const ItemDiscount =
        Number(row.quantity) * selectedSaleRecord.value.discount;
      return total - ItemDiscount + row.quantity * row.unitWholeSalePrice;
    }
    return total;
  }, 0);
};
const getSelectedWholesaleDetail = async (wholeSaleId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await wholeSaleDetailApi(wholeSaleId);
    if (res.type === 'Success') {
      if (res.data) {
        selectedSaleRecord.value = res.data;
        selectedSaleRecord.value.createdDate = moment(
          res.data.createdDate
        ).format('YYYY-MM-DD');
        selectedSaleRecord.value.updatedDate = moment(
          res.data.updatedDate
        ).format('DD/MM/YYYY');
        selectedArticleData.value = res.data.wholeSaleDetails;
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Wholesale Details';
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
async function saveUpdatedData(row: IWholeSaleDetailsData) {
  try {
    if (
      !row.wholeSaleDetailId ||
      row.quantity === null ||
      row.quantity === undefined
    ) {
      $q.notify({
        message: 'There has been an unexpected error',
        type: 'negative',
      });
      return;
    }
    const res = await updateWholeSaleDetailApi({
      wholeSaleDetailId: row.wholeSaleDetailId,
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
    getSelectedWholesaleDetail(selectedId.value);
  }
}
</script>
