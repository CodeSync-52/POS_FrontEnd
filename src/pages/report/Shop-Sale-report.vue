<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Date Wise Shop Sale Report</span>
    <download-pdf-excel
      @downloadPdfData="downloadPdfData"
      @downloadCSVData="downloadCSVData"
    />
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      style="min-width: 200px"
      outlined
      map-options
      :options="shopData"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
      v-model="selectedShop"
      popup-content-class="!max-h-[200px]"
      label="Select Shop"
      color="btn-primary"
      multiple
      clearable
      option-label="name"
      option-value="shopId"
    />
    <q-input
      v-model="filterSearch.fromDate"
      :max="filterSearch.toDate"
      label="From"
      type="date"
      style="min-width: 200px"
      outlined
      dense
      color="btn-primary"
    />
    <q-input
      v-model="filterSearch.toDate"
      :min="filterSearch.fromDate"
      label="To"
      type="date"
      style="min-width: 200px"
      outlined
      color="btn-primary"
      dense
    />
    <div class="flex lg:justify-end sm:justify-center items-end gap-2">
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
        icon="search"
        label="Search"
        @click="searchShopSaleReport()"
      />
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
        label="Clear"
        @click="handleResetFilter()"
      />
    </div>
  </div>
  <div
    v-if="reportList.length > 0"
    class="text-[24px] font-bold text-btn-primary pb-1 pr-4"
  >
    Grand Total: {{ grandTotal }}
  </div>
  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="reportList"
      align="left"
      :columns="shopsaleReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="searchShopSaleReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportList.length > 0"
    >
      <template v-slot:no-data>
        <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
          <q-icon name="warning" size="xs" />
          <span class="text-md font-medium"> No data available. </span>
        </div>
      </template>
      <template v-if="reportList.length" v-slot:bottom-row>
        <q-tr class="sticky bottom-0 bg-white">
          <q-td colspan="2" class="text-bold"> Total </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('totalAmount') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('quantity') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('discount') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('netAmount') }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IDateWiseShopReportData,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { shopsaleReportColumn } from 'src/utils/reports';
import { useQuasar, exportFile } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import { GetDateWiseShopSaleReport, wrapCsvValue } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const reportList = ref<IDateWiseShopReportData[]>([]);
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past7Date = date.subtractFromDate(timeStamp, { date: 7 });
const formattedFromDate = date.formatDate(past7Date, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
});

onMounted(async () => {
  await getShopList();
  const defaultShop = shopData.value.find(
    (shop) =>
      shop.shopId === (authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1)
  );
  selectedShop.value = defaultShop ? [defaultShop] : [];
});
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 25,
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
    isFetchingShopList.value = false;
  }
};
const searchShopSaleReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopIds) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select Shop',
      icon: 'error',
      color: 'red',
    });
    return;
  } else if (!filterSearch.value.fromDate || !filterSearch.value.toDate) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select From and To Date',
      icon: 'error',
      color: 'red',
    });
    return;
  }
  try {
    const res = await GetDateWiseShopSaleReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      reportList.value = (res.data as { list: [] }).list;
      tableItems.value = await convertArrayToPdfData(
        (res.data as { list: [] }).list
      );
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
const grandTotal = computed(() => {
  let total = 0;
  reportList.value.forEach((item) => {
    total += item.netAmount;
  });
  return total;
});
const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    selectedShop.value = [];
    reportList.value = [];
    filterSearch.value.fromDate = '';
    filterSearch.value.toDate = '';
  } else {
    reportList.value = [];
    filterSearch.value.fromDate = '';
    filterSearch.value.toDate = '';
  }
};
async function convertArrayToPdfData(array: IDateWiseShopReportData[]) {
  const tableStuff = [];
  const headerRow = [
    'Date',
    'Shop',
    'Total Amount',
    'Total Quantity',
    'Disc',
    'Net Amount',
  ];
  tableStuff.push(headerRow);
  const footerRow = [
    {
      text: 'Total',
      margin: [0, 5],
      bold: true,
    },
    '',
    {
      text: calculateTotal('totalAmount').toString(),
      bold: true,
      margin: [0, 5],
    },
    {
      text: calculateTotal('quantity').toString(),
      bold: true,
      margin: [0, 5],
    },
    { text: calculateTotal('discount').toString(), bold: true, margin: [0, 5] },
    {
      text: calculateTotal('netAmount').toString(),
      bold: true,
      margin: [0, 5],
    },
  ];
  array.forEach((item: IDateWiseShopReportData) => {
    const row = [
      { text: moment(item.transactionDate).format('DD/MM/YYYY') },
      { text: item.shop },
      { text: item.totalAmount },
      { text: item.quantity },
      { text: item.discount },
      { text: item.netAmount },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(footerRow);
  return tableStuff;
}
async function downloadPdfData() {
  const headers: IPdfHeaders[] = [
    {
      heading: '',
      content: '',
    },
    {
      heading: '',
      content: '',
    },
    {
      heading: 'From Date',
      content: moment(filterSearch?.value?.fromDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'End Date',
      content: moment(filterSearch?.value?.toDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'Shop Name',
      content: selectedShop.value?.map((shop) => shop.name).join(','),
    },
    {
      heading: 'Grand Total',
      content: grandTotal.value,
    },
  ];
  const myFileName = `Shop-Sale-report-${moment(
    filterSearch?.value?.fromDate
  ).format('DD/MM/YYYY')}-${moment(filterSearch?.value?.toDate).format(
    'DD/MM/YYYY'
  )}.pdf`;
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    title: 'Date Wise Shop Sale Report',
  });
}
const downloadCSVData = () => {
  const content = [shopsaleReportColumn.map((col) => wrapCsvValue(col.label))]
    .concat(
      reportList.value.map((row: any) =>
        shopsaleReportColumn
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
    `Shop-Sale-report-${moment(filterSearch?.value?.fromDate).format(
      'DD/MM/YYYY'
    )}-${moment(filterSearch?.value?.toDate).format('DD/MM/YYYY')}.csv`,
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
const calculateTotal = (columnName: keyof (typeof reportList.value)[0]) => {
  return reportList.value.reduce(
    (total, row) => total + Number(row[columnName]),
    0
  );
};
</script>
