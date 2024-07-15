<template>
  <div class="flex justify-end mb-4">
    <q-btn-dropdown
      dropdown-icon="arrow_downward"
      label="Download Report"
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover text-white"
    >
      <q-list>
        <q-item clickable @click="handleDownloadGRNReport" v-close-popup>
          <q-item-section>
            <q-item-label>Download in Excel</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"
          >{{ isEdit ? 'Edit' : 'Preview' }} STR</span
        >
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-input
            dense
            outlined
            :loading="isLoading"
            maxlength="250"
            disable
            v-model="selectedGrnData.fromShopName"
            label="From Shop"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            outlined
            maxlength="250"
            :loading="isLoading"
            disable
            v-model="selectedGrnData.toShopName"
            label="To Shop"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            disable
            outlined
            maxlength="250"
            :loading="isLoading"
            v-model="selectedGrnData.grnStatus"
            label="Status"
            color="btn-primary"
          />
        </div>
        <div class="col-4">
          <q-input
            dense
            disable
            outlined
            :loading="isLoading"
            maxlength="250"
            v-model="selectedGrnData.addedDate"
            label="Added Date"
            color="btn-primary"
          />
        </div>
      </div>
      <!-- Article and Image -->
      <div
        v-for="(item, itemIndex) in selectedGrnData.grnProductInfos"
        :key="itemIndex"
        class="mb-8 border p-2"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="flex flex-col">
              <img
                :src="item.productImage ?? ''"
                alt="Product Image"
                class="w-16 h-16 mt-2 mb-4"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-bold">{{ item.productName }}</div>
              <div class="text-bold">{{ item.retailPrice }}</div>
            </div>
          </div>
          <div></div>
        </div>
        <!-- Table -->
        <div class="flex flex-col mt-4">
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border border-gray-300 bg-gray-200 p-2"></th>
                <th
                  v-for="(size, sizeIndex) in getUniqueSizes(
                    item.variant2Infos
                  )"
                  :key="sizeIndex"
                  class="border border-gray-300 bg-gray-200 p-2"
                >
                  {{ size }}
                </th>
                <th class="border border-gray-300 bg-gray-200 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(variant, variantIndex) in item.variant2Infos"
                :key="variantIndex"
                class="border border-gray-300"
              >
                <td class="border border-gray-300 p-2 font-semibold">
                  {{ variant.variant2_Name }}
                </td>
                <td
                  v-for="(secondItem, secondItemIndex) in variant.variant1Infos"
                  :key="secondItemIndex"
                  class="border border-gray-300 p-2 text-center"
                >
                  <!-- {{ secondItem.quantity }} -->
                  <q-input
                    type="number"
                    dense
                    class="quantity_input min-w-[92px]"
                    color="btn-primary"
                    outlined
                    :disable="!isEdit"
                    :min="0"
                    @update:model-value="
                      handleUpdateStrStockQuantity(
                        Number($event) ?? 0,
                        secondItem
                      )
                    "
                    v-model="secondItem.quantity"
                  >
                    <template v-if="isEdit" v-slot:append>
                      <q-icon
                        class="cursor-pointer"
                        name="check"
                        color="green"
                        dense
                        size="xs"
                        @click="
                          updateSelectedProductVariant(
                            secondItem.selectedGrnId,
                            secondItem.quantity
                          )
                        "
                      />
                      <q-icon
                        class="cursor-pointer"
                        name="delete"
                        @click="
                          updateSelectedProductVariant(
                            secondItem.selectedGrnId,
                            0
                          )
                        "
                        color="red"
                        dense
                        size="xs"
                      />
                    </template>
                  </q-input>
                </td>
                <td class="border border-gray-300 p-2 text-center">
                  {{ variant.totalQuantity }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </q-card-section>
    <div class="text-end flex justify-between text-[16px] px-4 mb-4 font-bold">
      <div
        v-if="
          authStore.loggedInUser?.rolePermissions.roleName ===
          EUserRoles.SuperAdmin.toLowerCase()
        "
      >
        Total Whole Sale Price:
        <span>{{ selectedGrnData.totalWholeSalePrice }}</span>
      </div>
      <div>
        Total Retail Price: <span>{{ selectedGrnData.totalRetailPrice }}</span>
      </div>
      <div>
        Total Qty: <span>{{ selectedGrnData.quantity }}</span>
      </div>
    </div>
    <q-card-actions align="right">
      <q-btn
        v-if="
          selectedGrnData.grnStatus === 'Accept' &&
          selectedGrnData.fromShopId === selectedGrnData.toShopId
        "
        unelevated
        label="Copy STR"
        color="btn-primary hover:bg-btn-primary-hover"
        @click="handleOpenCopyModal"
      />
      <q-btn
        unelevated
        v-if="
          authStore.loggedInUser?.rolePermissions.roleName !==
          EUserRoles.ShopOfficer.toLowerCase()
        "
        label="Print Label"
        color="btn-primary"
        class="hover:btn-primary-hover"
        :to="`/inventory/add-new/${selectedGrnId}`"
      />
      <q-btn
        flat
        label="Go Back"
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        @click="router.go(-1)"
      />
    </q-card-actions>
  </q-card>
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
  <q-dialog v-model="isCopyDialogVisible">
    <copy-str-modal
      :grn-id="selectedGrnData.grnId"
      @close-modal="handleCloseCopyDialog"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  EUserRoles,
  IGrnPreviewResponse,
  IProductGRN,
  IVariant1Data,
} from 'src/interfaces';
import { GetGRNDetail, UpdateGRN } from 'src/services';
import { useAuthStore } from 'src/stores';
import CopyStrModal from 'src/components/str/Copy-Str-Modal.vue';
import { isPosError } from 'src/utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const isCopyDialogVisible = ref(false);
const $q = useQuasar();
const isLoading = ref(false);
const authStore = useAuthStore();
const selectedGrnData = ref<IGrnPreviewResponse>({
  grnId: 0,
  fromShopId: 0,
  toShopId: 0,
  totalWholeSalePrice: 0,
  totalRetailPrice: 0,
  fromShopName: '',
  toShopName: '',
  quantity: 0,
  grnStatus: '',
  addedDate: '',
  grnDetails: [],
  grnProductInfos: [],
});
const handleOpenCopyModal = () => {
  isCopyDialogVisible.value = true;
};

