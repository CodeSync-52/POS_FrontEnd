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
        unelevated
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
        style="min-width: 200px; max-width: 200px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        :options="options"
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
        style="min-width: 200px"
        v-model="filterSearch.purchaseStatus"
        :options="purchaseStatusOptions"
        label="Status"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.userName"
        maxlength="250"
        outlined
        label="Name"
        autofocus
        @keyup.enter="getReceiptList()"
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
          unelevated
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getReceiptList()"
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
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="receiptData"
        :columns="receiptColumn"
        v-model:pagination="pagination"
        @request="getReceiptList"
      >
        <template v-slot:body-cell-fullName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.fullName }}
          </q-td>
        </template>
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
              >
                <q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Receipt
                </q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                flat
                dense
                unelevated
                icon="visibility"
                color="green"
                @click="router.push(`/receipt/${props.row.purchaseId}/preview`)"
                ><q-tooltip class="bg-green" :offset="[10, 10]">
                  Preview Receipt
                </q-tooltip></q-btn
              >
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Create
                  ) &&
                  props.row.purchaseStatus !== 'Cancelled' &&
                  props.row.purchaseStatus !== 'Billed' &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 365 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
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
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Generate Bill
                </q-tooltip></q-btn
              >
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.ReceiptManagement,
                    EActionPermissions.Update
                  ) &&
                  props.row.purchaseStatus !== 'Cancelled' &&
                  props.row.purchaseStatus !== 'Billed' &&
                  authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase() &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 365 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
                "
                size="sm"
                flat
                dense
                unelevated
                icon="cancel"
                color="red"
                @click="handleCancelReceiptPopup(props.row)"
                ><q-tooltip class="bg-red" :offset="[10, 10]">
                  Cancel Receipt
                </q-tooltip></q-btn
              >
              <q-btn
                size="md"
                flat
                dense
                unelevated
                icon="download"
                color="btn-primary"
                @click="getReceiptDataFromApi(props.row.purchaseId)"
                ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                  Download Pdf
                </q-tooltip></q-btn
              >
            </div>
          </q-td>
          <q-td v-else />
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
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
    <q-dialog v-model="isLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { CanceledError } from 'axios';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
  IReceiptData,
  IPagination,
  IUserResponse,
  EUserRoles,
  ICustomerListResponse,
  ISelectedArticleData,
} from 'src/interfaces';
import { useAuthStore } from 'src/stores';
import {
  GetPurchaseList,
  CancelPurchase,
  GetUsers,
  GetCustomerGroupList,
  GetPurchaseDetail,
} from 'src/services';
import {
  isPosError,
  receiptColumn,
  purchaseStatusOptions,
  IPdfFooters,
  IPdfHeaders,
  ITableItems,
  downloadPdf,
} from 'src/utils';
import { processTableItems } from 'src/utils/process-table-items';
import moment from 'moment';
const authStore = useAuthStore();
const $q = useQuasar();
const pageTitle = getRoleModuleDisplayName(EUserModules.ReceiptManagement);
const isLoading = ref(false);
const router = useRouter();
const receiptData = ref<IReceiptData[]>([]);
const sTRPdf = ref<IReceiptData>({
  purchaseId: 0,
  userId: 0,
  fullName: '',
  totalQuantity: 0,
  purchaseStatus: '',
  createdDate: '',
  createdBy: '',
  outStandingBalance: 0,
  updatedDate: '',
  createdById: 0,
  comments: '',
  updatedBy: null,
  purchaseDetails: [],
});
const tableItems = ref<ITableItems[][]>([]);
const isCancelReceiptModalVisible = ref(false);
const isLoader = ref(false);
const selectedRowData = ref<IReceiptData | null>(null);
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
  rowsNumber: 0,
};

const pagination = ref<IPagination>(defaultPagination);
const isCancellingReceipt = ref(false);
const apiController = ref<AbortController | null>(null);
const timeStamp = Date.now();

