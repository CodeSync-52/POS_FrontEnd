<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.GoodsReceiptNotes,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        unelevated
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        to="/goods-receipt/add-new"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        popup-content-class="!max-h-[200px]"
        :options="shopData"
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
        v-model="selectedShop.fromShopId"
        @update:model-value="handleUpdateFromShop($event)"
        label="From Shop"
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
        :options="shopData"
        :loading="isLoading"
        use-input
        dense
        class="min-w-[220px] max-w-[220px]"
        clearable
        map-options
        outlined
        v-model="selectedShop.toShopId"
        @update:model-value="handleUpdateToShop($event)"
        label="To Shop"
        autofocus
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
        :rows="GrnRecords"
        :columns="GrnTableColumn"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getGrnList"
      >
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
        <template
          v-slot:header-cell-action
          v-if="
            authStore.loggedInUser?.rolePermissions.roleName !==
              EUserRoles.SuperAdmin.toLowerCase() &&
            authStore.loggedInUser?.rolePermissions.roleName !==
              EUserRoles.Admin.toLowerCase()
          "
        >
          <q-th></q-th>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                v-if="
                  (authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase() ||
                    authStore.loggedInUser?.rolePermissions.roleName ===
                      EUserRoles.Admin.toLowerCase()) &&
                  props.row.grnStatus !== 'Accept' &&
                  props.row.grnStatus !== 'Reject'
                "
                flat
                unelevated
                dense
                size="sm"
                icon="cancel"
                color="red"
                @click="handleRejectStrPopup(props.row)"
              >
                <q-tooltip class="bg-red" :offset="[10, 10]">
                  Cancel GRN
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                unelevated
                dense
                size="sm"
                icon="visibility"
                color="green"
                :to="`/stock-transfer/${props.row.grnId}`"
              >
                <q-tooltip class="bg-green" :offset="[10, 10]">
                  Preview STR
                </q-tooltip>
              </q-btn>
              <div class="flex gap-2 flex-nowrap">
                <q-btn
                  v-if="
                    authStore.checkUserHasPermission(
                      EUserModules.GoodsReceiptNotes,
                      EActionPermissions.Delete
                    ) &&
                    authStore.checkUserHasPermission(
                      EUserModules.GoodsReceiptNotes,
                      EActionPermissions.Update
                    ) &&
                    props.row.grnStatus === 'Pending'
                  "
                  size="sm"
                  flat
                  unelevated
                  dense
                  icon="edit"
                  class="hover:text-btn-primary !px-[5px]"
                  :to="`/stock-transfer/${props.row.grnId}/edit`"
                >
                  <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                    Edit GRN
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isAcceptOrRejectStrModalVisible">
      <accept-or-reject-str-modal
        :is-reject="true"
        @reject-str="handleRejectStr"
      />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { useQuasar, date } from 'quasar';
import { onMounted, onUnmounted, ref } from 'vue';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IGrnListFilter,
  IGrnRecords,
  IPagination,
  IShopResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import AcceptOrRejectStrModal from 'src/components/str/Accept-Or-Reject-Str-Modal.vue';
import { grnListApi, shopListApi, rejectStrApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { GrnTableColumn } from 'src/utils';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.GoodsReceiptNotes);
const $q = useQuasar();
const GrnRecords = ref<IGrnRecords[]>([]);
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const filterSearch = ref<IGrnListFilter>({
  FromDate: formattedFromDate,
  ToDate: formattedToDate,
  fromShopId: null,
  toShopId: null,
});
const pagination = ref<IPagination>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});
const selectedShop = ref<{
  fromShopId: IShopResponse | null;
  toShopId: IShopResponse | null;
}>({
  fromShopId: null,
  toShopId: null,
});
const apiController = ref<AbortController | null>(null);
const selectedRowData = ref<IGrnRecords | null>(null);
const isAcceptOrRejectStrModalVisible = ref(false);

const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ToDate: null,
    FromDate: null,
    toShopId: null,
    fromShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
  };
  selectedShop.value = {
    toShopId: null,
    fromShopId: {
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      closingBalance: 0,
      status: '',
      isWareHouse: '',
      name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
      phone: '',
      address: '',
      code: '',
    },
  };
  getGrnList();
};
onMounted(() => {
  getShopList();
  selectedShop.value.fromShopId = {
    shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
    closingBalance: 0,
    status: '',
    isWareHouse: '',
    name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
    phone: '',
    address: '',
    code: '',
  };
  filterSearch.value.fromShopId = selectedShop.value.fromShopId.shopId;
  getGrnList();
}),
  onUnmounted(() => {
    if (apiController.value) {
      apiController.value.abort();
    }
  });
const handleRejectStrPopup = (selectedRow: IGrnRecords) => {
  selectedRowData.value = selectedRow;
  isAcceptOrRejectStrModalVisible.value = true;
};
const handleUpdateToShop = (newVal: IShopResponse) => {
  selectedShop.value.toShopId = newVal;
  filterSearch.value.toShopId = newVal?.shopId;
};
const handleUpdateFromShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShopId = newVal;
  filterSearch.value.fromShopId = newVal?.shopId;
};

const getGrnList = async (data?: {
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
    const res = await grnListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      GrnRecords.value = res.data.items;
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
const getShopList = async () => {
  isLoading.value = true;
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
    isLoading.value = false;
  }
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
</script>
