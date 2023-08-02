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
              <q-input
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
                outlined
                v-model="userData.userName"
                label="User Name"
                color="btn-primary"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <q-input
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
                :options="roleOptions"
                outlined
                v-model="userData.role"
                label="Role"
                color="btn-primary"
              />
            </div>
          </div>
          <div
            v-if="
              userData.role?.value === 'shop_sale_officer' ||
              userData.role?.value === 'shop_manager'
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
          v-if="userData.role?.value === 'customer_vendor'"
          class="row px-2 q-col-gutter-sm"
        >
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="roleOptions"
                outlined
                v-model="userData.customerGroup"
                label="Customer Group"
              />
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                outlined
                v-model="userData.wholeSaleDiscount"
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
        color="white"
        v-close-popup
        class="bg-btn-primary hover:bg-btn-secondary"
      />
      <q-btn
        flat
        label="Save"
        color="white"
        v-close-popup
        @click="handleAddNewUser"
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { addUserDefaultState, roleOptions } from 'src/constants';
import { IUserData } from 'src/interfaces';
import { createUserApi } from 'src/services/userManagement';
interface IProps {
  selectedUser?: IUserData;
}
const userData = ref<IUserData>(addUserDefaultState);
const emit = defineEmits<{
  (event: 'user-add', data: IUserData): void;
}>();
const props = withDefaults(defineProps<IProps>(), {
  selectedUser: () => addUserDefaultState,
});

async function handleAddNewUser() {
  const payload = {
    fullName: userData.value.fullName,
    phoneNumber: userData.value.phoneNumber,
    flatDiscount: 0,
    userName: userData.value.userName,
    userRoleName: userData.value.role?.value ?? '',
  };
  await createUserApi({ payload: payload });
  emit('user-add', userData.value);
}
onMounted(() => {
  userData.value = props.selectedUser;
});
</script>
