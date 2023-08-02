<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-2xl font-medium">Add new user</span>
        <span
          ><q-btn v-close-popup flat unelevated dense size="md" icon="close"
        /></span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="row px-2 q-col-gutter-sm">
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input outlined v-model="userData.fullName" label="Full Name" />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input outlined v-model="userData.userName" label="User Name" />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <q-input
              outlined
              v-model="userData.phoneNumber"
              type="tel"
              mask="(####) #######"
              label="Phone Number"
            />
          </div>
        </div>
        <div class="row px-2 q-col-gutter-sm">
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-select
                :options="roleOptions"
                outlined
                v-model="userData.userRoleName"
                map-options
                @update:model-value="userData.userRoleName = $event.value"
                label="Role"
              />
            </div>
          </div>
          <div
            v-if="
              userData.userRoleName === EUserRoles.ShopOfficer ||
              userData.userRoleName === EUserRoles.ShopManager
            "
            class="col-md-6 w-full col-sm-12"
          >
            <div>
              <q-select
                :options="roleOptions"
                outlined
                v-model="userData.assignShop"
                label="Assigned Shop"
              />
            </div>
          </div>
        </div>
        <div
          v-if="userData.userRoleName === EUserRoles.Customer"
          class="row px-2 q-col-gutter-sm"
        >
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="roleOptions"
                outlined
                v-model="userData.customerGroupId"
                label="Customer Group"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                outlined
                v-model="userData.flatDiscount"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
                label="Discount"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-checkbox
            v-model="userData.isActive"
            color="secondary"
            label="Active"
            size="30px"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="justify-end">
      <q-btn flat label="Cancel" color="red" v-close-popup />
      <q-btn
        flat
        label="Save"
        color="primary"
        v-close-popup
        @click="handleAddNewUser"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { roleOptions } from 'src/constants';
import { EUserRoles, ICreateUserPayload } from 'src/interfaces';
type PropType = {
  selectedUser?: ICreateUserPayload;
};
const userData = ref<ICreateUserPayload>({
  fullName: '',
  phoneNumber: '',
  userRoleName: EUserRoles.Customer,
  userName: '',
  assignShop: 0,
  isActive: false,
  flatDiscount: 0,
  customerGroupId: 0,
});
const emit = defineEmits<{
  (event: 'user-add', data: ICreateUserPayload): void;
}>();
const props = defineProps<PropType>();

function handleAddNewUser() {
  if (userData.value.userRoleName !== EUserRoles.Customer) {
    delete userData.value.assignShop;
    delete userData.value.customerGroupId;
    delete userData.value.isActive;
  }
  emit('user-add', userData.value);
}
onMounted(() => {
  if (props.selectedUser !== undefined) {
    userData.value = props.selectedUser;
  }
});
</script>
