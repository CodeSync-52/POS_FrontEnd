<template>
  <q-card class="min-w-[700px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> Add New GRN</span>
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-base mb-1"><span>From Shop</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            :options="shopData"
            :loading="isLoading"
            use-input
            dense
            map-options
            outlined
            disable
            v-model="selectedShop.fromShop"
            @update:model-value="selectedShop.fromShop = $event.shopId"
            label="Select Shop"
            color="btn-primary"
            option-label="name"
            option-value="shopId"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
        <div class="col-6">
          <div class="text-base mb-1"><span>To Shop</span></div>
          <q-select
            popup-content-class="!max-h-[200px]"
            :options="shopData"
            :loading="isLoading"
            use-input
            dense
            clearable
            map-options
            outlined
            v-model="selectedShop.toShop"
            @update:model-value="selectedShop.toShop = $event.shopId"
            label="Select Shop"
            color="btn-primary"
            option-label="name"
            option-value="shopId"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
        <div v-if="isSelectedShopDetailTableVisible" class="w-full">
          <!-- {{ selectedShopRecords }} -->
          <!-- @update:selected="handleChangeSelectedShopRecord" -->
          <q-table
            :columns="InventoryListColumn"
            :rows="selectedShopDetailRecords"
            row-key="id"
            selection="multiple"
            v-model:selected="selectedShopRecords"
            align="left"
            :loading="isLoading"
            ><template v-slot:no-data>
              <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
                <q-icon name="warning" size="xs" />
                <span class="text-md font-medium"> No data available. </span>
              </div>
            </template>
            <template v-slot:body-cell-productCode="props">
              <q-td :props="props">
                {{ props.row.productCode || '-' }}
              </q-td>
            </template>
            <template v-slot:body-cell-quantity="props">
              <q-td :props="props">
                {{
                  selectedInventoryPayload[
                    `${props.row.id}-${props.row.productId}-${props.row.variantId_1}-${props.row.variantId_2}`
                  ]
                }}
                <q-input
                  v-if="
                    selectedInventoryPayload[
                      `${props.row.id}-${props.row.productId}-${props.row.variantId_1}-${props.row.variantId_2}`
                    ]
                  "
                  type="number"
                  outlined
                  dense
                  :disable="!selectedShopRecords.includes(props.row)"
                  :min="0"
                  v-model="
                    selectedInventoryPayload[
                      `${props.row.id}-${props.row.productId}-${props.row.variantId_1}-${props.row.variantId_2}`
                    ].quantity
                  "
                  class="min-w-[100px]"
                  color="btn-primary"
                />
                <div v-else>0</div>
              </q-td>
            </template>
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
              </q-td> </template
          ></q-table>
        </div>
        <div v-else class="w-full mx-auto">
          <q-spinner size="3rem" color="btn-primary" class="mx-auto" />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="Cancel" color="btn-cancel" unelevated v-close-popup />

      <q-btn
        label="Save"
        unelevated
        :disable="isSavingGrnButtonDisabled"
        color="btn-primary"
        @click="handleSaveNewGrn"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  IInventoryFilterSearch,
  IInventoryListResponseWithId,
  IShopResponse,
} from 'src/interfaces';
import { inventoryDetailApi, shopListApi } from 'src/services';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { InventoryListColumn } from 'src/utils/inventory';
import { useAuthStore } from 'src/stores';
const selectedShop = ref<{
  fromShop: number | null;
  toShop: number | null;
}>({
  fromShop: null,
  toShop: null,
});
const $q = useQuasar();
const selectedShopDetailRecords = ref<IInventoryListResponseWithId[]>([]);
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedShopRecords = ref<IInventoryListResponseWithId[]>([]);
const selectedInventoryPayload = ref<
  Record<
    string,
    {
      productId: number;
      variantId_1: number;
      variantId_2: number;
      quantity: number;
    }
  >
>({});
const authStore = useAuthStore();
onMounted(() => {
  getShopList();
  selectedShop.value.fromShop =
    authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1;
  inventoryDetailList();
});
const isSelectedShopDetailTableVisible = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const filterSearch = ref<IInventoryFilterSearch>({
  ProductId: null,
  ProductCode: null,
  ShopId: null,
});
const selectedPreviewImage = ref('');
const isFetchingRecords = ref(false);

//watch(selectedShopRecords, (newRecord: IInventoryListResponseWithId[]) => {
//newRecord.forEach((record: IInventoryListResponseWithId) => {
//const key = `${record.id}-${record.productId}-${record.variantId_1}-${record.variantId_2}`;
// console.log(
//  'is in: ' + !selectedShopRecords.value.includes(record),
//  selectedShopRecords.value,
//  'selected record:',
//  record
//);
// if (record.hasOwnProperty(key)) {
//  selectedInventoryPayload.value[key] = {
//     productId: record.productId,
//     variantId_1: record.variantId_1,
//     variantId_2: record.variantId_2,
//     quantity: 0,
//   };
//  } else if (!selectedShopRecords.value.includes(record)) {
// } else {
//   selectedInventoryPayload.value = {
//     ...selectedInventoryPayload.value,
//     [key]: {
//       productId: record.productId,
//       variantId_1: record.variantId_1,
//       variantId_2: record.variantId_2,
//       quantity: 0,
//     },
//   };
// }
//  });
//});
const handlePreviewImage = (selectedImage: string) => {
  if (selectedImage) {
    selectedPreviewImage.value = `data:image/png;base64,${selectedImage}`;
  }
};
const getImageUrl = (base64Image: string) => {
  if (base64Image) {
    return `data:image/png;base64,${base64Image}`;
  }
  return '';
};
const handleSaveNewGrn = () => {
  console.log(selectedShop.value);
};

const isSavingGrnButtonDisabled = computed(() => {
  const validations = [
    selectedShop.value.fromShop === null,
    selectedShop.value.toShop === null,
  ];
  return validations.some((validation) => validation === true);
});
const inventoryDetailList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isFetchingRecords.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await inventoryDetailApi({
      ShopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      PageNumber: pagination.value.page,
      PageSize: pagination.value.rowsPerPage,
      filterSearch: filterSearch.value,
    });
    if (res.data) {
      selectedShopDetailRecords.value = res.data.inventoryDetails.map(
        (record, index) => {
          return { ...record, id: index + 1 };
        }
      );
      // selectedShopDetailRecords.value.forEach(
      //  (record: IInventoryListResponseWithId) => {
      //    const key = `${record.id}-${record.productId}-${record.variantId_1}-${record.variantId_2}`;
      //    selectedInventoryPayload.value = {
      //     ...selectedInventoryPayload.value,
      //      [key]: {
      //        productId: record.productId,
      //        variantId_1: record.variantId_1,
      //        variantId_2: record.variantId_2,
      //        quantity: 0,
      //     },
      //   };
      // }
      //);
      isSelectedShopDetailTableVisible.value = true;
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
  isFetchingRecords.value = false;
};
//const shopOptionrecords = computed(() => {
//  let idList: number[] = [];
//  if (selectedShop.value.fromShop) {
//    idList.push(selectedShop.value.fromShop.shopId);
//  }
//  if (selectedShop.value.toShop) {
//    idList.push(selectedShop.value.toShop.shopId);
//  }
// if (idList.length > 0) {
//    return shopData.value.filter((shop) => !idList.includes(shop.shopId));
//  }
//  return shopData.value;
//});
const getShopList = async () => {
  isLoading.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
      ShopOptionData.value = response.data.items;
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
</script>
