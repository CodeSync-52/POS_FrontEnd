<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">Account Reports</span>
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
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
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
    <div class="py-4">
      <q-table
        :loading="isLoading"
        tabindex="0"
        align="left"
        :rows="reportData"
        :columns="accountReportColumn"
        :pagination="{ rowsPerPage: 0 }"
      >
      </q-table>
    </div>
    <div
      v-if="reportData.length > 0"
      class="flex flex-end w-full justify-end px-4 gap-2 text-lg font-medium"
    >
      <span> Closing: </span>
      <span> {{ reportData[reportData.length - 1]?.balance }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CanceledError } from 'axios';
import { date, useQuasar } from 'quasar';
import { IAccountReportData, IUserData, IUserResponse } from 'src/interfaces';
import { getUserListApi } from 'src/services';
import { accountReportListApi } from 'src/services/reports';
import { downloadPdf, isPosError, ITableHeaders, ITableItems } from 'src/utils';
import { accountReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';
import { processTableItems } from 'src/utils/process-table-items';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const UserList = ref<IUserResponse[]>([]);
const $q = useQuasar();
const options = ref<IUserResponse[]>([]);
const reportData = ref<IAccountReportData[]>([]);
const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const formattedFromDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
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
    const res = await getUserListApi({
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
    const res = await accountReportListApi(
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
    'Debit +',
    'Credit -',
    'Balance',
  ];
  tableStuff.push(headerRow);
  const footerRow = [
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
      { text: item.balance },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(footerRow);
  return tableStuff;
}
async function downloadPdfData() {
  const headers: ITableHeaders[] = [
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
  const fileTitle = 'Account Reports';
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
    tableHeaders: headers,
    title: fileTitle,
  });
}
</script>
