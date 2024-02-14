<template>
  <div>
    <div class="font-semibold text-lg text-center">
      <span>Shop Summary : {{ shopName }} </span>
      <div>{{ moment(createdDate).format('dddd, D MMMM, YYYY') }}</div>
    </div>
    <div
      class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-between q-pa-md"
    >
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Status :</span>
          <span class="md:text-lg"> {{ shopAccountStatus }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Last Closing Date :</span>
          <span class="md:text-lg">
            {{ moment(lastClosingDate).format('ddd, D MMM, YYYY') }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Available Stock :</span>
          <span class="md:text-lg"> {{ availableStock }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Item's Sold Today :</span>
          <span class="md:text-lg"> {{ totalItemsSale }} </span>
        </div>
      </div>
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Opening Balance :</span>
          <span class="md:text-lg"> {{ openingBalance }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Gross Sales :</span>
          <span class="md:text-lg"> {{ todaySale }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Discounts :</span>
          <span class="md:text-lg"> {{ totalDiscount }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">HO Incoming :</span>
          <span class="md:text-lg"> {{ totalIncomingFromHO }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Refunds :</span>
          <span class="md:text-lg"> {{ totalReturnSaleAmount }} </span>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        bordered
        :rows="ShopManagementExpenseRecords"
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
          <span class="md:text-lg"> {{ totalExpense }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">HO Outgoing:</span>
          <span class="md:text-lg"> {{ totalOutgoingToHO }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Remaining Balance :</span>
          <span class="md:text-lg"> {{ remainingBalance }} </span>
        </div>
      </div>
    </div>
    <div class="row justify-end">
      <q-btn
        label="CLOSE"
        unelevated
        color="btn-cancel hover:bg-btn-cancel-hover"
        @click="$router.go(-1)"
      />
    </div>
    <q-dialog v-model="showAddNewExpenseModal">
      <add-new-expense-modal @confirm="updateSaleSummary()" />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { IShopSaleExpenses, SaleSummaryResponse } from 'src/interfaces';
import AddNewExpenseModal from 'components/today-sale-summary/AddNewExpenseModal.vue';
import { saleSummaryApi } from 'src/services';
import { shopSaleExpenseTableColumn } from './utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
const $q = useQuasar();
const authStore = useAuthStore();
const showAddNewExpenseModal = ref(false);
const openingBalance = ref(0);
const todaySale = ref(0);
const totalDiscount = ref(0);
const shopAccountStatus = ref('');
const createdDate = ref('');
const lastClosingDate = ref('');
const shopName = ref('');
const totalItemsSale = ref(0);
const totalExpense = ref(0);
const availableStock = ref(0);
const remainingBalance = ref(0);
const totalIncomingFromHO = ref(0);
const totalOutgoingToHO = ref(0);
const totalReturnSaleAmount = ref(0);
const ShopManagementExpenseRecords = ref<IShopSaleExpenses[]>([]);
const ShopId = authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
onMounted(async () => {
  await updateSaleSummary();
});
const handleAddNewExpense = async () => {
  showAddNewExpenseModal.value = true;
};
const updateSaleSummary = async () => {
  try {
    const res = await saleSummaryApi(ShopId);
    if (res.type === 'Success') {
      const responseData = res.data as SaleSummaryResponse | null;
      if (responseData) {
        shopName.value = responseData.shopName;
        shopAccountStatus.value = responseData.shopAccountStatus;
        openingBalance.value = responseData.openingBalance;
        remainingBalance.value = responseData.remainingBalance;
        availableStock.value = responseData.availableStock;
        totalItemsSale.value = responseData.totalItemsSale;
        totalDiscount.value = responseData.totalDiscount;
        totalIncomingFromHO.value = responseData.totalIncomingFromHO;
        totalOutgoingToHO.value = responseData.totalOutgoingToHO;
        todaySale.value = responseData.totalSale;
        totalExpense.value = responseData.totalExpense;
        createdDate.value = responseData.createdDate;
        lastClosingDate.value = responseData.lastClosingDate;
        totalReturnSaleAmount.value = responseData.totalReturnSaleAmount;
        ShopManagementExpenseRecords.value = responseData.salesExpenseSummary;
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