const handleCloseCopyDialog = () => {
  isCopyDialogVisible.value = false;
  router.go(-1);
};

const selectedPreviewImage = ref('');
const selectedGrnId = ref(-1);
const isPreviewImageModalVisible = ref(false);
const isEdit = ref(false);
const grnGroupByProductId = ref<IProductGRN[]>([]);

onMounted(() => {
  selectedGrnId.value = Number(router.currentRoute.value.params.id);
  previewGrn(selectedGrnId.value);

  if (router.currentRoute.value.path.includes('edit')) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
});

const previewGrn = async (selectedId: number) => {
  isLoading.value = true;
  try {
    const res = await GetGRNDetail(selectedId);
    if (res.type === 'Success') {
      selectedGrnData.value = res.data;
      selectedGrnData.value.addedDate = moment(res.data.addedDate).format(
        'YYYY-MM-DD'
      );

      const groupedProducts = selectedGrnData.value.grnDetails.reduce(
        (accumulator: any, currentDetail) => {
          const productId = currentDetail.productId;

          if (!accumulator[productId]) {
            accumulator[productId] = {
              productId,
              productName: currentDetail.productName,
              productImage: currentDetail.productImage,
              retailPrice: currentDetail.retailPrice,
              data: [],
            };
          }
          const existingVariantv2 = accumulator[productId].data.find(
            (variant: any) => variant.variantId1 === currentDetail.variantId_2
          );
          if (existingVariantv2) {
            existingVariantv2.v2details.push(currentDetail);
          } else {
            accumulator[productId].data.push({
              variantId2: currentDetail.variantId_2,
              variantName2: currentDetail.variant_2_Name,
              variantId1: currentDetail.variantId_1,
              variantName1: currentDetail.variant_1_Name,
              selectedGrnId: currentDetail.grnDetailId,
              quantity: currentDetail.quantity,
              v2details: [currentDetail],
            });
          }
          return accumulator;
        },
        {}
      );

      grnGroupByProductId.value = groupedProducts;
    }
  } catch (e) {
    let message = 'Unexpected error occurred while Preview Grn';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  isLoading.value = false;
};

const handleUpdateStrStockQuantity = (value: number, row: IVariant1Data) => {
  if (!value || value <= 0) {
    setTimeout(() => {
      row.quantity = 0;
    }, 0);
  } else {
    row.quantity = value;
  }
};
const updateSelectedProductVariant = async (
  grnDetailId: number,
  quantity: number
) => {
  try {
    const res = await UpdateGRN({
      grnId: grnDetailId,
      quantity: quantity,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
    }
    selectedGrnId.value = Number(router.currentRoute.value.params.id);
    previewGrn(selectedGrnId.value);
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
const handleDownloadGRNReport = () => {
  if (grnGroupByProductId.value) {
    const csvContent = generateCSV(grnGroupByProductId.value);
    downloadExcel(csvContent);
  } else {
    console.error('No data available to download.');
  }
};
const generateCSV = (data: any) => {
  if (!data || !Object.keys(data).length) {
    console.error('Invalid data format or data is null/undefined.');
    return '';
  }

  // Extract all variant names and sort them numerically
  const allVariantNames1 = new Set<string>();
  Object.values(data).forEach((product: any) => {
    product.data.forEach((variant: any) => {
      allVariantNames1.add(variant.variantName1);
    });
  });

  // Convert set to array and sort numerically
  const sortedVariantNames = Array.from(allVariantNames1).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  // Construct headers with sorted variant names
  const headers = [
    'Product',
    'Retail Price',
    'Color',
    ...sortedVariantNames,
    'Total',
  ];
  let csvContent = headers.join(',') + '\n';

  Object.values(data).forEach((product: any) => {
    const colorVariantsMap: any = {};

    product.data.forEach((variant: any) => {
      if (!colorVariantsMap[variant.variantName2]) {
        colorVariantsMap[variant.variantName2] = {};
      }
      colorVariantsMap[variant.variantName2][variant.variantName1] =
        variant.quantity;
    });

    Object.keys(colorVariantsMap).forEach((color) => {
      const row = [
        product.productName,
        product.retailPrice.toString(),
        color,
        ...sortedVariantNames.map(
          (vName) => colorVariantsMap[color][vName]?.toString() || '0'
        ),
        Object.values(colorVariantsMap[color])
          .reduce((total: number, quantity: any) => total + quantity, 0)
          .toString(),
      ].join(',');
      csvContent += row + '\n';
    });
  });

  return csvContent;
};

const downloadExcel = (csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'preview_str_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Your browser does not support downloading files.');
  }
};

// const generateCSV = (data: Record<string, IProductGRN>) => {
//   const uniqueSizes = new Set<string>();

//   // Loop through the data object
//   Object.values(data).forEach((item) => {
//     item.data.forEach((variant) => {
//       uniqueSizes.add(variant.variantName1);
//     });
//   });

//   const sortedSizes = Array.from(uniqueSizes).sort((a, b) => Number(a) - Number(b));

//   const headers = ['Product', 'Retail Price', 'Color', ...sortedSizes, 'Total'];
//   let csvContent = headers.join(',') + '\n';

//   Object.values(data).forEach((item) => {
//     const colorVariantsMap: Record<string, Record<string, number>> = {};

//     item.data.forEach((variant) => {
//       if (!colorVariantsMap[variant.variantName2]) {
//         colorVariantsMap[variant.variantName2] = {};
//       }
//       colorVariantsMap[variant.variantName2][variant.variantName1] = variant.quantity;
//     });

//     Object.keys(colorVariantsMap).forEach((color) => {
//       const row = [
//         item.productName,
//         item.retailPrice.toString(),
//         color,
//         ...sortedSizes.map((size) => colorVariantsMap[color][size]?.toString() || '0'),
//         Object.values(colorVariantsMap[color]).reduce((total, quantity) => total + quantity, 0).toString(),
//       ].join(',');

//       csvContent += row + '\n';
//     });
//   });

//   return csvContent;
// };

// const downloadExcel = (data: Record<string, IProductGRN>) => {
//   const csvContent = generateCSV(data);
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   if (link.download !== undefined) {
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'preview_str_report.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } else {
//     alert('Your browser does not support downloading files. Please try again in a modern browser.');
//   }
// };

const getUniqueSizes = (variant2List: any) => {
  let uniqueSizes: any = [];
  variant2List.forEach((variant: any) => {
    variant.variant1Infos.forEach((v1: any) => {
      if (!uniqueSizes.includes(v1.variant1_Name)) {
        uniqueSizes.push(v1.variant1_Name);
      }
    });
  });
  return uniqueSizes;
};
</script>
<style scoped lang="scss">
.quantity_input {
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
