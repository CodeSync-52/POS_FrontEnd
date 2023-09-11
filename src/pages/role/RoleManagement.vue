<template>
  <div>
    <div class="flex mb-4">
      <span class="text-lg font-medium">{{ pageTitle }}</span>
    </div>
    <div class="">
      <div class="roleManagementTable">
        <q-table
          :rows="rolesManagementTableRows"
          :columns="rolesManagementTableColumns"
          row-key="name"
          :hide-bottom="true"
        >
          <template v-slot:body-cell-action="props">
            <q-td class="!text-right" :props="props">
              <div class="flex justify-end gap-2 md:pr-4">
                <q-btn
                  v-if="
                    authStore.checkUserHasPermission(
                      EUserModules.RolePermission,
                      EActionPermissions.Update
                    ) &&
                    props.row.role !== EUserRoles.SuperAdmin &&
                    props.row.role !== EUserRoles.Customer
                  "
                  icon="edit"
                  size="sm"
                  flat
                  unelevated
                  class="hover:text-btn-primary"
                  dense
                  @click="showEditPopup(true, props.row.role)"
                  ><q-tooltip class="bg-black" :offset="[10, 10]">
                    Edit Permissions
                  </q-tooltip>
                </q-btn>
                <q-btn
                  icon="visibility"
                  size="sm"
                  flat
                  unelevated
                  color="green"
                  dense
                  @click="showEditPopup(false, props.row.role)"
                  ><q-tooltip class="bg-green" :offset="[10, 10]">
                    Preview Permissions
                  </q-tooltip>
                </q-btn>
              </div>
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
    </div>
    <q-dialog
      v-model="isRoleModalVisible"
      @update:model-value="setInitialModuleValue"
    >
      <role-management-modal
        :is-edit="isEdit"
        :is-fetching="isFetchingPermissions"
        :role-data-prop="selectedModulePermissions.permissions"
        @save-data="saveNewUserRoles"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import RoleManagementModal from 'components/role/RoleManagementModal.vue';
import {
  getRoleModuleDisplayName,
  EUserModules,
  IUserRole,
  EUserRoles,
  IUserRolePermissions,
  getRoleDisplayName,
  EActionPermissions,
} from 'src/interfaces';
import { QTableColumn, useQuasar } from 'quasar';
import { fetchUserRoles, updateUserRoles } from 'src/services';
import { isPosError } from 'src/utils';
import { CanceledError } from 'axios';
import { useAuthStore } from 'src/stores';
const $q = useQuasar();
const pageTitle = getRoleModuleDisplayName(EUserModules.RolePermission);
const authStore = useAuthStore();
const rolesManagementTableColumns: QTableColumn<IUserRole>[] = [
  {
    name: 'name',
    required: true,
    label: 'Role Name',
    align: 'left',
    sortable: false,
    field: (row) => row.name,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'right',
    sortable: false,
    field: () => '',
  },
];
const apiController = ref<AbortController | null>(null);

const selectedModulePermissions = ref<{
  role: EUserRoles;
  permissions: IUserRolePermissions[];
}>({
  role: EUserRoles.Admin,
  permissions: [],
});
const rolesManagementTableRows = ref(
  Object.values(EUserRoles).map((role) => {
    return {
      name: getRoleDisplayName(role),
      role,
    };
  })
);
const isRoleModalVisible = ref(false);
const isEdit = ref(false);
const isFetchingPermissions = ref(false);
const showEditPopup = async (shouldEdit: boolean, role: EUserRoles) => {
  selectedModulePermissions.value.role = role;
  if (isFetchingPermissions.value && apiController.value) {
    apiController.value.abort();
    apiController.value = null;
  }
  apiController.value = new AbortController();
  isFetchingPermissions.value = true;
  isRoleModalVisible.value = true;
  isEdit.value = shouldEdit;
  await fetchUserRoles(role, apiController.value)
    .then((res) => {
      selectedModulePermissions.value.permissions.forEach((moduleBase) => {
        const selectedModule = res.data.permissionModuleActions.find(
          (moduleItem) => moduleItem.moduleId === moduleBase.moduleId
        );
        if (selectedModule) {
          moduleBase.actionIds = selectedModule.actionIds;
        } else {
          moduleBase.actionIds = [];
        }
      });
    })
    .catch((e) => {
      if (e instanceof CanceledError) {
        return;
      }
      console.error(e);
      let message = 'There was an error fetching permissions for this role';
      if (isPosError(e)) {
        message = e.message;
      }
      $q.notify({
        type: 'negative',
        message,
      });
    });
  isFetchingPermissions.value = false;
};

function setInitialModuleValue() {
  selectedModulePermissions.value.permissions = Object.values(EUserModules)
    .filter((moduleId) => typeof moduleId === 'number')
    .map((moduleId) => ({
      actionIds: [],
      moduleName: '',
      moduleId: moduleId as EUserModules,
    }));
}
onMounted(() => {
  setInitialModuleValue();
});
onUnmounted(() => {
  if (apiController.value) {
    apiController.value.abort();
  }
});
async function saveNewUserRoles(data: IUserRolePermissions[]) {
  isFetchingPermissions.value = true;
  try {
    await updateUserRoles({
      data,
      roleName: selectedModulePermissions.value.role,
    });
    $q.notify({
      type: 'positive',
      message: 'Role Permissions updated successfully',
    });
  } catch (e) {
    console.error(e);
    let message = 'There was an error updating the records';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
  }
  isFetchingPermissions.value = false;
  isRoleModalVisible.value = false;
  setInitialModuleValue();
}
</script>
