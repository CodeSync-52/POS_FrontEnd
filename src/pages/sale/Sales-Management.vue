<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <router-link to="/sale/add-new">
        <q-btn
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Create
            )
          "
          unelevated
          label="Add New"
          icon="add"
          class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
          color=""
        />
      </router-link>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroupId"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.customerGroupId = $event.customerGroupId
        "
        :loading="isCustomerGroupListLoading"
        label="User Category"
        option-label="name"
        option-value="customerGroupId"
        color="btn-primary"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        dense
        outlined
        style="min-width: 200px"
        :options="options"
        use-input
        @filter="filterFn"
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="User"
        color="btn-primary"
      />
      <q-select
        dense
        outlined
        :options="wholeSaleStatusOptions"
        style="min-width: 200px"
        v-model="filterSearch.wholeSaleStatus"
        label="Status"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.userName"
        maxlength="250"
        outlined
        label="Name"
        autofocus
        @keyup.enter="getSalesManagementList()"
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.startDate"
        label="From"
        :max="filterSearch.endDate"
        type="date"
        outlined
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.endDate"
        label="To"
        type="date"
        :min="filterSearch.startDate"
        outlined
        color="btn-primary"
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          :loading="isLoading"
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getSalesManagementList()"
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
        class="max-h-[39.5vh] lg:max-h-[55vh] 3xl:max-h-[65vh]"
        :columns="salesManagementColumn"
        :rows="salesManagementRecords"
        v-model:pagination="pagination"
        align="left"
        :loading="isLoading"
        :rows-per-page-options="[0]"
        hide-bottom
        @request="getSalesManagementList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.SalesManagement,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td
            v-if="
              authStore.checkUserHasPermission(
                EUserModules.SalesManagement,
                EActionPermissions.Update
              ) ||
              authStore.checkUserHasPermission(
                EUserModules.SalesManagement,
                EActionPermissions.Delete
              )
            "
            :props="props"
          >
            <div class="flex gap-2 flex-nowrap">
              <router-link :to="`/sale/${props.row.wholeSaleId}`">
                <q-btn
                  v-if="
                    authStore.checkUserHasPermission(
                      EUserModules.SalesManagement,
                      EActionPermissions.Update
                    ) &&
                    props.row.wholeSaleStatus !== 'Cancelled' &&
                    props.row.wholeSaleStatus !== 'Completed'
                  "
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="edit"
                  class="hover:text-btn-primary"
                  ><q-tooltip class="bg-black" :offset="[10, 10]">
                    Edit Sale
                  </q-tooltip></q-btn
                >
              </router-link>
              <router-link :to="`/sale/${props.row.wholeSaleId}/preview`">
                <q-btn
                  size="sm"
                  flat
                  dense
                  unelevated
                  icon="visibility"
                  color="green"
                >
                  <q-tooltip class="bg-green" :offset="[10, 10]">
                    Preview Sale
                  </q-tooltip>
                </q-btn>
              </router-link>

              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.SalesManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.wholeSaleStatus !== 'Cancelled' &&
                  props.row.wholeSaleStatus !== 'Completed' &&
                  authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase() &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 5 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
                "
                size="sm"
                flat
                dense
                unelevated
                icon="check"
                color="green"
                @click="handleGenerateSalePopup(props.row)"
              >
                <q-tooltip class="bg-green" :offset="[10, 10]">
                  Generate Sale
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.SalesManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.wholeSaleStatus !== 'Cancelled' &&
                  props.row.wholeSaleStatus !== 'Completed' &&
                  authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase() &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 5 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
                "
                size="sm"
                flat
                dense
                unelevated
                icon="cancel"
                color="red"
                @click="handleCancelSalePopup(props.row)"
                ><q-tooltip class="bg-red" :offset="[10, 10]">
                  Cancel Sale
                </q-tooltip></q-btn
              >
            </div>
          </q-td>
          <q-td v-else />
        </template>
        <template v-slot:body-cell-fullName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.fullName }}
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
        <template v-slot:bottom-row>
          <q-tr class="sticky bottom-0 bg-white">
            <q-td colspan="2" class="text-bold"> Total </q-td>
            <q-td class="text-bold">
              {{ calculateTotal('totalAmount') }}
            </q-td>
            <q-td class="text-bold">
              {{ calculateTotal('discount') }}
            </q-td>
            <q-td class="text-bold">
              {{ calculateTotal('netAmount') }}
            </q-td>
            <q-td colspan="3" class="text-bold">
              {{ calculateTotal('totalQuantity') }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isGenerateOrCancelSaleModalVisible">
      <generate-or-cancel-sale-modal
        :is-cancel="isCancel"
        :selected-row-id="selectedRowData?.wholeSaleId"
        @cancel-sale="handleCancelSale"
        @generate-sale="handleGenerateSale"
      />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IPagination,
  IWholeSalesData,
  getRoleModuleDisplayName,
  IWholeSalesFilter,
  IUserResponse,
  EUserRoles,
  ICustomerListResponse,
} from 'src/interfaces';
import { onMounted, ref } from 'vue';
import {
  GetWholeSaleList,
  CompleteWholeSale,
  CancelWholeSale,
  GetUsers,
  GetCustomerGroupList,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import {
  isPosError,
  salesManagementColumn,
  wholeSaleStatusOptions,
} from 'src/utils';
import GenerateOrCancelSaleModal from 'src/components/sales-management/Generate-Or-Cancel-Sale-Modal.vue';
import { CanceledError } from 'axios';
import { date } from 'quasar';
import moment from 'moment';
const pageTitle = getRoleModuleDisplayName(EUserModules.SalesManagement);
const authStore = useAuthStore();
const $q = useQuasar();
const isCancel = ref(false);
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100000,
  rowsNumber: 0,
};
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const filterSearch = ref<IWholeSalesFilter>({
  userId: null,
  userName: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
  wholeSaleStatus: null,
  customerGroupId: null,
});
const isGenerateOrCancelSaleModalVisible = ref(false);
const isGeneratingSale = ref(false);
const isCustomerGroupListLoading = ref(false);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const salesManagementRecords = ref<IWholeSalesData[]>([]);
const pagination = ref<IPagination>(defaultPagination);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const selectedRowData = ref<IWholeSalesData | null>(null);
const UserList = ref<IUserResponse[]>([]);
const options = ref<IUserResponse[]>([]);
onMounted(() => {
  getSalesManagementList();
  getUserList();
  getCustomerListOption();
});
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userId: null,
    userName: null,
    startDate: null,
    endDate: null,
    wholeSaleStatus: null,
    customerGroupId: null,
  };
  getSalesManagementList();
};
const handleGenerateSalePopup = (selectedRow: IWholeSalesData) => {
  selectedRowData.value = selectedRow;
  isCancel.value = false;
  isGenerateOrCancelSaleModalVisible.value = true;
};
const handleCancelSalePopup = (selectedRow: IWholeSalesData) => {
  selectedRowData.value = selectedRow;
  isCancel.value = true;
  isGenerateOrCancelSaleModalVisible.value = true;
};
const handleCancelSale = async (id: number, callback: () => void) => {
  try {
    const res = await CancelWholeSale(id);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.wholeSaleStatus = 'Cancelled';
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Cancelling sale';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  callback();
  isGenerateOrCancelSaleModalVisible.value = false;
};
const getSalesManagementList = async (data?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
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
    const res = await GetWholeSaleList(
      {
        filterSearch: filterSearch.value,
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      salesManagementRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Sales List';
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
const handleGenerateSale = async () => {
  if (isGeneratingSale.value) return;
  isGeneratingSale.value = true;
  try {
    const selectedId = selectedRowData.value?.wholeSaleId ?? -1;
    const res = await CompleteWholeSale(selectedId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.wholeSaleStatus = 'Completed';
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Generating Sale';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isGeneratingSale.value = false;
  isGenerateOrCancelSaleModalVisible.value = false;
};
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items;
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
async function getCustomerListOption() {
  if (isCustomerGroupListLoading.value) return;
  isCustomerGroupListLoading.value = true;
  try {
    const res = await GetCustomerGroupList({ status: 'Active' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupList.value = res?.data;
    }
    isCustomerGroupListLoading.value = false;
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
    isCustomerGroupListLoading.value = false;
  }
}
const calculateTotal = (
  columnName: keyof (typeof salesManagementRecords.value)[0]
) => {
  return salesManagementRecords.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
</script>
