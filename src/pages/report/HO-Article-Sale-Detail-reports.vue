<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">HO Article Sale Detail Reports</span>
      <q-btn
        color="btn-primary"
        class="mb-2"
        unelevated
        label="Download PDF"
        @click="downloadPdfData"
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
        v-model="filterSearch.ProductId"
        @update:model-value="filterSearch.ProductId"
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
            filterSearch.ProductId !== null && filterSearch.ProductId < 0
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
      >
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { date, QSelect, useQuasar } from 'quasar';
import { IArticleData, IHOSaleDetailReportData } from 'src/interfaces';
import { articleListApi } from 'src/services';
import { HOSaleDetailReportListApi } from 'src/services/reports';
import { downloadPdf, isPosError, ITableHeaders, ITableItems } from 'src/utils';
import { processTableItems } from 'src/utils/process-table-items';
import { HOArticleSaleDetailReportColumn } from 'src/utils/reports';
import { onUnmounted, ref } from 'vue';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const articleList = ref<IArticleData[]>([]);
const reportData = ref<IHOSaleDetailReportData[]>([]);
const timeStamp = Date.now();
const isFetchingArticleList = ref(false);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const productSelectInputRef = ref<QSelect | null>(null);
const formattedFromDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const tableItems = ref<ITableItems[][]>([]);
const filterSearch = ref<{
  ProductId: null | IArticleData;
  startDate: null | string;
  endDate: null | string;
}>({
  ProductId: null,
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
  if (productSelectInputRef.value) {
    productSelectInputRef.value.blur();
  }
};
const getArticleList = async (productName?: string) => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({
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
async function convertArrayToPdfData(array: IHOSaleDetailReportData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }

  const tableStuff = [];
  const headerRow = ['User', 'Amount', 'Quantity', 'Date'];
  tableStuff.push(headerRow);
  // const totalAmount = array.reduce(
  //   (total, row: IHOSaleDetailReportData ) => {
  //     if (row.totalAmount) {
  //       return total + row.totalAmount ?? 0;
  //     }
  //     return total;
  //   },
  //   0
  // );
  // const footerRow = [
  //   {
  //     text: 'Total',
  //     margin: 5,
  //   },
  //   '',
  //   {
  //     text: `${saleGenerationTotalQuantity.value}`,
  //     margin: [0, 5],
  //   },
  //   '',
  //   { text: `${totalAmount}`, margin: 5 },
  // ];

  array.forEach((item: IHOSaleDetailReportData) => {
    const row = [
      {
        text: item.user,
      },
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
      heading: 'Product',
      content: filterSearch.value.ProductId?.name,
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
  const fileTitle = 'HO Article Sale Detail Reports';
  const myFileName = `HO-Article-Sale-Detail-Reports-${moment(
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

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    ProductId: null,
    startDate: null,
    endDate: null,
  };
  getReceiptList();
};

const getReceiptList = async () => {
  if (isLoading.value) return;
  if (
    !filterSearch.value.ProductId?.productId ||
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
    const res = await HOSaleDetailReportListApi(
      {
        ToDate: filterSearch.value.endDate,
        FromDate: filterSearch.value.startDate,
        ProductId: filterSearch.value.ProductId.productId,
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
</script>
