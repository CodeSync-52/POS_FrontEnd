<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
  >
    <span class="text-xl font-medium">Accumulative Sale Purchase Report</span>
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
      :options="options"
      use-input
      v-model="filterSearch.user"
      popup-content-class="!max-h-[200px]"
      label="Select User"
      color="btn-primary"
      clearable
      option-label="fullName"
      option-value="userId"
      @clear="clearUserSelection"
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
    <div class="q-gutter-sm">
      <q-radio
        v-model="filterSearch.sortByArticle"
        color="btn-primary"
        val="false"
        label="Sort by T.Price"
      />
      <q-radio
        v-model="filterSearch.sortByArticle"
        color="btn-primary"
        val="true"
        label="Sort by Article"
      />
    </div>

    <div class="font-bold text-[20px]">Reciept Type :</div>
    <div class="q-gutter-sm">
      <q-radio
        v-model="filterSearch.typeReciept"
        color="btn-primary"
        val="true"
        label="Reciept"
      />
      <q-radio
        v-model="filterSearch.typeReciept"
        color="btn-primary"
        val="false"
        label="Sale"
      />
    </div>

    <div class="flex lg:justify-end sm:justify-center items-end gap-2">
      <q-btn
        unelevated
        color=""
        class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
        icon="search"
        label="Search"
        @click="accumulativeSalePurchaseReport()"
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
      :columns="accumulativesalepurchaseReportColumn"
      row-key="id"
      :rows-per-page-options="[0]"
      @request="accumulativeSalePurchaseReport()"
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
            {{ calculateTotal('unitPrice') }}
          </q-td>
          <q-td colspan="1" class="text-bold">
            {{ calculateTotal('totalPrice') }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="isLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
  <q-dialog v-model="isExcelLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating Excel...</span>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IAccumulativeSalePurchaseReportData,
  IUserResponse,
} from 'src/interfaces';
import { GetUsers } from 'src/services';
import { isPosError, IPdfHeaders, ITableItems, downloadPdf } from 'src/utils';
import { accumulativesalepurchaseReportColumn } from 'src/utils/reports';
import { useQuasar, exportFile } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { processTableItems } from 'src/utils/process-table-items';
import {
  GetAccumulativeSalePurchaseReport,
  wrapCsvValue,
} from 'src/services/reports';
const $q = useQuasar();
const isLoading = ref(false);
const isLoader = ref(false);
const isExcelLoader = ref(false);
const timeStamp = Date.now();
const reportList = ref<IAccumulativeSalePurchaseReportData[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const past1MOnth = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1MOnth, 'YYYY-MM-DD');
const UserList = ref<IUserResponse[]>([]);
const options = ref<IUserResponse[]>([]);

const filterSearch = ref<{
  user: IUserResponse | null;
  fromDate: string;
  toDate: string;
  typeReciept: string;
  sortByArticle: string;
}>({
  user: null,
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  typeReciept: 'true',
  sortByArticle: 'true',
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
      UserList.value = res.data.items.filter(
        (user) => user.status === 'Active' && user.roleName === 'Customer'
      );
      options.value = res.data.items.filter((x) => x.roleName === 'Customer');
    }
  } catch (error) {
    let message = ' Error Occurred';
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
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};

const accumulativeSalePurchaseReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.user) {
    isLoading.value = false;
    $q.notify({
      message: 'Please Select User',
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
    const res = await GetAccumulativeSalePurchaseReport({
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
      userId: filterSearch.value.user?.userId ?? -1,
      typeReciept: filterSearch.value.typeReciept === 'true' ? true : false,
      sortByArticle: filterSearch.value.sortByArticle === 'true' ? true : false,
    });
    if (res?.data) {
      reportList.value = res?.data;
      tableItems.value = await convertArrayToPdfData(res?.data);
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
    user: null,
    fromDate: '',
    toDate: '',
    typeReciept: 'true',
    sortByArticle: 'true',
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
const clearUserSelection = () => {
  filterSearch.value.user = null;
  getUserList();
};

const defaultImage = ref<string | null>(null);
async function convertArrayToPdfData(
  array: IAccumulativeSalePurchaseReportData[]
) {
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
    'Unit Price',
    'Total Price',
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
      text: calculateTotal('quantity').toString(),
      bold: true,
      margin: [0, 5],
    },
    {
      text: calculateTotal('unitPrice').toString(),
      bold: true,
      margin: [0, 5],
    },
    {
      text: calculateTotal('totalPrice').toString(),
      bold: true,
      margin: [0, 5],
    },
  ];
  array.forEach((item: IAccumulativeSalePurchaseReportData) => {
    const row = [
      { text: item.article },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },

      { text: item.quantity },
      { text: item.unitPrice },
      { text: item.totalPrice },
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
      heading: 'Report Type',
      content: filterSearch.value.typeReciept === 'true' ? 'Receipt' : 'Sale',
    },
    {
      heading: 'Sort By',
      content:
        filterSearch.value.sortByArticle === 'true' ? 'Article' : 'T.Price',
    },
  ];
  const myFileName = 'Accumulative-Sale-Purchase-Stock-Reportpdf';
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  isExcelLoader.value = true;
  const selectedColumnsData = accumulativesalepurchaseReportColumn.filter(
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
    `Accumulative-Sale-Purchase-Stock-Report-${moment(
      filterSearch?.value?.fromDate
    ).format('DD/MM/YYYY')}-${moment(filterSearch?.value?.toDate).format(
      'DD/MM/YYYY'
    )}.csv`,
    content,
    'text/csv'
  );
  isExcelLoader.value = false;
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
