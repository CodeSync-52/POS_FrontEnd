<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>

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
        unelevated
        color=""
        @click="handleAddNewReceipt"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-input
        v-model="filterSearch.userId"
        min="1"
        label="User ID"
        type="number"
        dense
        outlined
      />
      <q-input v-model="filterSearch.userName" outlined label="Name" dense />
      <q-input
        v-model="filterSearch.startDate"
        label="From"
        type="date"
        outlined
        dense
      />
      <q-input
        v-model="filterSearch.endDate"
        label="To"
        type="date"
        outlined
        dense
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
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
                  )
                "
                size="sm"
                flat
                dense
                unelevated
                icon="edit"
                color="bg-btn-secondary"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.ReceiptManagement,
                    EActionPermissions.Update
                  ) && props.row.purchaseStatus !== 'Cancelled'
                "
                size="sm"
                flat
                dense
                unelevated
                icon="cancel"
                color="red"
                @click="handleCancelReceipt(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
  IReceiptData,
  IPagination,
} from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { onMounted, ref } from 'vue';
import { receiptListApi, cancelReceiptApi } from 'src/services';
import { isPosError, receiptColumn } from 'src/utils';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const $q = useQuasar();
const pageTitle = getRoleModuleDisplayName(EUserModules.ReceiptManagement);
const isLoading = ref(false);
const router = useRouter();
const receiptData = ref<IReceiptData[]>([]);
const defaultFilterValues = {
  userId: null,
  userName: null,
  startDate: null,
  endDate: null,
};
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
};
const pagination = ref<IPagination>(defaultPagination);
const filterSearch = ref<{
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
}>(defaultFilterValues);
onMounted(() => {
  getReceiptList();
});
const handleFilterSearch = () => {
  getReceiptList();
};
const resetFilter = () => {
  filterSearch.value = {
    userId: null,
    userName: null,
    startDate: null,
    endDate: null,
  };
  getReceiptList();
};
const handleAddNewReceipt = () => {
  router.push('/receipt/add-new');
};
const handleCancelReceipt = async (selectedRowData: IReceiptData) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await cancelReceiptApi(selectedRowData.purchaseId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      const matchingRowIndex = receiptData.value.findIndex(
        (row) => selectedRowData.purchaseId === row.purchaseId
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
  isLoading.value = false;
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
    const res = await receiptListApi({
      ToDate: filterSearch.value.endDate,
      FromDate: filterSearch.value.startDate,
      UserId: filterSearch.value.userId,
      FullName: filterSearch.value.userName,
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
    });
    if (res?.data) {
      receiptData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemsCount;
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
