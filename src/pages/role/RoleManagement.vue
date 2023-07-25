<template>
  <div>
    <div class="flex mb-4">
      <span class="text-3xl font-semibold">Admin Roles</span>
    </div>
    <div class="q-pa-md">
      <q-table
        :rows="rolesManagementTableRows"
        :visible-columns="['name', 'action']"
        :column="rolesManagementTableColumns"
        row-key="name"
        @row-click="handleRowClick"
        :hide-bottom="true"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="!text-right" :props="props">
            <div class="flex justify-end gap-2 md:pr-4">
              <q-btn-dropdown color="signature" flat unelevated size="md">
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section @click="handleRowAction('preview')">
                      <q-item-label>Preview</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="handleRowAction('edit')"
                  >
                    <q-item-section>
                      <q-item-label>Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="showEditAdminRolePopup">
      <q-card class="!max-w-[650px]">
        <q-card-section class="q-pa-none">
          <div v-close-popup class="row justify-end items-center mb-2">
            <span><q-btn flat unelevated dense size="md" icon="close" /></span>
          </div>
          <div class="row px-2 q-col-gutter-y-md">
            <div class="col-12">
              <div class="row items-center q-gutter-x-md">
                <span>Permissions:</span>
                <span
                  >Select all:
                  <q-toggle
                    v-model="roleActionsType.selectAllRoles"
                    color="signature"
                    :disable="selectedAdminRoleAction === 'preview'"
                /></span>
              </div>
            </div>
            <div class="col-12">
              <div class="row q-col-gutter-x-md">
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md items-center">
                      <span>View All:</span>
                      <q-toggle
                        v-model="hasAllViewRoles"
                        @update:model-value="handleViewAllRoles"
                        color="signature"
                        :disable="selectedAdminRoleAction === 'preview'"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md items-center">
                      <span>Create All:</span>
                      <q-toggle
                        v-model="roleActionsType.createAllRoles"
                        color="signature"
                        @click="handleCreateAllRoles"
                        :disable="
                          selectedAdminRoleAction === 'preview'
                            ? true
                            : !roleActionsType.viewAllRoles
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md items-center">
                      <span>Edit All:</span>
                      <q-toggle
                        v-model="roleActionsType.editAllRoles"
                        color="signature"
                        @click="handleEditAllRoles"
                        :disable="
                          selectedAdminRoleAction === 'preview'
                            ? true
                            : !roleActionsType.viewAllRoles
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div>
                    <div class="row q-gutter-x-md items-center">
                      <span>Delete All:</span>
                      <q-toggle
                        v-model="roleActionsType.deleteAllRoles"
                        color="signature"
                        @click="handleDeleteAllRoles"
                        :disable="
                          selectedAdminRoleAction === 'preview'
                            ? true
                            : !roleActionsType.viewAllRoles
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <q-markup-table
              flat
              bordesignature
              class="full-width max-h-[380px] overflow-y-auto adminRoleEditTable"
            >
              <thead>
                <tr>
                  <th class="text-left">Module Name</th>
                  <th class="text-center">View</th>
                  <th class="text-center">Create</th>
                  <th class="text-center">Edit</th>
                  <th class="text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="roles in rolesManagementTableRows[
                    selectedAdminRoleRowIndex
                  ].roles"
                  :key="roles.role"
                >
                  <td class="text-left">{{ roles.role }}</td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.view"
                      color="signature"
                      @click="handleSingleViewToggle(roles)"
                      :disable="selectedAdminRoleAction === 'preview'"
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.create"
                      color="signature"
                      @click="handleSingleCreateToggle"
                      :disable="
                        selectedAdminRoleAction === 'preview'
                          ? true
                          : !roles.view
                      "
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.edit"
                      color="signature"
                      @click="handleSingleEditToggle"
                      :disable="
                        selectedAdminRoleAction === 'preview'
                          ? true
                          : !roles.view
                      "
                    />
                  </td>
                  <td class="text-left">
                    <q-toggle
                      v-model="roles.delete"
                      color="signature"
                      @click="handleSingleDeleteToggle"
                      :disable="
                        selectedAdminRoleAction === 'preview'
                          ? true
                          : !roles.view
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>
        <q-card-actions
          v-if="selectedAdminRoleAction === 'edit'"
          class="justify-end"
        >
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn flat label="Save" color="signature" v-close-popup />
        </q-card-actions>
        <q-card-actions v-else class="justify-end">
          <q-btn
            label="close"
            color="signature"
            flat
            unelevated
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IAdminRole } from '../../interfaces/admin-role/AdminRole';
const hasAllViewRoles = computed(() => {
  return addAdminRoleTableData.value.every((role) => role.view);
});
const selectedAdminRoleRowIndex = ref(0);
const selectedAdminRoleAction = ref('');
const rolesManagementTableColumns = ref([
  {
    name: 'name',
    required: true,
    label: 'Role Name',
    align: 'left',
  },
  {
    name: 'action',
    label: '',
    align: 'right',
  },
]);
const rolesManagementTableRows = ref([
  {
    id: 1,
    name: 'Super Admin',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Admin',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Shop Manager',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Office Boy',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Shop Sale Officer',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Customer/Vendor',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
]);
const handleRowClick = (prop: Event, selectedRow: IAdminRole) => {
  selectedAdminRoleRowIndex.value = rolesManagementTableRows.value.findIndex(
    (row) => selectedRow.id === row.id
  );
};
const handleRowAction = (action: string) => {
  selectedAdminRoleAction.value = action;
  showEditAdminRolePopup.value = true;
};

const addAdminRoleTableData = ref([
  {
    id: 1,
    role: 'User Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 2,
    role: 'Role Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 3,
    role: 'Customer Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 4,
    role: 'Receipt Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 5,
    role: 'Bill Generation',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 6,
    role: 'Cash in/Cash out',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 7,
    role: 'Sales Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 8,
    role: 'Sales Return Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 9,
    role: 'Shop Discount',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 10,
    role: 'Variant Management',
    view: false,
    create: true,
    edit: false,
    delete: false,
  },
  {
    id: 11,
    role: 'Category Management',
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 12,
    role: 'Article Management',
    view: true,
    create: false,
    edit: true,
    delete: false,
  },
  {
    id: 13,
    role: 'Inventory Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 14,
    role: 'Shop Management',
    view: true,
    create: false,
    edit: false,
    delete: true,
  },
  {
    id: 15,
    role: 'GRN',
    view: true,
    create: true,
    edit: false,
    delete: true,
  },
  {
    id: 16,
    role: 'STR',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    id: 17,
    role: 'Report Management',
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
]);
const showEditAdminRolePopup = ref(false);
const viewAllRoles = ref(false);
const roleActionsType = ref({
  viewAllRoles: false,
  createAllRoles: false,
  editAllRoles: false,
  deleteAllRoles: false,
  selectAllRoles: false,
});
const handleViewAllRoles = (newState: boolean) => {
  rolesManagementTableRows.value[selectedAdminRoleRowIndex.value].roles.forEach(
    (role) => {
      role.view = newState;
    }
  );
  return;
  if (!viewAllRoles.value) {
    roleActionsType.value.editAllRoles = false;
    roleActionsType.value.createAllRoles = false;
    roleActionsType.value.deleteAllRoles = false;
    addAdminRoleTableData.value.forEach((role) => {
      role.edit = roleActionsType.value.editAllRoles;
      role.create = roleActionsType.value.createAllRoles;
      role.delete = roleActionsType.value.deleteAllRoles;
    });
  }
  addAdminRoleTableData.value.forEach(
    (role) => (role.view = roleActionsType.value.viewAllRoles)
  );
};
const handleCreateAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.create = roleActionsType.value.createAllRoles)
  );
};
const handleEditAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.edit = roleActionsType.value.editAllRoles)
  );
};
const handleDeleteAllRoles = () => {
  addAdminRoleTableData.value.forEach(
    (role) => (role.delete = roleActionsType.value.deleteAllRoles)
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
    roleActionsType.value.viewAllRoles = false;
    role.create = false;
    role.delete = false;
    role.edit = false;
  } else {
    roleActionsType.value.viewAllRoles = true;
  }
};
const handleSingleCreateToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.create).includes(false)) {
    roleActionsType.value.createAllRoles = false;
  } else {
    roleActionsType.value.createAllRoles = true;
  }
};
const handleSingleEditToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.edit).includes(false)) {
    roleActionsType.value.editAllRoles = false;
  } else {
    roleActionsType.value.editAllRoles = true;
  }
};
const handleSingleDeleteToggle = () => {
  if (addAdminRoleTableData.value.map((data) => data.delete).includes(false)) {
    roleActionsType.value.deleteAllRoles = false;
  } else {
    roleActionsType.value.deleteAllRoles = true;
  }
};
// const handleSelectAllRoles =()=>{
//    editAllRoles.value= createAllRoles.value=deleteAllRoles.value = viewAllRoles.value = selectAllRoles.value
//    addAdminRoleTableData.value.forEach(role=>{role.edit = selectAllRoles.value
//    role.create = selectAllRoles.value
//    role.view = selectAllRoles.value
//    role.delete = selectAllRoles.value})
// }
</script>
