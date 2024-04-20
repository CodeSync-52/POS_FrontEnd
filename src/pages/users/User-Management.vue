<template>
  <div>
    <div
      class="flex md:flex-row md:gap-0 md:justify-between sm:justify-center sm:flex-col sm:gap-2 md:items-center sm:items-center mb-4"
    >
      <span class="text-lg font-medium">{{ pageTitle }}</span>

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
      class="row flex lg:justify-end sm:justify-center items-center min-h-[3.5rem] gap-4"
    >
      <q-input
        outlined
        dense
        debounce="300"
        color="btn-primary"
        maxlength="250"
        label="Name"
        autofocus
        v-model="filterSearch.name"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        dense
        style="min-width: 200px"
        outlined
        v-model="filterSearch.customerGroupId"
        :options="customerGroupList"
        map-options
        popup-content-class="!max-h-[200px]"
        @update:model-value="
          filterSearch.customerGroupId = $event.customerGroupId
        "
        :loading="isCustomerGroupListLoading"
        label="User Category"
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
        popup-content-class="!max-h-[200px]"
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
      <div class="flex lg:justify-end sm:justify-center items-end gap-2">
        <q-btn
          unelevated
          :loading="isLoading"
          color=""
          class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
          icon="search"
          label="Search"
          @click="getUserList()"
        />
        <q-btn
          unelevated
          color=""
          class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
          label="Clear"
          @click="resetFilter"
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
        <template v-slot:body-cell-shopName="props">
          <q-td :props="props">
            {{ props.row.shopName || '-' }}
          </q-td>
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
          v-slot:header-cell-reset
        >
          <q-th></q-th>
        </template>
        <template v-slot:body-cell-address="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.address || '-' }}
          </q-td>
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
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Edit User
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  authStore.loggedInUser?.rolePermissions.roleName ===
                  EUserRoles.SuperAdmin.toLowerCase()
                "
                size="sm"
                flat
                dense
                unelevated
                icon="vpn_key"
                class="hover:text-btn-primary"
                @click="handleResetPasswordPopup(props.row)"
                ><q-tooltip class="bg-black" :offset="[10, 10]">
                  Reset Password
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-discount="props">
          <q-td :props="props">
            {{ props.row.discount ?? 0 }}
          </q-td>
        </template>
        <template v-slot:body-cell-userName="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.userName }}
          </q-td>
        </template>
        <template v-slot:body-cell-fullname="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.fullName }}
          </q-td>
        </template>
        <template v-slot:body-cell-customerGroup="props">
          <q-td
            :props="props"
            class="whitespace-nowrap max-w-[60px] text-ellipsis overflow-hidden"
          >
            {{ props.row.customerGroup ?? '-' }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              class="hover:text-btn-primary"
              flat
              size="sm"
              unelevated
              dense
              style="text-decoration: underline"
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
              ><q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                Change Status
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-isRetailDiscountAllowed="props">
          <q-td :props="props">
            <template
              v-if="
                props.row.roleName === 'ShopManager' ||
                props.row.roleName === 'SuperAdmin'
              "
            >
              <q-btn
                class="hover:text-btn-primary"
                flat
                size="sm"
                style="text-decoration: underline"
                unelevated
                dense
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
                :label="props.row.isRetailDiscountAllowed ? 'Yes' : 'No'"
                @click="handleRetailDiscountPopup(props.row)"
              >
                <q-tooltip class="bg-btn-primary" :offset="[10, 10]">
                  Edit Discount Permission
                </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="mx-auto q-pa-sm text-center row q-gutter-x-sm">
            <q-icon name="warning" size="xs" />
            <span class="text-md font-medium"> No data available. </span>
          </div>
        </template>
      </q-table>
    </div>
    <q-dialog
      v-model="showAddNewAdminRolePopup"
      @update:model-value="selectedUser = null"
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
    <q-dialog v-model="isRetailDiscModalVisible">
      <change-retail-disc-modal
        :selected-data="selectedRowData"
        @retail-disc="handleChangeRetailDisc"
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
import AddUserModal from 'src/components/user-management/Add-User-Modal.vue';
import ChangeStatusModal from 'src/components/user-management/Change-Status-Modal.vue';
import ResetPasswordModal from 'src/components/user-management/Reset-Password-Modal.vue';
import ChangeRetailDiscModal from 'src/components/user-management/Change-Retail-Disc-Modal.vue';
import { roleOptions, statusOptions } from 'src/constants/utils';
import {
  EActionPermissions,
  EUserModules,
  IGenericResponse,
  getRoleModuleDisplayName,
  IUserResponse,
  EUserRoles,
  ICustomerListResponse,
  IUserFilterList,
  IUserPayload,
} from 'src/interfaces';
import { isPosError, makeApiCall } from 'src/utils';
import {
  GetUsers,
  ResetUserPassword,
  ChangeUserStatus,
  UpdateUser,
  GetCustomerGroupList,
  ChangeUserRetailDisc,
} from 'src/services';
const $q = useQuasar();
const authStore = useAuthStore();
const customerGroupList = ref<ICustomerListResponse[]>([]);
const pageTitle = getRoleModuleDisplayName(EUserModules.UserManagment);
const showAddNewAdminRolePopup = ref(false);
const isChangeStatusModalVisible = ref(false);
const isLoading = ref(false);
const isResetPasswordModalVisible = ref(false);
const isRetailDiscModalVisible = ref(false);
const selectedRowData = ref<{
  customerId: number;
  status: string;
  isRetailDiscountAllowed?: boolean;
}>({
  customerId: -1,
  status: '',
});
const defaultFilterValues = {
  customerGroupId: null,
  role: null,
  status: null,
  name: null,
};
const UserRows = ref<IUserResponse[]>([]);
const action = ref<string>('');
const apiController = ref<AbortController | null>(null);
const isCustomerGroupListLoading = ref(false);
const selectedUser = ref<IUserResponse | null>(null);
const defaultPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 200,
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
      role.value === EUserRoles.SuperAdmin ||
      role.value === EUserRoles.ShopManager ||
      role.value === EUserRoles.ShopOfficer
  )
);
onMounted(() => {
  getUserList();
  getCustomerListOption();
});
const handleChangeStatusPopup = (selectedRow: IUserResponse) => {
  if (selectedRow.userId && selectedRow.status) {
    selectedRowData.value.customerId = selectedRow.userId;
    selectedRowData.value.status = selectedRow.status;
  }
  action.value = 'Change Status';
  isChangeStatusModalVisible.value = true;
};

