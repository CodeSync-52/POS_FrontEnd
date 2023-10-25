<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.StockTransferRequests,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        popup-content-class="!max-h-[200px]"
        :options="shopOptionRecords"
        :loading="isLoading"
        use-input
        class="min-w-[220px] max-w-[220px]"
        dense
        map-options
        outlined
        :disable="
          authStore.loggedInUser?.rolePermissions.roleName !==
            EUserRoles.SuperAdmin.toLowerCase() &&
          authStore.loggedInUser?.rolePermissions.roleName !==
            EUserRoles.Admin.toLowerCase()
        "
        v-model="selectedShop.fromShop"
        @update:model-value="handleUpdateFromShop($event)"
        label="Select Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >
      <q-select
        popup-content-class="!max-h-[200px]"
        :options="shopOptionRecords"
        :loading="isLoading"
        use-input
        dense
        class="min-w-[220px] max-w-[220px]"
        clearable
        map-options
        outlined
        v-model="selectedShop.toShop"
        @update:model-value="handleUpdateToShop($event)"
        label="Select Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >
      <q-input
        v-model="filterSearch.FromDate"
        label="From"
        style="min-width: 200px"
        type="date"
        :max="filterSearch.ToDate"
        outlined
        color="btn-primary"
        dense
      />
      <q-input
        v-model="filterSearch.ToDate"
        label="To"
        color="btn-primary"
        type="date"
        style="min-width: 200px"
        :min="filterSearch.FromDate"
        outlined
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getGrnList()"
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
        :rows="strRecords"
        :columns="GrnTableColumn"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getGrnList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.StockTransferRequests,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.StockTransferRequests,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.StockTransferRequests,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.StockTransferRequests,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div
              v-if="
                props.row.grnStatus !== 'Accept' &&
                props.row.grnStatus !== 'Reject'
              "
              class="flex gap-2 flex-nowrap"
            >
              <q-btn
                flat
                unelevated
                dense
                size="sm"
                icon="check"
                color="green"
                @click="handleAcceptOrRejectStrPopup(props.row, false)"
              />
              <q-btn
                flat
                unelevated
                dense
                size="sm"
                icon="cancel"
                color="red"
                @click="handleAcceptOrRejectStrPopup(props.row, true)"
              />
            </div>
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
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog v-model="isAcceptOrRejectStrModalVisible">
    <accept-or-reject-str-modal
      :is-reject="isReject"
      @reject-str="handleRejectStr"
      @accept-str="handleAcceptStr"
    />
  </q-dialog>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useQuasar, date } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  IGrnListFilter,
  IGrnRecords,
  IPagination,
  getRoleModuleDisplayName,
  IShopResponse,
  EUserRoles,
} from 'src/interfaces';
import AcceptOrRejectStrModal from 'src/components/str/AcceptOrRejectStrModal.vue';
import {
  grnListApi,
  rejectStrApi,
  acceptStrApi,
  shopListApi,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { GrnTableColumn } from 'src/utils';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.StockTransferRequests);
const $q = useQuasar();
const strRecords = ref<IGrnRecords[]>([]);
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedRowData = ref<IGrnRecords | null>(null);
const isReject = ref(false);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const filterSearch = ref<IGrnListFilter>({
  FromDate: formattedFromDate,
  ToDate: formattedToDate,
  FromShop: null,
  ToShop: null,
});
const selectedShop = ref<{
  fromShop: IShopResponse | null;
  toShop: IShopResponse | null;
}>({
  fromShop: null,
  toShop: null,
});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const isAcceptOrRejectStrModalVisible = ref(false);
const apiController = ref<AbortController | null>(null);
const handleAcceptOrRejectStrPopup = (
  selectedRow: IGrnRecords,
  isRejected: boolean
) => {
  isReject.value = isRejected;
  selectedRowData.value = selectedRow;
  isAcceptOrRejectStrModalVisible.value = true;
};
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ToDate: null,
    FromDate: null,
    ToShop: null,
    FromShop: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
  };
  selectedShop.value = {
    fromShop: {
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      closingBalance: 0,
      status: '',
      isWareHouse: '',
      name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
      phone: '',
      address: '',
      code: '',
    },
    toShop: null,
  };
  if (selectedShop.value.fromShop) {
    filterSearch.value.FromShop = selectedShop.value.fromShop?.shopId;
  }
  getGrnList();
};
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
  filterSearch.value.FromShop = selectedShop.value.fromShop.shopId;
  getGrnList();
}),
  onUnmounted(() => {
    if (apiController.value) {
      apiController.value.abort();
    }
  });
const getGrnList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await grnListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      strRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Fetching Grn List';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isLoading.value = false;
};
const shopOptionRecords = computed(() => {
  let idList: number[] = [];
  if (selectedShop.value.fromShop) {
    idList.push(selectedShop.value.fromShop.shopId);
  }
  if (selectedShop.value.toShop) {
    idList.push(selectedShop.value.toShop.shopId);
  }
  if (idList.length > 0) {
    return shopData.value.filter((shop) => !idList.includes(shop.shopId));
  }
  return shopData.value;
});
const handleUpdateToShop = (newVal: IShopResponse) => {
  selectedShop.value.toShop = newVal;
  filterSearch.value.ToShop = newVal?.shopId;
};
const handleUpdateFromShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShop = newVal;
  filterSearch.value.FromShop = newVal?.shopId;
};

const handleRejectStr = async (reason: string, callback: () => void) => {
  try {
    const res = await rejectStrApi({
      grnId: selectedRowData.value?.grnId ?? -1,
      reason,
    });
    if (res.type === 'Success') {
      $q.notify({
        type: 'positive',
        message: res.message,
      });
      if (selectedRowData.value) {
        selectedRowData.value.grnStatus = 'Reject';
      }
    }
  } catch (e) {
    let message = 'Unexpected error occurred rejecting Str';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  callback();
  isAcceptOrRejectStrModalVisible.value = false;
};
const handleAcceptStr = async (callback: () => void) => {
  try {
    const res = await acceptStrApi(selectedRowData.value?.grnId ?? -1);
    if (res.type === 'Success') {
      $q.notify({
        type: 'positive',
        message: res.message,
      });
      if (selectedRowData.value) {
        selectedRowData.value.grnStatus = 'Accept';
      }
    }
  } catch (e) {
    let message = 'Unexpected error occurred accepting Str';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  callback();
  isAcceptOrRejectStrModalVisible.value = false;
};
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
      ShopOptionData.value = response.data.items;
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
    isLoading.value = false;
  }
};
</script>
