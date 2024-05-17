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
        <q-item clickable @click="download(groupedReportData)" v-close-popup>
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
    <q-card
      class="my-6 mx-4 p-6 border rounded-lg shadow-md"
      v-for="(shopReport, shopIndex) in groupedReportData"
      :key="shopIndex"
    >
      <div class="inner-content">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-medium">
            {{ shopReport.shop.toUpperCase() }}
          </h2>
        </div>

        <div class="flex justify-between items-center mb-4">
          <div>
            <span class="font-medium text-lg">Shop Net Sale: </span>
            <span class="text-lg">{{
              getTotalNetSale(shopReport.reports)
            }}</span>
          </div>
          <div>
            <span class="font-medium text-lg">Shop Expense: </span>
            <span class="text-lg">{{
              getTotalExpense(shopReport.reports)
            }}</span>
          </div>
        </div>

        <div
          v-for="(userDetail, userIndex) in getUserDetails(shopReport.reports)"
          :key="userIndex"
          class="mb-2"
        >
          <span class="font-medium">{{ userDetail.user + ' Amount: ' }}</span>
          <span class="text-sm">{{ userDetail.totalAmount }}</span>
        </div>

        <div
          v-for="(dateReport, dateIndex) in shopReport.reports"
          :key="dateIndex"
          class="mt-4 border-b border-gray-300"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="font-medium text-lg">
              {{ date.formatDate(dateReport.date, 'YYYY-MM-DD') }}
            </div>
            <div class="flex gap-2">
              <div>
                <span class="font-medium text-sm">Net Sale:</span>
                <span class="text-sm text-right">{{ dateReport.netSale }}</span>
              </div>
              <div>
                <span class="font-medium text-sm">Expense:</span>
                <span class="text-sm text-right">{{
                  dateReport.totalExpense
                }}</span>
              </div>
              <div>
                <span class="font-medium text-sm">Rem. Blnc:</span>
                <span class="text-sm text-right">{{
                  dateReport.remainingBalance
                }}</span>
              </div>
            </div>
          </div>

          <div v-if="dateReport.submitToHODetails.length" class="py-2">
            <q-table
              :loading="isLoading"
              tabindex="0"
              :rows="dateReport.submitToHODetails"
              align="left"
              :columns="cashClosingUserExpenseColumn"
              row-key="id"
              :rows-per-page-options="[0]"
              :pagination="{ rowsPerPage: 0 }"
              :hide-bottom="dateReport.submitToHODetails.length > 0"
              title="Outgoing Payment Details"
              title-class="text-sm"
            >
            </q-table>
          </div>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="isLoader" persistent>
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
import { cashClosingUserExpenseColumn } from 'src/utils/reports';
import { useQuasar } from 'quasar';
const isLoader = ref(false);
import { date } from 'quasar';
import { GetCashClosingReport } from 'src/services/reports';
import moment from 'moment';
const $q = useQuasar();
const authStore = useAuthStore();
const isLoading = ref(false);
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
        submitToHODetails: item.submitToHODetails,
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
const getUserDetails = (
  reports: ICashClosinReport[]
): { user: string; totalAmount: number }[] => {
  if (!reports) return [];
  const userDetailsMap = new Map<string, number>();
  reports.forEach((sdet) => {
    sdet.submitToHODetails.forEach((detail) => {
      if (!userDetailsMap.has(detail.user)) {
        userDetailsMap.set(detail.user, 0);
      }
      userDetailsMap.set(
        detail.user,
        userDetailsMap.get(detail.user)! + detail.amount
      );
    });
  });

  const userDetails: { user: string; totalAmount: number }[] = [];
  userDetailsMap.forEach((amount, user) => {
    userDetails.push({ user, totalAmount: amount });
  });

  return userDetails;
};

const download = async (
  data: { shop: string; reports: ICashClosinReport[] }[]
) => {
  isLoader.value = true;
  downloadPdf(data);
  isLoader.value = false;
};