const onEditButtonClick = (row: IUserResponse) => {
  action.value = 'Edit User';
  selectedUser.value = {
    ...row,
    phoneNumber: row.phoneNumber?.toString() || '',
  };
  showAddUserModal(true);
};
const handleAddNewUser = () => {
  action.value = 'Add New User';
  selectedUser.value = null;
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
const handleChangeRetailDisc = (customerGroupId: number) => {
  handleChangeRetailDiscApi(customerGroupId);
  isRetailDiscModalVisible.value = false;
};

const resetFilter = () => {
  if (Object.values(filterSearch.value).every((item) => item === null)) {
    return;
  }
  filterSearch.value = {
    customerGroupId: null,
    role: null,
    status: null,
    name: null,
  };
  getUserList();
};
const handleResetPasswordPopup = (selectedRow: IUserResponse) => {
  if (selectedRow.userId) {
    selectedRowData.value.customerId = selectedRow.userId;
  }
  isResetPasswordModalVisible.value = true;
};

const handleRetailDiscountPopup = (selectedRow: IUserResponse) => {
  if (selectedRow.userId) {
    selectedRowData.value.customerId = selectedRow.userId;
  }
  isRetailDiscModalVisible.value = true;
};
const editUserInfo = async (userData: IUserPayload) => {
  const { userId, fullName, phoneNumber, address } = userData;
  let data: Partial<IUserResponse> = { userId, fullName, phoneNumber, address };
  try {
    if (userData.roleName === EUserRoles.Customer) {
      const { customerGroupId, discount } = userData;
      data.customerGroupId = customerGroupId;
      data.discount = Number(discount);
    }
    const res = await UpdateUser({
      ...data,
      flatDiscount: data.discount,
    });
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
  const rowsPerPage =
    pagination.value.rowsPerPage === 0 ? 10000 : pagination.value.rowsPerPage;
  try {
    if (isLoading.value && apiController.value) {
      apiController.value.abort();
      apiController.value = null;
    }
    apiController.value = new AbortController();
    const res = await GetUsers(
      {
        filterSearch: filterSearch.value,
        pageNumber: pagination.value.page,
        pageSize: rowsPerPage,
      },
      apiController.value
    );
    if (res?.data) {
      if (Object.values(filterSearch.value).some((item) => item !== null)) {
        UserRows.value = res.data.items;
      } else {
        UserRows.value = [];
      }
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
async function handleChangeStatusApi(id: number, updatedStatus: string) {
  try {
    const res = await ChangeUserStatus(id);
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
      data: {
        ...userData,
        flatDiscount: userData.discount,
      },
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
    const res = await ResetUserPassword(customerId);
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

async function handleChangeRetailDiscApi(customerId: number) {
  try {
    const res = await ChangeUserRetailDisc(customerId);
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      const selectedUserIndex = UserRows.value.findIndex(
        (x) => x.userId === selectedRowData.value.customerId
      );

      if (selectedUserIndex !== -1) {
        const selectedUser = UserRows.value[selectedUserIndex];

        if (selectedUser.isRetailDiscountAllowed !== undefined) {
          selectedUser.isRetailDiscountAllowed =
            !selectedUser.isRetailDiscountAllowed;
          UserRows.value[selectedUserIndex] = { ...selectedUser };
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
async function getCustomerListOption() {
  if (isCustomerGroupListLoading.value) return;
  isCustomerGroupListLoading.value = true;
  try {
    const res = await GetCustomerGroupList({ status: 'Active' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupList.value = res?.data;
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
