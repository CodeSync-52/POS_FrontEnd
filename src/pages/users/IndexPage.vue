<template>
  <div class="px-12 py-16">
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">User Managment</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color="primary"
        @click="handleAddNewAdminRole(true)"
      />
    </div>
    <div class="q-pa-md">
    <q-table
      flat bordered
      ref="tableRef"
      :class="tableClass"
      tabindex="0"
      title="Treats"
      :rows="UserRows"
      :columns="UserColumn"
      :filter="filter"
      
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
    <q-dialog v-model="showAddNewAdminRolePopup">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center mb-2">
            <span class="text-2xl font-medium">Add new user</span>
            <span
              ><q-btn
                @click="handleAddNewAdminRole(false)"
                flat
                unelevated
                dense
                size="md"
                icon="close"
            /></span>
          </div>
          <div class="row px-2 q-col-gutter-y-md">
            <div class="col-4">
              <div>
                <q-input v-model="searchedAdminRole" label="Role Name" />
              </div>
            </div>
            <div class="col-4">pagination</div>
            <div class="col-4">
              <div>
                <q-input
                  v-model="itemsPerPage"
                  type="number"
                  label="Items Per Page"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="row items-center q-gutter-x-md">
                <span>Permissions:</span>
                <span
                  >Select all: <q-toggle v-model="selectAllRoles" color="red"
                /></span>
              </div>
            </div>
            <div class="col-12">
              <div class="row q-col-gutter-x-md">
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md">
                      <span>View All:</span>
                      <q-toggle
                        v-model="viewAllRoles"
                        @click="handleViewAllRoles"
                        color="red"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md">
                      <span>Create All:</span>
                      <q-toggle
                        v-model="createAllRoles"
                        color="red"
                        @click="handleCreateAllRoles"
                        :disable="!viewAllRoles"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md">
                      <span>Edit All:</span>
                      <q-toggle
                        v-model="editAllRoles"
                        color="red"
                        @click="handleEditAllRoles"
                        :disable="!viewAllRoles"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md">
                      <span>Delete All:</span>
                      <q-toggle
                        v-model="deleteAllRoles"
                        color="red"
                        @click="handleDeleteAllRoles"
                        :disable="!viewAllRoles"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserColumn, UserRows } from './utils';
const adminRolesTableData = ref([
  { id: 1, role: 'admin roles 22' },
  { id: 2, role: 'test update' },
  { id: 3, role: 'Admin 1' },
  { id: 4, role: 'Master' },
  { id: 5, role: 'Master2' },
]);
const addAdminRoleTableData = ref([
  {
    id: 1,
    role: 'Dashboard',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 2,
    role: 'Team',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 3,
    role: 'Videos',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 4,
    role: 'Blog',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 5,
    role: 'Users',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
]);
const showAddNewAdminRolePopup = ref(false);
const searchedAdminRole = ref('');
const viewAllRoles = ref(false);
const createAllRoles = ref(false);
const editAllRoles = ref(false);
const deleteAllRoles = ref(false);
const itemsPerPage = ref(12);
const selectAllRoles = ref(false);
const handleViewAllRoles = () => {
  if (!viewAllRoles.value) {
    editAllRoles.value = false;
    createAllRoles.value = false;
    deleteAllRoles.value = false;
    addAdminRoleTableData.value.forEach((role) => {
      role.edit = editAllRoles.value;
      role.create = createAllRoles.value;
      role.delete = deleteAllRoles.value;
    });
  }
  addAdminRoleTableData.value.forEach(
    (role) => (role.view = viewAllRoles.value)
  );
};
const handleCreateAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.create = createAllRoles.value)
  );
};
const handleEditAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.edit = editAllRoles.value)
  );
};
const handleDeleteAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.delete = deleteAllRoles.value)
  );
};
const handleSingleViewToggle = (role: {
  id: number;
  role: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}) => {
  if (addAdminRoleTableData.value.map((data) => data.view).includes(false)) {
    viewAllRoles.value = false;
    role.create = false;
    role.delete = false;
    role.edit = false;
  } else {
    viewAllRoles.value = true;
  }
};
const handleSingleCreateToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.create).includes(false)) {
    createAllRoles.value = false;
  } else {
    createAllRoles.value = true;
  }
};
const handleSingleEditToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.edit).includes(false)) {
    editAllRoles.value = false;
  } else {
    editAllRoles.value = true;
  }
};
const handleSingleDeleteToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.delete).includes(false)) {
    deleteAllRoles.value = false;
  } else {
    deleteAllRoles.value = true;
  }
};
const handleAddNewAdminRole = (action) => {
  showAddNewAdminRolePopup.value = action;
};

 const filter = ref('')
      
 
</script>
