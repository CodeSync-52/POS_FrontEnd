<template>
  <div>
    <div class="flex mb-4">
      <span class="text-lg font-medium">{{ pageTitle }}</span>
    </div>
    <div class="">
      <q-btn
        color="primary"
        class="my-3"
        label="Download Dummy PDF"
        @click="downloadPdfData"
      />
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
                />
                <q-btn
                  icon="visibility"
                  size="sm"
                  flat
                  unelevated
                  color="green"
                  dense
                  @click="showEditPopup(false, props.row.role)"
                />
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
import { downloadPdf, isPosError, ITableHeaders, ITableItems } from 'src/utils';
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
function downloadPdfData() {
  const headers: ITableHeaders[] = [
    {
      content: 'Value 1',
      heading: 'Heading 1',
    },
    {
      content: 'Value 2',
      heading: 'Heading 2',
    },
    {
      content: 'Value 3',
      heading: 'Heading 3',
    },
  ];
  // Each array represents a row inside the main array, number of columns in each row must be consistent
  const tableStuff: ITableItems[][] = [
    [
      'Heading 1',
      'Heading 2',
      'Heading 3',
      // {
      //   image: base64 of image goes here ,
      // },
    ],
    [
      'Row data 1',
      'Row data 2',
      {
        text: 'Row Data 3',
        bold: true,
      },
    ],
    [
      'Row data 4',
      {
        text: 'Row Data 5',
        bold: true,
      },
      'Row data 6',
      // {
      //   image: base64 of image goes here ,
      // },
    ],
  ];
  const fileTitle = 'Title here';
  const myFileName = 'FileNameHere.pdf';
  downloadPdf({
    filename: myFileName,
    tableData: tableStuff,
    tableHeaders: headers,
    title: fileTitle,
  });
}
</script>
