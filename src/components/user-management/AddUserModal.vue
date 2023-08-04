<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-2xl font-medium">Add new user</span>
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="row px-2 q-col-gutter-sm">
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                dense
                outlined
                v-model="userData.fullName"
                label="Full Name"
                color="btn-primary"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                dense
                outlined
                v-model="userData.userName"
                label="User Name"
                color="btn-primary"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <q-input
              dense
              outlined
              v-model="userData.phoneNumber"
              type="tel"
              color="btn-primary"
              mask="(####) #######"
              label="Phone Number"
            />
          </div>
        </div>
        <div class="row px-2 q-col-gutter-sm">
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-select
                dense
                :options="roleOptions"
                outlined
                v-model="userData.userRoleName"
                map-options
                @update:model-value="userData.userRoleName = $event.value"
                label="Role"
                color="btn-primary"
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
                dense
                outlined
                v-model="userData.customerGroupId"
                label="Customer Group"
                color="btn-primary"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                dense
                outlined
                v-model="userData.flatDiscount"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
                label="Discount"
                color="btn-primary"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-checkbox
            v-model="userData.isActive"
            color="btn-primary"
            label="Active"
            size="30px"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="justify-end">
      <q-btn
        flat
        label="Cancel"
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        label="Save"
        color="signature"
        v-close-popup
        @click="handleAddNewUser"
        class="bg-btn-primary hover:bg-btn-primary-hover"
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
<style>
.close-modal {
  color: white;
  background-color: rgba(255, 0, 0, 0.706);
  border: 2px solid !important;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
}
</style>
