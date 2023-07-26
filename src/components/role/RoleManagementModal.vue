<template>
  <q-card class="!max-w-[650px]">
    <q-card-section class="q-pa-none">
      <div v-close-popup class="row justify-end items-center mb-2">
        <span><q-btn flat unelevated dense size="md" icon="close" /></span>
      </div>
      <div class="row px-2 q-col-gutter-y-md">
        <div class="col-12">
          <div class="row items-center q-gutter-x-md">
            <span>Permissions:</span>
            <span
              >Select all:
              <q-toggle
                @update:model-value="handleSelectAll"
                v-model="groupedPermissions.isAll"
                color="signature"
                :disable="!isEdit"
            /></span>
          </div>
        </div>
        <div class="col-12">
          <div class="row q-col-gutter-x-md">
            <div class="col-3">
              <div>
                <div class="row q-gutter-x-md items-center">
                  <span>View All:</span>
                  <q-toggle
                    v-model="groupedPermissions.isView"
                    @update:model-value="
                      updateGroupedPermissions($event, 'view')
                    "
                    color="signature"
                    :disable="!isEdit"
                  />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div>
                <div class="row q-gutter-x-md items-center">
                  <span>Create All:</span>
                  <q-toggle
                    v-model="groupedPermissions.isCreate"
                    @update:model-value="
                      updateGroupedPermissions($event, 'create')
                    "
                    color="signature"
                    :disable="!isEdit || !groupedPermissions.isView"
                  />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div>
                <div class="row q-gutter-x-md items-center">
                  <span>Edit All:</span>
                  <q-toggle
                    v-model="groupedPermissions.isEdit"
                    @update:model-value="
                      updateGroupedPermissions($event, 'edit')
                    "
                    color="signature"
                    :disable="!isEdit || !groupedPermissions.isView"
                  />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div>
                <div class="row q-gutter-x-md items-center">
                  <span>Delete All:</span>
                  <q-toggle
                    v-model="groupedPermissions.isDelete"
                    @update:model-value="
                      updateGroupedPermissions($event, 'delete')
                    "
                    color="signature"
                    :disable="!isEdit || !groupedPermissions.isView"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-markup-table
          flat
          bordesignature
          class="full-width max-h-[380px] overflow-y-auto adminRoleEditTable"
        >
          <thead>
            <tr>
              <th class="text-left">Module Name</th>
              <th class="text-center">View</th>
              <th class="text-center">Create</th>
              <th class="text-center">Edit</th>
              <th class="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(roles, roleIndex) in roleData" :key="roles.role">
              <td class="text-left">{{ roles.role }}</td>
              <td class="text-left">
                <q-toggle
                  v-model="roles.view"
                  @update:model-value="toggleAllPermission($event, roleIndex)"
                  color="signature"
                  :disable="!isEdit"
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="roles.create"
                  color="signature"
                  :disable="!isEdit ? true : !roles.view"
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="roles.edit"
                  color="signature"
                  :disable="!isEdit ? true : !roles.view"
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="roles.delete"
                  color="signature"
                  :disable="!isEdit ? true : !roles.view"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>
    <q-card-actions v-if="isEdit" class="justify-end">
      <q-btn flat label="Cancel" color="red" v-close-popup />
      <q-btn flat label="Save" color="signature" v-close-popup />
    </q-card-actions>
    <q-card-actions v-else class="justify-end">
      <q-btn label="close" color="signature" flat unelevated v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { IUserRolePermissions } from 'src/interfaces/roles/roles';
import { computed, onMounted, ref } from 'vue';
interface IProps {
  roleDataProp: IUserRolePermissions[];
  isEdit: boolean;
}
const roleData = ref<IUserRolePermissions[]>([]);
onMounted(() => {
  roleData.value = props.roleDataProp;
});
const props = defineProps<IProps>();
const groupedPermissions = computed(() => {
  let permissionData = {
    isView: true,
    isEdit: true,
    isCreate: true,
    isDelete: true,
    isAll: true,
  };
  roleData.value.forEach((item) => {
    if (item.create === false) {
      permissionData.isCreate = false;
    }
    if (item.view === false) {
      permissionData.isView = false;
    }
    if (item.delete === false) {
      permissionData.isDelete = false;
    }
    if (item.edit === false) {
      permissionData.isEdit = false;
    }
  });
  permissionData.isAll = Object.values(permissionData).every(
    (permission) => permission
  );
  return permissionData;
});
const toggleAllPermission = (newVal: boolean, roleIndex: number) => {
  if (!newVal) {
    roleData.value[roleIndex] = {
      ...roleData.value[roleIndex],
      create: false,
      delete: false,
      edit: false,
    };
  }
};
const updateGroupedPermissions = (
  newValue: boolean,
  key: keyof IUserRolePermissions
) => {
  if (key === 'view' && !newValue) {
    roleData.value = roleData.value.map((permission) => ({
      ...permission,
      create: false,
      delete: false,
      edit: false,
      view: false,
    }));
    return;
  }
  roleData.value = roleData.value.map((permission) => ({
    ...permission,
    [key]: newValue,
  }));
};
const handleSelectAll = (newValue: boolean) => {
  roleData.value = roleData.value.map((permission) => ({
    ...permission,
    create: newValue,
    delete: newValue,
    edit: newValue,
    view: newValue,
  }));
};
</script>
