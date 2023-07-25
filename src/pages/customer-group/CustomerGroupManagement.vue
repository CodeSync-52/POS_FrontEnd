<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">Customer Managment</span>
      <q-btn label="Add New" icon="add" unelevated color="primary" />
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="customerGroupRows"
        :column="customerGroupColumns"
        :filter="filter"
        :visible-columns="['name', 'action']"
        :rows-per-page-options="['50', '5', '10', '15', '20']"
        row-key="name"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="flex gap-2 justify-left md:pr-4">
              <q-btn
                size="sm"
                flat
                unelevated
                :label="props.row.status"
                @click="handleEditStatusPopup(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td class="!text-right" :props="props">
            <div class="flex gap-2 justify-end md:pr-4">
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
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h5 q-mb-md"><span> Edit Status </span></div>
          <div class="q-gutter-md">
            <q-radio v-model="selectedStatus" val="active" label="Active" />
            <q-radio v-model="selectedStatus" val="inactive" label="InActive" />
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
    <q-dialog v-model="editCustomerGroupNamePopup">
      <q-card class="q-pa-md">
        <q-card-section>
          <q-input v-model="editCustomerGroup.name" outlined label="Name" />
        </q-card-section>
        <div class="row justify-end">
          <q-btn label="Cancel" flat unelevated color="red" v-close-popup />
          <q-btn
            label="Save"
            flat
            unelevated
            color="signature"
            v-close-popup
            @click="handleSaveEditedCustomerGroupName"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
const customerGroupColumns = ref([
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
]);
const filter = ref('');
const selectedEditStatusRowIndex = ref(0);
const selectedEditNameRowIndex = ref(0);
const selectedStatus = ref('active');
const editStatusPopup = ref(false);
const editCustomerGroupNamePopup = ref(false);
const editCustomerGroup = ref({
  name: '',
});
const customerGroupRows = ref([
  {
    id: 0,
    name: 'Frozen Yogurt',
    status: 'Active',
    action: 'edit',
  },
  {
    id: 1,
    name: 'Ice cream sandwich',
    status: 'Active',
    action: 'edit',
  },
  {
    id: 2,
    name: 'Eclair',
    status: 'Active',
    action: 'edit',
  },
  {
    id: 3,
    name: 'Cupcake',
    status: 'Active',
    action: 'edit',
  },
  {
    id: 4,
    name: 'Gingerbread',
    status: 'Active',
    action: 'edit',
  },
  {
    id: 5,
    name: 'Jelly bean',
    status: 'Inactive',
    action: 'edit',
  },
  {
    id: 6,
    name: 'Lollipop',
    status: 'Inactive',
    action: 'edit',
  },
  {
    id: 7,
    name: 'Honeycomb',
    status: 'Inactive',
    action: 'edit',
  },
  {
    id: 8,
    name: 'Donut',
    status: 'Inactive',
    action: 'edit',
  },
  {
    id: 9,
    name: 'KitKat',
    status: 'Inactive',
    action: 'edit',
  },
]);
const handleEditStatusPopup = (selectedRow: {
  id: number;
  name: string;
  status: string;
  action: string;
}) => {
  selectedEditStatusRowIndex.value = customerGroupRows.value.findIndex(
    (row) => selectedRow.id === row.id
  );
  if (selectedRow.status === 'Active') {
    selectedStatus.value = 'active';
  } else {
    selectedStatus.value = 'inactive';
  }
  editStatusPopup.value = true;
};
const handleSaveEditedStatus = () => {
  customerGroupRows.value[selectedEditStatusRowIndex.value].status =
    selectedStatus.value === 'active' ? 'Active' : 'InActive';
};
const handleDeleteCustomerGroupRow = (selectedRow: {
  id: number;
  name: string;
  status: string;
  action: string;
}) => {
  const selectedRowIndex = customerGroupRows.value.findIndex(
    (row) => selectedRow.id === row.id
  );
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Deleted!', 'Your row has been deleted.', 'success');
      return customerGroupRows.value.splice(selectedRowIndex, 1);
    }
  });
};
const handleEditCustomerGroupNamePopup = (selectedRow: {
  id: number;
  name: string;
  status: string;
  action: string;
}) => {
  editCustomerGroup.value.name = selectedRow.name;
  editCustomerGroupNamePopup.value = true;
  selectedEditNameRowIndex.value = selectedRow.id;
};
const handleSaveEditedCustomerGroupName = () => {
  customerGroupRows.value[selectedEditNameRowIndex.value].name =
    editCustomerGroup.value.name;
};
</script>
