<template>
  <div>
    <div class="mb-4 row justify-between items-center">
      <div class="text-xl text-center md:text-left font-medium">
        <span>{{ action }} Sale</span>
      </div>
      <q-btn
        v-if="action === 'Preview'"
        color="btn-primary"
        class="mb-2"
        unelevated
        label="Download PDF"
        @click="downloadPdfData"
      />
    </div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div v-if="action !== 'Add New'" class="row q-col-gutter-md q-mb-md">
          <div class="col-md-6 col-sm-12">
            <q-input
              disable
              outlined
              dense
              maxlength="250"
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
              v-model="selectedUserDiscount"
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
            <outside-click-container @outside-click="handleOutsideClick">
              <div>
                <q-select
                  :options="options"
                  :loading="isLoading"
                  use-input
                  dense
                  popup-content-class="!max-h-[200px]"
                  map-options
                  outlined
                  @filter="filterFn"
                  v-model="selectedSaleRecord.userId"
                  @update:model-value="addNewSale.userId = $event.userId"
                  label="Select User"
                  color="btn-primary"
                  @keydown="dialoagClose"
                  autofocus
                  option-label="fullName"
                  option-value="userId"
                  :disable="action === 'Preview' || action === 'Edit'"
                  ><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template></q-select
                >
              </div>
            </outside-click-container>
          </div>
          <div v-if="action !== 'Preview'" class="col-12 col-md-4">
            <div class="q-gutter-y-xs">
              <div class="row gap-6 items-center">
                <span class="text-base">Article</span>
                <q-btn
                  icon="add"
                  rounded
                  unelevated
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
        <div class="updateSaleTable">
          <q-table
            v-if="selectedArticleData.length > 0"
            :loading="isLoading"
            tabindex="0"
            :rows="selectedArticleData"
            v-model:pagination="defaultPagination"
            align="left"
            :columns="selectedSalesArticleColumn"
            row-key="name"
          >
            <template v-slot:body-cell-productImage="props">
              <q-td :props="props">
                <div
                  @click="handlePreviewImage(props.row.productImage)"
                  class="w-[50px] h-[50px] min-w-[2rem] overflow-hidden rounded-full"
                  :class="props.row.productImage ? 'cursor-pointer' : ''"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="
                      getImageUrl(props.row.productImage) ||
                      'assets/default-image.png'
                    "
                    alt="img"
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-unitWholeSalePrice="props">
              <q-td :props="props">
                {{ props.row.unitWholeSalePrice }}
                <span
                  class="ml-2 updateArticleAmount"
                  v-if="action !== 'Preview'"
                >
                  <q-btn flat unelevated icon="edit" dense size="sm" />
                </span>
                <q-popup-edit
                  v-model="props.row.unitWholeSalePrice"
                  :disable="action === 'Preview'"
                  color="btn-primary"
                  title="Update Amount"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    :min="0"
                    type="number"
                    v-model="scope.value"
                    @update:model-value="handleUpdateAmount($event, scope)"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </template>
            <template
              v-slot:body-cell-action="props"
              v-if="action !== 'Preview'"
            >
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
                <q-td colspan="3" />
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
                <q-td />
              </q-tr>
              <q-tr :props="props">
                <q-td colspan="6" />
                <q-td>
                  <div>
                    Discount:
                    {{
                      action === 'Add New'
                        ? selectedSaleRecord.discount *
                          saleGenerationTotalQuantity
                        : action === 'Edit'
                        ? (selectedUserDiscount ?? 0) *
                          saleGenerationTotalQuantity
                        : selectedSaleRecord.discount
                    }}
                  </div>
                </q-td>
                <q-td />
              </q-tr>
              <q-tr :props="props">
                <q-td colspan="6" />
                <q-td>
                  <div>
                    Net Total:
                    {{
                      action === 'Add New'
                        ? saleGenerationNetAmount(selectedArticleData)
                        : action === 'Edit'
                        ? saleGenerationTotalAmount -
                          (selectedUserDiscount ?? 0) *
                            saleGenerationTotalQuantity
                        : selectedSaleRecord.netAmount
                    }}
                  </div>
                </q-td>
                <q-td />
              </q-tr>
            </template>
            <template v-slot:body-cell-quantity="props">
              <q-td :props="props">
                <div class="flex gap-2 flex-nowrap">
                  <q-input
                    ref="firstRow"
                    :disable="
                      (action === 'Edit' &&
                        !authStore.checkUserHasPermission(
                          EUserModules.SalesManagement,
                          EActionPermissions.Update
                        )) ||
                      action === 'Preview'
                    "
                    :max="props.row.masterStock"
                    v-model="props.row.quantity"
                    @update:model-value="
                      handleUpdateQuantity($event, props.row)
                    "
                    type="number"
                    filled
                    :min="1"
                    color="btn-primary"
                    style="max-width: 200px"
                  />
                </div>
                <span v-if="props.row.errorMessage" class="text-red text-sm">{{
                  props.row.errorMessage
                }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-productName="props">
              <q-td
                :props="props"
                class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
              >
                {{ props.row.productName }}
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
            ) ||
            selectedArticleData.some(
              (item) =>
                item.unitWholeSalePrice && Number(item.unitWholeSalePrice) <= 0
            )
          "
          unelevated
          label="Save"
          @click="saveNewSale"
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
            productImage: item.productImage || '',
            masterStock: item.masterStock || 0,
            retailPrice: item.retailPrice ?? 0,
          }))
        "
        :is-fetching-article-list="isFetchingArticleList"
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
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, watch, nextTick } from 'vue';
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
import {
  ITableHeaders,
  ITableItems,
  downloadPdf,
  isPosError,
  selectedSalesArticleColumn,
} from 'src/utils';
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
import OutsideClickContainer from 'src/components/common/OutsideClickContainer.vue';
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
const options = ref<IUserResponse[]>([]);
const isFilterChanged = ref(false);
const articleList = ref<IArticleData[]>([]);
const selectedArticleData = ref<ISelectedWholeSaleArticleData[]>([]);
const selectedId = ref<number>(-1);
const isAddingSale = ref(false);
const firstRow = ref<HTMLElement | null>(null);
const selectedPreviewImage = ref('');
const isPreviewImageModalVisible = ref(false);
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
};
const pagination = ref<IPagination>({ ...defaultPagination });
const tableItems = ref<ITableItems[][]>([]);
const addNewSale = ref<IAddNewSale>({
  userId: null,
  userDiscount: 0,
  userOutstandingBalance: 0,
  productList: [],
});
const selectedUserDiscount = ref<number | undefined>(0);
watch(addNewSale.value, (newVal: IAddNewSale) => {
  const selectedUser = UserList.value.find(
    (row) => newVal.userId === row.userId
  );
  if (selectedUser) {
    addNewSale.value.userOutstandingBalance =
      selectedUser.outStandingBalance ?? 0;
    addNewSale.value.userDiscount = selectedUser.discount ?? 0;
    selectedUserDiscount.value = selectedUser.discount;
    selectedSaleRecord.value.discount = selectedUser.discount ?? 0;
  }
});
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'n' || e.key === 'N') {
    isArticleListModalVisible.value = true;
  }
};
const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    window.addEventListener('keypress', handleKeyPress);
  } else if (e.key === 'Tab' && e.shiftKey) {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const dialoagClose = (e: KeyboardEvent) => {
  if (e.key === 'n' || e.key === 'N') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
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
function handleUpdateAmount(newVal: unknown, scope: { value: string }) {
  function setScopeValue(val: number) {
    scope.value = `${val}`;
  }
  if (typeof newVal === 'string') {
    const val = parseFloat(newVal);
    if (val <= 0 || !val) {
      setScopeValue(0);
    } else if (val > 0) {
      setScopeValue(val);
    }
  }
}
const handleUpdateQuantity = (
  newVal: string | number | null,
  row: ISelectedWholeSaleArticleData
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    const masterStock = row.masterStock ?? 0;
    if (val >= 0 && val <= masterStock) {
      row.quantity = val;
      row.errorMessage = '';
    } else if (val > masterStock) {
      row.quantity = 0;
      row.errorMessage = 'Invalid Quantity!';
      $q.notify({
        message: `Product ${row.productName} quantity is more than the available quantity. Please add the quantity again!`,
        color: 'red',
        icon: 'warning',
      });
    } else if (val < 0 || !val) {
      row.quantity = 0;
      row.errorMessage = '';
    }
  }
};
const handleFilterRows = (filterChanged: boolean) => {
  if (filterChanged) {
    isFilterChanged.value = filterChanged;
    setTimeout(() => {
      isFilterChanged.value = false;
    }, 200);
  }
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
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
const saveNewSale = async () => {
  if (isAddingSale.value) return;
  isAddingSale.value = true;
  const productList = selectedArticleData.value.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity || 0,
      unitWholeSalePrice: item.unitWholeSalePrice,
    };
  });
  addNewSale.value.productList = productList;
  try {
    const res = await addWholeSaleApi({
      userId: addNewSale.value.userId,
      productList: addNewSale.value.productList,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
    }
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
    productImage: string | null;
    masterStock: number;
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
        productImage: item.productImage,
        masterStock: item.masterStock,
      });
      nextTick(() => {
        if (firstRow.value) {
          firstRow.value.focus();
        }
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
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
    const res = await articleListApi({
      PageNumber: pagination.value.page,
      PageSize: rowsPerPage,
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items.filter(
          (article) => article.status === 'Active'
        );
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
      options.value = res.data.items;
      selectedUserDiscount.value = UserList.value.find(
        (user) => selectedSaleRecord.value.userId === user.userId
      )?.discount;
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
        selectedUserDiscount.value = UserList.value.find(
          (user) => selectedSaleRecord.value.userId === user.userId
        )?.discount;
        selectedArticleData.value = res.data.wholeSaleDetails;
        tableItems.value = await convertArrayToPdfData(
          res.data.wholeSaleDetails
        );
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
      unitWholeSalePrice: row.unitWholeSalePrice,
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
  }
  getSelectedWholesaleDetail(selectedId.value);
  if (selectedArticleData.value) {
    tableItems.value = await convertArrayToPdfData(selectedArticleData.value);
  }
}
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
const defaultImage = ref<string | null>(null);
async function convertArrayToPdfData(
  array: IWholeSaleDetailsData[] | ISelectedWholeSaleArticleData[]
) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }

  const tableStuff = [];
  const headerRow = ['Id', 'Image', 'Name', 'Quantity', 'W.Price', 'Amount'];
  tableStuff.push(headerRow);
  const totalAmount = array.reduce(
    (total, row: IWholeSaleDetailsData | ISelectedWholeSaleArticleData) => {
      if (row.totalAmount) {
        return total + row.totalAmount ?? 0;
      }
      return total;
    },
    0
  );
  const footerRow = [
    {
      text: 'Total',
      margin: 5,
    },
    '',
    '',
    {
      text: `${saleGenerationTotalQuantity.value}`,
      margin: [0, 5],
    },
    '',
    { text: `${totalAmount}`, margin: 5 },
  ];
  const discountRow = [
    '',
    '',
    '',
    '',
    {
      text: 'Discount:',
      margin: [5, 0],
      width: 10,
    },
    {
      text: `${
        (selectedUserDiscount.value ?? 0) * saleGenerationTotalQuantity.value
      }`,
      margin: [5, 0],
      width: 10,
    },
  ];
  const netTotalRow = [
    '',
    '',
    '',
    '',
    {
      text: 'Net Total:',
      margin: 5,
    },
    {
      text: `${selectedSaleRecord.value.netAmount}`,
      margin: 5,
    },
  ];
  array.forEach(
    (item: IWholeSaleDetailsData | ISelectedWholeSaleArticleData) => {
      const row = [
        { text: item.productId, margin: [0, 20] },
        {
          image:
            'data:image/png;base64,' +
            (item.productImage || defaultImage.value),
          width: 50,
          height: 50,
          margin: 2,
        },
        { text: item.productName, bold: true, margin: [0, 20] },
        { text: item.quantity, margin: [0, 20] },
        { text: item.unitWholeSalePrice, margin: [0, 20] },
        {
          text: item.unitWholeSalePrice ?? 0 * (item.quantity ?? 0),
          margin: [0, 20],
        },
      ];
      tableStuff.push(row);
    }
  );
  tableStuff.push(footerRow);
  tableStuff.push(discountRow);
  tableStuff.push(netTotalRow);
  return tableStuff;
}
function downloadPdfData() {
  const headers: ITableHeaders[] = [
    {
      heading: 'Sale Id',
      content: Number(router.currentRoute.value.params.id),
    },
    {
      heading: 'Sale Status',
      content: selectedSaleRecord.value.wholeSaleStatus,
    },
    {
      heading: 'User Name',
      content: selectedSaleRecord.value.fullName,
    },
    {
      heading: 'Outstanding Balance',
      content: selectedSaleRecord.value.outStandingBalance,
    },
    {
      heading: 'Date',
      content: moment(selectedSaleRecord?.value?.createdDate).format(
        'DD/MM/YYYY'
      ),
    },
    {
      heading: 'Created By',
      content: selectedSaleRecord.value.createdBy,
    },
  ];
  const fileTitle = 'Sale';
  const myFileName = 'Sale.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableItems.value)),
    tableHeaders: headers,
    title: fileTitle,
  });
}
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName.toLowerCase().includes(needle)
    );
  });
};
</script>
