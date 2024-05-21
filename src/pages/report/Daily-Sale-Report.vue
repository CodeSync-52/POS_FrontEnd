<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
  >
    <span class="text-xl font-medium">Daily Sale Report</span>
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
    <q-select
      dense
      style="min-width: 200px"
      outlined
      v-model="filterSearch.showOnlyDiscount"
      :options="IShowOnlyDiscountOptionList"
      map-options
      popup-content-class="!max-h-[200px]"
      label="Show Only Disc"
      option-label="name"
      option-value="statusId"
      color="btn-primary"
    >
    </q-select>
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
        @click="searchDailySaleReport()"
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
      :columns="dailySaleReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="searchDailySaleReport()"
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
            {{ calculateTotal('quantity') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('retailPrice') }}
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
  <q-dialog v-model="isLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IDailySaleReportData,
  IShopResponse,
  EUserRoles,
  IShowOnlyDiscount,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import {
  dailySaleReportColumn,
  IShowOnlyDiscountOptionList,
} from 'src/utils/reports';
import { useAuthStore } from 'src/stores';
import { useQuasar, exportFile } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import { GetDailySaleReport, wrapCsvValue } from 'src/services/reports';
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);
const isLoader = ref(false);
const isFetchingShopList = ref(false);
const timeStamp = Date.now();
const reportList = ref<IDailySaleReportData[]>([]);
const selectedShop = ref<IShopResponse[]>([]);
const shopData = ref<IShopResponse[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const past1Day = date.subtractFromDate(timeStamp, { day: 0 });
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const formattedFromDate = date.formatDate(past1Day, 'YYYY-MM-DD');
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  showOnlyDiscount: IShowOnlyDiscount | number;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  showOnlyDiscount: -1,
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

const searchDailySaleReport = async () => {
  isLoading.value = true;
  const showOnlyDiscountValue =
    typeof filterSearch.value.showOnlyDiscount === 'object'
      ? (filterSearch.value.showOnlyDiscount as IShowOnlyDiscount).statusId
      : (filterSearch.value.showOnlyDiscount as number);
  if (!selectedShop.value?.map((shop) => shop.shopId).join(',')) {
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
    const res = await GetDailySaleReport({
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      showOnlyDiscount: showOnlyDiscountValue,
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
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
async function convertArrayToPdfData(array: IDailySaleReportData[]) {
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
    'Quantity',
    'Retail Price',
    'Discount',
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
    { text: calculateTotal('quantity').toString(), bold: true, margin: [0, 5] },
    {
      text: calculateTotal('retailPrice').toString(),
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
  array.forEach((item: IDailySaleReportData) => {
    const row = [
      { text: item.article },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.quantity },
      { text: item.retailPrice },
      { text: item.discount },
      { text: item.netAmount },
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
      heading: 'Shop Name',
      content: selectedShop.value?.map((shop) => shop.name).join(','),
    },
    {
      heading: 'From Date',
      content: moment(filterSearch?.value?.fromDate).format('DD/MM/YYYY'),
    },
    {
      heading: 'To Date',
      content: moment(filterSearch?.value?.toDate).format('DD/MM/YYYY'),
    },
  ];
  const myFileName = `Daily-Sale-Report-${moment(
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
    title: 'Daily-Sale-Report',
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  const selectedColumnsData = dailySaleReportColumn.filter(
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
    `Daily-Sale-Report-${moment(filterSearch?.value?.fromDate).format(
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
