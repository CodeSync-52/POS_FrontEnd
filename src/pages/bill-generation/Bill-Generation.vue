<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:items-center sm:justify-center sm:flex-col sm:gap-4 md:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.CustomerGroupId"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.CustomerGroupId = $event.customerGroupId
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
        v-model="filterSearch.userId"
        @update:model-value="filterSearch.userId = $event.userId"
        use-input
        @filter="filterFn"
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
        v-model="filterSearch.billStatus"
        :options="billStatusOptions"
        label="Status"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.userName"
        outlined
        maxlength="250"
        style="min-width: 200px"
        label="Name"
        autofocus
        @keyup.enter="getBillList()"
        dense
        color="btn-primary"
      />
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
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
          @click="getBillList()"
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
        :rows="billGenerationData"
        :columns="billGenerationColumn"
        row-key="billId"
        :loading="isLoading"
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        hide-bottom
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
                class="hover:text-btn-primary"
                @click="
                  router.push(`/bill-generation/${props.row.billId}/edit-bill`)
                "
              >
                <q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit Bill
                </q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                icon="visibility"
                color="green"
                @click="
                  router.push(`/bill-generation/${props.row.billId}/preview`)
                "
                ><q-tooltip class="bg-green" :offset="[10, 10]">
                  Preview Bill
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Update
                  ) &&
                  props.row.billStatus !== 'Cancelled' &&
                  props.row.billStatus !== 'Completed' &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 365 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
                "
                size="sm"
                flat
                unelevated
                dense
                color="green"
                icon="check"
                @click="handleGenerateBillPopup(props.row)"
              >
                <q-tooltip class="bg-green" :offset="[10, 10]">
                  Complete Bill
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.BillGeneration,
                    EActionPermissions.Delete
                  ) &&
                  props.row.billStatus !== 'Cancelled' &&
                  props.row.billStatus !== 'Completed' &&
                  authStore.loggedInUser?.rolePermissions.roleName ===
                    EUserRoles.SuperAdmin.toLowerCase() &&
                  moment(
                    date.addToDate(props.row.createdDate, { date: 365 })
                  ).format('YYYY-MM-DD') >
                    moment(timeStamp).format('YYYY-MM-DD')
                "
                size="sm"
                flat
                unelevated
                dense
                color="red"
                icon="cancel"
                @click="handleCancelBillPopup(props.row)"
                ><q-tooltip class="bg-red" :offset="[10, 10]">
                  Cancel Bill
                </q-tooltip>
              </q-btn>
              <q-btn
                size="md"
                flat
                unelevated
                dense
                color="btn-primary"
                icon="download"
                @click="getBillDetailInfo(props.row.billId)"
                ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                  Download Pdf
                </q-tooltip>
              </q-btn>
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
        <template v-slot:bottom-row>
          <q-tr class="sticky bottom-0 bg-white">
            <q-td colspan="3" class="text-bold"> Total </q-td>
            <q-td colspan="3" class="text-bold">
              {{ calculateTotal('totalAmount') }}
            </q-td>
          </q-tr>
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
    <q-dialog v-model="isPdfLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { isPosError, billGenerationColumn, billStatusOptions } from 'src/utils';
