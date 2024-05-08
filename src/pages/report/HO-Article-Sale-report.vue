<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">HO Article Sale Report</span>
      <download-pdf-excel
        @downloadPdfData="downloadPdfData"
        @downloadCSVData="downloadCSVData"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        style="min-width: 240px"
        outlined
        use-input
        @filter="filterFr"
        v-model="filterSearch.purchaseFromCustomerGroup"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="filterSearch.purchaseFromCustomerGroup"
        :loading="isLoading"
        label="Sel. Purchase from user cat."
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
        style="min-width: 200px; max-width: 210px"
        clearable
        use-input
        @filter="filterFn"
        v-model="filterSearch.purchaseFromCustomer"
        @update:model-value="filterSearch.purchaseFromCustomer"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="Sel. Purchase from user"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 240px"
        outlined
        clearable
        use-input
        @filter="filterFr"
        v-model="filterSearch.saleToCustomerGroup"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="filterSearch.saleToCustomerGroup"
        :loading="isLoading"
        label="Sel. Sale to user Cat."
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
        clearable
        style="min-width: 200px; max-width: 210px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.saleToCustomer"
        @update:model-value="filterSearch.saleToCustomer"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="Sel. Sale to user"
        color="btn-primary"
      />
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        use-input
        dense
        map-options
        clearable
        multiple
        outlined
        :options="articleList"
        v-model="filterSearch.ProductId"
        @filter="handleFilterArticles"
        :loading="isFetchingArticleList"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        option-value="productId"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
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
      <div class="q-gutter-sm">
        <q-radio
          v-model="filterSearch.sortByQty"
          color="btn-primary"
          val="true"
          label="Sort by Qty"
        />
        <q-radio
          v-model="filterSearch.sortByQty"
          color="btn-primary"
          val="false"
          label="Sort by article"
        />
      </div>
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          unelevated
          @click="getUserOutStandingBalanceReportList()"
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
        :rows="reportData"
        :columns="HOArticleReportColumn"
        :pagination="{ rowsPerPage: 0 }"
        :rows-per-page-options="[0]"
        ><template v-slot:body-cell-image="props">
          <q-td :props="props">
            <div
              class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
              :class="props.row.image ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.image || 'assets/default-image.png'"
                alt="img"
              />
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
  </div>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { date, exportFile, useQuasar } from 'quasar';
import {
  IArticleData,
  ICustomerListResponse,
  IHOArticleReportData,
  IUserResponse,
} from 'src/interfaces';
import { GetArticleList, GetCustomerGroupList, GetUsers } from 'src/services';
import { GetHOArticleSaleReport, wrapCsvValue } from 'src/services/reports';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { processTableItems } from 'src/utils/process-table-items';
import { HOArticleReportColumn } from 'src/utils/reports';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const tableItems = ref<ITableItems[][]>([]);
const articleList = ref<IArticleData[]>([]);
const reportData = ref<IHOArticleReportData[]>([]);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { date: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const options = ref<IUserResponse[]>([]);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const isFetchingArticleList = ref(false);
const UserList = ref<IUserResponse[]>([]);
const filterSearch = ref<{
  purchaseFromCustomerGroup: null | ICustomerListResponse;
  purchaseFromCustomer: null | IUserResponse;
  saleToCustomerGroup: null | ICustomerListResponse;
  saleToCustomer: null | IUserResponse;
  includeZeroBalance: boolean;
  startDate: null | string;
  endDate: null | string;
  sortByQty: string;
  ProductId: IArticleData[];
}>({
  purchaseFromCustomerGroup: null,
  purchaseFromCustomer: null,
  saleToCustomerGroup: null,
  saleToCustomer: null,

  includeZeroBalance: false,
  startDate: formattedFromDate,
  endDate: formattedToDate,
  sortByQty: 'true',
  ProductId: [],
});

onMounted(() => {
  getCustomerListOption();
  getUserList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});

async function getCustomerListOption() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await GetCustomerGroupList({ status: 'Active' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupList.value = res?.data;
    }
    isLoading.value = false;
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
    isLoading.value = false;
  }
}

