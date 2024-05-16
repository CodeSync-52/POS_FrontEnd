<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
  >
    <span class="text-xl font-medium">Slow Article Sale Report</span>
    <download-pdf-excel
      @downloadPdfData="downloadPdfData"
      @downloadCSVData="downloadCSVData"
    />
  </div>
  <div
    class="row flex lg:justify-evenly sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <div class="flex items-center gap-2 font-[500] text-base">
      <span>Stock More Than</span>
      <q-input
        v-model="filterSearch.stockQuantity"
        type="number"
        style="max-width: 70px"
        outlined
        dense
        color="btn-primary"
      />
      <span>Quantity</span>
    </div>
    <div class="flex items-center gap-2 font-[500] text-base">
      <span>Article Meaningful Inv Creation Date Greater Than</span>
      <q-input
        v-model="filterSearch.meaningfulInvGreaterThanDays"
        type="number"
        style="max-width: 70px"
        outlined
        dense
        color="btn-primary"
      />
      <span>Days</span>
    </div>
    <div class="flex items-center gap-2 font-[500] text-base">
      <span>Sale Less Than</span>
      <q-input
        v-model="filterSearch.saleLessThanPercentage"
        max="100"
        type="number"
        style="max-width: 70px"
        outlined
        dense
        color="btn-primary"
        @update:model-value="handleUpdatedispatchQuantity($event)"
      />
      <span>%</span>
    </div>
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
      v-model="selectedShop"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
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
        @click="searchSlowArticleSaleReport()"
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
  <div class="py-4">
    <q-table
      :loading="isLoading"
      tabindex="0"
      :rows="reportList"
      align="left"
      :columns="slowArticleSaleReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="searchSlowArticleSaleReport()"
      :pagination="{ rowsPerPage: 0 }"
      :hide-bottom="reportList.length > 0"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <div
            class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
            :class="props.row.image"
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
      <template v-if="reportList.length" v-slot:bottom-row>
        <q-tr class="sticky bottom-0 bg-white">
          <q-td colspan="2" class="text-bold"> Total </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('retailPrice') }}
          </q-td>
          <q-td colspan="3" class="text-bold">
            {{ calculateTotal('totalStock') }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="isLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  ISlowArticleSaleReportData,
  IShopResponse,
  EUserRoles,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { slowArticleSaleReportColumn } from 'src/utils/reports';
import { useAuthStore } from 'src/stores';
import { useQuasar, exportFile } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import { GetSlowArticleSaleReport, wrapCsvValue } from 'src/services/reports';
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);
const isLoader = ref(false);
const isFetchingShopList = ref(false);
const timeStamp = Date.now();
const reportList = ref<ISlowArticleSaleReportData[]>([]);
const selectedShop = ref<IShopResponse[]>([]);
const shopData = ref<IShopResponse[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  saleLessThanPercentage: number;
  meaningfulInvGreaterThanDays: number;
  stockQuantity: number;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  saleLessThanPercentage: 0,
  meaningfulInvGreaterThanDays: 0,
  stockQuantity: 0,
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
const handleUpdatedispatchQuantity = (newVal: string | number | null) => {
  if (typeof newVal === 'string' || typeof newVal === 'number') {
    let val = Number(newVal);
    if (isNaN(val) || val < 0) {
      val = 0;
      $q.notify({
        message: 'Percentage cannot be less than 0!',
        color: 'red',
        icon: 'warning',
      });
    } else if (val > 100) {
      val = 100;
      $q.notify({
        message: 'Percentage cannot be greater than 100!',
        color: 'red',
        icon: 'warning',
      });
    }
    filterSearch.value.saleLessThanPercentage = val;
  }
};
const searchSlowArticleSaleReport = async () => {
  const filters = Object.values(filterSearch.value);
  if (
    filters.some((filter) => !filter) ||
    !selectedShop.value?.map((shop) => shop.shopId).join(',')
  ) {
    $q.notify({
      message: 'All filters are required.',
      color: 'red',
      icon: 'warning',
    });
    return;
  }
  isLoading.value = true;
  try {
    const res = await GetSlowArticleSaleReport({
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      stockQuantity: filterSearch.value.stockQuantity,
      meaningfulInvGreaterThanDays:
        filterSearch.value.meaningfulInvGreaterThanDays,
      saleLessThanPercentage: filterSearch.value.saleLessThanPercentage,
    });
    if (res?.data) {
      reportList.value = res?.data.list;
      tableItems.value = await convertArrayToPdfData(res?.data.list);
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
const handleResetFilter = () => {
  filterSearch.value = {
    fromDate: '',
    toDate: '',
    saleLessThanPercentage: 0,
    meaningfulInvGreaterThanDays: 0,
    stockQuantity: 0,
  };
  reportList.value = [];
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase()
  ) {
    selectedShop.value = [];
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
async function convertArrayToPdfData(array: ISlowArticleSaleReportData[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];
  const headerRow = [
    'Article',
    'Image',
    'Retail Price',
    'Total Stock',
    'Sale Qty',
    'Sale %',
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
      text: calculateTotal('retailPrice').toString(),
      bold: true,
      margin: [0, 5],
    },
    {
      text: calculateTotal('totalStock').toString(),
      bold: true,
      margin: [0, 5],
    },
    '',
    '',
  ];
  array.forEach((item: ISlowArticleSaleReportData) => {
    const row = [
      { text: item.article },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.retailPrice },
      { text: item.totalStock },
      { text: item.saleQuantity },
      { text: item.salePercentage },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(footerRow);
  return tableStuff;
}
async function downloadPdfData() {
  isLoader.value = true;
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
      heading: 'To Date',
      content: moment(filterSearch?.value?.toDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'Shop Name',
      content: selectedShop.value?.map((shop) => shop.name).join(','),
    },
    {
      heading: 'Stock More Than',
      content: `${filterSearch.value.stockQuantity} Quantity`,
    },
    {
      heading: 'Article Meaningful Inv Greater Than',
      content: `${filterSearch.value.meaningfulInvGreaterThanDays} Days`,
    },
    {
      heading: 'Sale Less Than',
      content: `${filterSearch.value.meaningfulInvGreaterThanDays} %`,
    },
  ];
  const myFileName = `Slow-Article-Sale-Report-${moment(
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
    title: 'Slow Article Sale Report',
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  const selectedColumnsData = slowArticleSaleReportColumn.filter(
    (col) => col.name !== 'image'
  );
  const content = [selectedColumnsData.map((col) => wrapCsvValue(col.label))]
    .concat(
      reportList.value.map((row: any) =>
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
    `Slow-Article-Sale-Report-${moment(filterSearch?.value?.fromDate).format(
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
