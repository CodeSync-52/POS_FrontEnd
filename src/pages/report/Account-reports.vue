<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Account Reports</span>
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
        outlined
        style="min-width: 200px; max-width: 210px"
        use-input
        @filter="filterFn"
        v-model="filterSearch.user"
        @update:model-value="filterSearch.user"
        :options="options"
        map-options
        popup-content-class="!max-h-[200px]"
        option-label="fullName"
        option-value="userId"
        label="User"
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
    <div
      v-if="reportData.length > 0"
      class="flex px-4 text-[24px] font-bold text-btn-primary"
    >
      <span> Closing: </span>
      <span> {{ reportData[reportData.length - 1]?.balance }}</span>
    </div>

    <div class="py-4">
      <q-table
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="reportData"
        :columns="accountReportColumn"
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
  <q-dialog v-model="isLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { date, exportFile, useQuasar } from 'quasar';
import { IAccountReportData, IUserData, IUserResponse } from 'src/interfaces';
import { GetUsers } from 'src/services';
import { GetAccountReport, wrapCsvValue } from 'src/services/reports';
import { downloadPdf, isPosError, IPdfHeaders, ITableItems } from 'src/utils';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { accountReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';
import { processTableItems } from 'src/utils/process-table-items';
const isLoading = ref(false);
const isLoader = ref(false);
const apiController = ref<AbortController | null>(null);
const UserList = ref<IUserResponse[]>([]);
const $q = useQuasar();
const options = ref<IUserResponse[]>([]);
const reportData = ref<IAccountReportData[]>([]);
const timeStamp = Date.now();
const next1Day = date.subtractFromDate(timeStamp, { day: -1 });
const formattedToDate = date.formatDate(next1Day, 'YYYY-MM-DD');
const past30Date = date.subtractFromDate(timeStamp, { date: 30 });
const formattedFromDate = date.formatDate(past30Date, 'YYYY-MM-DD');
const tableItems = ref<ITableItems[][]>([]);
const filterSearch = ref<{
  user: null | IUserData;
  startDate: null | string;
  endDate: null | string;
}>({
  user: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
});

onMounted(() => {
  getUserList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
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
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = UserList.value.filter((v) =>
      v.fullName?.toLowerCase().includes(needle)
    );
  });
};

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    user: null,
    startDate: null,
    endDate: null,
  };
  getReceiptList();
};

const getReceiptList = async () => {
  if (isLoading.value) return;
  if (
    !filterSearch.value.user?.userId ||
    !filterSearch.value.startDate ||
    !filterSearch.value.endDate
  ) {
    let message = 'Please select user and date';
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
    const res = await GetAccountReport(
      {
        ToDate: filterSearch.value.endDate,
        FromDate: filterSearch.value.startDate,
        UserId: filterSearch.value.user.userId,
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
async function convertArrayToPdfData(array: IAccountReportData[]) {
  const tableStuff = [];
  const headerRow = [
    'Date',
    'Transaction Detail',
    'Debit (Out)',
    'Credit (In)',
    'Comments',
    'Balance',
  ];
  tableStuff.push(headerRow);
  const footerRow = [
    '',
    '',
    '',
    '',
    {
      text: 'Closing',
      margin: [0, 5],
      bold: true,
    },
    { text: `${array[array.length - 1].balance}`, bold: true, margin: 5 },
  ];

  array.forEach((item: IAccountReportData) => {
    const row = [
      { text: moment(item.date).format('DD/MM/YYYY') },
      { text: item.transactionDetail },
      { text: item.debit },
      { text: item.credit },
      { text: item.comments },
      { text: item.balance },
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
      heading: 'User',
      content: filterSearch.value.user?.fullName,
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
  const myFileName = `Account-Reports-${moment(
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
    title: 'Account-Report',
  });
  isLoader.value = false;
}

const downloadCSVData = () => {
  const content = [accountReportColumn.map((col) => wrapCsvValue(col.label))]
    .concat(
      reportData.value.map((row: any) =>
        accountReportColumn
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
    `Account-Reports-${moment(filterSearch?.value?.startDate).format(
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
