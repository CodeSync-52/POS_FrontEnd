<template>
  <div>
    <div class="font-semibold text-lg text-center">
      <span>{{ shopAccountSummary.shopName }} Account Summary</span>
      <div>
        {{
          moment(shopAccountSummary.createdDate).format('dddd, D MMMM, YYYY')
        }}
      </div>
    </div>
    <div
      class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-between q-pa-md"
    >
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Status :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.shopAccountStatus }}</span
          >
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Last Closing Date :</span>
          <span class="md:text-lg">
            {{
              moment(shopAccountSummary.lastClosingDate).format(
                'ddd, D MMM, YYYY'
              )
            }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Available Stock :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.availableStock }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Item's Sold :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalItemsSale }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Discounts :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalDiscount }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Refunds :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalReturnSaleAmount }}
          </span>
        </div>
      </div>
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Opening Balance :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.openingBalance }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Net Sale :</span>
          <span class="md:text-lg">
            {{
              shopAccountSummary.totalSale -
              shopAccountSummary.totalDiscount -
              shopAccountSummary.totalReturnSaleAmount
            }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">- Expenses:</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalExpense }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">- Submitted To HO:</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalOutgoingToHO }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">+ Received From HO :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalIncomingFromHO }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Remaining Balance :</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.remainingBalance }}
          </span>
        </div>
      </div>
    </div>
    <q-card>
      <div class="q-pa-md">
        <q-table
          title="Expenses"
          bordered
          flat
          :rows="shopAccountSummary.salesExpenseSummary"
          :columns="shopExpenseTableColumn"
          :rows-per-page-options="[0]"
          row-key="id"
        >
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md">
        <q-table
          title="Incoming From Head Office"
          bordered
          flat
          :rows="shopAccountSummary.inComingFromHO"
          :columns="incomingOutgoingToHoTableColumn"
          :rows-per-page-options="[0]"
          row-key="id"
        >
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
      <div class="q-pa-md">
        <q-table
          title="Outgoing To Head Office"
          flat
          :rows="shopAccountSummary.outgoingToHO"
          :columns="incomingOutgoingToHoTableColumn"
          :rows-per-page-options="[0]"
          row-key="id"
        >
          <template v-slot:no-data>
            <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
              <q-icon name="warning" size="xs" />
              <span class="text-md font-medium"> No data available. </span>
            </div>
          </template>
        </q-table>
      </div>
    </q-card>

    <div class="row justify-center md:justify-end gap-3 mt-5">
      <q-btn
        label="Download Pdf"
        unelevated
        color="btn-primary"
        @click="downloadPdfData"
      />
      <q-btn
        class="mr-5"
        label="Back"
        unelevated
        color="btn-cancel hover:bg-btn-cancel-hover"
        @click="$router.go(-1)"
      />
    </div>
  </div>
  <q-dialog v-model="isPdfloader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  IShopAccountReport,
  IShopExpenses,
  InComingOutgoingToHo,
} from 'src/interfaces';
import { downloadPdf } from 'src/utils/pdf-make/pdf-make';
import { GetShopAccount } from 'src/services';
import {
  shopExpenseTableColumn,
  incomingOutgoingToHoTableColumn,
  ITableItems,
} from 'src/utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();
const isPdfloader = ref(false);
const selectedId: string | string[] = router.currentRoute.value.params.id;
const $q = useQuasar();
const expenseItems = ref<ITableItems[][]>([]);
const outgoingPaymentItems = ref<ITableItems[][]>([]);
const incoingPaymentItems = ref<ITableItems[][]>([]);
const shopAccountSummary = ref<{
  shopAccountId: number;
  shopId: number;
  shopName: string;
  openingBalance: number;
  remainingBalance: number;
  shopAccountStatus: string;
  availableStock: number;
  totalItemsSale: number;
  totalDiscount: number;
  totalIncomingFromHO: number;
  totalOutgoingToHO: number;
  totalSale: number;
  totalExpense: number;
  totalReturnSaleAmount: number;
  lastClosingDate: string;
  createdDate: string;
  inComingFromHO: InComingOutgoingToHo[];
  outgoingToHO: InComingOutgoingToHo[];
  salesExpenseSummary: IShopExpenses[];
}>({
  shopAccountId: 0,
  shopId: 0,
  shopName: '',
  openingBalance: 0,
  remainingBalance: 0,
  shopAccountStatus: '',
  availableStock: 0,
  totalItemsSale: 0,
  totalDiscount: 0,
  totalIncomingFromHO: 0,
  totalOutgoingToHO: 0,
  totalSale: 0,
  totalExpense: 0,
  totalReturnSaleAmount: 0,
  lastClosingDate: '',
  createdDate: '',
  inComingFromHO: [],
  outgoingToHO: [],
  salesExpenseSummary: [],
});
const convertExpenseArray = (expenseArray: IShopExpenses[]) => {
  const tableStuff = [];
  const expenseTitleHeading = [{ text: 'Expenses', fontSize: 15 }, '', ''];
  tableStuff.push(expenseTitleHeading);
  const expenseHeaderRow = ['Expense', 'Amount', 'Comment'];
  tableStuff.push(expenseHeaderRow);

  expenseArray.forEach((item: IShopExpenses) => {
    const expenseRow = [
      { text: item.expenseName, bold: true, margin: [10, 20] },
      { text: item.amount, margin: [10, 20] },
      { text: item.comment, margin: [10, 20] },
    ];
    tableStuff.push(expenseRow);
  });
  return tableStuff;
};

