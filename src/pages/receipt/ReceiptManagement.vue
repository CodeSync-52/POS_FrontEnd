<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>

      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.ReceiptManagement,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="handleAddNewReceipt"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        :options="UserList"
        map-options
        option-label="fullName"
        option-value="userId"
        label="User"
        color="btn-primary"
      />
      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.purchaseStatus"
        :options="purchaseStatusOptions"
        label="Purchased Status"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.userName"
        outlined
        label="Name"
        style="min-width: 200px"
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.startDate"
        label="From"
        :max="filterSearch.endDate"
        type="date"
        style="min-width: 200px"
        outlined
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.endDate"
        label="To"
        type="date"
        style="min-width: 200px"
        :min="filterSearch.startDate"
        outlined
        color="btn-primary"
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getReceiptList()"
        />
        <q-btn
          color=""
          :loading="isLoading"
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="receiptData"
        :columns="receiptColumn"
        v-model:pagination="pagination"
        @request="getReceiptList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.ReceiptManagement,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.ReceiptManagement,
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
                EUserModules.ReceiptManagement,
                EActionPermissions.Update
              ) ||
              authStore.checkUserHasPermission(
                EUserModules.ReceiptManagement,
                EActionPermissions.Delete
              )
            "
            :props="props"
          >
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.ReceiptManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.purchaseStatus !== 'Cancelled' &&
                  props.row.purchaseStatus !== 'Billed'
                "
                size="sm"
                flat
                dense
                unelevated
                @click="router.push(`/receipt/${props.row.purchaseId}`)"
                icon="edit"
                class="hover:text-btn-primary"
              />
              <q-btn
                size="sm"
                flat
                dense
                unelevated
                icon="visibility"
                color="green"
                @click="router.push(`/receipt/${props.row.purchaseId}/preview`)"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.ReceiptManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.purchaseStatus !== 'Cancelled' &&
                  props.row.purchaseStatus !== 'Billed'
                "
                size="sm"
                flat
                dense
                unelevated
                @click="
                  router.push(
                    `/bill-generation/${props.row.purchaseId}/generate-receipt-bill`
                  )
                "
                icon="receipt"
                color="bg-btn-secondary"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.ReceiptManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.purchaseStatus !== 'Cancelled' &&
                  props.row.purchaseStatus !== 'Billed'
                "
                size="sm"
                flat
                dense
                unelevated
                icon="cancel"
                color="red"
                @click="handleCancelReceiptPopup(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isCancelReceiptModalVisible">
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
            <span>Are you sure you want to Cancel the Receipt?</span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="white"
            v-close-popup
            class="bg-btn-cancel hover:bg-btn-cancel-hover"
          />
          <q-btn
            flat
            label="Cancel"
            color="white"
            :loading="isCancellingReceipt"
            class="bg-btn-primary hover:bg-btn-primary-hover"
            @click="handleCancelReceipt"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
  IReceiptData,
  IPagination,
  IUserManagementData,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { onMounted, onUnmounted, ref } from 'vue';
import { receiptListApi, cancelReceiptApi, getUserListApi } from 'src/services';
import { isPosError, receiptColumn, purchaseStatusOptions } from 'src/utils';
import { useRouter } from 'vue-router';
import { CanceledError } from 'axios';
const authStore = useAuthStore();
const $q = useQuasar();
const pageTitle = getRoleModuleDisplayName(EUserModules.ReceiptManagement);
const isLoading = ref(false);
const router = useRouter();
const receiptData = ref<IReceiptData[]>([]);
const isCancelReceiptModalVisible = ref(false);
const selectedRowData = ref<IReceiptData | null>(null);
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
};
const pagination = ref<IPagination>(defaultPagination);
const isCancellingReceipt = ref(false);
const apiController = ref<AbortController | null>(null);
const filterSearch = ref<{
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  purchaseStatus: null | string;
}>({
  userId: null,
  userName: null,
  startDate: null,
  endDate: null,
  purchaseStatus: null,
});
onMounted(() => {
  getReceiptList();
  getUserList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
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
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userId: null,
    userName: null,
    startDate: null,
    endDate: null,
    purchaseStatus: null,
  };
  getReceiptList();
};
const handleAddNewReceipt = () => {
  router.push('/receipt/add-new');
};
const handleCancelReceiptPopup = (selectedRow: IReceiptData) => {
  selectedRowData.value = selectedRow;
  isCancelReceiptModalVisible.value = true;
};
const handleCancelReceipt = async () => {
  if (isCancellingReceipt.value) return;
  isCancellingReceipt.value = true;
  try {
    const res = await cancelReceiptApi(selectedRowData.value?.purchaseId ?? -1);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      const matchingRowIndex = receiptData.value.findIndex(
        (row) => selectedRowData.value?.purchaseId === row.purchaseId
      );
      receiptData.value[matchingRowIndex].purchaseStatus = 'Cancelled';
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
  isCancellingReceipt.value = false;
  isCancelReceiptModalVisible.value = false;
};
const getReceiptList = async (data?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
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
    const res = await receiptListApi(
      {
        ToDate: filterSearch.value.endDate,
        FromDate: filterSearch.value.startDate,
        UserId: filterSearch.value.userId,
        FullName: filterSearch.value.userName,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        PurchaseStatus: filterSearch.value.purchaseStatus,
      },
      apiController.value
    );
    if (res?.data) {
      receiptData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
  isLoading.value = false;
};
</script>
