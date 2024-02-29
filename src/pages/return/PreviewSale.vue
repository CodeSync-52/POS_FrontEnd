<template>
  <div>
    <!-- <span class="font-semibold text-lg"> {{ titleAction }} </span> -->
    <div class="font-semibold text-lg text-center">
      <div>Invoice Number : {{ SaleSummary.invoiceNumber }} </div>
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
          <span class="md:text-lg"> {{ SaleSummary.status}}</span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Shop Name :</span>
          <span class="md:text-lg">
            {{ SaleSummary.shopName }}
          </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Sale Person Code :</span>
          <span class="md:text-lg"> {{ SaleSummary.salePersonCode }} </span>
        </div>
        <div v-if="routerPath.includes('editHoldBill')" class="md:flex md:justify-between md:w-full items-center">
          <div class="row gap-6 items-center">
            <span class="font-medium md:text-lg">Add Articles</span>
            <q-btn
              icon="add"
              rounded
              dense
              unelevated
              color="btn-primary"
              @click="isInventoryListModalVisible = true"
            />
          </div>
          <outside-click-container @outside-click="handleOutsideClick">
            <q-input
              autofocus
              ref="scannedLabelInput"
              class=" max-w-[200px]"
              v-model="scannedLabel"
              :loading="scannedLabelLoading"
              outlined
              dense
              @keydown="dialogClose"
              label="Scan label"
              color="btn-primary"
            />
          </outside-click-container>
        </div>
      </div>
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total Quantity :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalQuantity}} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Sale Id :</span>
          <span class="md:text-lg"> {{ SaleSummary.saleId }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Overall Discounts :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalDiscount }} </span>
        </div>
      </div>

    </div>
    <div class="py-4 w-full">
      <q-table
        auto-width
        :loading="isLoading"
        :rows="SaleSummary.saleDetailInfos"
        :columns="shopSalePreviewTableColumn"
        :rows-per-page-options="[0]"
        row-key="id"
      >
      <template v-slot:body-cell-productImage="props">
        <q-td :props="props">
          <div
            @click="handlePreviewImage(props.row.productImage)"
            class="h-[50px] w-[50px] min-w-[2rem] overflow-hidden rounded-full"
            :class="props.row.productImage ? 'cursor-pointer' : ''"
          >
            <img
              class="w-full h-full object-cover"
              :src="
                getImageUrl(props.row.productImage) ||
                'assets/default-image.png'
              "
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
          :max=" routerPath.includes('editHoldBill')?
          props.row.alreadyDispatchedQuantity +
          SaleSummary.saleDetailInfos.find(
                  (record) =>
                    record.inventoryId === props.row.inventoryId
                )?.quantity
                : props.row.quantity
          "
          @update:model-value="
            handleUpdatedispatchQuantity($event, props.row)
          "
          dense
          outlined
          class="w-[150px]"
          color="btn-primary"
        />
        <span
          v-if="props.row.errorMessage"
          class="text-red text-sm"
          >{{ props.row.errorMessage }}</span
        >
      </q-td>
    </template>

      <template
      v-if="routerPath.includes('editHoldBill')"
      v-slot:body-cell-discount="props"
    >
      <q-td :props="props">
        <q-input
          v-model="props.row.discount"

          :disable="props.row.isReturn"
          type="number"
          dense
          outlined
          color="btn-primary"
          class="w-[150px]"
        />
        <!-- @update:model-value="
        handleUpdateDiscount($event, props.row)
      " -->
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
      class="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center md:justify-end q-pa-md"
    >
      <div
        class="flex flex-col gap-2 md:min-w-[350px] md:gap-4 items-center md:items-start md:pr-2"
      >
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Total :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalSalesAmount }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Refund :</span>
          <span class="md:text-lg"> {{ SaleSummary.totalReturnAmount }} </span>
        </div>
        <div class="md:flex md:justify-between md:w-full items-center">
          <span class="font-medium md:text-lg">Net Total :</span>
          <span class="md:text-lg"> {{ SaleSummary.netAmount }} </span>
        </div>
      </div>
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
</template>
<script lang="ts" setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import {  ISaleInfo,IPreviewSaleResponse,ISaleDetail } from 'src/interfaces';
import InventoryListModal from 'src/components/inventory/NewInventoryListModal.vue';
import OutsideClickContainer from 'src/components/common/OutsideClickContainer.vue';
import { previewSaleApi,changeSaleStatusApi,deleteSaleApi,addSaleItemApi,updateSaleItemApi } from 'src/services';
import { shopSalePreviewTableColumn } from './utils';
import { isPosError } from 'src/utils';
import moment from 'moment';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const router = useRouter();
const isLoading = ref(false);
const isPreviewImageModalVisible = ref(false);
const isInventoryListModalVisible = ref(false);
const titleAction = ref('Preview Sale Bill');
const selectedPreviewImage = ref('');
const scannedLabel = ref('');
const scannedLabelInput = ref<null | HTMLDivElement>(null);
const scannedLabelLoading = ref(false);
const routerPath = router.currentRoute.value.fullPath;
const selectedId: string | string[] = router.currentRoute.value.params.id;
const SaleSummary = ref<{
  totalReturnAmount: number,
  saleId: number,
  invoiceNumber: string,
  salePersonCode: string,
  shopId: number,
  totalQuantity: number,
  totalSalesAmount: number,
  totalDiscount: number,
  netAmount: number,
  comments: string,
  status: string,
  shopName: string,
  saleDate: string,
  saleDetailInfos:ISaleInfo[];
}>({
  totalReturnAmount: 0,
  saleId: 0,
  invoiceNumber: '',
  salePersonCode: '-',
  shopId: 0,
  totalQuantity: 0,
  totalSalesAmount: 0,
  totalDiscount:0,
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
   }
   console.log(SaleSummary.value.saleDetailInfos);

});
const dialogClose = (e: KeyboardEvent) => {
  if (e.key === 'n' || e.key === 'N') {
    window.removeEventListener('keypress', handleKeyPress);
  }
};
const handleSelectedData = (payload: ISaleInfo[]) => {

  const oldIdList = SaleSummary.value.saleDetailInfos.map((item) => item.inventoryId);

  payload.forEach((item) => {
    if (!oldIdList.includes(item.inventoryId)) {
      SaleSummary.value.saleDetailInfos.push({
        ...item,
        discount: 0,
        isReturn: false,
      });
    }
  });

  isInventoryListModalVisible.value = false;
};
const handleOutsideClick = () => {
  window.addEventListener('keypress', handleKeyPress);
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
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
      selectedRecord.quantity = 0;
      selectedRecord.errorMessage = '';
    } else if (
      val >
      selectedRecord.quantity + (selectedRecord.alreadyDispatchedQuantity ?? 0)
    ) {
      selectedRecord.quantity =
        0 + (selectedRecord.alreadyDispatchedQuantity ?? 0);
      selectedRecord.errorMessage = 'Invalid Quantity !';
      $q.notify({
        message: `Product ${selectedRecord.productName} ${selectedRecord.productCode} quantity is more than the available quantity. Please add the quantity again!`,
        color: 'red',
        icon: 'warning',
      });
    } else {
      selectedRecord.quantity = val;
      selectedRecord.errorMessage = '';
    }
  }
};
const previewBill = async (saleId: number) => {
  try {
    isLoading.value = true;
    const res = await previewSaleApi(saleId);
    if (res.type === 'Success') {
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

    const response = await changeSaleStatusApi({ saleId, saleStatus });
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
const handleDeleteSaleItem = async (saleId: number, saleDetailId: number, inventoryId: number) => {
  try {

    if(!saleDetailId){
      const indexToRemove = SaleSummary.value.saleDetailInfos.findIndex(
        (row) => row.inventoryId === inventoryId
      );
      SaleSummary.value.saleDetailInfos.splice(indexToRemove, 1);
    }
    else{
    const response = await deleteSaleApi({ saleId, saleDetailId });
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
const isDeleteButtonDisabled = (row: ISaleInfo) => {
  return !row.saleDetailId;
};

const handleEditBill = async (id: number) => {
  const saleId = Number(selectedId);
  const selectedRow = SaleSummary.value.saleDetailInfos.find(
    (row) => row.inventoryId === id
  );
  if (selectedRow) {
    if (selectedRow.quantity === 0) {
      let message = 'Dispatch Quantity Required';
      $q.notify({
        message,
        icon: 'error',
        color: 'orange',
      });
    } else if (selectedRow.saleDetailId) {
      await handleUpdateSaleItem(selectedRow.saleDetailId, {
        quantity: selectedRow.quantity,
        discount: selectedRow.discount,
      });
    } else {
      const saleDetails = {
        inventoryId: selectedRow.inventoryId,
        quantity: selectedRow.quantity,
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
    const res = await updateSaleItemApi({
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
      // await inventoryDetailList();
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
    const res = await addSaleItemApi({
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
      // await inventoryDetailList();
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
