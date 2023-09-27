<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-6"
    >
      <h1 class="text-lg font-medium">{{ pageTitle }}</h1>

      <q-btn
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        color=""
        @click="handleAddNewUser"
      />
    </div>
    <div
      class="row flex lg:justify-end sm:justify-center items-center w-full min-h-[3.5rem] gap-4"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroupId"
        :options="shopNmaeOptions"
        label="Shop Name"
        color="btn-primary"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        dense
        outlined
        style="min-width: 200px; max-width: 200px"
        use-input
        v-model="filterSearch.userId"
        :options="shopNumberOptions"
        option-label="fullName"
        option-value="userId"
        label="Shop Number"
        color="btn-primary"
      />
      <q-select
        dense
        outlined
        style="min-width: 200px"
        v-model="filterSearch.purchaseStatus"
        :options="shopMangerOptions"
        label="Shop Manager"
        color="btn-primary"
      />

      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-2">
        <q-btn
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          :disable="filterSearch.userId !== null && filterSearch.userId < 0"
        />

        <q-btn
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table :rows="shopRows" :columns="shopColumn" row-key="name" />
    </div>
  </div>
  <q-dialog
    v-model="showAddNewAdminRolePopup"
    @update:model-value="selectedUser = null"
  >
    <add-user-modal :action="action" :selected-user="selectedUser" />
  </q-dialog>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { ref } from 'vue';
import {
  EUserModules,
  IUserResponse,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import AddUserModal from 'components/user-management/AddUserModal.vue';
import {
  shopMangerOptions,
  shopNmaeOptions,
  shopNumberOptions,
  shopColumn,
  shopRows,
} from 'src/utils';
const pageTitle = getRoleModuleDisplayName(EUserModules.ShopManagement);
const isLoading = ref(false);

const timeStamp = Date.now();
const formattedToDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
const past5Date = date.subtractFromDate(timeStamp, { date: 5 });
const formattedFromDate = date.formatDate(past5Date, 'YYYY-MM-DD');
const filterSearch = ref<{
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  purchaseStatus: null | string;
  customerGroupId: null | number;
}>({
  userId: null,
  userName: null,
  startDate: formattedFromDate,
  endDate: formattedToDate,
  purchaseStatus: null,
  customerGroupId: null,
});
const action = ref<string>('');
const selectedUser = ref<IUserResponse | null>(null);
const showAddNewAdminRolePopup = ref(false);

const handleAddNewUser = () => {
  action.value = 'Add New User';
  selectedUser.value = null;
  showAddUserModal(true);
};
const showAddUserModal = (isVisible: boolean) => {
  showAddNewAdminRolePopup.value = isVisible;
};
</script>
