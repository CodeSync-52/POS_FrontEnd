<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>
      <q-btn
        label="Add New"
        icon="add"
        class="rounded-lg"
        unelevated
        color="primary"
        @click="showAddUserModal(true)"
      />
    </div>
    <div class="row flex justify-end items-end w-full h-[3.5rem] gap-8">
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroup"
        :options="customerGroupOptions"
        label="Customer Group"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.role"
        :options="roleOptions"
        label="Role"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.status"
        :options="statusOptions"
        label="Status"
      />
      <div class="flex justify-end items-end h-full gap-4">
        <q-btn
          color="primary"
          class="rounded-lg h-2"
          icon="search"
          label="Search"
          @click="
            () => {
              console.log(filterSearch);
            }
          "
        />
        <q-btn
          color="red"
          class="rounded-lg h-2"
          label="Clear"
          @click="resetFilter"
        />
        <q-btn color="green" class="rounded-lg h-2" label="Export as CSV" />
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        tabindex="0"
        :rows="UserRows"
        :column="UserColumn"
        :visible-columns="[
          'fullName',
          'userName',
          'phone',
          'role',
          'assignShop',
          'customerGroup',
          'discount',
          'outStandingBalance',
          'action',
        ]"
        row-key="name"
      >
        <template v-slot:body-cell-action="props">
          <q-td class="" :props="props">
            <div class="flex flex-nowrap">
              <q-btn
                size="sm"
                flat
                unelevated
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
              <q-btn size="sm" flat unelevated icon="delete" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog
      v-model="showAddNewAdminRolePopup"
      @update:model-value="selectedUser = undefined"
    >
      <add-user-modal :selected-user="selectedUser" @user-add="handleUserAdd" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserColumn, UserRows } from './utils';
import AddUserModal from 'components/user-management/AddUserModal.vue';
import {
  customerGroupOptions,
  roleOptions,
  statusOptions,
} from 'src/constants/utils';
import { useUserManagementStore } from 'src/stores';
import {
  EUserModules,
  IUserData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
const pageTitle = getRoleModuleDisplayName(EUserModules.UserManagment);
const showAddNewAdminRolePopup = ref(false);
const userManagementStore = useUserManagementStore();
const defaultFilterValues = {
  customerGroup: null,
  role: null,
  status: null,
};
const selectedUser = ref<IUserData | undefined>();
let filterSearch = ref(defaultFilterValues);
const onEditButtonClick = (row: IUserData) => {
  selectedUser.value = {
    ...row,
    phone: row.phone?.toString() || '',
  };
  showAddUserModal(true);
};

const showAddUserModal = (action: boolean) => {
  showAddNewAdminRolePopup.value = action;
};

const resetFilter = () => {
  filterSearch.value = {
    customerGroup: null,
    role: null,
    status: null,
  };
};
function handleUserAdd(data: IUserData) {
  userManagementStore.addNewUser(data);
}
</script>
