<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <h1 class="text-lg font-medium">{{ pageTitle }}</h1>

      <q-btn
        label="Add New"
        unelevated
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
        autofocus
        @keyup.enter="getShopList()"
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
          unelevated
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getShopList()"
        />

        <q-btn
          color=""
          unelevated
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="handleResetFilter"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :rows="ShopRows"
        :columns="shopColumn"
        row-key="name"
        :loading="isLoading"
        v-model:pagination="pagination"
        @request="getShopList"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              :label="props.row.status"
              class="hover:text-btn-primary"
              flat
              size="sm"
              unelevated
              dense
              style="text-decoration: underline"
              @click="handleEditStatusPopup(props.row)"
            >
              <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Change Status
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-address="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[160px] text-ellipsis overflow-hidden"
          >
            {{ props.row.address }}
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
              @click="handleEditShopPopup(props.row)"
            >
              <q-tooltip :offset="[10, 10]"> Edit Shop </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog v-model="showAddNewShopPopup">
    <add-shop-modal
      :action="action"
      :selected-shop="selectedRowData"
      @user-add="handleAddNewShop"
      @user-edit="handleEditShop"
    />
  </q-dialog>

  <q-dialog v-model="isShopStatusModalVisible">
    <shop-status-modal
      :selected-status="selectedRowData?.status"
      @updated-status="updatingStatus"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import {
  EUserModules,
  IShopAddNew,
  getRoleModuleDisplayName,
  IShopResponse,
} from 'src/interfaces';
import AddShopModal from 'src/components/shop-managment/Add-Shop-Modal.vue';
import ShopStatusModal from 'src/components/shop-managment/Shop-Status-Modal.vue';
import { OrderBy, shopStatusOptions, shopColumn, isPosError } from 'src/utils';
import {
  shopListApi,
  changeShopStatusApi,
  AddShopApi,
  updateShopApi,
} from 'src/services';
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
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});
const handleEditShopPopup = (selectedRow: IShopResponse) => {
  selectedRowData.value = Object.assign({}, selectedRow);
  action.value = 'Edit Shop';
  showAddNewShopPopup.value = true;
};
const handleResetFilter = () => {
  if (Object.values(filterSearch.value).every((value) => value === null))
    return;
  filterSearch.value = {
    ShopName: null,
    Status: null,
    OrderBy: null,
  };
  getShopList();
};
const action = ref<string>('');
const ShopRows = ref<IShopResponse[]>([]);
const showAddNewShopPopup = ref(false);
const $q = useQuasar();
const selectedRowData = ref<IShopResponse | null>(null);
const handleAddNewUser = () => {
  action.value = 'Add Shop';
  selectedRowData.value = null;
  showAddNewShopPopup.value = true;
};
const handleEditStatusPopup = (selectedRow: IShopResponse) => {
  selectedRowData.value = selectedRow;
  isShopStatusModalVisible.value = true;
};
onMounted(() => {
  getShopList();
});
async function handleAddNewShop(shopData: IShopAddNew, callback: () => void) {
  try {
    const response = await AddShopApi(shopData);
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      getShopList();
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred Adding Shop';

    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  callback();
  showAddNewShopPopup.value = false;
}
const getShopList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const rowsPerPage =
      pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
    const response = await shopListApi({
      PageNumber: pagination.value.page,
      PageSize: rowsPerPage,
      filterSearch: filterSearch.value,
    });
    if (response.data) {
      ShopRows.value = response.data.items;
      pagination.value.rowsNumber = response.data.totalItemCount;
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
const updatingStatus = async (updatedStatus: string, callback: () => void) => {
  if (selectedRowData.value?.status === updatedStatus) {
    callback();
    isShopStatusModalVisible.value = false;
    return;
  }
  const id = selectedRowData.value?.shopId ?? -1;
  try {
    const response = await changeShopStatusApi(id);
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      if (selectedRowData.value && selectedRowData.value.status === 'Active') {
        selectedRowData.value.status = 'InActive';
      } else if (
        selectedRowData.value &&
        selectedRowData.value.status === 'InActive'
      ) {
        selectedRowData.value.status = 'Active';
      }
    }
  } catch (error) {
    let message = 'Unexpected error occurred while updating shop status';

    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }

  callback();
  isShopStatusModalVisible.value = false;
};
const handleEditShop = async (data: IShopResponse, callback: () => void) => {
  const { name, phone, code, shopId, address } = data;
  try {
    const response = await updateShopApi({
      name,
      phone,
      code,
      shopId,
      address,
    });
    if (response.type === 'Success') {
      $q.notify({
        message: response.message,
        type: 'positive',
      });
      getShopList();
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred Editing Shop Info';

    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  callback();
  showAddNewShopPopup.value = false;
};
</script>
