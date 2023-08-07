<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-start mb-4"
    >
      <span class="text-xl font-medium">{{ pageTitle }}</span>

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
                color="bg-btn-secondary"
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
                color="red"
                icon="delete"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-discount="props">
          <q-td :props="props">
            {{ props.row.discount ?? 'Null' }}
          </q-td>
        </template>
        <template v-slot:body-cell-customerGroup="props">
          <q-td :props="props">
            {{ props.row.customerGroup ?? 'Null' }}
          </q-td>
        </template>
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
          v-slot:body-cell-reset="props"
        >
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              color="red"
              no-caps
              label="Reset"
              @click="handleResetPasswordPopup(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              flat
              unelevated
              dense
              no-caps
              :label="props.row.status"
              @click="handleChangeStatusPopup(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog
      v-model="showAddNewAdminRolePopup"
      @update:model-value="selectedUser = undefined"
    >
      <add-user-modal
        :action="action"
        :selected-user="selectedUser"
        @user-add="handleUserAdd"
      />
    </q-dialog>
    <q-dialog v-model="isChangeStatusModalVisible">
      <change-status-modal
        :action="action"
        :selected-data="selectedRowData"
        @reset-password="handleResetPassword"
        @change-status="handleChangeStatus"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores';
import { UserColumn } from './utils';
import AddUserModal from 'components/user-management/AddUserModal.vue';
import ChangeStatusModal from 'src/components/user-management/ChangeStatusModal.vue';
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
  IUserResponse,
} from 'src/interfaces';
import { isPosError, makeApiCall } from 'src/utils';
import {
  getUserListApi,
  resetUserPassword,
  changeUserStatus,
} from 'src/services';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const authStore = useAuthStore();
const pageTitle = getRoleModuleDisplayName(EUserModules.UserManagment);
const showAddNewAdminRolePopup = ref(false);
const isChangeStatusModalVisible = ref(false);
const selectedRowData = ref<{ customerId: number; status: string }>({
  customerId: -1,
  status: '',
});
const defaultFilterValues = {
  customerGroup: null,
  role: null,
  status: null,
};
const UserRows = ref<IUserData[]>([]);
const action = ref('');
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
const handleChangeStatusPopup = (selectedRow: IUserResponse) => {
  selectedRowData.value.customerId = selectedRow.userId;
  selectedRowData.value.status = selectedRow.status;
  action.value = 'Change Status';
  isChangeStatusModalVisible.value = true;
};
const onEditButtonClick = (row: IUserData) => {
  selectedUser.value = {
    ...row,
    phoneNumber: row.phoneNumber?.toString() || '',
  };
  action.value = 'Edit User';
  showAddUserModal(true);
};
const handleChangeStatus = (id: number, updatedStatus: string) => {
  callingChangeStatusApi(id, updatedStatus);
  isChangeStatusModalVisible.value = false;
};
const handleResetPassword = (customerGroupId: number) => {
  callingResetPasswordApi(customerGroupId);
};
const showAddUserModal = (isVisible: boolean) => {
  action.value = 'Add New User';
  showAddNewAdminRolePopup.value = isVisible;
};
const resetFilter = () => {
  filterSearch.value = {
    customerGroup: null,
    role: null,
    status: null,
  };
};
const handleResetPasswordPopup = (selectedRow: IUserResponse) => {
  action.value = 'Reset Password';
  selectedRowData.value.customerId = selectedRow.userId;
  isChangeStatusModalVisible.value = true;
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
async function callingChangeStatusApi(id: number, updatedStatus: string) {
  try {
    const res = await changeUserStatus(id);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      if (selectedRowData.value) {
        selectedRowData.value.status = updatedStatus;
        if (UserRows.value) {
          const matchingRow = UserRows.value.findIndex(
            (row) => id === row.customerGroupId
          );
          if (matchingRow !== -1) {
            const newList = [...UserRows.value];
            newList[matchingRow].status = updatedStatus;
            UserRows.value = newList;
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
}
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
async function callingResetPasswordApi(customerId: number) {
  try {
    const res = await resetUserPassword(customerId);
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
}
</script>
