<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ billAction }}</span>
    </div>
    <q-card v-if="billAction === 'Generate Receipt'">
      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-6">
            <q-input
              type="number"
              min="0"
              disable
              v-model="billGenerationData.outStandingBalance"
              dense
              label="Outstanding Balance"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              type="date"
              disable
              v-model="formattedPurchaseDate"
              dense
              label="Date"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              disable
              v-model="billGenerationData.fullName"
              dense
              label="User Name"
              outlined
            />
          </div>
        </div>
        <q-table
          :loading="isLoading"
          :rows="billGenerationData.productInfoDetailList"
          :columns="editBillGenerationRecordsColumn"
        >
          <template v-slot:body-cell-amount="props">
            <q-td :props="props">
              {{ props.row.amount }}
              <q-popup-edit
                :disable="router.currentRoute.value.path.includes('preview')"
                v-model="props.row.amount"
                color="btn-primary"
                title="Update Amount"
                buttons
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model="scope.value"
                  @update:model-value="
                    scope.value = ($event as number) >= 0 ? Number($event) : 0
                  "
                  color="btn-primary"
                  min="0"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div
                class="max-w-[2rem] h-[2rem] min-w-[2rem] overflow-hidden rounded-full"
                :class="props.row.image ? 'cursor-pointer' : ''"
                @click="handleShowImagePreview(props.row.image)"
              >
                <img
                  class="w-full h-full object-cover"
                  :src="
                    getImageUrl(props.row.image) || 'assets/default-image.png'
                  "
                  alt="img"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="4" />
              <q-td>
                <div>
                  Total:
                  {{ BillGenerationTotalAmount }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          label="Cancel"
          color="btn-cancel hover:bg-btn-cancel-hover"
          @click="router.push('/receipt')"
        />
        <q-btn
          :label="
            billAction === 'Generate Receipt'
              ? 'Save as Draft'
              : billAction === 'Add New'
              ? 'Add'
              : ''
          "
          :loading="isSavingDraft"
          :disable="
            billGenerationData.productInfoDetailList.some(
              (row) => row.amount === 0
            )
          "
          color="btn-primary"
          @click="handleBillSaveAsDraft"
        />
      </q-card-actions>
    </q-card>
    <q-card v-else>
      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.fullName"
              disable
              dense
              label="Name"
              class="btn-primary"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.billStatus"
              disable
              dense
              type="text"
              label="Bill Status"
              class="btn-primary"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.totalAmount"
              disable
              dense
              type="number"
              label="Total Amount"
              class="btn-primary"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.createdDate"
              disable
              dense
              type="date"
              label="Created Date"
              class="btn-primary"
              outlined
            />
          </div>
        </div>
        <q-table
          :loading="isLoading"
          :rows="billGenerationDetailsInfoData.productList"
          :columns="BillGenerationDetailsInfoColumn"
        >
          <template v-slot:body-cell-amount="props">
            <q-td :props="props">
              {{ props.row.amount }}
              <q-popup-edit
                :disable="router.currentRoute.value.path.includes('preview')"
                v-model="props.row.amount"
                color="btn-primary"
                title="Update Amount"
                buttons
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model="scope.value"
                  @update:model-value="
                    scope.value = ($event as number) >= 0 ? Number($event) : 0
                  "
                  min="0"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div
                class="max-w-[2rem] h-[2rem] min-w-[2rem] overflow-hidden rounded-full"
                @click="handleShowImagePreview(props.row.image)"
                :class="props.row.image ? 'cursor-pointer' : ''"
              >
                <img
                  class="object-cover h-full w-full"
                  :src="
                    getImageUrl(props.row.image) || 'assets/default-image.png'
                  "
                  alt="img"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="4" />
              <q-td>
                <div>
                  Total:
                  {{ BillGenerationDetailsInfoTotalAmount }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          :label="billAction !== 'Preview Receipt' ? 'Cancel' : 'Close'"
          color="btn-cancel hover:bg-btn-cancel-hover"
          @click="router.push('/bill-generation')"
        />
        <q-btn
          v-if="billAction !== 'Preview Receipt'"
          label="Update"
          :loading="isUpdating"
          :disable="
            billGenerationDetailsInfoData.productList.some(
              (row) => row.amount === 0
            )
          "
          color="btn-primary"
          @click="handleUpdateBill"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="isPreviewImageModalVisible">
      <q-card class="min-w-[400px]">
        <q-card-section>
          <div class="w-full max-h-[350px] overflow-hidden">
            <img
              class="w-full h-full bg-contain"
              :src="selectedPreviewImage"
              alt="image"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  editBillGenerationRecordsColumn,
  isPosError,
  BillGenerationDetailsInfoColumn,
} from 'src/utils';
import {
  billDetailsApi,
  addBillApi,
  billDetailInfoApi,
  updateBillApi,
} from 'src/services';
import moment from 'moment';
import {
  IBillDetail,
  IProductInfoDetailList,
  INewBillData,
  IBillGenerationDetailsInfoData,
  IBillGenerationDetailsInfoProductList,
  IUpdatedBillProductList,
} from 'src/interfaces';
const billAction = ref('');
const router = useRouter();
const isLoading = ref(false);
const $q = useQuasar();
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');
const isUpdating = ref(false);
const isSavingDraft = ref(false);
const billGenerationDetailsInfoData = ref<IBillGenerationDetailsInfoData>({
  billId: 0,
  billStatus: '',
  createdDate: '',
  fullName: '',
  productList: [],
  totalAmount: 0,
});
const billGenerationData = ref<IBillDetail>({
  userId: 0,
  fullName: '',
  outStandingBalance: 0,
  productInfoDetailList: [],
  purchaseDate: '',
  totalPurchaseQuantity: 0,
  quantity: 0,
});
const selectedId = router.currentRoute.value.params.id;
const path = router.currentRoute.value.fullPath;
onMounted(() => {
  if (selectedId) {
    if (path.includes('preview')) {
      billAction.value = 'Preview Receipt';
      getBillDetailInfo(Number(selectedId));
    } else if (path.includes('generate-receipt-bill')) {
      billAction.value = 'Generate Receipt';
      getBillDetails(Number(selectedId));
    } else {
      billAction.value = 'Update bill';
      getBillDetailInfo(Number(selectedId));
    }
  } else {
    billAction.value = 'Add New';
  }
});
const handleUpdateBill = () => {
  const billId = billGenerationDetailsInfoData.value.billId;
  const productList = billGenerationDetailsInfoData.value.productList.map(
    ({ productId, amount }) => ({
      productId,
      amount,
    })
  );
  updateExistingBill(billId, productList);
};
const handleBillSaveAsDraft = () => {
  const newBillInfo = {
    purchaseId: Number(selectedId),
    productList: billGenerationData.value.productInfoDetailList.map(
      ({ productId, amount, image, productName }) => ({
        productId,
        amount,
        image,
        name: productName,
      })
    ),
  };
  addNewBill(newBillInfo);
};
const formattedPurchaseDate = computed(() => {
  if (billGenerationData.value.purchaseDate) {
    return moment(billGenerationData.value.purchaseDate).format('YYYY-MM-DD');
  }
  return '';
});
const BillGenerationTotalAmount = computed(() => {
  const rows = billGenerationData.value.productInfoDetailList;
  return rows.reduce((total: number, row: IProductInfoDetailList) => {
    return total + row.quantity * row.amount;
  }, 0);
});
const BillGenerationDetailsInfoTotalAmount = computed(() => {
  const rows = billGenerationDetailsInfoData.value.productList;
  return rows.reduce(
    (total: number, row: IBillGenerationDetailsInfoProductList) => {
      return total + row.quantity * row.amount;
    },
    0
  );
});
const addNewBill = async (newBillInfo: INewBillData) => {
  if (isSavingDraft.value) return;
  isSavingDraft.value = true;
  try {
    const res = await addBillApi(newBillInfo);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/receipt');
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      {
        message = e.message;
      }
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isSavingDraft.value = false;
};
const handleShowImagePreview = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const getImageUrl = (base64Image: string | null) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const getBillDetailInfo = async (BillId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await billDetailInfoApi(BillId);
    if (res.type === 'Success') {
      if (res.data) {
        billGenerationDetailsInfoData.value = res.data;
        billGenerationDetailsInfoData.value.createdDate = moment(
          res.data.createdDate
        ).format('YYYY-MM-DD');
      }
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
  isLoading.value = false;
};
const getBillDetails = async (purchaseId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await billDetailsApi(purchaseId);
    if (res.type === 'Success') {
      billGenerationData.value = res.data;
      if (res.data.outStandingBalance === null) {
        billGenerationData.value.outStandingBalance = 0;
      }
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
const updateExistingBill = async (
  billId: number,
  productList: IUpdatedBillProductList[]
) => {
  if (isUpdating.value) return;
  isUpdating.value = true;
  try {
    const res = await updateBillApi({ billId, productList });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/bill-generation');
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      {
        message = e.message;
      }
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isUpdating.value = false;
};
</script>
