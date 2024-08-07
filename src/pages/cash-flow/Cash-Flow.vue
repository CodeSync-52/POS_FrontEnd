<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <router-link to="/cash-flow/add-new">
        <q-btn
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CashInCashOutManagement,
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
      <q-checkbox
        dense
        v-model="filterSearch.IsReverted"
        color="btn-primary"
        label="Reverted"
      />
      <q-input
        v-model="filterSearch.FromDate"
        :max="filterSearch.ToDate"
        type="date"
        dense
        style="min-width: 150px; max-width: 150px"
        label="From Date"
        outlined
        color="btn-primary"
      />
      <q-input
        :min="filterSearch.FromDate"
        v-model="filterSearch.ToDate"
        style="min-width: 150px; max-width: 150px"
        type="date"
        dense
        outlined
        label="To Date"
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          :loading="isLoading"
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getCashFlowRecords()"
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
        :columns="cashFlowColumn"
        :rows="filteredRows"
        v-model:pagination="pagination"
        align="left"
        :loading="isLoading"
        :rows-per-page-options="[0]"
        hide-bottom
        @request="getCashFlowRecords"
      >
        <template v-slot:top>
          <div
            class="flex flex-col sm:flex-row justify-center md:justify-between gap-4 item-center w-full"
          >
            <div class="font-medium text-lg flex items-center">
              <span>Cash Flow</span>
            </div>
            <div class="row gap-2">
              <q-input
                outlined
                dense
                maxlength="250"
                debounce="300"
                color="btn-primary"
                label="Receiver"
                autofocus
                v-model="filter.receiver"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-input
                outlined
                dense
                maxlength="250"
                debounce="300"
                color="btn-primary"
                label="Sender"
                v-model="filter.sender"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-sourceUserName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap w-[260px] text-ellipsis overflow-hidden"
          >
            {{ props.row.sourceUserName }}
          </q-td>
        </template>
        <template
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.CashInCashOutManagement,
              EActionPermissions.View
            )
          "
          v-slot:header-cell-action
        >
          <q-th> </q-th>
        </template>
        <template
          v-slot:body-cell-action="props"
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CashInCashOutManagement,
              EActionPermissions.View
            )
          "
        >
          <q-td class="flex justify-start" :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                icon="visibility"
                dense
                flat
                unelevated
                color="green"
                size="sm"
                @click="handleShowCashFlow(props.row)"
                ><q-tooltip class="bg-green" :offset="[10, 10]">
                  Preview Cashflow
                </q-tooltip></q-btn
              >
              <q-btn
                v-if="
                  props.row.isRevertTransactionAllowed === true &&
                  authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase()
                "
                icon="undo"
                dense
                flat
                unelevated
                color="blue"
                size="sm"
                @click="handleUndoCashFlow(props.row)"
                ><q-tooltip class="bg-blue" :offset="[10, 10]">
                  Undo Cashflow
                </q-tooltip></q-btn
              >
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-comments="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.comments || 'N/A' }}
          </q-td>
        </template>
        <template v-slot:body-cell-targetUserName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap w-[260px] text-ellipsis overflow-hidden"
          >
            {{ props.row.targetUserName }}
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
            <q-td colspan="5" class="text-bold">
              {{ calculateTotal('amount') }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isPreviewCashFlowModalVisible">
      <preview-cash-flow :selected-data="selectedRowData" />
    </q-dialog>
    <q-dialog v-model="showUndoCashFlowModal">
      <UndoCashFlowModal
        title="Undo Cashflow"
        message="Are you sure you want to Undo Cashflow?"
        @confirm="handleAddNewFlow(selectedRecord.selectedData)"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
  ICashFlowRecords,
} from 'src/interfaces';
import { date } from 'quasar';
import { GetCashFlowList, CreateTransaction } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError, cashFlowColumn } from 'src/utils';
import { EUserRoles } from 'src/interfaces';
import PreviewCashFlow from 'src/components/cash-flow/Preview-Cash-Flow.vue';
import UndoCashFlowModal from 'src/components/return/Complete-Or-Cancel-Modal.vue';
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.CashInCashOutManagement
);
const isPreviewCashFlowModalVisible = ref(false);
const isLoading = ref(false);
const showUndoCashFlowModal = ref(false);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const filter = ref({
  sender: '',
  receiver: '',
});
const $q = useQuasar();
const filterSearch = ref({
  FromDate: formattedFromDate || null,
  ToDate: formattedToDate || null,
  IsReverted: false,
});
const filterChanged = ref(false);
const cashFlowRecords = ref<ICashFlowRecords[]>([]);
const selectedRecord = ref<{ selectedData: ICashFlowRecords }>({
  selectedData: {} as ICashFlowRecords,
});
const filteredRows = ref<ICashFlowRecords[]>([]);
function setFilteredData() {
  filterChanged.value = true;
  filterChanged.value = true;
  filteredRows.value = cashFlowRecords.value.filter((row) => {
    const receiverMatch = row.sourceUserName
      .toLowerCase()
      .includes(filter.value.receiver.toLowerCase().trim());
    const senderMatch = row.targetUserName
      .toLowerCase()
      .includes(filter.value.sender.toLowerCase().trim());
    return receiverMatch && senderMatch;
  });
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData, { deep: true });
watch(cashFlowRecords, setFilteredData);
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((item) => item === null)) return;
  filterSearch.value = {
    FromDate: null,
    ToDate: null,
    IsReverted: false,
  };
  getCashFlowRecords();
};
const selectedRowData = ref<ICashFlowRecords | null>(null);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 1000000,
  rowsNumber: 0,
  IsReverted: true,
});
const handleShowCashFlow = (selectedRow: ICashFlowRecords) => {
  selectedRowData.value = selectedRow;
  isPreviewCashFlowModalVisible.value = true;
};
const apiController = ref<AbortController | null>(null);
onMounted(() => {
  getCashFlowRecords();
});
const handleUndoCashFlow = async (selectedRow: ICashFlowRecords) => {
  selectedRecord.value.selectedData = selectedRow;
  showUndoCashFlowModal.value = true;
};
const handleAddNewFlow = async (selectedRow: ICashFlowRecords) => {
  try {
    const res = await CreateTransaction({
      sourceUserId: selectedRow.targetUserId ?? -1,
      amount: selectedRow.amount,
      cashFlowId: selectedRow.cashFlowId,
      targetUserId: selectedRow.sourceUserId ?? -1,
      comments: 'Amount Reverted',
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      isLoading.value = false;
      await getCashFlowRecords();
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Add Cash Flow';
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
  showUndoCashFlowModal.value = false;
};
const getCashFlowRecords = async (data?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (filterChanged.value) return;
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
    const res = await GetCashFlowList(
      {
        filterSearch: filterSearch.value,
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
        IsReverted: filterSearch.value.IsReverted,
      },
      apiController.value
    );
    if (res?.data) {
      cashFlowRecords.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred fetching Cash Flow List';
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
const calculateTotal = (columnName: keyof (typeof filteredRows.value)[0]) => {
  return filteredRows.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
</script>
