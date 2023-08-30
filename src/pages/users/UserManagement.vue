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
        @click="handleAddNewUser"
      />
    </div>

    <div
      class="row flex lg:justify-end sm:justify-start items-center w-full min-h-[3.5rem] gap-8"
    >
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroupId"
        :options="customerGroupList"
        map-options
        @update:model-value="
          filterSearch.customerGroupId = $event.customerGroupId
        "
        :loading="isCustomerGroupListLoading"
        label="Customer Group"
        option-label="name"
        option-value="customerGroupId"
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
        style="min-width: 200px"
        outlined
        map-options
        v-model="filterSearch.role"
        :options="roleDropdownOptions"
        @update:model-value="filterSearch.role = $event.value"
        label="Role"
        color="btn-primary"
      />
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.status"
        @update:model-value="filterSearch.status = $event.value"
        :options="statusOptions"
        label="Status"
        color="btn-primary"
      />
      <div class="flex lg:justify-end sm:justify-start items-end h-full gap-4">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="handleUserFilter"
        />
        <q-btn
          unelevated
          color=""
          :loading="isLoading"
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
        :loading="isLoading"
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
            !authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Delete
            )
          "
          v-slot:header-cell-reset
        >
          <q-th></q-th>
        </template>
        <template
          v-if="
            !authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Update
            ) &&
            !authStore.checkUserHasPermission(
              EUserModules.UserManagment,
              EActionPermissions.Delete
            )
          "
          v-slot:header-cell-action
        >
          <q-th></q-th>
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
                class="hover:text-btn-primary"
                @click="onEditButtonClick(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-discount="props">
          <q-td :props="props">
            {{ props.row.discount ?? 0 }}
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
              class="hover:text-btn-primary"
              unelevated
              dense
              no-caps
              :disable="
                !authStore.checkUserHasPermission(
                  EUserModules.UserManagment,
                  EActionPermissions.Update
                ) ||
                !authStore.checkUserHasPermission(
                  EUserModules.UserManagment,
                  EActionPermissions.Delete
                )
              "
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
        @user-edit="editUserInfo"
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
    <q-dialog v-model="isResetPasswordModalVisible">
      <reset-password-modal
        :selected-data="selectedRowData"
        @reset-password="handleResetPassword"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { CanceledError } from 'axios';
import { useAuthStore } from 'src/stores';
import { UserColumn } from './utils';
import AddUserModal from 'components/user-management/AddUserModal.vue';
import ChangeStatusModal from 'src/components/user-management/ChangeStatusModal.vue';
import ResetPasswordModal from 'src/components/user-management/ResetPasswordModal.vue';
import { roleOptions, statusOptions } from 'src/constants/utils';
import {
  EActionPermissions,
  EUserModules,
  IGenericResponse,
  getRoleModuleDisplayName,
  IUserResponse,
  IUserManagementData,
  EUserRoles,
  ICustomerListResponse,
  IUserFilterList,
  IUserPayload,
} from 'src/interfaces';
import { isPosError, makeApiCall } from 'src/utils';
import {
  getUserListApi,
  resetUserPassword,
  changeUserStatus,
  updateUser,
  getCustomerGroupList,
} from 'src/services';
const $q = useQuasar();
const authStore = useAuthStore();
const customerGroupList = ref<ICustomerListResponse[]>([]);
const pageTitle = getRoleModuleDisplayName(EUserModules.UserManagment);
const showAddNewAdminRolePopup = ref(false);
const isChangeStatusModalVisible = ref(false);
const isLoading = ref(false);
const isResetPasswordModalVisible = ref(false);
const selectedRowData = ref<{ customerId: number; status: string }>({
  customerId: -1,
  status: '',
});
const defaultFilterValues = {
  customerGroupId: null,
  role: null,
  status: null,
};
const UserRows = ref<IUserManagementData[]>([]);
const action = ref<string>('');
const apiController = ref<AbortController | null>(null);
const isCustomerGroupListLoading = ref(false);
const selectedUser = ref<IUserManagementData | undefined>();
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
};
const pagination = ref<{
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}>(defaultPagination);
const filterSearch = ref<IUserFilterList>(defaultFilterValues);
const roleDropdownOptions = computed(() =>
  roleOptions.filter(
    (role) =>
      role.value === EUserRoles.Customer ||
      role.value === EUserRoles.Admin ||
      role.value === EUserRoles.SuperAdmin
  )
);

