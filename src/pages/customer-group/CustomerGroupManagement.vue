<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">Customer Managment</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color="primary"
        @click="handleAddNewCustomerPopup"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="customerGroupRows"
        :columns="customerGroupColumns"
        :visible-columns="['name', 'status', 'action']"
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
      <q-card class="q-pa-md full-width">
        <q-card-section>
          <div class="text-h6 q-mb-md"><span> Edit Customer Status </span></div>
          <div class="column">
            <q-radio v-model="selectedStatus" val="1" label="Active" />
            <q-radio v-model="selectedStatus" val="0" label="InActive" />
          </div>
        </q-card-section>
        <div class="row justify-end">
          <q-btn label="Cancel" flat unelevated color="red" v-close-popup />
          <q-btn
            label="Save"
            flat
            unelevated
            color="signature"
            v-close-popup
            @click="handleSaveEditedStatus"
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCustomerGroupNamePopup">
      <q-card class="q-pa-md full-width">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <span>
              {{
                isEditCustomer ? 'Edit New Customer' : 'Add Customer Name'
              }}</span
            >
          </div>
          <q-input dense v-model="newCustomerName" outlined label="Name" />
        </q-card-section>
        <div class="row justify-end">
          <q-btn label="Cancel" flat unelevated color="red" v-close-popup />
          <q-btn
            v-if="isEditCustomer"
            label="Save"
            flat
            unelevated
            color="signature"
            v-close-popup
            @click="handleSaveEditedCustomerGroupName"
          />
          <q-btn
            v-else
            label="Add"
            flat
            unelevated
            color="signature"
            v-close-popup
            @click="handleSaveNewCustomer"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { customerGroupMockRows } from './customerGroupMocks';
import { ICustomerData } from '../../interfaces/users/customerGroupManagement';
import { QTableColumn, useQuasar } from 'quasar';
const $q = useQuasar();
const customerGroupColumns = ref<QTableColumn<ICustomerData>[]>([
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
]);
const customerGroupRows = ref(customerGroupMockRows);
const selectedRowData = ref<ICustomerData>({
  id: 0,
  name: '',
  status: '',
  action: '',
});
const selectedStatus = ref('');
const editStatusPopup = ref(false);
const addCustomerGroupNamePopup = ref(false);
const isEditCustomer = ref(false);
const newCustomerName = ref('');
const handleAddNewCustomerPopup = () => {
  isEditCustomer.value = false;
  newCustomerName.value = '';
  addCustomerGroupNamePopup.value = true;
};
const handleSaveNewCustomer = () => {
  const highestId =
    Math.max(...customerGroupRows.value.map((customer) => customer.id)) + 1;
  customerGroupRows.value = [
    ...customerGroupRows.value,
    {
      id: highestId,
      name: newCustomerName.value,
      status: '1',
      action: 'edit',
    },
  ];
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
const handleSaveEditedStatus = () => {
  selectedRowData.value.status = selectedStatus.value;
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
  isEditCustomer.value = true;
  newCustomerName.value = selectedRow.name;
  addCustomerGroupNamePopup.value = true;
  selectedRowData.value = selectedRow;
};
const handleSaveEditedCustomerGroupName = () => {
  const filteredSelectedRecord = customerGroupRows.value.find(
    (row) => selectedRowData.value.id === row.id
  );
  if (filteredSelectedRecord) {
    filteredSelectedRecord.name = newCustomerName.value;
  }
};
</script>
