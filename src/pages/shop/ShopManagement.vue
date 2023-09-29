<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <h1 class="text-lg font-medium">{{ pageTitle }}</h1>

      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="handleAddNewUser"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-input
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.ShopName"
        label="Shop Name"
        color="btn-primary"
      />

      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        v-model="filterSearch.Status"
        :options="shopStatusOptions"
        label="Shop Status"
        color="btn-primary"
      />

      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.OrderBy"
        :options="OrderBy"
        label="OrderBy"
        color="btn-primary"
      />

      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getShopList"
        />

        <q-btn
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table :rows="ShopRows" :columns="shopColumn" row-key="name">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              :label="props.row.status"
              class="hover:text-btn-primary"
              flat
              size="sm"
              unelevated
              dense
              @click="handleEditStatusPopup(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              icon="edit"
              flat
              size="sm"
              unelevated
              dense
              @click="showAddNewShopPopup = true"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog
    v-model="showAddNewShopPopup"
    @update:model-value="selectedUser = null"
  >
    <add-shop-modal
      :action="action"
      :selected-user="selectedUser"
      @user-add="handleAddNewShop"
    />
    <!-- @user-edit="handleEditShop" -->
  </q-dialog>

  <q-dialog v-model="isShopStatusModalVisible">
    <shop-status-modal
      :selected-status="selectedStatus"
      :shopId="shopId"
      @updated-status="
        (newVal, callback) => updatingStatus(newVal, shopId, callback)
      "
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import {
  EUserModules,
  IGenericResponse,
  IShopAddNew,
  getRoleModuleDisplayName,
  IShopData,
} from 'src/interfaces';
import AddShopModal from 'components/shop-managment/AddShopModal.vue';
import ShopStatusModal from 'components/shop-managment/ShopStatusModal.vue';
import {
  OrderBy,
  shopStatusOptions,
  shopColumn,
  isPosError,
  makeApiCall,
} from 'src/utils';
import { shopListApi } from 'src/services';
const pageTitle = getRoleModuleDisplayName(EUserModules.ShopManagement);
const isLoading = ref(false);
const isShopStatusModalVisible = ref(false);
const filterSearch = ref<{
  ShopName: string | null;
  Status: string | null;
  OrderBy: string | null;
}>({
  ShopName: null,
  Status: null,
  OrderBy: null,
});
const action = ref<string>('');
const selectedUser = ref<IShopAddNew | null>(null);
const ShopRows = ref<IShopData[]>([]);
const showAddNewShopPopup = ref(false);
const selectedStatus = ref<string>('');
const shopId = ref<number>(0);
const $q = useQuasar();
const handleAddNewUser = () => {
  action.value = 'Add New Shop';
  selectedUser.value = null;
  showAddShopModal(true);
};
const showAddShopModal = (isVisible: boolean) => {
  showAddNewShopPopup.value = isVisible;
};
const handleEditStatusPopup = (selectedRow: IShopData) => {
  selectedStatus.value = selectedRow.status;
  shopId.value = selectedRow.shopId;
  isShopStatusModalVisible.value = true;
};

async function handleAddNewShop(shopData: IShopAddNew) {
  try {
    const response: IGenericResponse = await makeApiCall({
      url: 'api/shop/add', // Use the correct API endpoint
      method: 'POST',
      data: shopData,
    });

    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      getShopList();
    } else {
      console.error('Failed to add shop:', response.message);
      $q.notify({
        message: response.message || 'Failed to add shop',
        type: 'negative',
      });
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    let errorMessage = 'Unexpected Error Occurred';

    if (isPosError(error)) {
      errorMessage = error.message;
    }
    $q.notify({
      message: errorMessage,
      color: 'red',
      icon: 'error',
    });
  }

  // Close the dialog or take any other necessary action
  showAddNewShopPopup.value = false;
}
onMounted(() => {
  getShopList();
});
const getShopList = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  const PageNumber = 1;
  const PageSize = 50;
  try {
    const response = await shopListApi({
      PageSize,
      PageNumber,
      filterSearch: filterSearch.value,
    });
    // makeApiCall<IGenericResponse<IShopResponse>>({
    //   url: 'api/shop/list?PageNumber=1&PageSize=50',
    //   method: 'GET',
    // });
    if (response.type === 'Success') {
      ShopRows.value = response.data.items;
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    let errorMessage = 'Unexpected Error Occurred';

    if (isPosError(error)) {
      errorMessage = error.message;
    }
    $q.notify({
      message: errorMessage,
      color: 'red',
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};
const updatingStatus = async (
  updatedStatus: string,
  shopId: number,
  callback: () => void
) => {
  try {
    const response: IGenericResponse = await makeApiCall({
      url: `api/shop/changestatus?shopId=${shopId}`, // Update with the correct API endpoint
      method: 'PUT', // Use 'PUT' method
      data: { status: updatedStatus },
    });

    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });

      // Optionally, update the shop status locally
      const shopToUpdate = ShopRows.value.find(
        (shop) => shop.shopId === shopId
      );
      if (shopToUpdate) {
        shopToUpdate.status = updatedStatus;
      }
    } else {
      console.error('Failed to update shop status:', response.message);
      $q.notify({
        message: response.message || 'Failed to update shop status',
        type: 'negative',
      });
    }
  } catch (error) {
    console.error(
      'Unexpected error occurred while updating shop status:',
      error
    );
    let errorMessage = 'Unexpected Error Occurred';

    if (isPosError(error)) {
      errorMessage = error.message;
    }
    $q.notify({
      message: errorMessage,
      color: 'red',
      icon: 'error',
    });
  }

  callback();

  // Close the status modal or take any other necessary action
  isShopStatusModalVisible.value = false;
};
</script>