import GenerateOrCancelBillModal from 'src/components/bill-generation/Generate-Or-Cancel-Bill-Modal.vue';
import { processTableItems } from 'src/utils/process-table-items';
import {
  getRoleModuleDisplayName,
  EActionPermissions,
  EUserModules,
  IBillGenerationData,
  IBillFilter,
  IUserResponse,
  EUserRoles,
  ICustomerListResponse,
  IBillData,
  IBillProductList,
} from 'src/interfaces';
import {
  GetBillList,
  CancelBill,
  CompleteBill,
  GetCustomerGroupList,
  GetUsers,
  GetBillBasicInfo,
} from 'src/services';
import {
  IPdfFooters,
  ITableItems,
  downloadPdf,
  IPdfHeaders,
} from 'src/utils/pdf-make/pdf-make';
import { CanceledError } from 'axios';
import { date } from 'quasar';
import moment from 'moment';
const authStore = useAuthStore();
const router = useRouter();
const billGenerationData = ref<IBillGenerationData[]>([]);
const tableItems = ref<string[][]>([]);
const pageTitle = getRoleModuleDisplayName(EUserModules.BillGeneration);
const isLoading = ref(false);
const isPdfLoader = ref(false);
const $q = useQuasar();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 1000000,
  rowsNumber: 0,
});
const isCancel = ref(false);
const isCancelOrGenerateBillModalVisible = ref(false);
const selectedRowData = ref<IBillGenerationData | null>(null);
const apiController = ref<AbortController | null>(null);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Days = date.subtractFromDate(timeStamp, { date: 30 });
const formattedFromDate = date.formatDate(past30Days, 'YYYY-MM-DD');
const isCustomerGroupListLoading = ref(false);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const billGenerationDetailsInfoData = ref<IBillData>({
  billId: 0,
  billStatus: '',
  createdDate: '',
  fullName: '',
  productList: [],
  outStandingBalance: 0,
  totalAmount: 0,
  claim: 0,
  freight: 0,
  comments: '',
  stockReceivingDate: '',
});
const filterSearch = ref<IBillFilter>({
  userId: null,
  userName: null,
  ToDate: formattedToDate,
  FromDate: formattedFromDate,
  billStatus: null,
  CustomerGroupId: null,
});
onMounted(() => {
  getBillList();
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
const resetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    userId: null,
    userName: null,
    ToDate: null,
    FromDate: null,
    billStatus: null,
    CustomerGroupId: null,
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
    const res = await CompleteBill(id);
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
    const res = await CancelBill(id);
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
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;

    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetBillList(
      {
        PageNumber: pagination.value.page,
        PageSize: rowsPerPage,
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
  columnName: keyof (typeof billGenerationData.value)[0]
) => {
  return billGenerationData.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
const getBillDetailInfo = async (BillId: number) => {
  try {
    const res = await GetBillBasicInfo(BillId);
    if (res.type === 'Success') {
      if (res.data) {
        billGenerationDetailsInfoData.value = res.data;
        billGenerationDetailsInfoData.value.createdDate = moment(
          res.data.createdDate
        ).format('YYYY-MM-DD');
        billGenerationDetailsInfoData.value.stockReceivingDate = moment(
          res.data.stockReceivingDate
        ).format('YYYY-MM-DD');
        tableItems.value = await convertArray(res.data.productList);
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Fetching bill details';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  } finally {
    downloadPdfData(BillId);
  }
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
async function convertArray(array: IBillProductList[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];

  const netQuantity = array.reduce((total: number, row: IBillProductList) => {
    if (row.quantity) {
      return total + row.quantity;
    }
    return total;
  }, 0);

  const headerRow = [
    'Row#',
    'Image',
    'Article',
    'Quantity',
    'Item Score',
    'Total',
  ];
  tableStuff.push(headerRow);
  const claimAmount = [
    '',
    '',
    '',
    '',
    'Claim:',
    `${billGenerationDetailsInfoData.value.claim}`,
  ];
  const freightAmount = [
    '',
    '',
    '',
    '',
    'Freight:',
    `${billGenerationDetailsInfoData.value.freight}`,
  ];
  const qtyRow = ['', '', '', '', 'Quantity:', `${netQuantity}`];
  const footerRow = [
    '',
    '',
    '',
    '',
    'Net Total:',
    `${billGenerationDetailsInfoData.value.totalAmount}`,
  ];
  array.forEach((item: IBillProductList, index: number) => {
    const randomTextBeforeAmount = generateRandomAlphaNumeric(3); // Generate 3-character random string
    const randomTextAfterAmount = generateRandomAlphaNumeric(3); // Generate 3-character random string

    const row = [
      {
        text: index + 1,
      },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.name, margin: [0, 20] },
      { text: item.quantity, bold: true, margin: [0, 20] },
      {
        text: randomTextBeforeAmount + item.amount + randomTextAfterAmount,
        margin: [0, 20],
      },
      { text: item.amount * item.quantity, margin: [0, 20] },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(claimAmount, freightAmount, qtyRow, footerRow);
  return tableStuff;
}
function generateRandomAlphaNumeric(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function downloadPdfData(BillId: number) {
  isPdfLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: 'Bill Id',
      content: BillId,
    },
    {
      heading: 'Status',
      content: billGenerationDetailsInfoData.value.billStatus,
    },
    {
      content: billGenerationDetailsInfoData.value.fullName,
    },
    {
      heading: 'Bill Date',
      content: billGenerationDetailsInfoData.value.createdDate,
    },
    {
      heading: 'Purchase Date',
      content: billGenerationDetailsInfoData.value.stockReceivingDate,
    },
  ];
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );

  const footers: IPdfFooters[] = [
    {
      heading: 'Outstanding Balance',
      content: billGenerationDetailsInfoData.value.outStandingBalance,
    },
    {
      heading: 'Comments',
      content: billGenerationDetailsInfoData.value.comments,
    },
  ];
  const myFileName = 'Bill.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    pdfFooters: footers,
    title: '',
  });
  isPdfLoader.value = false;
}
</script>
