<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-center md:justify-between gap-2 items-center mb-4 mt-2"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color=""
        class="bg-btn-primary hover:bg-btn-secondary"
        @click="showAddNewCustomerGroupPopup"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="filteredRows"
        v-model:pagination="pagination"
        :columns="customerGroupColumns"
        row-key="name"
        :filter="filter"
        @request="fetchingCustomerGroupList"
      >
        <template v-slot:top>
          <div class="font-medium text-lg"><span>Customer Group</span></div>
          <q-space />
          <q-input
            outlined
            dense
            debounce="300"
            color="btn-primary"
            label="Name"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
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
              />
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
              />
            </div>
          </q-td>
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
      <add-user-modal
        :user-name="selectedRowData?.name"
        :is-edit-customer-group="isEditCustomerGroup"
        @name-changed="updateOrAddCustomer"
      />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import CustomerStatusModal from 'components/customer-group-management/CustomerStatusModal.vue';
import AddUserModal from 'components/customer-group-management/AddCustomerModal.vue';
import {
  EActionPermissions,
  ICustomerData,
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
import { isPosError } from 'src/utils';
const pageTitle = getRoleModuleDisplayName(
  EUserModules.CustomerGroupManagement
);
const $q = useQuasar();
const authStore = useAuthStore();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});
const filter = ref('');
const customerGroupRows = ref<ICustomerListResponse[]>([]);
const selectedRowData = ref<ICustomerListResponse | null>(null);
const selectedStatus = ref<string>('');
const editStatusPopup = ref(false);
const isEditCustomerGroup = ref(false);
const isAddCustomerModalVisible = ref(false);
const newCustomerName = ref('');
const isLoading = ref(false);
const customerGroupColumns: QTableColumn<ICustomerData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    sortable: true,
    field: 'name',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: false,
  },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    align: 'left',
    sortable: false,
  },
];
const updateOrAddCustomer = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  try {
    const customerId = selectedRowData.value?.customerGroupId ?? -1;
    const status = selectedRowData.value?.status ?? '';
    const res = await (action === 'add'
      ? addNewCustomerGroup(newName)
      : updateCustomerGroup({ newName, customerId, status }));
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
  fetchingCustomerGroupList();
  callback();
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

const filteredRows = computed(() =>
  customerGroupRows.value.filter((row) =>
    row.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);
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
async function fetchingCustomerGroupList(data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) {
  if (isLoading.value) return;
  isLoading.value = true;
  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await getCustomerGroupList({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res?.data) {
      customerGroupRows.value = res?.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
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
