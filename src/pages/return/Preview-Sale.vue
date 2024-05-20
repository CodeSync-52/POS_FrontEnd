<template>
  <div>
    <div
      v-if="!routerPath.includes('editHoldBill')"
      class="row justify-between"
    >
      <div class="q-gutter-sm">
        <q-radio
          v-model="receipt.sampleType"
          color="btn-primary"
          val="first"
          label="Template 1"
        />
        <q-radio
          v-model="receipt.sampleType"
          color="btn-primary"
          val="second"
          label="Template 2"
        />
      </div>
      <q-btn
        label="Print invoice"
        unelevated
        color="btn-primary"
        :loading="isLoading"
        :disable="!ReceiptToPrint"
        @click="handlePrintReceipt"
      />
    </div>
    <div class="font-semibold text-lg text-center">
      <div>Invoice Number : {{ SaleSummary.invoiceNumber }}</div>
      <div>
        {{ moment(SaleSummary.saleDate).format('dddd, D MMMM, YYYY') }}
      </div>
    </div>
    <div
      class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-between q-pa-md"
    >
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Status:</span>
          <span class="md:text-lg"> {{ SaleSummary.status }}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Shop Name :</span>
          <span class="md:text-lg">
            {{ SaleSummary.shopName }}
          </span>
        </div>

        <div
          v-if="routerPath.includes('editHoldBill')"
          class="md:flex md:justify-between md:w-full items-center"
        >
          <div class="row gap-6 items-center">
            <span class="font-medium md:text-lg">Select Articles</span>
            <q-btn
              icon="add"
              rounded
              dense
              unelevated
              color="btn-primary"
              @click="isInventoryListModalVisible = true"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total Quantity :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalQuantity }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Sale Id :</span>
          <span class="md:text-lg"> {{ SaleSummary.saleId }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Sale Person Code :</span>
          <span class="md:text-lg"> {{ SaleSummary.salePersonCode }} </span>
        </div>
      </div>
    </div>
    <div class="py-4 w-full">
      <q-table
        auto-width
        :loading="isLoading"
        :rows="SaleSummary.saleDetailInfos"
        :columns="shopSalePreviewTableColumn"
        :visible-columns="
          routerPath.includes('preview')
            ? [
                'productImage',
                'productCode',
                'dispatchQuantity',
                'amount',
                authStore.loggedInUser?.isRetailDiscountAllowed && 'discount',
                'isReturn',
              ].filter(Boolean)
            : [
                'productImage',
                'productName',
                'availableQuantity',
                'retailPrice',
                'dispatchQuantity',
                authStore.loggedInUser?.isRetailDiscountAllowed && 'discount',
                'action',
              ].filter(Boolean)
        "
        :rows-per-page-options="[0]"
        row-key="id"
      >
        <template v-slot:body-cell-productImage="props">
          <q-td :props="props">
            <div
              @click="handlePreviewImage(props.row.productImage)"
              class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
              :class="props.row.productImage ? 'cursor-pointer' : ''"
            >
              <img
                class="w-full h-full object-cover"
                :src="props.row.productImage || 'assets/default-image.png'"
                alt="img"
              />
            </div>
          </q-td>
        </template>
        <template
          v-slot:header-cell-action
          v-if="routerPath.includes('preview')"
        >
          <q-th></q-th>
        </template>
        <template
          v-if="routerPath.includes('editHoldBill')"
          v-slot:body-cell-dispatchQuantity="props"
        >
          <q-td :props="props">
            <q-input
              type="number"
              v-model="props.row.dispatchQuantity"
              ref="dispatchQuantityInput"
              :min="0"
              :max="props.row.maxDispatchQuantityAllowed"
              dense
              outlined
              class="w-[150px]"
              color="btn-primary"
              @update:model-value="
                handleUpdatedispatchQuantity($event, props.row)
              "
            />

            <span v-if="props.row.errorMessage" class="text-red text-sm">{{
              props.row.errorMessage
            }}</span>
          </q-td>
        </template>
        <template
          v-if="
            routerPath.includes('editHoldBill') &&
            authStore.loggedInUser?.isRetailDiscountAllowed
          "
          v-slot:body-cell-discount="props"
        >
          <q-td :props="props">
            <q-input
              v-model="props.row.discount"
              :disable="props.row.isReturn"
              type="number"
              dense
              min="0"
              outlined
              color="btn-primary"
              class="w-[150px]"
              @update:model-value="
                handleUpdateDiscount(
                  $event,
                  props.row,
                  authStore.loggedInUser?.discount ?? 0
                )
              "
            />
          </q-td>
        </template>

        <template
          v-if="routerPath.includes('editHoldBill')"
          v-slot:body-cell-action="props"
        >
          <q-td :props="props">
            <div>
              <q-btn
                dense
                size="md"
                icon="check"
                flat
                unelevated
                color="green"
                @click="handleEditBill(props.row.inventoryId)"
              >
                <q-tooltip class="bg-green" :offset="[10, 10]">
                  Add Sale
                </q-tooltip>
              </q-btn>
              <q-btn
                dense
                size="md"
                icon="delete"
                flat
                unelevated
                color="red"
                @click="
                  handleDeleteSaleItem(
                    Number(selectedId),
                    props.row.saleDetailId,
                    props.row.inventoryId
                  )
                "
              >
                <q-tooltip class="bg-red" :offset="[10, 10]">
                  Delete Sale
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available.</span>
          </div>
        </template>
      </q-table>
    </div>
    <div
      v-if="routerPath.includes('editHoldBill')"
      class="flex justify-center lg:justify-start mb-3"
    >
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-7">
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg">Total :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalSalesAmount }} </span>
        </div>
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg">Total Quantity :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalQuantity }} </span>
        </div>
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg">Total Discount :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalDiscount }} </span>
        </div>
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg">Cash Received:</span>
          <q-input
            v-model="cashReceived"
            type="number"
            maxlength="250"
            outlined
            dense
            color="btn-primary"
          />
        </div>
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg">Change:</span>
          <q-input
            v-model="cashReturn"
            type="number"
            maxlength="250"
            readonly
            borderless
            dense
            color="btn-primary"
          />
        </div>
        <div
          v-if="routerPath.includes('preview')"
          class="md:flex gap-3 items-center"
        >
          <span class="font-medium md:text-lg">Refund :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalReturnAmount }} </span>
        </div>
        <div class="md:flex gap-3 items-center">
          <span class="font-medium md:text-lg text-btn-primary"
            >Net Total :</span
          >
          <span class="md:text-lg text-btn-primary font-medium">
            {{ SaleSummary.netAmount }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center lg:justify-start">
      <span class="font-medium md:text-lg">Comment :</span>
      <span class="md:text-lg"> {{ SaleSummary.comments }} </span>
    </div>
    <div class="row justify-center md:justify-end gap-2">
      <q-btn
        v-if="routerPath.includes('editHoldBill')"
        label="Complete Bill"
        unelevated
        color="btn-primary hover:btn-primary-hover"
        @click="handleCompleteSale(Number(selectedId), 1)"
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
  <q-dialog v-model="isPreviewImageModalVisible">
    <q-card class="max-w-[400px]">
      <q-card-section>
        <div class="min-w-[2rem]">
          <img
            class="w-full h-full object-cover"
            :src="selectedPreviewImage"
            alt="img"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isInventoryListModalVisible">
    <inventory-list-modal
      title="Articles"
      @selected-data="handleSelectedData"
    />
  </q-dialog>
  <div ref="ReceiptToPrint" class="receipt hidden">
    <sale-receipt
      :receipt-detail="receiptDetail"
      :is-first-sample="receipt.sampleType"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import SaleReceipt from 'src/components/today-sale-summary/Sale-Receipt.vue';
import { useRouter } from 'vue-router';
import { ISaleInfo, IPreviewSaleResponse, ISaleDetail } from 'src/interfaces';
import InventoryListModal from 'src/components/inventory/New-Inventory-List-Modal.vue';
import {
  GetSaleDetail,
  ChangeSaleStatus,
  DeleteSaleLineItem,
  CreateSaleLineItem,
  UpdateSaleLineItem,
} from 'src/services';
import { printReceipt, shopSalePreviewTableColumn } from './utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
const $q = useQuasar();
const router = useRouter();
const cashReceived = ref<number>(0);
const authStore = useAuthStore();
const isLoading = ref(false);
const receipt = ref<{
  receiptId: null | number;
  receiptTime: null | number;
  sampleType: 'first' | 'second';
}>({
  receiptId: null,
  receiptTime: null,
  sampleType: 'first',
});
const isPreviewImageModalVisible = ref(false);
const isInventoryListModalVisible = ref(false);
const titleAction = ref('Preview Sale Bill');
const selectedPreviewImage = ref('');
const ReceiptToPrint = ref<null | HTMLDivElement>(null);
const dispatchQuantityInput = ref<null | HTMLDivElement>(null);
const receiptDetail = ref<null | IPreviewSaleResponse>(null);
const routerPath = router.currentRoute.value.fullPath;
const selectedId: string | string[] = router.currentRoute.value.params.id;
const SaleSummary = ref<{
  totalReturnAmount: number;
  saleId: number;
  invoiceNumber: string;
  salePersonCode: string;
  shopId: number;
  totalQuantity: number;
  totalSalesAmount: number;
  totalDiscount: number;
  netAmount: number;
  comments: string;
  status: string;
  shopName: string;
  saleDate: string;
  saleDetailInfos: ISaleInfo[];
}>({
  totalReturnAmount: 0,
  saleId: 0,
  invoiceNumber: '',
  salePersonCode: '-',
  shopId: 0,
  totalQuantity: 0,
  totalSalesAmount: 0,
  totalDiscount: 0,
  netAmount: 0,
  comments: '',
  status: '-',
  shopName: '-',
  saleDate: '',
  saleDetailInfos: [],
});
onMounted(async () => {
  await previewBill(Number(selectedId));
  if (routerPath.includes('editHoldBill')) {
    titleAction.value = 'Edit Hold Bill';
    document.body.addEventListener('keydown', handleKeyPress);
  }
});
const handleSelectedData = (payload: ISaleInfo[]) => {
  const oldIdList = SaleSummary.value.saleDetailInfos.map(
    (item) => item.inventoryId
  );

  payload.forEach((item) => {
    if (!oldIdList.includes(item.inventoryId)) {
      SaleSummary.value.saleDetailInfos.push({
        ...item,
        availableQuantity: item.quantity,
        dispatchQuantity: 0,
        discount: 0,
        isReturn: false,
      });
    }
  });

  isInventoryListModalVisible.value = false;
};

const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const handleUpdatedispatchQuantity = (
  newVal: string | number | null,
  selectedRecord: ISaleInfo
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val < 0) {
      selectedRecord.dispatchQuantity = 0;
      selectedRecord.errorMessage = '';
    } else if (val > selectedRecord.maxDispatchQuantityAllowed) {
      selectedRecord.dispatchQuantity = 0;
      selectedRecord.errorMessage = 'Invalid Quantity !';
      $q.notify({
        message: `Product ${selectedRecord.productName} ${selectedRecord.productCode} quantity is more than the available quantity. Please add the quantity again!`,
        color: 'red',
        icon: 'warning',
      });
    } else {
      selectedRecord.dispatchQuantity = val;
      selectedRecord.errorMessage = '';
    }
  }
};
const cashReturn = computed(() => {
  return cashReceived.value - SaleSummary.value.netAmount;
});
const handleUpdateDiscount = (
  newVal: string | number | null,
  row: ISaleInfo,
  discountPercentage: number
) => {
  const retailPrice = row.retailPrice;
  const dispatchQuantity = row.dispatchQuantity;
  const dP = discountPercentage / 100;
  const discountAmount = retailPrice * dispatchQuantity * dP;
  if (newVal === null || newVal === '') {
    row.discount = 0;
  } else {
    const value = parseInt(newVal.toString());
    if (!value) {
      row.discount = 0;
    } else if (value > discountAmount) {
      row.discount = discountAmount;
    } else if (value < -1 * discountAmount) {
      row.discount = -1 * discountAmount;
    } else {
      row.discount = value;
    }
  }
};

