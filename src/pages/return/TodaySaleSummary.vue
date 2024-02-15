<template>
  <div>
    <div class="font-semibold text-lg text-center">
      <span>Shop Summary : {{ SaleSummary.shopName }} </span>
      <div>
        {{ moment(SaleSummary.createdDate).format('dddd, D MMMM, YYYY') }}
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
          <span class="md:text-lg"> {{ SaleSummary.shopAccountStatus }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Last Closing Date :</span>
          <span class="md:text-lg">
            {{ moment(SaleSummary.lastClosingDate).format('ddd, D MMM, YYYY') }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Available Stock :</span>
          <span class="md:text-lg"> {{ SaleSummary.availableStock }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Item's Sold Today :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalItemsSale }} </span>
        </div>
      </div>
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Opening Balance :</span>
          <span class="md:text-lg"> {{ SaleSummary.openingBalance }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Gross Sales :</span>
          <span class="md:text-lg"> {{ SaleSummary.todaySale }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Discounts :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalDiscount }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">HO Incoming :</span>
          <span class="md:text-lg">
            {{ SaleSummary.totalIncomingFromHO }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Refunds :</span>
          <span class="md:text-lg">
            {{ SaleSummary.totalReturnSaleAmount }}
          </span>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        bordered
        :rows="SaleSummary.ShopManagementExpenseRecords"
        :columns="shopSaleExpenseTableColumn"
        row-key="id"
      >
        <template v-slot:top>
          <div class="col-2 q-table__title">Expenses</div>
          <q-space />
          <q-btn
            label="Add Expense"
            unelevated
            icon="add"
            class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
            @click="handleAddNewExpense()"
          />
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
    <div
      class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-end q-pa-md"
    >
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Expense:</span>
          <span class="md:text-lg"> {{ SaleSummary.totalExpense }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">HO Outgoing:</span>
          <span class="md:text-lg"> {{ SaleSummary.totalOutgoingToHO }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Remaining Balance :</span>
          <span class="md:text-lg"> {{ SaleSummary.remainingBalance }} </span>
        </div>
      </div>
    </div>
    <div class="row justify-center md:justify-end">
      <q-btn
        class="mr-2"
        label="Close Shop"
        unelevated
        color="btn-primary hover:bg-btn-cancel-hover"
        @click="handleColseShop()"
      />
      <q-btn
        class="mr-5"
        label="Back"
        unelevated
        color="btn-cancel hover:bg-btn-cancel-hover"
        @click="$router.go(-1)"
      />
    </div>
    <q-dialog v-model="showAddNewExpenseModal">
      <add-new-expense-modal @confirm="updateSaleSummary()" />
    </q-dialog>
    <q-dialog v-model="showCloseShopModal">
      <close-shop-modal @confirm="updateSaleSummary()" />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { IShopSaleExpenses, SaleSummaryResponse } from 'src/interfaces';
import AddNewExpenseModal from 'components/today-sale-summary/AddNewExpenseModal.vue';
import CloseShopModal from 'components/today-sale-summary/CloseShop.vue';
import { saleSummaryApi } from 'src/services';
import { shopSaleExpenseTableColumn } from './utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
const $q = useQuasar();
const authStore = useAuthStore();
const todayDate = Date.now();
const showAddNewExpenseModal = ref(false);
const showCloseShopModal = ref(false);
const ShopId = authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
const SaleSummary = ref<{
  openingBalance: number;
  todaySale: number;
  totalDiscount: number;
  shopAccountStatus: string;
  createdDate: string;
  lastClosingDate: string;
  shopName: string;
  totalItemsSale: number;
  totalExpense: number;
  availableStock: number;
  remainingBalance: number;
  totalIncomingFromHO: number;
  totalOutgoingToHO: number;
  totalReturnSaleAmount: number;
  ShopManagementExpenseRecords: IShopSaleExpenses[];
}>({
  openingBalance: 0,
  todaySale: 0,
  totalDiscount: 0,
  shopAccountStatus: '',
  createdDate: '',
  lastClosingDate: '',
  shopName: '',
  totalItemsSale: 0,
  totalExpense: 0,
  availableStock: 0,
  remainingBalance: 0,
  totalIncomingFromHO: 0,
  totalOutgoingToHO: 0,
  totalReturnSaleAmount: 0,
  ShopManagementExpenseRecords: [],
});
onMounted(async () => {
  await updateSaleSummary();
});
const handleAddNewExpense = async () => {
  showAddNewExpenseModal.value = true;
};
const handleColseShop = async () => {
  showCloseShopModal.value = true;
};
const updateSaleSummary = async () => {
  try {
    const res = await saleSummaryApi(ShopId);
    if (res.type === 'Success') {
      const responseData = res.data as SaleSummaryResponse | null;
      if (responseData) {
        SaleSummary.value = {
          openingBalance: responseData.openingBalance,
          todaySale: responseData.totalSale,
          totalDiscount: responseData.totalDiscount,
          shopAccountStatus: responseData.shopAccountStatus,
          createdDate: responseData.createdDate ?? todayDate,
          lastClosingDate: responseData.lastClosingDate,
          shopName: responseData.shopName,
          totalItemsSale: responseData.totalItemsSale,
          totalExpense: responseData.totalExpense,
          availableStock: responseData.availableStock,
          remainingBalance: responseData.remainingBalance,
          totalIncomingFromHO: responseData.totalIncomingFromHO,
          totalOutgoingToHO: responseData.totalOutgoingToHO,
          totalReturnSaleAmount: responseData.totalReturnSaleAmount,
          ShopManagementExpenseRecords: responseData.salesExpenseSummary,
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
  showAddNewExpenseModal.value = false;
};
</script>
