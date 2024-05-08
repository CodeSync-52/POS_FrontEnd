<template>
  <div>
    <div class="font-semibold text-lg text-center">
      <span>Shop Closing : {{ SaleSummary.shopName }} </span>
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
          <span class="font-medium md:text-lg">Item's Sold :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalItemsSale }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Discounts :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalDiscount }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Refunds :</span>
          <span class="md:text-lg">
            {{ SaleSummary.totalReturnSaleAmount }}
          </span>
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
          <span class="font-medium md:text-lg">Net Sale :</span>
          <span class="md:text-lg">
            {{
              SaleSummary.todaySale -
              SaleSummary.totalDiscount -
              SaleSummary.totalReturnSaleAmount
            }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">- Expenses:</span>
          <span class="md:text-lg"> {{ SaleSummary.totalExpense }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">- Submitted To HO:</span>
          <span class="md:text-lg"> {{ SaleSummary.totalOutgoingToHO }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">+ Received From HO :</span>
          <span class="md:text-lg">
            {{ SaleSummary.totalIncomingFromHO }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Remaining Balance :</span>
          <span class="md:text-lg"> {{ SaleSummary.remainingBalance }} </span>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        bordered
        :rows="SaleSummary.ShopManagementExpenseRecords"
        :columns="shopSaleExpenseTableColumn"
        :rows-per-page-options="[0]"
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
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="flex min-w-[72px]">
              <q-btn
                dense
                size="md"
                icon="delete"
                flat
                unelevated
                color="red"
                @click="handleCancelBill(props.row.shopAccountDetailId)"
              >
                <q-tooltip class="bg-red" :offset="[10, 10]">
                  Delete Expense
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
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
        bordered
        :rows="SaleSummary.outgoingToHo"
        :columns="shopSaleOutgoingToHoTableColumn"
        :rows-per-page-options="[0]"
        row-key="id"
      >
        <template v-slot:top>
          <div class="col-2 q-table__title">Outgoing To Ho</div>
          <q-space />
          <q-btn
            label="Add New"
            unelevated
            icon="add"
            class="rounded-[4px] bg-btn-primary text-signature hover:bg-btn-secondary"
            @click="handleColseShop()"
          />
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="flex min-w-[72px]">
              <q-btn
                dense
                size="md"
                icon="delete"
                flat
                unelevated
                color="red"
                @click="handleDeleteRow(props.row.shopAccountDetailId)"
              >
                <q-tooltip class="bg-red" :offset="[10, 10]">
                  Delete Expense
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
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
      ></div>
    </div>
    <div class="row justify-center md:justify-end">
      <q-btn
        class="mr-2"
        label="Close Shop"
        unelevated
        color="btn-primary hover:bg-btn-cancel-hover"
        @click="handleCashSendToHo()"
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
    <q-dialog v-model="showDeleteExpenseModal">
      <complete-cancel-bill-modal
        title="Delete Expense"
        message="Are you sure you want to Delete the Expense?"
        @confirm="handleDeleteExpense(selectedRowId)"
      />
    </q-dialog>
    <q-dialog v-model="showDeleteHoModal">
      <complete-cancel-bill-modal
        title="Outgoing To Ho"
        message="Are you sure you want to this transaction?"
        @confirm="handleDeleteHoRow(selectedRowId)"
      />
    </q-dialog>
    <q-dialog v-model="showCashSendToHoModal">
      <complete-cancel-bill-modal
        title="Close Shop"
        message="Are you sure you want to Close Shop?"
        @confirm="handcloseShop(ShopId)"
      />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  IShopSaleExpenses,
  SaleSummaryResponse,
  IOutgoingToHo,
} from 'src/interfaces';
import AddNewExpenseModal from 'src/components/today-sale-summary/Add-New-Expense-Modal.vue';
import CompleteCancelBillModal from 'src/components/return/Complete-Or-Cancel-Modal.vue';
import CloseShopModal from 'src/components/today-sale-summary/Close-Shop.vue';
import {
  GetShopAccountSummary,
  DiscardExpenseFromShopAccount,
  deleteRowFromShopAccountOutgoingToHo,
  closeShop,
} from 'src/services';
import {
  shopSaleExpenseTableColumn,
  shopSaleOutgoingToHoTableColumn,
} from './utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const todayDate = Date.now();
const showAddNewExpenseModal = ref(false);
const showCloseShopModal = ref(false);
const showDeleteExpenseModal = ref(false);
const showDeleteHoModal = ref(false);
const showCashSendToHoModal = ref(false);
const selectedRowId = ref<number>(-1);
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
  outgoingToHo: IOutgoingToHo[];
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
  outgoingToHo: [],
});
onMounted(async () => {
  await updateSaleSummary();
});
const handleCancelBill = async (selectedRow: number) => {
  selectedRowId.value = selectedRow;
  showDeleteExpenseModal.value = true;
};
const handleDeleteRow = async (selectedRow: number) => {
  selectedRowId.value = selectedRow;
  showDeleteHoModal.value = true;
};
const handleCashSendToHo = async () => {
  showCashSendToHoModal.value = true;
};
const handleAddNewExpense = async () => {
  showAddNewExpenseModal.value = true;
};
const handleColseShop = async () => {
  showCloseShopModal.value = true;
};
const updateSaleSummary = async () => {
  try {
    const res = await GetShopAccountSummary(ShopId);
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
          outgoingToHo: responseData.outgoingToHO,
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
  showCloseShopModal.value = false;
};
const handleDeleteExpense = async (shopAccountDetailId: number) => {
  try {
    const response = await DiscardExpenseFromShopAccount({
      shopAccountDetailId,
    });
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      updateSaleSummary();
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  showDeleteExpenseModal.value = false;
};
const handleDeleteHoRow = async (shopAccountDetailId: number) => {
  try {
    const response = await deleteRowFromShopAccountOutgoingToHo({
      shopAccountDetailId,
    });
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      updateSaleSummary();
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  showDeleteHoModal.value = false;
};
const handcloseShop = async (shopId: number) => {
  try {
    const response = await closeShop({
      shopId,
    });
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      router.go(-1);
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
</script>
