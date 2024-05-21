<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Profit Loss Report</span>
    <q-btn-dropdown
      dropdown-icon="arrow_downward"
      label="Download Report"
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
    >
      <q-list>
        <q-item clickable @click="downloadPdfData()" v-close-popup>
          <q-item-section>
            <q-item-label>Download in PDF</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <div
    class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
  >
    <q-select
      dense
      outlined
      style="min-width: 200px; max-width: 200px"
      v-model="filterSearch.shopId"
      @update:model-value="filterSearch.shopId = $event.shopId"
      :options="shopData"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
      @filter="filterFn"
      map-options
      option-value="shopId"
      popup-content-class="!max-h-[200px]"
      option-label="name"
      label="Select Shop"
      color="btn-primary"
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
        @click="searchProfitLossReport()"
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
  <div class="flex justify-center mt-10" v-if="shouldShowReport">
    <div class="w-[40%]">
      <div
        class="flex flex-col gap-2 md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total Net Sale :</span>
          <span class="md:text-lg"> {{ reportData.netSale }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total Expense :</span>
          <span class="md:text-lg"> {{ reportData.totalExpense }}</span>
        </div>
      </div>
      <div class="py-4">
        <q-table
          :loading="isLoading"
          tabindex="0"
          :rows="reportData.expnseDetails"
          align="left"
          :columns="profitLossExpenseColumn"
          row-key="id"
          :rows-per-page-options="[0]"
          :pagination="{ rowsPerPage: 0 }"
          :hide-bottom="reportData.expnseDetails.length > 0"
        >
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium">
                No Expense Details available.
              </span>
            </div>
          </template>
        </q-table>
      </div>
      <div
        class="flex flex-col gap-2 md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total WholeSale Price :</span>
          <span class="md:text-lg"> {{ reportData.totalWholeSalePrice }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg"
            >Profit By WholeSale Price :</span
          >
          <span class="md:text-lg">
            {{ reportData.profitByWholeSalePrice }}</span
          >
        </div>

        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total Cost Price :</span>
          <span class="md:text-lg"> {{ reportData.totalCostPrice }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Profit By Cost Price :</span>
          <span class="md:text-lg"> {{ reportData.totalExpense }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  IShopResponse,
  EUserRoles,
  IProfitLossReportData,
  IProfitLossExpnseDetails,
} from 'src/interfaces';
import { GetShopList } from 'src/services';
import {
  isPosError,
  IPdfHeaders,
  ITableItems,
  downloadPdf,
  IPdfFooters,
} from 'src/utils';
import { useAuthStore } from 'src/stores';
import { profitLossExpenseColumn } from 'src/utils/reports';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import moment from 'moment';
import { processTableItems } from 'src/utils/process-table-items';
import { GetProfitLossReport } from 'src/services/reports';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const tableItems = ref<ITableItems[][]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past1Month = date.subtractFromDate(timeStamp, { month: 1 });
const formattedFromDate = date.formatDate(past1Month, 'YYYY-MM-DD');
const reportData = ref<IProfitLossReportData>({
  netSale: null,
  totalWholeSalePrice: null,
  profitByWholeSalePrice: null,
  totalCostPrice: null,
  profitByCostPrice: null,
  totalExpense: null,
  expnseDetails: [],
});
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopId: number | null;
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopId: null,
});

onMounted(async () => {
  await getShopList();
  filterSearch.value.shopId =
    authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
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
const searchProfitLossReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopId) {
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
    const res = await GetProfitLossReport({
      shopId: filterSearch.value.shopId,
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      reportData.value = res.data as IProfitLossReportData;
      tableItems.value = await convertArrayToPdfData(
        reportData.value.expnseDetails
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
const filterFn = (val: string, update: CallableFunction) => {
  update(() => {
    const needle = val.toLowerCase();
    shopData.value = shopData.value.filter((v) =>
      v.name?.toLowerCase().includes(needle)
    );
  });
};
const handleResetFilter = () => {
  if (
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopManager.toLowerCase() ||
    authStore.loggedInUser?.rolePermissions.roleName !==
      EUserRoles.ShopOfficer.toLowerCase()
  ) {
    filterSearch.value.shopId = null;
  }
  reportData.value = {
    netSale: null,
    totalWholeSalePrice: null,
    profitByWholeSalePrice: null,
    totalCostPrice: null,
    profitByCostPrice: null,
    totalExpense: null,
    expnseDetails: [],
  };
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
async function convertArrayToPdfData(array: IProfitLossExpnseDetails[]) {
  const tableStuff = [];
  const headerRow = ['Expense Name', 'Amount'];
  tableStuff.push(headerRow);
  array.forEach((item: IProfitLossExpnseDetails) => {
    const row = [{ text: item.expense }, { text: item.amount }];
    tableStuff.push(row);
  });
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
      heading: 'Total Net Sale',
      content: reportData.value.netSale,
    },
    {
      heading: 'Total Expense',
      content: reportData.value.totalExpense,
    },
  ];
  const myFileName = `Profit-Loss-report-${moment(
    filterSearch?.value?.fromDate
  ).format('DD/MM/YYYY')}-${moment(filterSearch?.value?.toDate).format(
    'DD/MM/YYYY'
  )}.pdf`;
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );
  const footers: IPdfFooters[] = [
    {
      heading: '',
      content: '',
    },
    {
      heading: '',
      content: '',
    },
    {
      heading: 'Total WholeSale Price',
      content: reportData.value.totalWholeSalePrice,
    },
    {
      heading: 'Profit By WholeSale Price',
      content: reportData.value.profitByWholeSalePrice,
    },
    {
      heading: 'Total Cost Price',
      content: reportData.value.totalCostPrice,
    },
    {
      heading: 'Profit By Cost Price',
      content: reportData.value.totalCostPrice,
    },
  ];
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    pdfFooters: footers,
    title: 'Profit Loss Report',
  });
}
const shouldShowReport = computed(() => {
  const data = reportData.value;
  return (
    data.totalWholeSalePrice !== null ||
    data.profitByWholeSalePrice !== null ||
    data.totalCostPrice !== null ||
    data.profitByCostPrice !== null ||
    data.totalExpense !== null ||
    data.expnseDetails.length > 0
  );
});
</script>
