<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium"
        >HO Article Purchase Detail Reports</span
      >
      <download-pdf-excel
        @downloadPdfData="downloadPdfData"
        @downloadCSVData="downloadCSVData"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        popup-content-class="!max-h-[200px]"
        class="min-w-[220px]"
        ref="productSelectInputRef"
        dense
        autofocus
        use-input
        map-options
        outlined
        @filter="handleFilterArticles"
        :options="articleList"
        :loading="isFetchingArticleList"
        v-model="filterSearch.articleData"
        @update:model-value="filterSearch.articleData"
        label="Select Product"
        color="btn-primary"
        option-label="name"
        @popup-hide="handlePopupShow"
        option-value="productId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >

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
          :disable="
            filterSearch.articleData !== null &&
            filterSearch.articleData.productId < 0
          "
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
        :rows="reportData"
        :columns="HOArticleSaleDetailReportColumn"
        :pagination="{ rowsPerPage: 0 }"
        :rows-per-page-options="[0]"
      >
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
import { date, QSelect, useQuasar, exportFile } from 'quasar';
import moment from 'moment';
import { IArticleData, IHOSaleDetailReportData } from 'src/interfaces';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import { GetArticleList } from 'src/services';
import {
  GetHOPurchaseDetailReport,
  wrapCsvValue,
} from 'src/services/reports';
import { isPosError, ITableHeaders, ITableItems, downloadPdf } from 'src/utils';
import { HOArticleSaleDetailReportColumn } from 'src/utils/reports';
import { onUnmounted, ref } from 'vue';
const tableItems = ref<ITableItems[][]>([]);
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const articleList = ref<IArticleData[]>([]);
const reportData = ref<IHOSaleDetailReportData[]>([]);
const timeStamp = Date.now();
const isFetchingArticleList = ref(false);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { date: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const productSelectInputRef = ref<QSelect | null>(null);
const filterSearch = ref<{
  articleData: null | IArticleData;
  startDate: null | string;
  endDate: null | string;
}>({
  articleData: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
});

onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});

const handleFilterArticles = (value: any, update: CallableFunction) => {
  update(() => {
    getArticleList(value);
  });
};
const handlePopupShow = () => {
  // When the popup opens, blur the input
  if (productSelectInputRef.value) {
    productSelectInputRef.value.blur();
  }
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

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    articleData: null,
    startDate: null,
    endDate: null,
  };
  getReceiptList();
};

const getReceiptList = async () => {
  if (isLoading.value) return;
  if (
    !filterSearch.value.articleData ||
    !filterSearch.value.startDate ||
    !filterSearch.value.endDate
  ) {
    let message = 'Please select product and date';
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
    const res = await GetHOPurchaseDetailReport(
      {
        ToDate: filterSearch.value.endDate,
        FromDate: filterSearch.value.startDate,
        ProductId: filterSearch.value.articleData.productId,
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
async function convertArrayToPdfData(array: IHOSaleDetailReportData[]) {
  const tableStuff = [];
  const headerRow = ['User', 'Amount', 'Quantity', 'Date'];
  tableStuff.push(headerRow);
  array.forEach((item: IHOSaleDetailReportData) => {
    const row = [
      { text: item.user },
      { text: item.amount },
      { text: item.quantity },
      { text: moment(item.date).format('DD/MM/YYYY') },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
async function downloadPdfData() {
  const headers: ITableHeaders[] = [
    {
      heading: 'Article',
      content: filterSearch?.value.articleData?.name,
    },
    {
      heading: 'From Date',
      content: moment(filterSearch?.value?.startDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'End Date',
      content: moment(filterSearch?.value?.endDate).format('DD/MM/YYYY'),
    },
  ];
  const fileTitle = 'HO Article Purchase Detail Reports';
  const myFileName = `HO-Article-Purchase-Detail-reports-${moment(
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
    tableHeaders: headers,
    title: fileTitle,
  });
}

const downloadCSVData = () => {
  const content = [
    HOArticleSaleDetailReportColumn.map((col) => wrapCsvValue(col.label)),
  ]
    .concat(
      reportData.value.map((row: any) =>
        HOArticleSaleDetailReportColumn.map((col) =>
          wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format,
            row
          )
        ).join(',')
      )
    )
    .join('\r\n');

  const status = exportFile(
    `HO-Article-Purchase-Detail-reports-${moment(
      filterSearch?.value?.startDate
    ).format('DD/MM/YYYY')}-${moment(filterSearch?.value?.endDate).format(
      'DD/MM/YYYY'
    )}.csv`,
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
