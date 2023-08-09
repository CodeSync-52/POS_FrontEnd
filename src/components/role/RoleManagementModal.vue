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
                color="btn-primary"
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
                      updateGroupedPermissions($event, 'isView')
                    "
                    color="btn-primary"
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
                      updateGroupedPermissions($event, 'isCreate')
                    "
                    color="btn-primary"
                    :disable="!isEdit"
                  />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div>
                <div class="row q-gutter-x-md items-center">
                  <span>Edit All:</span>
                  <q-toggle
                    v-model="groupedPermissions.isUpdate"
                    @update:model-value="
                      updateGroupedPermissions($event, 'isUpdate')
                    "
                    color="btn-primary"
                    :disable="!isEdit"
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
                      updateGroupedPermissions($event, 'isDelete')
                    "
                    color="btn-primary"
                    :disable="!isEdit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-markup-table
          flat
          bordebtn-primary
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
            <tr v-for="(roles, roleIndex) in roleData" :key="roles.moduleName">
              <td class="text-left">{{ roles.moduleName }}</td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].view"
                  @update:model-value="
                    (e) =>
                      handleUpdateToggle(e, EActionPermissions.View, roleIndex)
                  "
                  color="btn-primary"
                  :disable="!isEdit"
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].create"
                  @update:model-value="
                    (e) =>
                      handleUpdateToggle(
                        e,
                        EActionPermissions.Create,
                        roleIndex
                      )
                  "
                  color="btn-primary"
                  :disable="
                    !isEdit
                      ? true
                      : !roles.actionIds.includes(EActionPermissions.View)
                  "
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].update"
                  @update:model-value="
                    (e) => handleUpdateToggle(e, 3, roleIndex)
                  "
                  color="btn-primary"
                  :disable="!isEdit ? true : !roles.actionIds.includes(1)"
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].delete"
                  @update:model-value="
                    (e) => handleUpdateToggle(e, 4, roleIndex)
                  "
                  color="btn-primary"
                  :disable="!isEdit ? true : !roles.actionIds.includes(1)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>
    <q-card-actions v-if="isEdit" class="justify-end">
      <q-btn
        flat
        label="Cancel"
        color="signature"
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        flat
        label="Save"
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        v-close-popup
      />
    </q-card-actions>
    <q-card-actions v-else class="justify-end">
      <q-btn
        label="close"
        color="signature"
        flat
        unelevated
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { EActionPermissions, IUserRolePermissions } from 'src/interfaces';
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
const permissions = computed(() => {
  return roleData.value.map((roles) => ({
    view: roles.actionIds.includes(1),
    create: roles.actionIds.includes(2),
    update: roles.actionIds.includes(3),
    delete: roles.actionIds.includes(4),
  }));
});
const groupedPermissions = computed(() => {
  const permissions = {
    isView: true,
    isCreate: true,
    isUpdate: true,
    isDelete: true,
  };

  roleData.value.forEach((module) => {
    if (!module.actionIds.includes(1)) {
      permissions.isView = false;
      permissions.isCreate = false;
      permissions.isUpdate = false;
      permissions.isDelete = false;
    } else {
      permissions.isCreate =
        permissions.isCreate && module.actionIds.includes(2);
      permissions.isUpdate =
        permissions.isUpdate && module.actionIds.includes(3);
      permissions.isDelete =
        permissions.isDelete && module.actionIds.includes(4);
    }
  });

  return permissions;
});
const updateGroupedPermissions = (newVal: boolean, permissionType: string) => {
  const permissionMap: { [key: string]: number } = {
    isView: 1,
    isCreate: 2,
    isUpdate: 3,
    isDelete: 4,
  };

  roleData.value.forEach((module) => {
    if (newVal) {
      module.actionIds.push(permissionMap[permissionType]);
    } else {
      const index = module.actionIds.indexOf(permissionMap[permissionType]);
      if (index !== -1) {
        module.actionIds.splice(index, 1);
      }
    }
  });
};

const handleUpdateToggle = (
  newVal: boolean,
  type: EActionPermissions,
  roleIndex: number
) => {
  let tempArr = [...roleData.value[roleIndex].actionIds];
  const typeIndex = tempArr.indexOf(type);
  const viewIndex = tempArr.indexOf(1); // Index of View permission

  if (type === EActionPermissions.View) {
    // Toggling View permission
    if (!newVal) {
      // Turning off View permission, turn off other permissions
      tempArr = []; // Remove all permissions except View
    } else {
      // Turning on View permission, ensure it's the only permission
      if (viewIndex === -1) {
        tempArr.push(1); // Add View permission if not already present
      }
      tempArr.splice(2); // Remove other permissions if present
    }
  } else if (newVal && typeIndex === -1 && viewIndex !== -1) {
    // Enabling other permissions and View is on
    tempArr.push(type);
  } else if (!newVal && typeIndex !== -1 && viewIndex !== -1) {
    // Disabling other permissions and View is on
    tempArr.splice(typeIndex, 1);
  }

  roleData.value[roleIndex] = {
    ...roleData.value[roleIndex],
    actionIds: tempArr,
  };
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
console.log(roleData);
</script>
