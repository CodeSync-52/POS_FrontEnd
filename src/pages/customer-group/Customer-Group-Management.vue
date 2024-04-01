<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-center md:justify-between gap-4 items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color=""
        class="bg-btn-primary hover:bg-btn-secondary"
        @click="showAddNewCustomerGroupPopup"
      />
    </div>
    <div>
      <q-table
        :rows="filteredRows"
        :columns="customerGroupColumns"
        row-key="shopId"
        :filter="filter"
        @request="fetchingCustomerGroupList"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top>
          <div
            class="flex flex-col sm:flex-row justify-center md:justify-between gap-4 item-center w-full"
          >
            <div class="font-medium text-lg flex items-center">
              <span>User Category</span>
            </div>
            <q-input
              outlined
              dense
              maxlength="250"
              debounce="300"
              color="btn-primary"
              label="Name"
              autofocus
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                style="text-decoration: underline"
                :disable="
                  !authStore.checkUserHasPermission(
                    EUserModules.CustomerGroupManagement,
                    EActionPermissions.Update
                  ) ||
                  !authStore.checkUserHasPermission(
                    EUserModules.CustomerGroupManagement,
                    EActionPermissions.Delete
                  )
                "
                class="hover:text-btn-primary"
                :label="props.row.status"
                @click="handleEditStatusPopup(props.row)"
              >
                <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                  Edit Status
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.CustomerGroupManagement,
              EActionPermissions.Delete
            ) ||
            authStore.checkUserHasPermission(
              EUserModules.CustomerGroupManagement,
              EActionPermissions.Update
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td class="!text-right" :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                dense
                unelevated
                icon="edit"
                class="hover:text-btn-primary"
                @click="handleEditCustomerGroupNamePopup(props.row)"
              >
                <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                  Edit User Category
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.name }}
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
    <q-dialog v-model="editStatusPopup">
      <customer-status-modal
        :selected-status="selectedStatus"
        @updated-status="updatingStatus"
      />
    </q-dialog>
    <q-dialog
      @update:model-value="selectedRowData = null"
      v-model="isAddCustomerModalVisible"
    >
      <add-customer-modal
        :user-name="selectedRowData?.name"
        :is-edit-customer-group="isEditCustomerGroup"
        @name-changed="updateOrAddCustomer"
      />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import CustomerStatusModal from 'src/components/customer-group-management/Customer-Status-Modal.vue';
import AddCustomerModal from 'src/components/customer-group-management/Add-Customer-Modal.vue';
import {
  EActionPermissions,
  ICustomerListResponse,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import {
  getCustomerGroupList,
  changeCustomerStatus,
  addNewCustomerGroup,
  updateCustomerGroup,
} from 'src/services';
import { useAuthStore } from 'src/stores';
import { isPosError, customerGroupColumns } from 'src/utils';
const pageTitle = getRoleModuleDisplayName(
  EUserModules.CustomerGroupManagement
);
const $q = useQuasar();
const authStore = useAuthStore();
const filter = ref('');
const customerGroupRows = ref<ICustomerListResponse[]>([]);
const selectedRowData = ref<ICustomerListResponse | null>(null);
const selectedStatus = ref<string>('');
const editStatusPopup = ref(false);
const isEditCustomerGroup = ref(false);
const isAddCustomerModalVisible = ref(false);
const newCustomerName = ref('');
const isLoading = ref(false);
const filteredRows = ref<ICustomerListResponse[]>([]);
const filterChanged = ref(false);
function setFilteredData() {
  filterChanged.value = true;
  filteredRows.value = customerGroupRows.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase().trim())
  );
  setTimeout(() => {
    filterChanged.value = false;
  }, 200);
}
watch(filter, setFilteredData);
watch(customerGroupRows, setFilteredData);
const updateOrAddCustomer = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  try {
    const existingCustomer = filteredRows.value.find(
      (customer) => customer.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingCustomer) {
      $q.notify({
        message: 'User Category With The Same Name Already Exists.',
        type: 'warning',
      });
      isAddCustomerModalVisible.value = false;
      return;
    }
    if (action !== 'add' && selectedRowData.value?.name === newName) {
      isAddCustomerModalVisible.value = false;
      callback();
      return;
    }
    const customerId = selectedRowData.value?.customerGroupId ?? -1;
    const res = await (action === 'add'
      ? addNewCustomerGroup(newName)
      : updateCustomerGroup({ newName, customerId }));
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
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
  selectedRowData.value = null;
  isAddCustomerModalVisible.value = false;
  callback();
  fetchingCustomerGroupList();
};
const updatingStatus = async (updatedStatus: string, callback: () => void) => {
  try {
    const res = await changeCustomerStatus(
      selectedRowData.value?.customerGroupId ?? -1
    );
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.status = updatedStatus;
        if (customerGroupRows.value) {
          const matchingRow = customerGroupRows.value.findIndex(
            (row) =>
              selectedRowData.value?.customerGroupId === row.customerGroupId
          );
          if (matchingRow !== -1) {
            const newList = [...customerGroupRows.value];
            newList[matchingRow].status = updatedStatus;
            customerGroupRows.value = newList;
          }
        }
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
  callback();
  editStatusPopup.value = false;
};
const showAddNewCustomerGroupPopup = () => {
  selectedRowData.value = null;
  isEditCustomerGroup.value = false;
  newCustomerName.value = '';
  isAddCustomerModalVisible.value = true;
};
const handleEditStatusPopup = (selectedRow: ICustomerListResponse) => {
  selectedRowData.value = selectedRow;
  if (selectedRowData.value?.status === 'Active') {
    selectedStatus.value = 'Active';
  } else {
    selectedStatus.value = 'InActive';
  }
  editStatusPopup.value = true;
};
const handleEditCustomerGroupNamePopup = (
  selectedRow: ICustomerListResponse
) => {
  isEditCustomerGroup.value = true;
  newCustomerName.value = selectedRow.name;
  isAddCustomerModalVisible.value = true;
  selectedRowData.value = selectedRow;
};
onMounted(() => {
  fetchingCustomerGroupList();
});
async function fetchingCustomerGroupList() {
  if (filterChanged.value) return;
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getCustomerGroupList({ status: 'ALL' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupRows.value = res.data;
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
}
</script>
<style>
.q-notification__actions {
  gap: 1rem !important;
}
</style>
