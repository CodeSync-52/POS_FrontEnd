<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Cash Closing Report</span>
    <q-btn-dropdown
      dropdown-icon="arrow_downward"
      label="Download Report"
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
    >
      <q-list>
        <q-item clickable @click="downloadPdf(groupedReportData)" v-close-popup>
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
      style="min-width: 200px"
      outlined
      map-options
      :options="shopData"
      :disable="
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopManager.toLowerCase() ||
        authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.ShopOfficer.toLowerCase()
      "
      v-model="selectedShop"
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
        @click="searchCashClosingReport()"
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
    <div
      v-for="(shopReport, shopIndex) in groupedReportData"
      :key="shopIndex"
      class="mb-8"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">
          {{ shopReport.shop.toUpperCase() }}
        </h2>
      </div>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th class="border border-gray-300 bg-gray-100 px-4 py-2">Date</th>
            <th class="border border-gray-300 bg-gray-100 px-4 py-2">
              Net Sale
            </th>
            <th class="border border-gray-300 bg-gray-100 px-4 py-2">
              Outgoing To HO
            </th>
            <th class="border border-gray-300 bg-gray-100 px-4 py-2">
              Remaining Balance
            </th>
            <th class="border border-gray-300 bg-gray-100 px-4 py-2">
              Total Expense
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(dateReport, dateIndex) in shopReport.reports"
            :key="dateIndex"
          >
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ formatDate(dateReport.date) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ dateReport.netSale ?? 0 }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ dateReport.outgoingToHO ?? 0 }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ dateReport.remainingBalance ?? 0 }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              {{ dateReport.totalExpense ?? 0 }}
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-2 font-bold text-center">
              Total
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center font-bold">
              {{ getTotalNetSale(shopReport.reports) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center font-bold">
              {{ getOutGoingToHO(shopReport.reports) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center font-bold">
              {{ getRemainingBalance(shopReport.reports) }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center font-bold">
              {{ getTotalExpense(shopReport.reports) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <q-dialog v-model="isPdfLoader" persistent>
      <q-spinner-ios size="78px" color="btn-primary" />
      <span class="ml-2 text-base font-[500]">Generating PDF...</span>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import { IShopResponse, EUserRoles, ICashClosinReport } from 'src/interfaces';
import { GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
import { useAuthStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import { GetCashClosingReport } from 'src/services/reports';
import moment from 'moment';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
const isPdfLoader = ref(false);
const timeStamp = Date.now();
const isFetchingShopList = ref(false);
const shopData = ref<IShopResponse[]>([]);
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const selectedShop = ref<IShopResponse[]>([]);
const filterSearch = ref<{
  fromDate: string;
  toDate: string;
  shopIds: [];
}>({
  fromDate: formattedFromDate,
  toDate: formattedToDate,
  shopIds: [],
});
const formatDate = (date: string) => {
  return moment(date).format('DD-MM-YYYY');
};
const reportData = ref<ICashClosinReport[]>([]);
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

const searchCashClosingReport = async () => {
  isLoading.value = true;
  if (!filterSearch.value.shopIds) {
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
    const res = await GetCashClosingReport({
      shopIds: selectedShop.value?.map((shop) => shop.shopId).join(','),
      fromDate: filterSearch.value.fromDate,
      toDate: filterSearch.value.toDate,
    });
    if (res.data) {
      reportData.value = (res.data as ICashClosinReport[]).map((item) => ({
        shop: item.shop,
        netSale: item.netSale,
        totalExpense: item.totalExpense,
        remainingBalance: item.remainingBalance,
        date: item.date,
        outgoingToHO: item.outgoingToHO,
      }));
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
  }
  reportData.value = [];
  filterSearch.value.fromDate = '';
  filterSearch.value.toDate = '';
};
const groupedReportData = computed(() => {
  const groupedByShop = reportData.value.reduce((acc, report) => {
    const existingShopIndex = acc.findIndex(
      (group) => group.shop === report.shop
    );
    if (existingShopIndex !== -1) {
      acc[existingShopIndex].reports.push(report);
    } else {
      acc.push({
        shop: report.shop,
        reports: [report],
      });
    }
    return acc;
  }, [] as { shop: string; reports: ICashClosinReport[] }[]);
  return groupedByShop;
});
const getTotalNetSale = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.netSale, 0);
};
const getTotalExpense = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.totalExpense, 0);
};
const getRemainingBalance = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.remainingBalance, 0);
};
const getOutGoingToHO = (reports: ICashClosinReport[]): number => {
  return reports.reduce((total, report) => total + report.outgoingToHO, 0);
};

const downloadPdf = (
  data: { shop: string; reports: ICashClosinReport[] }[]
) => {
  isPdfLoader.value = true;
  const content: any[] = [];

  data.forEach((shopReport) => {
    content.push(
      { text: ` ${shopReport.shop.toUpperCase()}`, style: 'sectionHeading' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Date', style: 'tableHeader' },
              { text: 'Net Sale', style: 'tableHeader' },
              { text: 'Outgoing To HO', style: 'tableHeader' },
              { text: 'Remaining Balance', style: 'tableHeader' },
              { text: 'Total Expense', style: 'tableHeader' },
            ],
            ...shopReport.reports.map((report) => [
              { text: formatDate(report.date), style: 'tableCell' },
              { text: report.netSale.toString(), style: 'tableCell' },
              { text: report.outgoingToHO.toString(), style: 'tableCell' },
              { text: report.remainingBalance.toString(), style: 'tableCell' },
              { text: report.totalExpense.toString(), style: 'tableCell' },
            ]),
            [
              { text: 'Total', style: 'tableHeader' },
              {
                text: getTotalNetSale(shopReport.reports).toString(),
                style: 'tableCell',
              },
              {
                text: getOutGoingToHO(shopReport.reports).toString(),
                style: 'tableCell',
              },
              {
                text: getRemainingBalance(shopReport.reports).toString(),
                style: 'tableCell',
              },
              {
                text: getTotalExpense(shopReport.reports).toString(),
                style: 'tableCell',
              },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      { text: '\n' }
    );
  });

  const documentDefinition = {
    content,
    styles: {
      mainHeading: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      subHeading: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      sectionHeading: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#F4F5F4',
        alignment: 'center',
      },
      tableCell: {
        fontSize: 10,
        alignment: 'center',
      },
    },
  };

  pdfMake.createPdf(documentDefinition).download('cash_closing_report.pdf');
  isPdfLoader.value = false;
};
</script>