const handlePrintReceipt = () => {
  printReceipt(ReceiptToPrint);
};
const handleKeyPress = async (e: KeyboardEvent) => {
  if (e.key === 'o' || e.key === 'O') {
    isInventoryListModalVisible.value = true;
  }
};
const previewBill = async (saleId: number) => {
  try {
    isLoading.value = true;
    const res = await GetSaleDetail(saleId);
    if (res.type === 'Success') {
      receiptDetail.value = res.data;
      const responseData = res.data as IPreviewSaleResponse | null;
      if (responseData) {
        SaleSummary.value = {
          totalReturnAmount: responseData.totalReturnAmount,
          saleId: responseData.saleId,
          invoiceNumber: responseData.invoiceNumber,
          salePersonCode: responseData.salePersonCode,
          shopId: responseData.shopId,
          totalQuantity: responseData.totalQuantity,
          totalSalesAmount: responseData.totalSalesAmount,
          totalDiscount: responseData.totalDiscount,
          netAmount: responseData.netAmount,
          comments: responseData.comments,
          status: responseData.status,
          shopName: responseData.shopName,
          saleDate: responseData.saleDate,
          saleDetailInfos: responseData.saleDetailInfos,
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
  } finally {
    isLoading.value = false;
  }
};
const handleCompleteSale = async (saleId: number, saleStatus: number) => {
  try {
    const response = await ChangeSaleStatus({ saleId, saleStatus });
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      router.push(`/shop-sale/${Number(selectedId)}/preview`);
      setTimeout(() => {
        location.reload();
      }, 100);
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
const handleDeleteSaleItem = async (
  saleId: number,
  saleDetailId: number,
  inventoryId: number
) => {
  try {
    if (!saleDetailId) {
      const indexToRemove = SaleSummary.value.saleDetailInfos.findIndex(
        (row) => row.inventoryId === inventoryId
      );
      SaleSummary.value.saleDetailInfos.splice(indexToRemove, 1);
    } else {
      const response = await DeleteSaleLineItem({ saleId, saleDetailId });
      if (response.type === 'Success') {
        $q.notify({
          message: response.message,
          type: 'positive',
        });
        const indexToRemove = SaleSummary.value.saleDetailInfos.findIndex(
          (row) => row.saleDetailId === saleDetailId
        );
        if (indexToRemove !== -1) {
          SaleSummary.value.saleDetailInfos.splice(indexToRemove, 1);
        }
        previewBill(Number(selectedId));
      }
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
const handleEditBill = async (id: number) => {
  const saleId = Number(selectedId);
  const selectedRow = SaleSummary.value.saleDetailInfos.find(
    (row) => row.inventoryId === id
  );
  if (selectedRow) {
    if (selectedRow.dispatchQuantity === 0) {
      let message = 'Dispatch Quantity Required';
      $q.notify({
        message,
        icon: 'error',
        color: 'orange',
      });
      dispatchQuantityInput.value?.focus();
    } else if (selectedRow.retailPrice === 0) {
      $q.notify({
        message:
          'Cannot ADD this Sale Item. Selected item has a retailPrice of 0.',
        type: 'warning',
      });
    } else if (selectedRow.saleDetailId) {
      await handleUpdateSaleItem(selectedRow.saleDetailId, {
        quantity: selectedRow.dispatchQuantity,
        discount: selectedRow.discount,
      });
    } else {
      const saleDetails = {
        inventoryId: selectedRow.inventoryId,
        quantity: selectedRow.dispatchQuantity,
        discount: selectedRow.discount,
      };
      await handleAddSaleItem(saleId, saleDetails);
    }
  }
};
const handleUpdateSaleItem = async (
  saleDetailId: number,
  saleDetails: ISaleDetail
) => {
  try {
    const res = await UpdateSaleLineItem({
      saleDetailId,
      saleDetails: { ...saleDetails },
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      isLoading.value = true;
      SaleSummary.value.saleDetailInfos = [];
      isLoading.value = false;
      previewBill(Number(selectedId));
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
};

const handleAddSaleItem = async (saleId: number, saleDetails: ISaleDetail) => {
  try {
    const res = await CreateSaleLineItem({
      saleId,
      saleDetails: { ...saleDetails },
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      isLoading.value = true;
      SaleSummary.value.saleDetailInfos = [];
      isLoading.value = false;
      previewBill(Number(selectedId));
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
};
</script>
