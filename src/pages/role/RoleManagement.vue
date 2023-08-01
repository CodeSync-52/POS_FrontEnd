<template>
  <div>
    <div class="flex mb-4">
      <span class="text-3xl font-semibold">{{ pageTitle }}</span>
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
                <q-btn-dropdown color="signature" flat unelevated size="md">
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showEditPopup(false, props.rowIndex)"
                    >
                      <q-item-section>
                        <q-item-label>Preview</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showEditPopup(true, props.rowIndex)"
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
    </div>
    <q-dialog v-model="isRoleModalVisible">
      <role-management-modal
        :is-edit="isEdit"
        :role-data-prop="rolesManagementTableRows[selectedRow].roles"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { rolesMock } from './roleMock';
import RoleManagementModal from 'components/role/RoleManagementModal.vue';
import {
  getRoleModuleDisplayName,
  EUserModules,
  IUserRole,
} from 'src/interfaces';
import { QTableColumn } from 'quasar';
const pageTitle = getRoleModuleDisplayName(EUserModules.RolePermission);
const selectedRow = ref(0);
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
    field: (row) => row.action,
  },
];
const rolesManagementTableRows = ref(rolesMock);
const isRoleModalVisible = ref(false);
const isEdit = ref(false);
const showEditPopup = (shouldEdit: boolean, rowIndex: number) => {
  selectedRow.value = rowIndex;
  isRoleModalVisible.value = true;
  isEdit.value = shouldEdit;
};
</script>
