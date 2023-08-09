<template>
  <div>
    <div class="flex mb-4">
      <span class="text-xl font-medium">{{ pageTitle }}</span>
    </div>
    <div class="q-pa-md">
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
                  icon="visibility"
                  size="sm"
                  flat
                  unelevated
                  dense
                  @click="showEditPopup(false, props.row.role)"
                  color="bg-btn-secondary"
                />

                <!-- v-if="props.row.role !== EUserRoles.SuperAdmin" -->
                <q-btn
                  icon="edit"
                  size="sm"
                  flat
                  unelevated
                  dense
                  @click="showEditPopup(true, props.row.role)"
                  color="bg-btn-secondary"
                />
              </div>
            </q-td>
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
        :role-data-prop="selectedModulePermissions"
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
} from 'src/interfaces';
import { QTableColumn, useQuasar } from 'quasar';
import { fetchUserRoles } from 'src/services';
import { isPosError } from 'src/utils';
import { CanceledError } from 'axios';
const $q = useQuasar();
const pageTitle = getRoleModuleDisplayName(EUserModules.RolePermission);

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

const selectedModulePermissions = ref<IUserRolePermissions[]>([]);
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
      selectedModulePermissions.value.forEach((moduleBase) => {
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
  selectedModulePermissions.value = Object.values(EUserModules)
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
</script>
