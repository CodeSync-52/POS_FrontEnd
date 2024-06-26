<template>
  <div>
    <div class="row items-center justify-between mb-2">
      <div class="text-lg text-center md:text-left font-medium">
        <span>{{ billAction }}</span>
      </div>
      <q-btn
        v-if="billAction === 'Preview Bill'"
        color="btn-primary"
        unelevated
        label="Download PDF"
        @click="downloadPdfData"
      />
    </div>

    <q-card v-if="billAction === 'Generate Receipt'">
      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-6">
            <q-input
              type="number"
              min="0"
              readonly
              v-model="billGenerationData.outStandingBalance"
              dense
              label="Outstanding Balance"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              type="date"
              readonly
              v-model="formattedPurchaseDate"
              dense
              label="Purchase Date"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              maxlength="250"
              readonly
              v-model="billGenerationData.fullName"
              dense
              label="Select User"
              outlined
            />
          </div>
        </div>
        <q-separator class="mb-2" color="orange" inset />
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-12 text-bold text-base">Enter Claim or Freight:</div>
          <div class="col-6">
            <q-input
              :min="0"
              type="number"
              v-model="billGenerationDetailsInfoData.claim"
              dense
              color="btn-primary"
              label="Claim Amount"
              outlined
              @update:model-value="handleUpdateClaimOrFreight($event, 'claim')"
            />
          </div>
          <div class="col-6">
            <q-input
              type="number"
              maxlength="250"
              v-model="billGenerationDetailsInfoData.freight"
              dense
              :min="0"
              color="btn-primary"
              label="Freight User"
              outlined
              @update:model-value="
                handleUpdateClaimOrFreight($event, 'freight')
              "
            />
          </div>
        </div>
        <div class="updateBillTable">
          <q-table
            :loading="isLoading"
            v-model:pagination="pagination"
            :rows="billGenerationData.productInfoDetailList"
            :columns="editBillGenerationRecordsColumn"
          >
            <template v-slot:body-cell-amount="props">
              <q-td
                :props="props"
                class="flex flex-nowrap items-center !h-[115px]"
              >
                <span
                  :class="billAction === 'Generate Receipt' && 'cursor-pointer'"
                  >{{ props.row.amount }}</span
                >
                <div class="updateArticleAmount ml-5">
                  <q-btn
                    v-if="billAction === 'Generate Receipt'"
                    icon="edit"
                    dense
                    size="sm"
                    flat
                    unelevated
                  />
                </div>
                <q-popup-edit
                  :disable="router.currentRoute.value.path.includes('preview')"
                  v-model="props.row.amount"
                  color="btn-primary"
                  title="Update Amount"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    :min="0"
                    type="number"
                    v-model="scope.value"
                    @update:model-value="handleAmountUpdate($event, scope)"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <div
                  class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
                  :class="props.row.image ? 'cursor-pointer' : ''"
                  @click="handleShowImagePreview(props.row.image)"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="props.row.image || 'assets/default-image.png'"
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
                    Claim:
                    {{ billGenerationDetailsInfoData.claim || 0 }}
                  </div>
                </q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td colspan="4" />
                <q-td>
                  <div>
                    Freight:
                    {{ billGenerationDetailsInfoData.freight || 0 }}
                  </div>
                </q-td>
              </q-tr>
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
            <template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
          </q-table>
        </div>
        <br />
        <div class="col-8">
          <q-input
            readonly
            v-model="billGenerationData.comments"
            dense
            :disable="true"
            type="textarea"
            label="Comments"
            outlined
          />
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          label="Cancel"
          unelevated
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
              (row) => Number(row.amount) === 0
            )
          "
          unelevated
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
              maxlength="250"
              v-model="billGenerationDetailsInfoData.fullName"
              readonly
              dense
              label="Name"
              class="btn-primary"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              maxlength="250"
              v-model="billGenerationDetailsInfoData.outStandingBalance"
              readonly
              dense
              type="number"
              label="OutStanding Balance"
              class="btn-primary"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.createdDate"
              readonly
              dense
              type="date"
              label="Bill Date"
              class="btn-primary"
              outlined
            />
          </div>

          <div class="col-6">
            <q-input
              v-model="billGenerationDetailsInfoData.stockReceivingDate"
              readonly
              dense
              type="date"
              label="Stock Receiving Date"
              class="btn-primary"
              outlined
            />
          </div>
        </div>
        <q-separator
          v-if="!router.currentRoute.value.fullPath.includes('preview')"
          class="mb-2"
          color="orange"
          inset
        />
        <div class="row q-mb-md q-col-gutter-md">
          <div
            v-if="!router.currentRoute.value.fullPath.includes('preview')"
            class="col-12 text-bold text-base"
          >
            Edit Claim or Freight:
          </div>
          <div
            v-if="!router.currentRoute.value.fullPath.includes('preview')"
            class="col-4"
          >
            <q-input
              :min="0"
              :disable="router.currentRoute.value.fullPath.includes('preview')"
              type="number"
              v-model="billGenerationDetailsInfoData.claim"
              dense
              label="Claim Amount"
              outlined
              color="btn-primary"
              @update:model-value="handleUpdateClaimOrFreight($event, 'claim')"
            />
          </div>
          <div
            v-if="!router.currentRoute.value.fullPath.includes('preview')"
            class="col-4"
          >
            <q-input
              type="number"
              maxlength="250"
              :disable="router.currentRoute.value.fullPath.includes('preview')"
              v-model="billGenerationDetailsInfoData.freight"
              dense
              :min="0"
              label="Freight User"
              outlined
              color="btn-primary"
              @update:model-value="
                handleUpdateClaimOrFreight($event, 'freight')
              "
            />
          </div>
          <div class="col-4">
            <q-btn
              v-if="billAction !== 'Preview Bill'"
              label="Update Claim Freight"
              :loading="isUpdating"
              unelevated
              color="btn-primary"
              @click="handleUpdateClaimFreight"
            />
          </div>
        </div>
        <div class="updateBillTable">
          <q-table
            :loading="isLoading"
            v-model:pagination="pagination"
            :rows="billGenerationDetailsInfoData.productList"
            :columns="BillGenerationDetailsInfoColumn"
            hide-pagination
          >
            <template v-slot:body-cell-amount="props">
              <q-td :props="props" class="flex items-center !h-[115px]">
                <span
                  :class="billAction === 'Update bill' && 'cursor-pointer'"
                  >{{ props.row.amount }}</span
                >
                <div class="updateArticleAmount ml-5">
                  <q-btn
                    v-if="billAction === 'Update bill'"
                    icon="edit"
                    dense
                    size="sm"
                    flat
                    unelevated
                  />
                </div>
                <q-popup-edit
                  :disable="
                    router.currentRoute.value.path.includes('preview') ||
                    billAction === 'Preview Bill'
                  "
                  v-model="props.row.amount"
                  color="btn-primary"
                  title="Update Amount"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    :min="0"
                    type="number"
                    v-model="scope.value"
                    @update:model-value="handleAmountUpdate($event, scope)"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <div
                  class="h-[100px] w-[100px] min-w-[2rem] overflow-hidden"
                  @click="handleShowImagePreview(props.row.image)"
                  :class="props.row.image ? 'cursor-pointer' : ''"
                >
                  <img
                    class="object-cover h-full w-full"
                    :src="props.row.image || 'assets/default-image.png'"
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
                    Claim:
                    {{ billGenerationDetailsInfoData.claim || 0 }}
                  </div>
                </q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td colspan="4" />
                <q-td>
                  <div>
                    Freight:
                    {{ billGenerationDetailsInfoData.freight || 0 }}
                  </div>
                </q-td>
              </q-tr>
              <q-tr :props="props">
                <q-td colspan="4" />
                <q-td>
                  <div class="font-bold">
                    Total:
                    {{
                      BillGenerationDetailsInfoTotalAmount -
                      billGenerationDetailsInfoData.claim +
                      billGenerationDetailsInfoData.freight
                    }}
                  </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
          </q-table>
          <br />
          <div class="col-8">
            <q-input
              v-model="billGenerationDetailsInfoData.comments"
              readonly
              :disable="true"
              type="textarea"
              dense
              label="Comments"
              class="btn-primary"
              outlined
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          :label="billAction !== 'Preview Bill' ? 'Cancel' : 'Close'"
          unelevated
          color="btn-cancel hover:bg-btn-cancel-hover"
          @click="router.push('/bill-generation')"
        />
        <q-btn
          v-if="billAction !== 'Preview Bill'"
          label="Update"
          :loading="isUpdating"
          :disable="
            billGenerationDetailsInfoData.productList.some(
              (row) => Number(row.amount) === 0
            )
          "
          unelevated
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
              class="w-full h-full bg-cover"
              :src="selectedPreviewImage"
              alt="image"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <q-dialog v-model="isPdfLoader" persistent>
    <q-spinner-ios size="78px" color="btn-primary" />
    <span class="ml-2 text-base font-[500]">Generating PDF...</span>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  editBillGenerationRecordsColumn,
  isPosError,
  BillGenerationDetailsInfoColumn,
  IPdfHeaders,
} from 'src/utils';
import {
  GetBillDetail,
  CreateBill,
  GetBillBasicInfo,
  UpdateBill,
  UpdateBillClaimFreight,
} from 'src/services';
import moment from 'moment';
import {
  IBillDetail,
  IProductInfoDetailList,
  INewBillData,
  IBillData,
  IBillProductList,
  IProductIdWithAmount,
} from 'src/interfaces';
import {
  IPdfFooters,
  ITableItems,
  downloadPdf,
} from 'src/utils/pdf-make/pdf-make';
import { processTableItems } from 'src/utils/process-table-items';
const billAction = ref('');
const router = useRouter();
const isLoading = ref(false);
const isPdfLoader = ref(false);
const $q = useQuasar();
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');
const isUpdating = ref(false);
const isSavingDraft = ref(false);
const billGenerationDetailsInfoData = ref<IBillData>({
  billId: 0,
  billStatus: '',
  createdDate: '',
  fullName: '',
  productList: [],
  outStandingBalance: 0,
  totalAmount: 0,
  claim: 0,
  freight: 0,
  comments: '',
  stockReceivingDate: '',
});
const billGenerationData = ref<IBillDetail>({
  userId: 0,
  fullName: '',
  outStandingBalance: 0,
  productInfoDetailList: [],
  purchaseDate: '',
  totalPurchaseQuantity: 0,
  quantity: 0,
  comments: '',
});
const selectedId = router.currentRoute.value.params.id;
const path = router.currentRoute.value.fullPath;
const tableItems = ref<string[][]>([]);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
  rowsNumber: 0,
});
onMounted(() => {
  if (selectedId) {
    if (path.includes('preview')) {
      billAction.value = 'Preview Bill';
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
const handleUpdateClaimOrFreight = (
  newVal: unknown,
  selectedKey: 'claim' | 'freight'
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (val <= 0 || !val) {
      billGenerationDetailsInfoData.value[selectedKey] = 0;
    } else {
      billGenerationDetailsInfoData.value[selectedKey] = val;
    }
  }
};
const handleUpdateBill = () => {
  const { billId } = billGenerationDetailsInfoData.value;
  const productList = billGenerationDetailsInfoData.value.productList.map(
    ({ productId, amount }) => ({
      productId,
      amount,
    })
  );
  updateExistingBill(billId, productList);
};
const handleUpdateClaimFreight = () => {
  const { billId, claim, freight } = billGenerationDetailsInfoData.value;
  updateClaimFreight({ billId, claim, freight });
};
const handleBillSaveAsDraft = () => {
  const newBillInfo = {
    purchaseId: Number(selectedId),
    claim: Number(billGenerationDetailsInfoData.value.claim) || 0,
    freight: Number(billGenerationDetailsInfoData.value.freight) || 0,
    productList: billGenerationData.value.productInfoDetailList.map(
      ({ productId, amount, image, productName }) => ({
        productId,
        amount: Number(amount),
        image,
        name: productName,
      })
    ),
  };
  addNewBill(newBillInfo);
};
const formattedPurchaseDate = computed(() => {
  if (billGenerationData.value.purchaseDate) {
    const date = moment(billGenerationData.value.purchaseDate);
    return date.format('YYYY-MM-DD');
  }
  return '';
});

const BillGenerationTotalAmount = computed(() => {
  const rows = billGenerationData.value.productInfoDetailList;
  let total = rows.reduce((subtotal: number, row: IProductInfoDetailList) => {
    return subtotal + row.quantity * row.amount;
  }, 0);

  if (
    billGenerationDetailsInfoData.value.claim &&
    billGenerationDetailsInfoData.value.claim > 0
  ) {
    const claimAsNumber = Number(billGenerationDetailsInfoData.value.claim);
    total -= claimAsNumber;
  }
  if (
    billGenerationDetailsInfoData.value.freight &&
    billGenerationDetailsInfoData.value.freight > 0
  ) {
    const freightAsNumber = Number(billGenerationDetailsInfoData.value.freight);
    total += freightAsNumber;
  }

  return total;
});

const BillGenerationDetailsInfoTotalAmount = computed(() => {
  const rows = billGenerationDetailsInfoData.value.productList;
  return rows.reduce((total: number, row: IBillProductList) => {
    return total + row.quantity * row.amount;
  }, 0);
});
const addNewBill = async (newBillInfo: INewBillData) => {
  if (isSavingDraft.value) return;
  isSavingDraft.value = true;
  try {
    const res = await CreateBill(newBillInfo);
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
    selectedPreviewImage.value = selectedImage;
    isPreviewImageModalVisible.value = true;
  }
};
const getBillDetailInfo = async (BillId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await GetBillBasicInfo(BillId);
    if (res.type === 'Success') {
      if (res.data) {
        billGenerationDetailsInfoData.value = res.data;
        billGenerationDetailsInfoData.value.createdDate = moment(
          res.data.createdDate
        ).format('YYYY-MM-DD');
        billGenerationDetailsInfoData.value.stockReceivingDate = moment(
          res.data.stockReceivingDate
        ).format('YYYY-MM-DD');

        tableItems.value = await convertArray(res.data.productList);
      }
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Fetching bill details';
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
    const res = await GetBillDetail(purchaseId);
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
const updateClaimFreight = async ({
  billId,
  claim,
  freight,
}: {
  billId: number;
  claim: number;
  freight: number;
}) => {
  try {
    const res = await UpdateBillClaimFreight({ billId, claim, freight });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      getBillDetailInfo(billId);
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred updating Freight and Claim';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
};
const updateExistingBill = async (
  billId: number,
  productList: IProductIdWithAmount[]
) => {
  if (isUpdating.value) return;
  isUpdating.value = true;
  try {
    const res = await UpdateBill({ billId, productList });
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
function handleAmountUpdate(newVal: unknown, scope: { value: string }) {
  function setScopeValue(val: number) {
    scope.value = `${val}`;
  }
  if (typeof newVal === 'string') {
    const val = parseFloat(newVal);
    if (val > 0) {
      setScopeValue(val);
    } else if (val <= 0 || !val) {
      setScopeValue(0);
    }
  }
}
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result && typeof fileReader.result === 'string') {
        const resultParts = fileReader.result.split(',');
        if (resultParts.length === 2) {
          resolve(resultParts[1]);
        } else {
          reject(new Error('Invalid data URL format'));
        }
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsDataURL(file);
  });
};
const defaultImage = ref<string | null>(null);
async function convertArray(array: IBillProductList[]) {
  if (!defaultImage.value) {
    defaultImage.value = await fetch('/assets/default-image.png')
      .then((res) => res.blob())
      .then((fileBlob) => {
        const imageFile = new File([fileBlob], 'default-image.png');
        return convertToBase64(imageFile);
      });
  }
  const tableStuff = [];

  const netQuantity = array.reduce((total: number, row: IBillProductList) => {
    if (row.quantity) {
      return total + row.quantity;
    }
    return total;
  }, 0);

  const headerRow = [
    'Row#',
    'Image',
    'Article',
    'Quantity',
    'Item Score',
    'Total',
  ];
  tableStuff.push(headerRow);
  const claimAmount = [
    '',
    '',
    '',
    '',
    'Claim:',
    `${billGenerationDetailsInfoData.value.claim}`,
  ];
  const freightAmount = [
    '',
    '',
    '',
    '',
    'Freight:',
    `${billGenerationDetailsInfoData.value.freight}`,
  ];
  const qtyRow = ['', '', '', '', 'Quantity:', `${netQuantity}`];
  const footerRow = [
    '',
    '',
    '',
    '',
    'Net Total:',
    `${billGenerationDetailsInfoData.value.totalAmount}`,
  ];
  array.forEach((item: IBillProductList, index: number) => {
    const randomTextBeforeAmount = generateRandomAlphaNumeric(3); // Generate 3-character random string
    const randomTextAfterAmount = generateRandomAlphaNumeric(3); // Generate 3-character random string

    const row = [
      {
        text: index + 1,
      },
      {
        image: item.image || defaultImage.value,
        width: 50,
        height: 50,
      },
      { text: item.name, margin: [0, 20] },
      { text: item.quantity, bold: true, margin: [0, 20] },
      {
        text: randomTextBeforeAmount + item.amount + randomTextAfterAmount,
        margin: [0, 20],
      },
      { text: item.amount * item.quantity, margin: [0, 20] },
    ];
    tableStuff.push(row);
  });
  tableStuff.push(claimAmount, freightAmount, qtyRow, footerRow);
  return tableStuff;
}

function generateRandomAlphaNumeric(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function downloadPdfData() {
  isPdfLoader.value = true;
  const headers: IPdfHeaders[] = [
    {
      heading: 'Bill Id',
      content: Number(router.currentRoute.value.params.id),
    },
    {
      heading: 'Status',
      content: billGenerationDetailsInfoData.value.billStatus,
    },
    {
      content: billGenerationDetailsInfoData.value.fullName,
    },
    {
      heading: 'Bill Date',
      content: billGenerationDetailsInfoData.value.createdDate,
    },
    {
      heading: 'Purchase Date',
      content: billGenerationDetailsInfoData.value.stockReceivingDate,
    },
  ];
  const tableDataWithImage: ITableItems[][] = await processTableItems(
    tableItems.value
  );

  const footers: IPdfFooters[] = [
    {
      heading: 'Outstanding Balance',
      content: billGenerationDetailsInfoData.value.outStandingBalance,
    },
    {
      heading: 'Comments',
      content: billGenerationDetailsInfoData.value.comments,
    },
  ];
  const myFileName = 'Bill.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: JSON.parse(JSON.stringify(tableDataWithImage)),
    pdfHeaders: headers,
    pdfFooters: footers,
    title: '',
  });
  isPdfLoader.value = false;
}
</script>
