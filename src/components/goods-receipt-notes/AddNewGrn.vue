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
            :options="shopOptionrecords"
            :loading="isLoading"
            use-input
            dense
            clearable
            map-options
            outlined
            v-model="filterSearch.fromShop"
            label="Select Shop"
            @update:model-value="filterSearch.fromShop = $event"
            color="btn-primary"
            option-label="name"
            option-value="shopId"
            ><template v-if="filterSearch.fromShop !== null" v-slot:append>
              <q-icon
                name="search"
                @click.stop.prevent
                class="cursor-pointer"
                @click="handleSelectedShop(filterSearch.fromShop.shopId)"
              />
            </template>
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
            :options="shopOptionrecords"
            :loading="isLoading"
            use-input
            clearable
            dense
            map-options
            outlined
            v-model="filterSearch.toShop"
            @update:model-value="filterSearch.toShop = $event.shopId"
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
        <div class="w-full">
          <q-table
            :rows="selectedShopDetailRecords"
            row-key="productId"
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
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="Cancel" color="btn-cancel" unelevated v-close-popup />

      <q-btn label="Save" unelevated color="btn-primary" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IGenericResponse, IShopResponse } from 'src/interfaces';
import { shopListApi } from 'src/services';
import { isPosError, makeApiCall } from 'src/utils';
import { useQuasar } from 'quasar';
const filterSearch = ref<{
  fromShop: IShopResponse | null;
  toShop: IShopResponse | null;
}>({
  fromShop: null,
  toShop: null,
});
const isLoading = ref(false);
const shopData = ref<IShopResponse[]>([]);
const ShopOptionData = ref<IShopResponse[]>([]);
const selectedShopRecords = ref([]);
const $q = useQuasar();
const selectedShopDetailRecords = ref<IInventoryListResponse[]>([]);
onMounted(() => {
  getShopList();
});
interface IInventoryListResponse {
  productId: number;
  productName: string;
  productImage: string;
  productCode: string;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
  addedDate: string;
}
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const selectedPreviewImage = ref('');
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
const handleSelectedShop = (selectedShopId: number) => {
  inventoryDetailApi({
    PageNumber: pagination.value.page,
    PageSize: pagination.value.rowsPerPage,
    ShopId: selectedShopId,
  });
};
const inventoryDetailApi = async ({
  ShopId,
  PageNumber = 1,
  PageSize = 50,
}: {
  PageNumber: number;
  PageSize: number;
  ShopId: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{
      inventoryDetails: IInventoryListResponse[];
      shopId: number;
      shopName: string;
    }>
  >({
    url: 'api/inventory/detail',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      ShopId,
    },
  });
  selectedShopDetailRecords.value = res.data.inventoryDetails;
};
const shopOptionrecords = computed(() => {
  let idList: number[] = [];
  if (filterSearch.value.fromShop) {
    idList.push(filterSearch.value.fromShop.shopId);
  }
  if (filterSearch.value.toShop) {
    idList.push(filterSearch.value.toShop.shopId);
  }
  if (idList.length > 0) {
    return shopData.value.filter((shop) => !idList.includes(shop.shopId));
  }
  return shopData.value;
});
const getShopList = async () => {
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