onMounted(() => {
  getUserList();
  getCustomerListOption();
});
const handleChangeStatusPopup = (selectedRow: IUserResponse) => {
  selectedRowData.value.customerId = selectedRow.userId;
  selectedRowData.value.status = selectedRow.status;
  action.value = 'Change Status';
  isChangeStatusModalVisible.value = true;
};
const onEditButtonClick = (row: IUserManagementData) => {
  action.value = 'Edit User';
  selectedUser.value = {
    ...row,
    phoneNumber: row.phoneNumber?.toString() || '',
  };
  showAddUserModal(true);
};
const handleAddNewUser = () => {
  action.value = 'Add New User';
  showAddUserModal(true);
};
const handleChangeStatus = (id: number, updatedStatus: string) => {
  if (selectedRowData.value.status !== updatedStatus) {
    handleChangeStatusApi(id, updatedStatus);
  }
  isChangeStatusModalVisible.value = false;
};
const handleResetPassword = (customerGroupId: number) => {
  handleResetPasswordApi(customerGroupId);
  isResetPasswordModalVisible.value = false;
};
const showAddUserModal = (isVisible: boolean) => {
  showAddNewAdminRolePopup.value = isVisible;
};
const resetFilter = () => {
  filterSearch.value = {
    customerGroupId: null,
    role: null,
    status: null,
  };
  getUserList();
};
const handleResetPasswordPopup = (selectedRow: IUserResponse) => {
  selectedRowData.value.customerId = selectedRow.userId;
  isResetPasswordModalVisible.value = true;
};
const editUserInfo = async (userData: IUserPayload) => {
  const { userId, fullName, phoneNumber } = userData;
  let data: Partial<IUserManagementData> = { userId, fullName, phoneNumber };
  try {
    if (userData.roleName === EUserRoles.Customer) {
      const { customerGroupId, flatDiscount } = userData;
      data.customerGroupId = customerGroupId;
      data.flatDiscount = flatDiscount;
    }
    const res = await updateUser(data);
    if (res.type === 'Success') {
      filterSearch.value = defaultFilterValues;
      pagination.value = defaultPagination;
      getUserList();
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  showAddNewAdminRolePopup.value = false;
};
const getUserList = async (paginationData?: {
  pagination?: Omit<typeof pagination.value, 'rowsNumber'>;
}) => {
  isLoading.value = true;
  if (paginationData) {
    pagination.value = {
      ...pagination.value,
      ...paginationData.pagination,
    };
  }
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await getUserListApi(
      {
        filterSearch: filterSearch.value,
        pageNumber: pagination.value.page,
        pageSize: pagination.value.rowsPerPage,
      },

      apiController.value
    );
    if (res?.data) {
      UserRows.value = res.data.items;
      pagination.value.rowsNumber = res.data.totalItemCount;
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isLoading.value = false;
};
const handleUserFilter = () => {
  getUserList();
};
async function handleChangeStatusApi(id: number, updatedStatus: string) {
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
            (row) => id === row.userId
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
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
}
async function handleUserAdd(userData: IUserPayload) {
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
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  showAddNewAdminRolePopup.value = false;
}
async function handleResetPasswordApi(customerId: number) {
  try {
    const res = await resetUserPassword(customerId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
}
async function getCustomerListOption() {
  if (isCustomerGroupListLoading.value) return;
  isCustomerGroupListLoading.value = true;
  try {
    const res = await getCustomerGroupList({
      pageNumber: 1,
      pageSize: 200,
    });
    if (res?.data) {
      customerGroupList.value = res?.data.items;
    }
    isCustomerGroupListLoading.value = false;
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
    isCustomerGroupListLoading.value = false;
  }
}

onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
</script>