function downloadPdf(
  groupedReportData: { shop: string; reports: ICashClosinReport[] }[]
): void {
  const content: any[] = [];

  groupedReportData.forEach((shopReport) => {
    const shopContent: any[] = [];

    // Shop section
    shopContent.push({
      text: shopReport.shop.toUpperCase(),
      style: 'header',
      margin: [0, 10, 0, 10],
    });

    const shopNetSale = shopReport.reports.reduce(
      (acc: number, report: any) => acc + report.netSale,
      0
    );
    const shopExpense = shopReport.reports.reduce(
      (acc: number, report: any) => acc + report.totalExpense,
      0
    );

    shopContent.push({
      columns: [
        {
          text: `Net Sale: ${shopNetSale}`,
          width: '*',
        },
        {
          text: `Expense: ${shopExpense}`,
          width: '*',
        },
      ],
      margin: [0, 0, 0, 10],
    });

    // User details
    const userDetails = getUserDetails(shopReport.reports);
    const userDetailSection: any[] = [];
    userDetails.forEach((userDetail: any) => {
      userDetailSection.push({
        text: `${userDetail.user}: ${userDetail.totalAmount}`,
        margin: [0, 5, 0, 0],
        fontSize: 10,
      });
    });
    shopContent.push(userDetailSection);

    // Adding border around the shop section
    shopContent.push({
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 600, y2: 0, lineWidth: 1 }],
    });

    // User details
    shopReport.reports.forEach((dateReport: any) => {
      const dateContent: any[] = [];
      const formattedDate = moment(dateReport.date).format('YYYY-MM-DD');

      // Net Sale, Expense, and Remaining Balance
      dateContent.push({
        text: formattedDate,
        style: 'subheader',
        margin: [0, 10, 0, 5],
      });

      dateContent.push({
        columns: [
          {
            text: `Net Sale: ${dateReport.netSale}`,
            width: '*',
            fontSize: 9,
          },
          {
            text: `Expense: ${dateReport.totalExpense}`,
            width: '*',
            fontSize: 9,
          },
          {
            text: `Rem. Blnc: ${dateReport.remainingBalance}`,
            width: '*',
            fontSize: 9,
          },
        ],
        margin: [0, 5, 0, 10],
      });

      if (dateReport.submitToHODetails.length > 0) {
        dateContent.push({
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            fontSize: 9, // Adjust column widths as needed
            body: [
              // Table headers
              [
                { text: 'User', style: 'tableHeader' },
                { text: 'Amount', style: 'tableHeader' },
              ],

              // Table rows
              ...dateReport.submitToHODetails.map((row: any) => [
                row.user,
                row.amount,
              ]),
            ],
          },
          layout: {
            hLineWidth: () => 1, // Draw horizontal line for each row
            vLineWidth: () => 1, // Draw vertical line for each column
            hLineColor: () => '#000', // Set color of horizontal lines
            vLineColor: () => '#000', // Set color of vertical lines
          },
          style: 'table', // Apply style to q-table
          margin: [0, 5, 0, 0],
        });

        dateContent.push({ text: '\n' });
      }

      // Adding border around each date section
      dateContent.push({
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 600, y2: 0, lineWidth: 0.5 },
        ],
      });

      shopContent.push(dateContent);
    });

    content.push({
      stack: shopContent,
      style: 'shopSection', // Apply shop section style
      margin: [0, 0, 0, 10], // Add bottom margin between shop sections
    });
  });

  const docDefinition = {
    content: content,
    styles: {
      table: {
        border: '1px solid #000',
        fontSize: 9,
      },
      header: {
        fontSize: 12,
        bold: true,
      },
      subheader: {
        fontSize: 10,
        bold: true,
      },
      tableHeader: {
        bold: true,
      },
      shopSection: {
        border: [true, true, true, true], // Add border around shop section
        margin: [0, 0, 0, 10], // Add margin around shop section
      },
    },
  };

  pdfMake.createPdf(docDefinition).download('report.pdf');
}
</script>
