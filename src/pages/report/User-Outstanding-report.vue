<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <span class="text-lg font-medium">User OutStanding Balance Reports</span>
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
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroup"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="filterSearch.customerGroup"
        :loading="isLoading"
        label="Select User Category"
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
      <q-checkbox
        v-model="filterSearch.includeZeroBalance"
        color="btn-primary"
        label="Include Zero Balance"
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
            filterSearch.customerGroup !== null &&
            filterSearch.customerGroup.customerGroupId < 0
          "
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
        :rows="outStandingReportData"
        :columns="outStandingReportColumn"
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
import { exportFile, useQuasar } from 'quasar';
import { ICustomerListResponse, IOutStandingReportData } from 'src/interfaces';
import DownloadPdfExcel from 'src/components/download-pdf-button/Download-Pdf-Excel.vue';
import { GetCustomerGroupList } from 'src/services';
import { GetUserOutstandingReport, wrapCsvValue } from 'src/services/reports';
import { isPosError, ITableHeaders, ITableItems, downloadPdf } from 'src/utils';
import { processTableItems } from 'src/utils/process-table-items';
import { outStandingReportColumn } from 'src/utils/reports';
import { onMounted, onUnmounted, ref } from 'vue';
const isLoading = ref(false);
const apiController = ref<AbortController | null>(null);
const $q = useQuasar();
const tableItems = ref<ITableItems[][]>([]);
const outStandingReportData = ref<IOutStandingReportData[]>([]);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const filterSearch = ref<{
  customerGroup: null | ICustomerListResponse;
  includeZeroBalance: boolean;
}>({
  customerGroup: null,
  includeZeroBalance: false,
});

onMounted(() => {
  getCustomerListOption();
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

const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null)) {
    return;
  }
  filterSearch.value = {
    customerGroup: null,
    includeZeroBalance: false,
  };
  getUserOutStandingBalanceReportList();
};

const getUserOutStandingBalanceReportList = async () => {
  if (isLoading.value) return;
  if (!filterSearch.value.customerGroup) {
    let message = 'Please select user category';
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
    const res = await GetUserOutstandingReport(
      {
        customerGroupId: filterSearch.value.customerGroup.customerGroupId,
        includeZeroBalance: filterSearch.value.includeZeroBalance,
      },
      apiController.value
    );
    if (res?.data) {
      outStandingReportData.value = res.data?.list;
      tableItems.value = await convertArrayToPdfData(res.data?.list);
    }
    outStandingReportData.value.sort((a, b) => {
      const userA = a.user.toUpperCase();
      const userB = b.user.toUpperCase();
      if (userA < userB) {
        return -1;
      }
      if (userA > userB) {
        return 1;
      }
      return 0;
    });
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
async function convertArrayToPdfData(array: IOutStandingReportData[]) {
  const tableStuff = [];
  const headerRow = ['User', 'OutStanding Balance', 'Phone Number'];
  tableStuff.push(headerRow);
  array.forEach((item: IOutStandingReportData) => {
    const row = [
      { text: item.user },
      { text: item.balance },
      { text: item.phone },
    ];
    tableStuff.push(row);
  });
  return tableStuff;
}
async function downloadPdfData() {
  const headers: ITableHeaders[] = [
    {
      heading: 'User Category',
      content: filterSearch.value.customerGroup?.name,
    },
  ];
  const fileTitle = 'User Outstanding Report';
  const myFileName = 'User-Outstanding-report.pdf';
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
    outStandingReportColumn.map((col) => wrapCsvValue(col.label)),
  ]
    .concat(
      outStandingReportData.value.map((row: any) =>
        outStandingReportColumn
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

  const status = exportFile('User-Outstanding-report.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>
