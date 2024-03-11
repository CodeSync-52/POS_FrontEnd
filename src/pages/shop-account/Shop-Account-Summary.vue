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
          <span class="font-medium md:text-lg">Item's Sold Today :</span>
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
          <span class="font-medium md:text-lg">- HO Outgoing:</span>
          <span class="md:text-lg">
            {{ shopAccountSummary.totalOutgoingToHO }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">+ HO Incoming :</span>
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
    <div class="row justify-center md:justify-end mt-5">
      <q-btn
        class="mr-5"
        label="Back"
        unelevated
        color="btn-cancel hover:bg-btn-cancel-hover"
        @click="$router.go(-1)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  IShopAccountReport,
  IShopExpenses,
  InComingOutgoingToHo,
} from 'src/interfaces';
import { accountSummaryApi } from 'src/services';
import {
  shopExpenseTableColumn,
  incomingOutgoingToHoTableColumn,
} from 'src/utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();
const selectedId: string | string[] = router.currentRoute.value.params.id;
const $q = useQuasar();
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
onMounted(async () => {
  await updateAccountSummary();
});
const updateAccountSummary = async () => {
  try {
    const res = await accountSummaryApi(Number(selectedId));
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
