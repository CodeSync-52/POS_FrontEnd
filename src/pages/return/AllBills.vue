<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-2 md:items-center sm:items-center mb-4"
  >
    <span class="text-lg font-medium">{{ titleAction }}</span>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.selectStatus"
      :options="billStatusOptionList"
      map-options
      popup-content-class="!max-h-[200px]"
      label="Bill Status"
      :disable="titleAction === 'Hold Bills'"
      option-label="name"
      option-value="statusId"
      color="btn-primary"
    >
    </q-select>
    <q-select
      dense
      style="min-width: 200px"
      outlined
      map-options
      :options="shopData"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName !==
        EUserRoles.SuperAdmin.toLowerCase()
      "
      v-model="selectedShop.fromShop"
      @update:model-value="handleUpdateFromShop($event)"
      popup-content-class="!max-h-[200px]"
      label="Select Shop"
      color="btn-primary"
      option-label="name"
      option-value="shopId"
    />
    <q-input
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.invoiceNumber"
      label="Invoice Number"
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.startDate"
      :max="filterSearch.endDate"
      :min="
        date.formatDate(
          date.subtractFromDate(timeStamp, { date: 7 }),
          'YYYY-MM-DD'
        )
      "
      label="From"
      type="date"
      style="min-width: 200px"
      outlined
      dense
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.endDate"
      :max="filterSearch.endDate"
      :min="filterSearch.startDate"
      label="To"
      type="date"
      style="min-width: 200px"
      outlined
      color="btn-primary"
      dense
    />
    <div class="flex lg:justify-end sm:justify-center items-end gap-2">
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
        icon="search"
        label="Search"
        @click="searchBills()"
      />
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
        label="Clear"
        @click="handleResetFilter()"
      />
    </div>
  </div>
  <div class="py-4">
    <q-table
      class="max-h-[39.5vh] lg:max-h-[55vh] 3xl:max-h-[65vh]"
      :loading="isLoading"
      tabindex="0"
      :rows="saleList"
      align="left"
      :columns="shopAllBillsTableColumn"
      row-key="id"
      v-model:pagination="pagination"
      @request="searchBills"
    >
      <template v-slot:body-cell-comments="props">
        <q-td
          :props="props"
          class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
        >
          {{ props.row.comments || '-' }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td class="flex justify-start" :props="props">
          <div class="flex gap-2 flex-nowrap">
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              icon="cancel"
              color="red"
              v-if="
                props.row.status === 'Hold' &&
                authStore.checkUserHasPermission(
                  EUserModules.SaleAndReturnManagement,
                  EActionPermissions.Delete
                )
              "
              @click="handleCancelSalePopup(props.row.saleId)"
            >
              <q-tooltip class="bg-red" :offset="[10, 10]">
                Cancel Bill
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                authStore.checkUserHasPermission(
                  EUserModules.SaleAndReturnManagement,
                  EActionPermissions.View
                )
              "
              flat
              unelevated
              dense
              size="sm"
              icon="visibility"
              color="green"
              @click="router.push(`/return/${props.row.saleId}/preview`)"
            >
              <q-tooltip class="bg-green" :offset="[10, 10]">
                Preview Bill
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                props.row.status === 'Hold' &&
                authStore.checkUserHasPermission(
                  EUserModules.SaleAndReturnManagement,
                  EActionPermissions.Update
                )
              "
              size="sm"
              flat
              unelevated
              dense
              icon="edit"
              class="hover:text-btn-primary !px-[5px]"
              @click="router.push(`/return/${props.row.saleId}/editHoldBill`)"
            >
              <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Edit Bill
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                props.row.status === 'Hold' &&
                authStore.checkUserHasPermission(
                  EUserModules.SaleAndReturnManagement,
                  EActionPermissions.Create
                )
              "
              size="sm"
              flat
              unelevated
              dense
              icon="check"
              class="text-green !px-[5px]"
              @click="handleCompleteSale(props.row.saleId, 1)"
            >
              <q-tooltip class="bg-green" :offset="[10, 10]">
                Complete Bill
              </q-tooltip>
            </q-btn>
          </div>
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
  <q-dialog v-model="isCancelBillModalVisible">
    <q-card class="min-w-[400px]">
      <q-card-section>
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-medium">Cancel Receipt</span>
          <q-btn
            class="font-medium"
            icon="close"
            flat
            unelevated
            dense
            v-close-popup
          />
        </div>
        <div class="text-center">
          <span>Are you sure you want to Cancel the Bill?</span>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="No"
          color="white"
          v-close-popup
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
        />
        <q-btn
          flat
          label="Yes"
          color="white"
          :loading="isCancellingBill"
          class="bg-btn-primary hover:bg-btn-primary-hover"
          @click="handleCancelSale(selectedRowId)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-card-actions class="row justify-end">
    <q-btn
      label="CLOSE"
      unelevated
      color="btn-cancel hover:bg-btn-cancel-hover"
      @click="$router.go(-1)"
    />
  </q-card-actions>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { shopAllBillsTableColumn, billStatusOptionList } from './utils';
import {
  getSaleListApi,
  shopListApi,
  cancelSaleApi,
  changeSaleStatusApi,
} from 'src/services';
import {
  IBillStatusOptionList,
  ISaleListResponse,
  EActionPermissions,
  EUserModules,
  IShopResponse,
  EUserRoles,
} from 'src/interfaces';
import { isPosError } from 'src/utils';
import { CanceledError } from 'axios';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { useAuthStore } from 'src/stores';
import { useRouter } from 'vue-router';
const router = useRouter();
const timeStamp = Date.now();
const authStore = useAuthStore();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Date = date.subtractFromDate(timeStamp, { date: 1 });
const formattedFromDate = date.formatDate(past1Date, 'YYYY-MM-DD');
const saleList = ref<ISaleListResponse[]>([]);
const selectedRowId = ref<number>(-1);
const apiController = ref<AbortController | null>(null);
const routerPath = router.currentRoute.value.fullPath;
const titleAction = ref('All Bills');
const isCancelBillModalVisible = ref(false);
const isCancellingBill = ref(false);
const isFetchingShopList = ref(false);
const isLoading = ref(false);
const $q = useQuasar();
const shopData = ref<IShopResponse[]>([]);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
onMounted(() => {
  getShopList();
  selectedShop.value.fromShop = {
    shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
    closingBalance: 0,
    status: '',
    isWareHouse: '',
    name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
    phone: '',
    address: '',
    code: '',
  };
  if (routerPath.includes('hold-bills')) {
    titleAction.value = 'Hold Bills';
    filterSearch.value.selectStatus =
      billStatusOptionList.find((status) => status.statusId === 2) || null;
  }
  searchBills();
});
const filterSearch = ref<{
  selectStatus: null | IBillStatusOptionList;
  shopId: null | number;
  invoiceNumber: null | string;
  startDate: null | string;
  endDate: null | string;
}>({
  selectStatus: null,
  shopId: selectedShop.value.fromShop?.shopId ?? null,
  invoiceNumber: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const searchBills = async (paginationData?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isLoading.value = true;
  if (paginationData) {
    pagination.value = {
      ...pagination.value,
      ...paginationData.pagination,
    };
  }
  const rowsPerPage =
    pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await getSaleListApi(
      {
        filterSearch: {
          statusId: filterSearch.value.selectStatus,
          shopId: filterSearch.value.shopId,
          invoiceNumber: filterSearch.value.invoiceNumber,
          fromDate: filterSearch.value.startDate,
          toDate: filterSearch.value.endDate,
        },
        pageNumber: pagination.value.page,
        pageSize: rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      saleList.value = res.data.items;
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
  } finally {
    isLoading.value = false;
  }
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    selectStatus: null,
    shopId: null,
    invoiceNumber: null,
    startDate: formattedFromDate,
    endDate: formattedToDate,
  };
  searchBills();
};
const handleUpdateFromShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShop = newVal;
  filterSearch.value.shopId = newVal.shopId;
};
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isFetchingShopList.value = false;
  }
};
const handleCompleteSale = async (saleId: number, saleStatus: number) => {
  try {
    const response = await changeSaleStatusApi({ saleId, saleStatus });
    if (response.type === 'Success') {
      const saleToUpdate = saleList.value.find(
        (sale) => sale.saleId === saleId
      );
      if (saleToUpdate) {
        saleToUpdate.status = 'Completed';
        $q.notify({
          message: response.message,
          type: 'positive',
        });
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};

const handleCancelSalePopup = (selectedRow: number) => {
  selectedRowId.value = selectedRow;
  isCancelBillModalVisible.value = true;
};
const handleCancelSale = async (id: number) => {
  if (isCancellingBill.value) return;
  isCancellingBill.value = true;
  try {
    const response = await cancelSaleApi(id);
    if (response.type === 'Success') {
      const saleToUpdate = saleList.value.find((sale) => sale.saleId === id);
      if (saleToUpdate) {
        saleToUpdate.status = 'Canceled';
        $q.notify({
          message: response.message,
          type: 'positive',
        });
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isCancellingBill.value = false;
  isCancelBillModalVisible.value = false;
};
</script>
