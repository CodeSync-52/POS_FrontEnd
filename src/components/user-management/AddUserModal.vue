<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-2xl font-medium"> {{ action }}</span>
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
        <div class="row px-2 q-col-gutter-x-sm">
          <div
            :class="action !== 'Add New User' ? 'col-md-6' : 'col-md-4'"
            class="w-full col-sm-12"
          >
            <div>
              <q-input
                dense
                outlined
                v-model="userData.fullName"
                label="Full Name"
                lazy-rules
                :rules="[(val) => val.length || 'This field is mandatory']"
                color="btn-primary"
              />
            </div>
          </div>
          <div
            v-if="action === 'Add New User'"
            class="col-md-4 w-full col-sm-12"
          >
            <div>
              <q-input
                dense
                outlined
                v-model="userData.userName"
                label="User Name"
                color="btn-primary"
                lazy-rules
                :rules="[(val) => val.length || 'This field is mandatory']"
              />
            </div>
          </div>
          <div
            :class="action !== 'Add New User' ? 'col-md-6' : 'col-md-4'"
            class="col-md-4 w-full col-sm-12"
          >
            <q-input
              dense
              outlined
              v-model="userData.phoneNumber"
              type="tel"
              color="btn-primary"
              mask="####-#######"
              label="Phone Number"
              lazy-rules
              :rules="[
                (val) =>
                  val.length === 12 || 'This entered number is not valid',
              ]"
            />
          </div>
        </div>
        <div v-if="action === 'Add New User'" class="row px-2 q-col-gutter-xs">
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-select
                dense
                :options="roleDropdownOptions"
                outlined
                v-model="userData.roleName"
                map-options
                @update:model-value="userData.roleName = $event.value"
                label="Role"
                color="btn-primary"
              />
            </div>
          </div>
        </div>
        <div
          v-if="userData.roleName === EUserRoles.Customer"
          class="row px-2 q-col-gutter-sm"
        >
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-select
                :options="customerGroupList"
                :loading="isLoading"
                dense
                map-options
                outlined
                v-model="userData.customerGroupId"
                @update:model-value="
                  userData.customerGroupId = $event.customerGroupId
                "
                label="Customer Group"
                color="btn-primary"
                option-label="name"
                option-value="customerGroupId"
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template></q-select
              >
            </div>
          </div>
          <div class="col-md-4 w-full col-sm-12">
            <div>
              <q-input
                type="number"
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
        :label="action === 'Add New User' ? 'Add' : 'Save'"
        color="signature"
        :disable="isButtonDisabled"
        @click="
          action === 'Add New User' ? handleAddNewUser() : handleEditUser()
        "
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { roleOptions } from 'src/constants';
import {
  EUserRoles,
  ICustomerListResponse,
  IUserManagementData,
  IUserPayload,
} from 'src/interfaces';
import { getCustomerGroupList } from 'src/services';
import { isPosError } from 'src/utils';
type PropType = {
  selectedUser?: IUserManagementData;
  action: string;
};
onMounted(() => {
  if (props.selectedUser !== undefined) {
    userData.value = props.selectedUser;
  }
  getCustomerListOption();
});
const $q = useQuasar();
const isLoading = ref(false);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const userData = ref<IUserManagementData>({
  roleName: EUserRoles.Customer,
  flatDiscount: 0,
  customerGroupId: null,
  fullName: '',
  status: '',
  phoneNumber: '',
  userName: '',
});
const roleDropdownOptions = computed(() =>
  roleOptions.filter(
    (role) =>
      role.value === EUserRoles.Customer ||
      role.value === EUserRoles.Admin ||
      role.value === EUserRoles.SuperAdmin
  )
);

function removeStatusFromPayload(
  param: IUserManagementData & { status?: string }
): IUserPayload {
  const data = { ...param };
  delete data.status;
  return data;
}

const isButtonDisabled = computed(() => {
  const { fullName, phoneNumber, roleName, userName, customerGroupId } =
    userData.value;
  const validations = ref<boolean[]>([]);
  if (
    roleName === EUserRoles.Admin ||
    roleName === EUserRoles.SuperAdmin ||
    roleName === EUserRoles.OfficeManager
  ) {
    validations.value = [!fullName, phoneNumber.length !== 12];
  } else if (
    roleName === EUserRoles.ShopManager ||
    roleName === EUserRoles.ShopOfficer
  ) {
    const shopValidation = [!fullName, phoneNumber.length !== 12, !userName];
    validations.value = shopValidation;
  } else if (roleName === EUserRoles.Customer) {
    const customerValidation = [
      !fullName,
      phoneNumber.length !== 12,
      !userName,
      !customerGroupId,
    ];
    validations.value = customerValidation;
  }
  return validations.value.some((validation) => validation);
});
const emit = defineEmits<{
  (event: 'user-add', data: IUserPayload): void;
  (event: 'user-edit', data: IUserPayload): void;
}>();
const props = defineProps<PropType>();
const handleEditUser = () => {
  const payload = removeStatusFromPayload(userData.value);
  emit('user-edit', payload);
};
function handleAddNewUser() {
  if (userData.value.roleName !== EUserRoles.Customer) {
    delete userData.value.customerGroupId;
    delete userData.value.flatDiscount;
    delete userData.value.customerGroupId;
  }
  const payload = removeStatusFromPayload(userData.value);
  emit('user-add', payload);
}
async function getCustomerListOption() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getCustomerGroupList({
      pageNumber: 1,
      pageSize: 200,
    });
    if (res?.data) {
      customerGroupList.value = res?.data.items;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      color: 'red',
      icon: 'error',
    });
  }
  isLoading.value = false;
}
</script>