const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
const filterFr = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    customerGroupList.value = customerGroupList.value.filter((v) =>
      v.name?.toLowerCase().includes(needle)
    );
  });
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    purchaseFromCustomerGroup: null,
    purchaseFromCustomer: null,
    saleToCustomerGroup: null,
    saleToCustomer: null,
    includeZeroBalance: false,
    startDate: formattedFromDate,
    endDate: formattedToDate,
    sortByQty: 'true',
    ProductId: [],
  };
  getUserOutStandingBalanceReportList();
};

const getUserOutStandingBalanceReportList = async () => {
  if (isLoading.value) return;
  if (!filterSearch.value.startDate || !filterSearch.value.endDate) {
    let message = 'Please select date range';
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
    return;
  }
  isLoading.value = true;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetHOArticleSaleReport(
      {
        purchaseFromCustomer:
          filterSearch.value.purchaseFromCustomer?.customerGroupId ?? 0,
        purchaseFromCustomerGroup:
          filterSearch.value.purchaseFromCustomerGroup?.customerGroupId ?? 0,
        saleToCustomer: filterSearch.value.saleToCustomer?.userId ?? 0,
        saleToCustomerGroup:
          filterSearch.value.saleToCustomerGroup?.customerGroupId ?? 0,
        sortByQty: filterSearch.value.sortByQty === 'true' ? true : false,
        startDate: filterSearch.value.startDate,
        endDate: filterSearch.value.endDate,
        productIds: filterSearch.value.ProductId.map(
          (product) => product.productId
        ).join(','),
      },
      apiController.value
    );
    if (res?.data) {
      reportData.value = res.data?.list;
      tableItems.value = await convertArrayToPdfData(res.data?.list);
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
const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await GetArticleList({
      PageNumber: 1,
      PageSize: 1000000,
      Status: 'Active',
      Name: productName,
    });
    if (res.type === 'Success') {
      if (res.data) {
        articleList.value = res.data.items;
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
  isFetchingArticleList.value = false;
};
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items.filter((x) => x.roleName === 'Customer');
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
async function convertArrayToPdfData(array: IHOArticleReportData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = ['Product', 'Image', 'Quantity', 'Amount'];
  tableStuff.push(headerRow);

  array.forEach((item: IHOArticleReportData) => {
    const row = [
      { text: item.product },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.quantity },
      { text: item.amount },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
async function downloadPdfData() {
  const headers: IPdfHeaders[] = [
    {
      heading: 'Purchase From User Category',
      content: filterSearch.value.purchaseFromCustomerGroup?.name,
    },
    {
      heading: 'Purchase From User',
      content: filterSearch.value.purchaseFromCustomer?.fullName,
    },
    {
      heading: 'Sale To User Category',
      content: filterSearch.value.saleToCustomerGroup?.name,
    },
    {
      heading: 'Sale To User',
      content: filterSearch.value.saleToCustomer?.fullName,
    },
    {
      heading: 'From Date',
      content: moment(filterSearch?.value?.startDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'End Date',
      content: moment(filterSearch?.value?.endDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'Article',
      content:
        filterSearch.value.ProductId && filterSearch.value.ProductId.length > 0
          ? filterSearch.value.ProductId[0].name
          : '',
    },
  ];
  const myFileName = `HO-Article-Sale-report-${moment(
    filterSearch?.value?.startDate
  ).format('DD/MM/YYYY')}-${moment(filterSearch?.value?.endDate).format(
    'DD/MM/YYYY'
  )}.pdf`;
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    title: '',
  });
}

const downloadCSVData = () => {
  const selectedColumnsData = HOArticleReportColumn.filter(
    (col) => col.name !== 'image'
  );
  const content = [selectedColumnsData.map((col) => wrapCsvValue(col.label))]
    .concat(
      reportData.value.map((row: any) =>
        selectedColumnsData
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status = exportFile(
    `HO-Article-Sale-report-${moment(filterSearch?.value?.startDate).format(
      'DD/MM/YYYY'
    )}-${moment(filterSearch?.value?.endDate).format('DD/MM/YYYY')}.csv`,
    content,
    'text/csv'
  );

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>