const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { date: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const filterSearch = ref<{
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  purchaseStatus: null | string;
  customerGroupId: null | number;
}>({
  userId: null,
  userName: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
  purchaseStatus: 'Open',
  customerGroupId: null,
});
watch(
  () => ({
    userName:
      filterSearch.value.userName != null ? filterSearch.value.userName : '',
    userId:
      filterSearch.value.userId !== null
        ? filterSearch.value.userId.toString()
        : '',
    customerGroupId:
      filterSearch.value.customerGroupId !== null
        ? filterSearch.value.customerGroupId.toString()
        : '',
    purchaseStatus:
      filterSearch.value.purchaseStatus != null
        ? filterSearch.value.purchaseStatus
        : '',
    startDate:
      filterSearch.value.startDate !== null
        ? filterSearch.value.startDate.toString()
        : '',
    endDate:
      filterSearch.value.endDate !== null
        ? filterSearch.value.endDate.toString()
        : '',
  }),
  ({
    userName,
    customerGroupId,
    purchaseStatus,
    startDate,
    endDate,
    userId,
  }) => {
    localStorage.setItem('receiptSearchName', userName);
    localStorage.setItem('receiptSearchCustomerGroupId', customerGroupId);
    localStorage.setItem('receiptSearchPurchaseStatus', purchaseStatus);
    localStorage.setItem('receiptStartDate', startDate);
    localStorage.setItem('receiptEndDate', endDate);
    localStorage.setItem(
      'receiptSearchUserId',
      userId !== null ? userId.toString() : ''
    );
  }
);

onMounted(() => {
  const savedName = localStorage.getItem('receiptSearchName');
  const savedCustomerGroupId = localStorage.getItem(
    'receiptSearchCustomerGroupId'
  );
  const savedPurchaseStatus = localStorage.getItem(
    'receiptSearchPurchaseStatus'
  );
  const savedStartDate = localStorage.getItem('receiptStartDate');
  const savedEndDate = localStorage.getItem('receiptEndDate');
  const savedUserId = localStorage.getItem('receiptSearchUserId');
  if (savedName) {
    filterSearch.value.userName = savedName;
  }
  if (savedCustomerGroupId) {
    filterSearch.value.customerGroupId = parseInt(savedCustomerGroupId);
  }
  if (savedPurchaseStatus) {
    filterSearch.value.purchaseStatus = savedPurchaseStatus;
  }
  if (savedStartDate) {
    filterSearch.value.startDate = savedStartDate;
  }
  if (savedEndDate) {
    filterSearch.value.endDate = savedEndDate;
  }
  if (savedUserId) {
    filterSearch.value.userId = parseInt(savedUserId, 10);
  }
});
onMounted(() => {
  getReceiptList();
  getUserList();
  getCustomerListOption();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const UserList = ref<IUserResponse[]>([]);
const options = ref<IUserResponse[]>([]);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 500,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active'
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
    customerGroupId: null,
  };
  localStorage.removeItem('receiptSearchName');
  getReceiptList();
};
const handleAddNewReceipt = () => {
  router.push('/receipt/add-new');
};
const handleCancelReceiptPopup = (selectedRow: IReceiptData) => {
  selectedRowData.value = selectedRow;
  isCancelReceiptModalVisible.value = true;
};
const isCustomerGroupListLoading = ref(false);
const handleCancelReceipt = async () => {
  if (isCancellingReceipt.value) return;
  isCancellingReceipt.value = true;
  try {
    const res = await CancelPurchase(selectedRowData.value?.purchaseId ?? -1);
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
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetPurchaseList(
      {
        ToDate: filterSearch.value.endDate,
        FromDate: filterSearch.value.startDate,
        UserId: filterSearch.value.userId,
        FullName: filterSearch.value.userName?.trim() ?? '',
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
        PurchaseStatus: filterSearch.value.purchaseStatus,
        customerGroupId: filterSearch.value.customerGroupId,
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
const getReceiptDataFromApi = async (selectedItemId: string | number) => {
  await GetPurchaseDetail(selectedItemId).then(async (res) => {
    sTRPdf.value = res.data;
    tableItems.value = await convertArrayToPdfData(res.data.purchaseDetails);
  });
  downloadPdfData(selectedItemId);
};
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
async function convertArrayToPdfData(array: ISelectedArticleData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = ['Row#', 'Image', 'Article', 'Quantity'];
  tableStuff.push(headerRow);
  const netQuantity = array.reduce(
    (total: number, row: ISelectedArticleData) => {
      if (row.quantity) {
        return total + row.quantity;
      }
      return total;
    },
    0
  );
  const footerRow = [
    '',
    '',
    '',
    { text: `Total Quantity: ${netQuantity}`, margin: 5 },
  ];
  array.forEach((item: ISelectedArticleData, index: number) => {
    const row = [
      {
        text: index + 1,
      },
      {
        image: item.productImage || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.productName, margin: [0, 20] },
      { text: item.quantity, bold: true, margin: [0, 20] },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(footerRow);

  return tableStuff;
}
async function downloadPdfData(selectedItemId: string | number) {
  isLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: 'Receipt Id',
      content: selectedItemId,
    },
    {
      heading: 'Status',
      content: sTRPdf.value.purchaseStatus,
    },
    {
      content: sTRPdf.value.fullName,
    },
    {
      heading: 'Date',
      content: moment(sTRPdf.value.createdDate).format('DD-MM-YYYY'),
    },
  ];

  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );

  const footers: IPdfFooters[] = [
    {
      heading: 'Comments',
      content: sTRPdf.value.comments,
    },
  ];

  const myFileName = 'Receipt.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    pdfFooters: footers,
    title: '',
  });
  isLoader.value = false;
}
</script>
