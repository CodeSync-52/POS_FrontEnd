<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.BillGeneration,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
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
        v-model="filterSearch.FromDate"
        label="From"
        type="date"
        :max="filterSearch.ToDate"
        outlined
        dense
      />
      <q-input
        v-model="filterSearch.ToDate"
        label="To"
        type="date"
        :min="filterSearch.FromDate"
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
          @click="getBillList()"
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
        :rows="billGenerationData"
        :columns="billGenerationColumn"
        row-key="billId"
        v-model:pagination="pagination"
        @request="getBillList"
      >
        <template
          v-slot:header-cell-action
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Delete
            )
          "
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Update
            ) &&
            authStore.checkUserHasPermission(
              EUserModules.BillGeneration,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  props.row.billStatus !== 'Cancelled' &&
                  props.row.billStatus !== 'Completed'
                "
                size="sm"
                flat
                unelevated
                dense
                icon="edit"
                @click="
                  router.push(`/bill-generation/${props.row.billId}/edit-bill`)
                "
              />
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="visibility"
                @click="
                  router.push(`/bill-generation/${props.row.billId}/preview`)
                "
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  props.row.billStatus !== 'Cancelled' &&
                  props.row.billStatus !== 'Completed'
                "
                size="sm"
                flat
                unelevated
                dense
                color="green"
                icon="check"
                @click="handleGenerateBillPopup(props.row)"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  props.row.billStatus !== 'Cancelled' &&
                  props.row.billStatus !== 'Completed'
                "
                size="sm"
                flat
                unelevated
                dense
                color="red"
                icon="cancel"
                @click="handleCancelBillPopup(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isCancelOrGenerateBillModalVisible">
      <generate-or-cancel-bill-modal
        :is-cancel="isCancel"
        :selected-row-id="selectedRowData?.billId"
        @cancel-bill="handleCancelBill"
        @generate-bill="handleGenerateBill"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { isPosError, billGenerationColumn } from 'src/utils';
import GenerateOrCancelBillModal from 'src/components/bill-generation/GenerateOrCancelBillModal.vue';
import {
  getRoleModuleDisplayName,
  EActionPermissions,
  EUserModules,
  IBillGenerationData,
  IBillGenerationFilter,
} from 'src/interfaces';
import { billListApi, cancelBillApi, completeBillApi } from 'src/services';
const authStore = useAuthStore();
const router = useRouter();
const billGenerationData = ref<IBillGenerationData[]>([]);
const pageTitle = getRoleModuleDisplayName(EUserModules.BillGeneration);
const isLoading = ref(false);
const $q = useQuasar();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const isCancel = ref(false);
const isCancelOrGenerateBillModalVisible = ref(false);
const selectedRowData = ref<IBillGenerationData | null>(null);
const apiController = ref<AbortController | null>(null);
const filterSearch = ref<IBillGenerationFilter>({
  userId: null,
  userName: null,
  ToDate: null,
  FromDate: null,
});
onMounted(() => {
  getBillList();
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
    userId: null,
    userName: null,
    ToDate: null,
    FromDate: null,
  };
  getBillList();
};
const handleGenerateBillPopup = async (selectedRow: IBillGenerationData) => {
  selectedRowData.value = selectedRow;
  isCancel.value = false;
  isCancelOrGenerateBillModalVisible.value = true;
};
const handleGenerateBill = async (id: number, callback: () => void) => {
  try {
    const res = await completeBillApi(id);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.billStatus = 'Completed';
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
  callback();
  isCancelOrGenerateBillModalVisible.value = false;
};
const handleCancelBillPopup = async (selectedRow: IBillGenerationData) => {
  selectedRowData.value = selectedRow;
  isCancel.value = true;
  isCancelOrGenerateBillModalVisible.value = true;
};
const handleCancelBill = async (id: number, callback: () => void) => {
  try {
    const res = await cancelBillApi(id);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.billStatus = 'Cancelled';
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
  callback();
  isCancelOrGenerateBillModalVisible.value = false;
};
const getBillList = async (data?: {
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
    const res = await billListApi(
      {
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      billGenerationData.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
  isLoading.value = false;
};
</script>
