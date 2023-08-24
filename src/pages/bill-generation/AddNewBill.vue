<template>
  <div>
    <div class="text-xl text-center md:text-left font-medium mb-4">
      <span>{{ billAction }} Bill</span>
    </div>
    <q-card>
      <q-card-section>
        <div class="row q-mb-md q-col-gutter-md">
          <div class="col-6">
            <q-input
              v-model="billGenerationData.userId"
              :disable="billAction === 'Preview'"
              dense
              label="User Id"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationData.outStandingBalance"
              dense
              :disable="billAction === 'Preview'"
              label="Outstanding Balance"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              type="date"
              :disable="billAction === 'Preview'"
              v-model="billGenerationData.purchaseDate"
              dense
              label="Date"
              outlined
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="billGenerationData.fullName"
              :disable="billAction === 'Preview'"
              dense
              label="User Name"
              outlined
            />
          </div>
        </div>
        <q-table
          :rows="billGenerationData.productInfoDetailList"
          :columns="editBillGenerationRecordsColumn"
          hide-bottom
        >
          <template v-slot:body-cell-amount="props">
            <q-td key="carbs" :props="props">
              {{ props.row.amount }}
              <q-popup-edit
                v-model="props.row.amount"
                color="btn-primary"
                title="Update Amount"
                buttons
                v-slot="scope"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <div
                v-if="props.row.image"
                class="w-12 h-8 overflow-hidden cursor-pointer"
                @click="handleShowImagePreview(props.row.image)"
              >
                <img
                  class="bg-contain h-full w-full"
                  :src="getImageUrl(props.row.image)"
                  alt="img"
                />
              </div>
              <span v-else>none</span>
            </q-td>
          </template>
          <template v-slot:bottom-row="props">
            <q-tr :props="props">
              <q-td colspan="4" />
              <q-td>
                <div>
                  Total:
                  {{ totalAmount }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          :label="billAction === 'Preview' ? 'Close' : 'Cancel'"
          color="btn-secondary"
          @click="router.push('/bill-generation')"
        />
        <q-btn
          v-if="billAction !== 'Preview'"
          :label="
            billAction === 'Edit'
              ? 'Save as Draft'
              : billAction === 'Add New'
              ? 'Add'
              : ''
          "
          color="btn-primary"
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
import { editBillGenerationRecordsColumn, isPosError } from 'src/utils';
import { billDetailsApi } from 'src/services';
import { IBillDetail, IProductInfoDetailList } from 'src/interfaces';
const billAction = ref('');
const router = useRouter();
const isLoading = ref(false);
const $q = useQuasar();
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');
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
onMounted(() => {
  if (selectedId) {
    if (router.currentRoute.value.fullPath.includes('preview')) {
      billAction.value = 'Preview';
      if (router.currentRoute.value.fullPath.includes('preview-receipt')) {
        getBillDetails(Number(selectedId));
      }
    } else {
      billAction.value = 'Edit';
    }
  } else {
    billAction.value = 'Add New';
  }
});
const totalAmount = computed(() => {
  const rows = billGenerationData.value.productInfoDetailList;
  return rows.reduce((total: number, row: IProductInfoDetailList) => {
    return total + row.quantity * row.amount;
  }, 0);
});
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
};
const getBillDetails = async (purchaseId: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await billDetailsApi(purchaseId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      billGenerationData.value = res.data;
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
};

// getBillList()
// const getBillList = async () => {
//   if (isLoading.value) return;
//   isLoading.value = true;
//   try {
//     const res = await billListApi({
//       PageNumber: 1,
//       PageSize: 200,
//     });
//     if (res.data) {
//       billGenerationData.value = res.data.items;
//     }
//   } catch (e) {
//     let message = 'Unexpected Error Occurred';
//     if (isPosError(e)) {
//       message = e.message;
//     }
//     $q.notify({
//       message,
//       color: 'red',
//       icon: 'error',
//     });
//   }
//   isLoading.value = false;
// };
</script>
