<template>
  <div>
    <!-- <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <div class="text-base flex items-center gap-1">
        <span> Date: </span>
        <span class="font-semibold">
          {{ moment(timeStamp).format('YYYY-MM-DD') }}
        </span>
      </div>
    </div> -->
    <!-- <router-link to="/return/add-new">
      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.SaleAndReturnManagement,
            EActionPermissions.Create
          )
        "
        unelevated
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
      />
    </router-link> -->

    <!-- <q-card class="w-full">
      <q-card-section>
        <div class="mb-2 justify-end text-base flex items-center gap-1">
          <span> Running Balance: </span>
          <span class="font-semibold">100</span>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-6">

            <q-input v-model="selectedShopBoyCode" outlined color="btn-primary" dense label="Shopboy Code" />
          </div>
          <div class="col-6">
            <div class="row justify-end">
              <q-btn label="show hold bill" :disable="!selectedShopBoyCode" color="btn-primary" unelevated />
            </div>
          </div>
          <div class="col-6"></div>
          <div class="col-6">
            <div class="row justify-end">
              <q-btn label="Close Balance" color="btn-primary" :disable="!selectedShopBoyCode" unelevated />
            </div>
          </div>
          <div class="col-6"></div>
          <div class="col-6">
            <div class="row justify-end">
              <q-btn label="show Today Sale" color="btn-primary" :disable="!selectedShopBoyCode" unelevated />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/return/add-sale">
          <q-btn unelevated color="btn-primary" label="Next" :disable="!selectedShopBoyCode" />
        </router-link>
      </q-card-actions>
    </q-card> -->


    <div>
      <!-- <div
        class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4">
        <span class="text-xl font-medium">{{ pageTitle }}</span>
        <div class="text-base flex items-center gap-1">
          <span> Date: </span>
          <span class="font-semibold">
            {{ moment(timeStamp).format('YYYY-MM-DD') }}
          </span>
        </div>
      </div> -->
      <div class="flex  justify-between">
        
        <div class="w-[80%]">
          <div
        class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4">
        <span class="text-xl font-medium">{{ pageTitle }}</span>
        <div class="text-base flex items-center gap-1">
          <!-- <span class="font-medium"> Date: </span> -->
          <span class=" font-mono text-[18px] font-semibold">
            {{ moment(timeStamp).format('LL')}}
          </span>
        </div>
      </div>
          <div class="flex justify-center md:justify-between">       
            <div>
              <!-- <div class="flex justify-between items-center m-2 max-w-[300px]">
                <span class="text-black text-[16px] font-medium">Shop</span>
                <q-input class="max-w-[220px] min-w-[220px]" v-model="selectedShopBoyCode" outlined color="btn-primary"
                  dense>
                </q-input>
              </div> -->
              <!-- <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="Shop" /> -->
       
      <q-select
        popup-content-class="!max-h-[200px]"
        class="my-3 mx-auto md:mx-0 max-w-[200px] min-w-[200px]"
        use-input
        dense
        map-options
        outlined
        v-model="selectedShopBoyCode"
      
        label="User"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select
      >

              <!-- <div class="flex justify-between items-center m-2 max-w-[350px]">
                <span class="text-black text-[16px] font-medium">Receipt</span>
                <q-input class="max-w-[220px] min-w-[220px]" v-model="selectedShopBoyCode" outlined color="btn-primary"
                  dense>
                </q-input>
              </div> -->
              
              <!-- <div class="flex justify-between items-center m-2 max-w-[300px]">
                <span class="text-black text-[16px] font-medium">User</span>
                <q-input class="max-w-[220px] min-w-[220px]" v-model="selectedShopBoyCode" outlined color="btn-primary"
                  dense>
                </q-input>
              </div> -->


              <!-- <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="User" /> -->
                <!-- <q-select
        popup-content-class="!max-h-[200px]"
        class="max-w-[220px] min-w-[220px] my-3 mx-auto md:mx-0"
        use-input
        dense
        map-options
        outlined
        v-model="filterSearch.ShopId"
        @update:model-value="filterSearch.ShopId = $event.shopId"
        label="User"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
        ><template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template></q-select> -->
            </div>
            <div>
              <!-- max-w-[220px] min-w-[220px] -->


                <!-- <q-select
        popup-content-class="!max-h-[200px]"
        class=" my-3 mx-auto md:mx-0"
        use-input
        dense
        map-options
        outlined
        v-model="selectedShop.fromShop"
        @update:model-value="handleUpdateShop($event)"
        label="Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
        ></q-select> -->

        <q-select
        :loading="isFetchingShopList"
        popup-content-class="!max-h-[200px]"
        :options="shopData"
        class="my-3 max-w-[200px] min-w-[200px]"
        use-input
        dense
        map-options
        outlined
        v-model="selectedShop.fromShop"
        @update:model-value="handleUpdateShop($event)"
        label="Select Shop"
        color="btn-primary"
        option-label="name"
        option-value="shopId"
      ></q-select>

            </div>
            <div class="max-w-[300px] min-w-[250px]">
              <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="Receipt" />
            </div>
            <div class="max-w-[300px] min-w-[250px]">
              <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="Remaining Balance" />
            </div>
            
          </div>
          <div class="py-4">
      <q-table
        :rows="ShopDetailRecords"
        v-model:pagination="pagination"
        @request="getInventoryDetailList"
        :columns="InventoryListColumn"
        :loading="isFetchingRecords"
        class="max-h-[47vh] 3xl:max-h-[58vh]"
      >
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
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
          </q-td>
        </template>
      </q-table>
    </div>
           <div class="w-full flex justify-center md:justify-end">
            <div class="max-w-[300px] min-w-[250px]">
              <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-2" outlined dense color="btn-primary"
                label="Total" />
              <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="Discount" />
              <q-input v-model="filterSearch.ProductCode" maxlength="250" class="my-3" outlined dense color="btn-primary"
                label="Net Total" />
            </div>
           </div>
        </div>
        <div class="w-[17%] relative">
        <div class="sticky top-20">
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Cancel Receipt" icon="close" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Create Return" icon="cached" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Hold Sale" icon="hourglass_empty" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Show Hold Sale" icon="visibility" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Today sale (f9)" icon="trending_up" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] border icon_left bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Close Balance" icon="paid" />
        <q-btn unelevated
          color=""
          class="rounded-[8px] icon_left border bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Save" icon="shopping_cart" />
           <!-- class="rounded-[8px] border bg-btn-primary hover:bg-btn-primary-hover w-full py-2 lg:py-5 my-3 text-[14px] lg:text-[16px]" label="Save" icon="shopping_cart" /> -->

           <!-- <q-btn unelevated
           color=""
           class="rounded-[8px] border bg-btn-primary hover:bg-btn-primary-hover my-5 w-full py-2 ">
           <div class="flex items-center w-full justify-between mx-7">
      <q-icon size="3em" name="map" />
      <div class="text-[14px] lg:text-[16px]">Save</div>
    </div>
    </q-btn>
           <q-btn unelevated
           color=""
           class="rounded-[8px] border bg-btn-primary hover:bg-btn-primary-hover w-full py-2 ">
           <div class="flex items-center">
            <div class="w-[50px]">
      <q-icon size="3em" name="map" />
    </div>
      <div class="text-[14px] lg:text-[16px]">Save optp</div>
    </div>
    </q-btn> -->

        </div>
      </div>
      </div>
    </div>

    <!-- <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        :loading="isFetchingShopList"
        popup-content-class="!max-h-[200px]"
        :options="shopData"
        class="max-w-[200px] min-w-[200px]"
        use-input
        dense
        map-options
        outlined
        v-model="selectedShop.fromShop"
        @update:model-value="handleUpdateShop($event)"
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
      <q-select
        dense
        outlined
        :options="['', '']"
        style="min-width: 200px"
        v-model="filterSearch.ProductId"
        label="Select Product"
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.ProductCode"
        maxlength="250"
        outlined
        label="Product Code"
        autofocus
        dense
        color="btn-primary"
      />
      <q-input
        v-model="filterSearch.keyword"
        maxlength="250"
        outlined
        label="Keyword"
        autofocus
        dense
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getInventoryDetailList()"
        />
        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :rows="ShopDetailRecords"
        v-model:pagination="pagination"
        @request="getInventoryDetailList"
        :columns="InventoryListColumn"
        :loading="isFetchingRecords"
      >
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
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
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isPreviewImageModalVisible">
      <q-card class="min-w-[400px]">
        <q-card-section>
          <div class="w-full max-h-[350px] overflow-hidden">
            <img
              :src="selectedPreviewImage"
              alt="image"
              class="mx-auto w-full h-full bg-contain"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </div>