const convertIncomingOutgoingArray = (
  incomingOutgoingArray: InComingOutgoingToHo[],
  isIncoming: boolean
) => {
  const tableStuff = [];
  if (isIncoming) {
    const titleHeading = [
      { text: 'Incoming From HO', fontSize: 15 },
      '',
      '',
      '',
    ];

    tableStuff.push(titleHeading);
  } else {
    const titleHeading = [{ text: 'Outgoing To HO', fontSize: 15 }, '', '', ''];

    tableStuff.push(titleHeading);
  }
  const inoutHeaderRow = ['Name', 'Amount', 'Comment', 'Transaction Date'];
  tableStuff.push(inoutHeaderRow);

  incomingOutgoingArray.forEach((item: InComingOutgoingToHo) => {
    const inoutRow = [
      { text: item.userName, bold: true, margin: [10, 20] },
      { text: item.amount, margin: [10, 20] },
      { text: item.comment, margin: [10, 20] },
      {
        text: moment(item.transactionDate).format('ddd, D MMMM, YYYY'),
        margin: [10, 20],
      },
    ];
    tableStuff.push(inoutRow);
  });
  return tableStuff;
};

function downloadPdfData() {
  isPdfloader.value = true;
  const headers = [
    {
      heading: 'Status',
      content: shopAccountSummary.value.shopAccountStatus,
    },
    {
      heading: 'Opening Balance',
      content: shopAccountSummary.value.openingBalance,
    },
    {
      heading: 'Last Closing Date',
      content: moment(shopAccountSummary.value.lastClosingDate).format(
        'ddd, D MMMM, YYYY'
      ),
    },
    {
      heading: 'Net Sale',
      content:
        shopAccountSummary.value.totalSale -
        shopAccountSummary.value.totalDiscount -
        shopAccountSummary.value.totalReturnSaleAmount,
    },
    {
      heading: 'Available Stock',
      content: shopAccountSummary.value.availableStock,
    },
    {
      heading: '- Expenses',
      content: shopAccountSummary.value.totalExpense,
    },
    {
      heading: 'Items Sold',
      content: shopAccountSummary.value.totalItemsSale,
    },
    {
      heading: '- Submitted TO HO',
      content: shopAccountSummary.value.totalOutgoingToHO,
    },
    {
      heading: 'Discounts',
      content: shopAccountSummary.value.totalDiscount,
    },
    {
      heading: '+ Received From HO',
      content: shopAccountSummary.value.totalIncomingFromHO,
    },
    {
      heading: 'Refunds',
      content: shopAccountSummary.value.totalReturnSaleAmount,
    },
    {
      heading: 'Remaining Balance',
      content: shopAccountSummary.value.remainingBalance,
    },
  ];
  const fileTitle = `${shopAccountSummary.value.shopName} Account Summary`;
  downloadPdf({
    filename: `${fileTitle}.pdf`,
    pdfHeaders: headers,
    tableData: JSON.parse(JSON.stringify(expenseItems.value)),
    tableData2: JSON.parse(JSON.stringify(incoingPaymentItems.value)),
    tableData3: JSON.parse(JSON.stringify(outgoingPaymentItems.value)),
    title: `${shopAccountSummary.value.shopName} | ${moment(
      shopAccountSummary.value.createdDate
    ).format('dddd, D MMMM, YYYY')}`,
  });
  isPdfloader.value = false;
}
onMounted(async () => {
  await updateAccountSummary();
});
const updateAccountSummary = async () => {
  try {
    const res = await GetShopAccount(Number(selectedId));
    if (res.type === 'Success') {
      const responseData = res.data as IShopAccountReport | null;
      if (responseData) {
        shopAccountSummary.value = {
          shopAccountId: responseData.shopAccountId,
          shopId: responseData.shopId,
          shopName: responseData.shopName,
          openingBalance: responseData.openingBalance,
          remainingBalance: responseData.remainingBalance,
          shopAccountStatus: responseData.shopAccountStatus,
          availableStock: responseData.availableStock,
          totalItemsSale: responseData.totalItemsSale,
          totalDiscount: responseData.totalDiscount,
          totalIncomingFromHO: responseData.totalIncomingFromHO,
          totalOutgoingToHO: responseData.totalOutgoingToHO,
          totalSale: responseData.totalSale,
          totalExpense: responseData.totalExpense,
          totalReturnSaleAmount: responseData.totalReturnSaleAmount,
          lastClosingDate: responseData.lastClosingDate,
          createdDate: responseData.createdDate,
          inComingFromHO: responseData.inComingFromHO || [],
          outgoingToHO: responseData.outgoingToHO || [],
          salesExpenseSummary: responseData.salesExpenseSummary || [],
        };

        expenseItems.value = convertExpenseArray(
          shopAccountSummary.value.salesExpenseSummary
        );
        incoingPaymentItems.value = convertIncomingOutgoingArray(
          shopAccountSummary.value.inComingFromHO,
          true
        );
        outgoingPaymentItems.value = convertIncomingOutgoingArray(
          shopAccountSummary.value.outgoingToHO,
          false
        );
      }
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
};
</script>
