<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"
          >{{ isEdit ? 'Edit' : 'Preview' }} Str Receiving</span
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
        <div v-for="(product, i) in grnGroupByProductId" :key="i">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">
                  <div class="row items-center gap-1">
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
                    <span
                      >Product:
                      <span class="font-semibold">{{
                        product.productName
                      }}</span></span
                    >
                  </div>
                </th>

                <th
                  v-for="(firstVariant, i) in uniqueVariantNames(product.data)"
                  :key="i"
                  class="text-left"
                >
                  {{ firstVariant }}
                </th>
                <th class="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(secondVariant, i) in uniqueVariantNames2(product.data)"
                :key="i"
              >
                <tr
                  v-if="
                    !limitedRecord(product.data, secondVariant).every(
                      (data) => data.quantity === 0
                    )
                  "
                >
                  <td class="text-left font-semibold">
                    {{ secondVariant }}
                  </td>
                  <td
                    v-for="(secondItem, secondItemIndex) in limitedRecord(
                      product.data,
                      secondVariant
                    )"
                    :key="secondItemIndex"
                  >
                    <q-input
                      type="number"
                      dense
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
                  <td>
                    {{
                      !Number.isNaN(
                        getInvetoryTotalStockQuantity(
                          limitedRecord(product.data, secondVariant)
                        )
                      )
                        ? getInvetoryTotalStockQuantity(
                            limitedRecord(product.data, secondVariant)
                          )
                        : 0
                    }}
                  </td>
                </tr>
              </template>
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
</template>
<script lang="ts" setup>
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  EUserRoles,
  IGrnPreviewResponse,
  IProductGRN,
  ProductVariant,
} from 'src/interfaces';
import { updateGrnDetail, viewGrnApi } from 'src/services';
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

const uniqueVariantNames = (data: ProductVariant[]) => {
  const uniqueNames = new Set();
  if (data) {
    for (const product of data) {
      uniqueNames.add(product.variantName1);
    }
  }

  return Array.from(uniqueNames);
};
const limitedRecord = (data: ProductVariant[], variantName2: any) => {
  let rec = data.filter((item) => item.variantName2 === variantName2);
  return rec;
};
const uniqueVariantNames2 = (data: ProductVariant[]) => {
  const uniqueNames = new Set();
  if (data) {
    for (const product of data) {
      uniqueNames.add(product.variantName2);
    }
  }

  return Array.from(uniqueNames);
};

const selectedPreviewImage = ref('');
const selectedGrnId = ref(-1);
const isPreviewImageModalVisible = ref(false);
const isEdit = ref(false);
const grnGroupByProductId = ref<IProductGRN[] | null>(null);

const handlePreviewImage = (selectedImage: string | null) => {
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
onMounted(() => {
  selectedGrnId.value = Number(router.currentRoute.value.params.id);
  previewGrn(selectedGrnId.value);
  if (router.currentRoute.value.path.includes('edit')) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
});
const getInvetoryTotalStockQuantity = (variant: ProductVariant[]) => {
  return variant.reduce((acc: number, row: ProductVariant) => {
    return acc + (parseInt(row.quantity.toString()) ?? 0);
  }, 0);
};
const handleUpdateStrStockQuantity = (value: number, row: ProductVariant) => {
  if (!value || value <= 0) {
    setTimeout(() => {
      row.quantity = 0;
    }, 0);
  } else {
    row.quantity = value;
  }
};
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
        (accumulator: any, currentDetail) => {
          const productId = currentDetail.productId;

          if (!accumulator[productId]) {
            accumulator[productId] = {
              productId,
              productName: currentDetail.productName,
              productImage: currentDetail.productImage,
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
    }
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
const updateSelectedProductVariant = async (
  grnDetailId: number,
  quantity: number
) => {
  const res = await updateGrnDetail({
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
};
</script>