</template>
<style scoped lang="scss">
.icon_left>:nth-child(2) {
  justify-content: flex-start;
  gap: 20px;
  margin-left: 15px;
}
</style>

<script setup lang="ts">
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
  // EActionPermissions,
  EUserModules,
  IInventoryListResponse,
  IShopResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { inventoryDetailApi, shopListApi } from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError } from 'src/utils';
import { InventoryListColumn } from 'src/utils/inventory';
import { ref, onMounted, onUnmounted } from 'vue';
const authStore = useAuthStore();
const timeStamp = Date.now();
const pageTitle = getRoleModuleDisplayName(
  EUserModules.SaleAndReturnManagement
);
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
const selectedShopBoyCode = ref('');
const filterSearch = ref({
  wholeSaleStatus: '',
  keyword: '',
  ProductId: null,
  ShopId: selectedShop.value.fromShop?.shopId ?? null,
  ProductCode: '',
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const ShopDetailRecords = ref<IInventoryListResponse[]>([]);
const shopData = ref<IShopResponse[]>([]);
const $q = useQuasar();
const isFetchingShopList = ref(false);
const isFetchingRecords = ref(false);
const apiController = ref<AbortController | null>(null);
const isPreviewImageModalVisible = ref(false);
const selectedPreviewImage = ref('');

onMounted(() => {
  getShopList();
  if (selectedShop.value)
    selectedShop.value.fromShop = {
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      closingBalance: 0,
      status: '',
      isWareHouse: '',
      name: authStore.loggedInUser?.userShopInfoDTO.shopName ?? '',
      phone: '',
      address: '',
      code: '',
    };
  getInventoryDetailList();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
const handleUpdateShop = (newVal: IShopResponse) => {
  selectedShop.value.fromShop = newVal;
  filterSearch.value.ShopId = newVal.shopId;
};
const handlePreviewImage = (selectedImage: string) => {
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
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
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
    isFetchingShopList.value = false;
  }
};
const getInventoryDetailList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isFetchingRecords.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    if (isFetchingRecords.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await inventoryDetailApi(
      {
        ShopId:
          filterSearch.value.ShopId ??
          authStore.loggedInUser?.userShopInfoDTO.shopId ??
          -1,
        PageNumber: pagination.value.page,
        PageSize: pagination.value.rowsPerPage,
        filterSearch: filterSearch.value,
      },
      apiController.value
    );
    if (res.data) {
      ShopDetailRecords.value = res.data.inventoryDetails;
      pagination.value.rowsNumber = res.data.totalCountInventoryDetails;
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
</script>
