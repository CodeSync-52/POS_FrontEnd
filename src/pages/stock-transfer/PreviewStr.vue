<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"
          >{{ isEdit ? 'Edit' : 'Preview' }} GRN</span
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
            :loading="isLoading"
            maxlength="250px"
            v-model="selectedGrnData.quantity"
            label="Total Quantity"
            lazy-rules
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
      <div v-if="grnGroupByProductId" class="q-gutter-y-md mt-2">
        <!-- <div v-for="product in grnPreviewDetailsArray" :key="product.productId">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">
                  <div class="row items-center gap-1">
                    <span
                      >Product:
                      <span class="font-semibold">
                    </span></span
                    >
                    <div
                      class="w-8 h-8 rounded-full overflow-hidden"
                      :class="product.productImage && 'cursor-pointer'"
                      @click="handlePreviewImage(product.productImage)"
                    >
                      <img
                        class="w-full h-full object-cover"
                        :src="
                          getImageUrl(product.productImage) ||
                          'assets/default-image.png'
                        "
                        alt="img"
                      />
                    </div>
                  </div>
                </th>
                <th
                  v-for="firstVariant in product.firstVariantSelection"
                  :key="firstVariant.variantId"
                  class="text-left"
                >
                  {{ firstVariant.displayName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="secondVariant in product.secondVariantSelection"
                :key="secondVariant.variantId"
              >
                <td class="text-left font-semibold">
                  {{ secondVariant.displayName }}
                </td>
                <td
                  v-for="(
                    firstItem, firstItemIndex
                  ) in product.firstVariantSelection"
                  :key="firstItemIndex"
                >
                  <q-input
                    type="number"
                    dense
                    color="btn-primary"
                    outlined
                    :disable="!isEdit"
                    min="0"
                    v-model="
                      selectedInventoryPayload[
                        `${product.productId}-${firstItem.variantId}-${secondVariant.variantId}`
                      ].stockQuantity
                    "
                    @update:model-value="
                      handleUpdateProductQuantity(
                        $event,
                        product.productId,
                        firstItem.variantId,
                        secondVariant.variantId
                      )
                    "
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
                            secondVariant.grnDetailId,
                            selectedInventoryPayload[
                              `${product.productId}-${firstItem.variantId}-${secondVariant.variantId}`
                            ].stockQuantity
                          )
                        "
                      />
                      <q-icon
                        class="cursor-pointer"
                        name="delete"
                        color="red"
                        dense
                        size="xs"
                      />
                    </template>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div> -->
        <div v-for="product in previewPayload" :key="product.productId">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">
                  <div class="row items-center gap-1">
                    <span
                      >Product:
                      <span class="font-semibold">{{
                        product.productName
                      }}</span></span
                    >
                    <div
                      class="w-8 h-8 rounded-full overflow-hidden"
                      :class="product.productImage && 'cursor-pointer'"
                      @click="handlePreviewImage(product.productImage)"
                    >
                      <img
                        class="w-full h-full object-cover"
                        :src="
                          getImageUrl(product.productImage) ||
                          'assets/default-image.png'
                        "
                        alt="img"
                      />
                    </div>
                  </div>
                </th>
                <th
                  v-for="firstVariant in product.firstVariantSelection"
                  :key="firstVariant.variantId"
                  class="text-left"
                >
                  {{ firstVariant.displayName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="secondVariant in product.secondVariantSelection"
                :key="secondVariant.variantId"
              >
                <td class="text-left font-semibold">
                  {{ secondVariant.displayName }}
                </td>
                <td
                  v-for="(
                    firstItem, firstItemIndex
                  ) in product.firstVariantSelection"
                  :key="firstItemIndex"
                >
                  <q-input
                    type="number"
                    dense
                    color="btn-primary"
                    outlined
                    :disable="!isEdit"
                    min="0"
                    v-model="
                      selectedInventoryPayload[
                        `${product.productId}-${firstItem.variantId}-${secondVariant.variantId}`
                      ].stockQuantity
                    "
                    @update:model-value="
                      handleUpdateProductQuantity(
                        $event,
                        product.productId,
                        firstItem.variantId,
                        secondVariant.variantId
                      )
                    "
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
                            secondVariant.grnDetailId,
                            selectedInventoryPayload[
                              `${product.productId}-${firstItem.variantId}-${secondVariant.variantId}`
                            ].stockQuantity
                          )
                        "
                      />
                      <q-icon
                        class="cursor-pointer"
                        name="delete"
                        color="red"
                        dense
                        size="xs"
                      />
                    </template>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        unelevated
        v-if="
          authStore.loggedInUser?.rolePermissions.roleName !==
            EUserRoles.ShopManager.toLowerCase() &&
          authStore.loggedInUser?.rolePermissions.roleName !==
            EUserRoles.ShopOfficer.toLowerCase()
        "
        label="Generate Barcode"
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
</template>
<script lang="ts" setup>
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  EUserRoles,
  IGrnPreviewResponse,
  IPreviewGrnDetail,
  IPreviewGrnPayload,
  // IGrnDetailProductData,
  // OrderDetails
} from 'src/interfaces';
import { viewGrnApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const isLoading = ref(false);
const authStore = useAuthStore();
const selectedGrnData = ref<IGrnPreviewResponse>({
  grnId: 0,
  fromShopId: 0,
  toShopId: 0,
  fromShopName: '',
  toShopName: '',
  quantity: 0,
  grnStatus: '',
  addedDate: '',
  grnDetails: [],
});
const selectedInventoryPayload = ref<
  Record<
    string,
    {
      variantId_1: number;
      grnDetailId: number;
      variantId_2: number;
      stockQuantity: number;
    }
  >
>({});
const selectedPreviewImage = ref('');
const selectedGrnId = ref(-1);
const isPreviewImageModalVisible = ref(false);
const isEdit = ref(false);
const grnGroupByProductId = ref<{
  [productId: number]: IPreviewGrnDetail[];
} | null>(null);
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
    isPreviewImageModalVisible.value = true;
  }
};
const getImageUrl = (base64Image: string) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const arrayOfObjects: { productId: string; items: IPreviewGrnDetail[] }[] = [];
// const grnPreviewDetailsArray: { productId: string; grnDetail: IGrnDetailProductData[] }[] = [];
onMounted(() => {
  selectedGrnId.value = Number(router.currentRoute.value.params.id);
  previewGrn(selectedGrnId.value);
  if (router.currentRoute.value.path.includes('edit')) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
});
const previewPayload = ref<IPreviewGrnPayload[]>([]);
const previewGrn = async (selectedId: number) => {
  isLoading.value = true;
  try {
    const res = await viewGrnApi(selectedId);
    if (res.type === 'Success') {
      selectedGrnData.value = res.data;
      selectedGrnData.value.addedDate = moment(res.data.addedDate).format(
        'YYYY-MM-DD'
      );
      grnGroupByProductId.value = selectedGrnData.value.grnDetails.reduce(
        (
          group: {
            [productId: number]: IPreviewGrnDetail[];
          },
          grn: IPreviewGrnDetail
        ) => {
          const { productId } = grn;
          group[productId] = group[productId] ?? [];
          group[productId].push(grn);
          return group;
        },
        {}
      );
      for (const key in grnGroupByProductId.value) {
        if (grnGroupByProductId.value.hasOwnProperty(key)) {
          const categoryArray = grnGroupByProductId.value[key];
          arrayOfObjects.push({ productId: key, items: categoryArray });
        }
      }
      arrayOfObjects.map((data) => {
        data.items.forEach((item) => {
          const selectedRecord = previewPayload.value.find(
            (payload) => payload.grnDetailId === item.grnDetailId
          );
          if (selectedRecord) {
            updateVariantSelection(
              selectedRecord.firstVariantSelection,
              item.variantId_1,
              item.variant_1_Name,
              item.quantity
            );
            updateVariantSelection(
              selectedRecord.secondVariantSelection,
              item.variantId_2,
              item.variant_2_Name,
              item.quantity
            );
          } else {
            const newRecord = {
              productId: item.productId,
              quantity: item.quantity,
              productName: item.productName,
              productImage: item.productImage,
              grnDetailId: item.grnDetailId,
              firstVariantSelection: [
                {
                  variantId: item.variantId_1,
                  displayName: item.variant_1_Name,
                },
              ],
              secondVariantSelection: [
                {
                  variantId: item.variantId_2,
                  displayName: item.variant_2_Name,
                  quantity: item.quantity,
                  grnDetailId: item.grnDetailId,
                },
              ],
            };
            previewPayload.value.push(newRecord);
            setProductKeys();
          }
        });
      });
    }
    // const grnDetailGroupByProductId = groupBy(previewPayload.value, 'productId');
    // const grnPreviewData:OrderDetails = Object.entries(grnDetailGroupByProductId).map(data=>data[1])
    // for (const key in grnPreviewData) {
    //     if (grnPreviewData.hasOwnProperty(key)) {
    //       const categoryArray = grnPreviewData[key];
    //       grnPreviewDetailsArray.push({ productId: key, grnDetail: categoryArray });
    //     }
    //   }
    //   console.log('nope',grnPreviewDetailsArray.map(data=>data.grnDetail))
  } catch (e) {
    let message = 'Unexpected error occurred Preview Grn';
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

// function groupBy(array: any, key: any) {
//   return array.reduce((result: any, item: any) => {
//     const keyValue = item[key];
//     (result[keyValue] = result[keyValue] || []).push(item);
//     return result;
//   }, {});
// }

function updateVariantSelection(
  variantSelection: {
    variantId: number;
    displayName: string;
    quantity?: number;
    grnDetailId?: number;
  }[],
  variantId: number,
  displayName: string,
  quantity: number,
  grnDetailId?: number
) {
  const existingVariant = variantSelection.find(
    (variant) => variant.variantId === variantId
  );

  if (existingVariant) {
    if (existingVariant.quantity !== undefined) {
      existingVariant.quantity += quantity;
    }
  } else {
    variantSelection.push({
      variantId: variantId,
      displayName: displayName,
      quantity: quantity,
      grnDetailId,
    });
  }
}
function setProductKeys() {
  selectedInventoryPayload.value = {};
  previewPayload.value.forEach((product) => {
    product.firstVariantSelection?.forEach((variantA) => {
      product.secondVariantSelection?.forEach((variantB) => {
        const key = `${product.productId}-${variantA.variantId}-${variantB.variantId}`;
        selectedInventoryPayload.value[key] = {
          variantId_1: variantA.variantId,
          grnDetailId: product.grnDetailId,
          variantId_2: variantB.variantId,
          stockQuantity: variantB.quantity || 0,
        };
      });
    });
  });
}
const updateSelectedProductVariant = (
  grnDetailId: number,
  quantity: number
) => {
  console.log(grnDetailId, quantity);
};

const handleUpdateProductQuantity = (
  newVal: string | number | null,
  productId: number | null,
  firstVariantId: number,
  secondVariantId: number
) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    const key = `${productId}-${firstVariantId}-${secondVariantId}`;
    if (!val) {
      selectedInventoryPayload.value[key].stockQuantity = 0;
    } else {
      selectedInventoryPayload.value[key].stockQuantity = val;
    }
  }
};
</script>
