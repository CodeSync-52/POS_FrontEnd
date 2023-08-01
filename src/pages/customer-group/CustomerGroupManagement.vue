<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color=""
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="showAddNewUserPopup"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="customerGroupRows"
        :columns="customerGroupColumns"
        :rows-per-page-options="['50', '5', '10', '15', '20']"
        row-key="name"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                :label="props.row.status === '1' ? 'Active' : 'InActive'"
                @click="handleEditStatusPopup(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="!text-right" :props="props">
            <div class="flex gap-2 md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                icon="edit"
                @click="handleEditCustomerGroupNamePopup(props.row)"
              />
              <q-btn
                size="sm"
                flat
                unelevated
                icon="delete"
                @click="handleDeleteCustomerGroupRow(props.row)"
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
import { ref } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import CustomerStatusModal from 'components/customer-group-management/CustomerStatusModal.vue';
import AddUserModal from 'components/customer-group-management/AddCustomerModal.vue';
import { customerGroupMockRows } from './customer-group-mocks';
import { ICustomerData } from 'src/interfaces';
import { EUserModules, getRoleModuleDisplayName } from 'src/interfaces';
const pageTitle = getRoleModuleDisplayName(
  EUserModules.CustomerGroupManagement
);
const $q = useQuasar();
const updateOrAddCustomer = async (newName: string, callback: () => void) => {
  if (selectedRowData.value) {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  } else {
    await new Promise((res) => {
      setTimeout(() => res(newName), 3000);
    });
  }
  selectedRowData.value = null;
  isAddCustomerModalVisible.value = false;
  callback();
};
const updatingStatus = async (updatedStatus: string) => {
  await new Promise((res) => {
    setTimeout(() => res(updatedStatus), 3000);
  });
  if (selectedRowData.value) {
    selectedRowData.value.status = updatedStatus;
  }
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
    field: 'action',
    align: 'left',
    sortable: false,
  },
];
const customerGroupRows = ref(customerGroupMockRows);
const selectedRowData = ref<ICustomerData | null>(null);
const selectedStatus = ref('');
const editStatusPopup = ref(false);
const isAddCustomerModalVisible = ref(false);
const newCustomerName = ref('');
const showAddNewUserPopup = () => {
  newCustomerName.value = '';
  isAddCustomerModalVisible.value = true;
};
const handleEditStatusPopup = (selectedRow: ICustomerData) => {
  selectedRowData.value = selectedRow;
  if (selectedRowData.value.status === '1') {
    selectedStatus.value = '1';
  } else {
    selectedStatus.value = '0';
  }
  editStatusPopup.value = true;
};
const handleDeleteCustomerGroupRow = (selectedRow: ICustomerData) => {
  $q.notify({
    message: 'Are you sure you want to delete this record?',
    color: 'signature',
    actions: [
      {
        label: 'Delete',
        color: 'yellow',
        handler: () => {
          const selectedRowIndex = customerGroupRows.value.findIndex(
            (row) => selectedRow.id === row.id
          );
          customerGroupRows.value.splice(selectedRowIndex, 1);
          $q.notify({
            type: 'positive',
            message: 'Your Selected Record is deleted.',
          });
        },
      },
      { label: 'Cancel', color: 'white' },
    ],
  });
};
const handleEditCustomerGroupNamePopup = (selectedRow: ICustomerData) => {
  newCustomerName.value = selectedRow.name;
  isAddCustomerModalVisible.value = true;
  selectedRowData.value = selectedRow;
};
</script>
