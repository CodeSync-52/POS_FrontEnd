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
                :disable="isFetching || !isEdit"
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
                      updateGroupedPermissions($event, EActionPermissions.View)
                    "
                    color="btn-primary"
                    :disable="isFetching || !isEdit"
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
                      updateGroupedPermissions(
                        $event,
                        EActionPermissions.Create
                      )
                    "
                    color="btn-primary"
                    :disable="
                      isFetching || !isEdit || !groupedPermissions.isView
                    "
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
                      updateGroupedPermissions(
                        $event,
                        EActionPermissions.Update
                      )
                    "
                    color="btn-primary"
                    :disable="
                      isFetching || !isEdit || !groupedPermissions.isView
                    "
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
                      updateGroupedPermissions(
                        $event,
                        EActionPermissions.Delete
                      )
                    "
                    color="btn-primary"
                    :disable="
                      isFetching || !isEdit || !groupedPermissions.isView
                    "
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
            <tr v-for="(roles, roleIndex) in roleData" :key="roles.moduleId">
              <td class="text-left">
                {{ getRoleModuleDisplayName(roles.moduleId) }}
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].view"
                  @update:model-value="
                    (e) =>
                      handleUpdateToggle(e, EActionPermissions.View, roleIndex)
                  "
                  color="btn-primary"
                  :disable="isFetching || !isEdit"
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
                    isFetching || !isEdit
                      ? true
                      : !roles.actionIds.includes(EActionPermissions.View)
                  "
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].update"
                  @update:model-value="
                    (e) =>
                      handleUpdateToggle(
                        e,
                        EActionPermissions.Update,
                        roleIndex
                      )
                  "
                  color="btn-primary"
                  :disable="
                    isFetching || !isEdit
                      ? true
                      : !roles.actionIds.includes(EActionPermissions.View)
                  "
                />
              </td>
              <td class="text-left">
                <q-toggle
                  v-model="permissions[roleIndex].delete"
                  @update:model-value="
                    (e) =>
                      handleUpdateToggle(
                        e,
                        EActionPermissions.Delete,
                        roleIndex
                      )
                  "
                  color="btn-primary"
                  :disable="
                    isFetching || !isEdit
                      ? true
                      : !roles.actionIds.includes(EActionPermissions.View)
                  "
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>
    <q-card-actions class="justify-end">
      <div v-if="isFetching">
        <q-spinner size="sm" class="text-btn-primary mr-2" />
      </div>
      <q-btn
        flat
        :label="isEdit ? 'Cancel' : 'Close'"
        color="signature"
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        v-if="isEdit"
        @click="savePermissions"
        flat
        label="Save"
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        :disable="isFetching"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import {
  EActionPermissions,
  IUserRolePermissions,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { computed, onMounted, ref, watch } from 'vue';
interface IProps {
  roleDataProp: IUserRolePermissions[];
  isEdit: boolean;
  isFetching: boolean;
}

const emits = defineEmits<{
  (e: 'save-data', data: IUserRolePermissions[]): void;
}>();
const roleData = ref<IUserRolePermissions[]>([]);
const isLoading = ref(false);

const props = withDefaults(defineProps<IProps>(), {
  isEdit: false,
  isFetching: false,
  roleDataProp: () => [],
});
onMounted(() => {
  roleData.value = props.roleDataProp;
});

watch(
  props.roleDataProp,
  (newVal) => {
    roleData.value = [...newVal];
  },
  {
    deep: true,
  }
);

const permissions = computed(() =>
  roleData.value.map((roles) => ({
    view: roles.actionIds.includes(EActionPermissions.View),
    create: roles.actionIds.includes(EActionPermissions.Create),
    update: roles.actionIds.includes(EActionPermissions.Update),
    delete: roles.actionIds.includes(EActionPermissions.Delete),
  }))
);
const groupedPermissions = computed(() => {
  const permissions = {
    isView: true,
    isCreate: true,
    isUpdate: true,
    isDelete: true,
    isAll: true,
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
  permissions.isAll = Object.values(permissions).every((item) => item);

  return permissions;
});
const updateGroupedPermissions = (
  newVal: boolean,
  permissionType: EActionPermissions
) => {
  roleData.value.forEach((module) => {
    if (permissionType === EActionPermissions.View && !newVal) {
      module.actionIds = [];
      return;
    }
    if (newVal && !module.actionIds.includes(permissionType)) {
      module.actionIds.push(permissionType);
    } else if (!newVal) {
      const index = module.actionIds.indexOf(permissionType);
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
  const viewIndex = tempArr.indexOf(EActionPermissions.View); // Index of View permission

  if (type === EActionPermissions.View) {
    // Toggling View permission
    if (!newVal) {
      // Turning off View permission, turn off other permissions
      tempArr = []; // Remove all permissions except View
    } else {
      // Turning on View permission, ensure it's the only permission
      if (viewIndex === -1) {
        tempArr = [EActionPermissions.View]; // Add View permission if not already present
      }
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
  if (!newValue) {
    roleData.value = roleData.value.map((module) => ({
      ...module,
      actionIds: [],
    }));
  } else {
    roleData.value = roleData.value.map((module) => ({
      ...module,
      actionIds: [
        EActionPermissions.View,
        EActionPermissions.Create,
        EActionPermissions.Delete,
        EActionPermissions.Update,
      ],
    }));
  }
};
function savePermissions() {
  isLoading.value = true;
  emits(
    'save-data',
    roleData.value.filter((item) => item.actionIds.length > 0)
  );
}
</script>
