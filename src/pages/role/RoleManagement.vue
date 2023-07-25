<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">Admin Roles</span>
      <q-btn
        label="Add New"
        icon="add"
        unelevated
        color="primary"
        @click="handleAddNewAdminRole"
      />
    </div>
    <div class="q-pa-md">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Role Name</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="roles in adminRolesTableData" :key="roles.id">
            <td class="text-left text-weight-bold">{{ roles.id }}</td>
            <td class="text-left">{{ roles.role }}</td>
            <td class="text-center">
              <q-btn icon="more_horiz" color="blue-grey-4" flat unelevated />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <q-dialog v-model="showAddNewAdminRolePopup">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center mb-2">
            <span class="text-2xl font-medium">Add Admin Roles</span>
            <span><q-btn flat unelevated dense size="md" icon="close" /></span>
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
            <q-markup-table flat bordered class="full-width">
              <thead>
                <tr>
                  <th class="text-left">#</th>
                  <th class="text-left">Role Name</th>
                  <th class="text-center">View</th>
                  <th class="text-center">Create</th>
                  <th class="text-center">Edit</th>
                  <th class="text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="roles in addAdminRoleTableData" :key="roles.role">
                  <td class="text-left">{{ roles.id }}</td>
                  <td class="text-left">{{ roles.role }}</td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.view"
                      color="red"
                      @click="handleSingleViewToggle(roles)"
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.create"
                      color="red"
                      @click="handleSingleCreateToggle"
                      :disable="!roles.view"
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.edit"
                      color="red"
                      @click="handleSingleEditToggle"
                      :disable="!roles.view"
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.delete"
                      color="red"
                      @click="handleSingleDeleteToggle"
                      :disable="!roles.view"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
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
const handleAddNewAdminRole = () => {
  showAddNewAdminRolePopup.value = true;
};
// const handleSelectAllRoles =()=>{
//    editAllRoles.value= createAllRoles.value=deleteAllRoles.value = viewAllRoles.value = selectAllRoles.value
//    addAdminRoleTableData.value.forEach(role=>{role.edit = selectAllRoles.value
//    role.create = selectAllRoles.value
//    role.view = selectAllRoles.value
//    role.delete = selectAllRoles.value})
// }
</script>
