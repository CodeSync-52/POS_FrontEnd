<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-center md:justify-between gap-2 items-center mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color=""
        class="bg-btn-primary hover:bg-btn-secondary"
        @click="showAddNewUserPopup"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="customerGroupRows"
        v-model:pagination="pagination"
        :columns="customerGroupColumns"
        row-key="name"
        @request="fetchingCustomerGroupList"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                dense
                class="hover:text-btn-primary"
                :label="props.row.status === '1' ? 'Active' : 'InActive'"
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
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.CustomerGroupManagement,
                    EActionPermissions.Update
                  )
                "
                size="sm"
                flat
                dense
                unelevated
                icon="edit"
                color="bg-btn-secondary"
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
        :is-edit-customer="!!selectedRowData"
        @name-changed="updateOrAddCustomer"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import CustomerStatusModal from 'components/customer-group-management/CustomerStatusModal.vue';
import AddUserModal from 'components/customer-group-management/AddCustomerModal.vue';
import {
  EActionPermissions,
  ICustomerData,
  ICustomerListResponse,
} from 'src/interfaces';
import { EUserModules, getRoleModuleDisplayName } from 'src/interfaces';
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
const updateOrAddCustomer = async (
  newName: string,
  action: string,
  callback: () => void
) => {
  try {
    const customerId = selectedRowData.value?.customerGroupId ?? -1;
    const status = selectedRowData.value?.status ?? -1;
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
    if (isPosError(e)) {
      $q.notify({
        message: e.message,
        color: 'red',
      });
    }
  }
  selectedRowData.value = null;
  isAddCustomerModalVisible.value = false;
  fetchingCustomerGroupList();
  callback();
};
const updatingStatus = async (updatedStatus: number, callback: () => void) => {
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
    if (isPosError(e)) {
      $q.notify({
        message: e.message,
        color: 'red',
      });
    }
  }
  callback();
  editStatusPopup.value = false;
};
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
    field: 'name',
    align: 'left',
    sortable: false,
  },
];
const customerGroupRows = ref<ICustomerListResponse[]>([]);
const selectedRowData = ref<ICustomerListResponse | null>(null);
const selectedStatus = ref<number>(-1);
const editStatusPopup = ref(false);
const isAddCustomerModalVisible = ref(false);
const newCustomerName = ref('');
const showAddNewUserPopup = () => {
  newCustomerName.value = '';
  isAddCustomerModalVisible.value = true;
};
const handleEditStatusPopup = (selectedRow: ICustomerListResponse) => {
  selectedRowData.value = selectedRow;
  if (selectedRowData.value?.status === 1) {
    selectedStatus.value = 1;
  } else {
    selectedStatus.value = 0;
  }
  editStatusPopup.value = true;
};
const handleEditCustomerGroupNamePopup = (
  selectedRow: ICustomerListResponse
) => {
  newCustomerName.value = selectedRow.name;
  isAddCustomerModalVisible.value = true;
  selectedRowData.value = selectedRow;
};
const isLoading = ref(false);
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
    if (isPosError(e)) {
      $q.notify({
        message: e.message ?? 'Unexpected Error Occurred',
        color: 'red',
      });
    }
  }
  isLoading.value = false;
}
</script>
<style>
.q-notification__actions {
  gap: 1rem !important;
}
</style>
