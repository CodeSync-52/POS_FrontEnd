<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
  >
    <span class="text-xl font-medium">Vendor Sale Stock Report</span>
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
      @filter="filterFn"
      :loading="isLoading"
      :options="userList"
      v-model="filterSearch.user"
      popup-content-class="!max-h-[200px]"
      label="Select User"
      color="btn-primary"
      clearable
      option-label="fullName"
      option-value="userId"
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
        @click="searchVendorSaleStockReport()"
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
      :columns="vendorsalestockReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="searchVendorSaleStockReport()"
      :pagination="{ rowsPerPage: 0 }"
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
    </q-table>
  </div>
  <q-dialog v-model="isLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IUserResponse, IVendorSaleStockReportData } from 'src/interfaces';
import { GetUsers } from 'src/services';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { vendorsalestockReportColumn } from 'src/utils/reports';
import { useQuasar, exportFile } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import { GetVendorSaleStockReport, wrapCsvValue } from 'src/services/reports';
const $q = useQuasar();
const isLoading = ref(false);
const isLoader = ref(false);
const timeStamp = Date.now();
const reportList = ref<IVendorSaleStockReportData[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past2Months = date.subtractFromDate(timeStamp, { month: 2 });
const formattedFromDate = date.formatDate(past2Months, 'YYYY-MM-DD');
const userList = ref<IUserResponse[]>([]);
const filterSearch = ref<{
  user: IUserResponse | null;
  fromDate: string;
  toDate: string;
}>({
  user: null,
  fromDate: formattedFromDate,
  toDate: formattedToDate,
});

onMounted(async () => {
  await getUserList();
});
const getUserList = async () => {
  isLoading.value = true;
  try {
    const res = await GetUsers({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res.data) {
      userList.value = res.data.items.filter(
        (user) =>
          user.status === 'Active' &&
          user.roleName === 'Customer' &&
          user.customerGroup === 'Shoe Makers'
      );
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
  }
  isLoading.value = false;
};
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    userList.value = userList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};
const searchVendorSaleStockReport = async () => {
  isLoading.value = true;
  try {
    const res = await GetVendorSaleStockReport({
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      userId: filterSearch.value.user?.userId ?? -1,
    });
    if (res?.data) {
      reportList.value = res?.data.list;
      tableItems.value = await convertArrayToPdfData(res?.data.list);
    }
  } catch (e) {
    let message = 'Please select shop and date';
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
    user: null,
    fromDate: '',
    toDate: '',
  };
  reportList.value = [];
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
async function convertArrayToPdfData(array: IVendorSaleStockReportData[]) {
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
    'Last Purchase Price',
    'Ho Master Stock',
    'Shop Total Stock',
    'Total Shop Sale',
    'Total WholeSale',
  ];
  tableStuff.push(headerRow);

  array.forEach((item: IVendorSaleStockReportData) => {
    const row = [
      { text: item.article },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.lastPurchasePrice },
      { text: item.hoStock },
      { text: item.shopStock },
      { text: item.shopSaleQty },
      { text: item.hoSaleQty },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
async function downloadPdfData() {
  isLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: 'User',
      content: filterSearch.value.user?.fullName,
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
  const myFileName = `Vendor-Sale-Stock-Report-${moment(
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
    title: '',
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  const selectedColumnsData = vendorsalestockReportColumn.filter(
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
    `Vendor Sale Stock Report-${moment(filterSearch?.value?.fromDate).format(
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
</script>
