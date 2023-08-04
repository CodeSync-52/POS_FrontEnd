<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>

      <q-btn
        v-if="
          authStore.checkUserHasPermission(
            EUserModules.UserManagment,
            EActionPermissions.Create
          )
        "
        label="Add New"
        icon="add"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-secondary"
        unelevated
        color=" "
        @click="showAddUserModal(true)"
      />
    </div>

    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroup"
        :options="customerGroupOptions"
        label="Customer Group"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.role"
        :options="roleOptions"
        label="Role"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.status"
        :options="statusOptions"
        label="Status"
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="() => {}"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Export as CSV"
        />
      </div>
    </div>
    <div class="py-4">
      <q-table
        :loading="false"
        tabindex="0"
        v-model:pagination="pagination"
        :rows="UserRows"
        align="left"
        :columns="UserColumn"
        row-key="name"
        @request="getUserList"
      >
        <template
          v-if="
            authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Update
            ) ||
            authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Delete
            )
          "
          v-slot:body-cell-action="props"
        >
          <q-td :props="props">
            <div class="flex gap-2 flex-nowrap">
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.UserManagment,
                    EActionPermissions.Update
                  )
                "
                size="sm"
                flat
                dense
                unelevated
                icon="edit"
                @click="onEditButtonClick(props.row)"
              />
              <q-btn
                v-if="
                  authStore.checkUserHasPermission(
                    EUserModules.UserManagment,
                    EActionPermissions.Delete
                  )
                "
                size="sm"
                dense
                flat
                unelevated
                icon="delete"
              />
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
import { onMounted, ref } from 'vue';

import { useAuthStore } from 'src/stores';
import { UserColumn } from './utils';
import AddUserModal from 'components/user-management/AddUserModal.vue';
import {
  customerGroupOptions,
  roleOptions,
  statusOptions,
} from 'src/constants/utils';
import {
  EActionPermissions,
  EUserModules,
  ICreateUserPayload,
  IGenericResponse,
  IUserData,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { isPosError, makeApiCall } from 'src/utils';
import { getUserListApi } from 'src/services';
import { useQuasar } from 'quasar';
const $q = useQuasar();

const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.UserManagment);
const showAddNewAdminRolePopup = ref(false);
const defaultFilterValues = {
  customerGroup: null,
  role: null,
  status: null,
};
const UserRows = ref<IUserData[]>([]);
const isFetching = ref(false);
const selectedUser = ref<IUserData | undefined>();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});

let filterSearch = ref(defaultFilterValues);
const onEditButtonClick = (row: IUserData) => {
  selectedUser.value = {
    ...row,
    phoneNumber: row.phoneNumber?.toString() || '',
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

const getUserList = async (data?: {
  pagination: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  if (isFetching.value) return;
  isFetching.value = true;

  if (data) {
    pagination.value = { ...pagination.value, ...data.pagination };
  }
  try {
    const res = await getUserListApi({
      pageNumber: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    });
    if (res?.data) {
      UserRows.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    let message = 'There was an error fetching the user list';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isFetching.value = false;
};
onMounted(() => {
  getUserList();
});
async function handleUserAdd(userData: ICreateUserPayload) {
  try {
    const res: IGenericResponse = await makeApiCall({
      url: 'api/User/create',
      method: 'POST',
      data: userData,
    });

    if (res.type === 'Success') {
      getUserList();
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
  } catch (e) {}
}
</script>
