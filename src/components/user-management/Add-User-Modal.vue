<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium"> {{ action }}</span>
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
                maxlength="250"
                v-model="userData.fullName"
                label="Full Name"
                autofocus
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
                maxlength="250"
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
              mask="+92###-########"
              label="Phone Number"
              lazy-rules
              :rules="[
                (val) =>
                  (val.length >= 14 && val.length <= 15) ||
                  'This entered number is not valid',
              ]"
            />
          </div>
          <div
            :class="action !== 'Add New User' ? 'col-md-6' : 'col-md-4'"
            class="col-md-6 mb-2 w-full col-sm-12"
          >
            <q-input
              dense
              outlined
              v-model="userData.address"
              type="text"
              color="btn-primary"
              label="Address"
              maxlength="250"
            />
          </div>
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-select
                dense
                popup-content-class="!max-h-[200px]"
                :disable="action !== 'Add New User'"
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
        <div class="row px-2 q-col-gutter-xs"></div>
        <div
          v-if="userData.roleName === EUserRoles.Customer"
          class="row px-2 q-col-gutter-sm"
        >
          <div
            v-if="action === 'Add New User'"
            class="col-md-6 w-full col-sm-12"
          >
            <div>
              <q-select
                :options="customerGroupList"
                :loading="isLoading"
                dense
                popup-content-class="!max-h-[200px]"
                map-options
                outlined
                v-model="userData.customerGroupId"
                @update:model-value="
                  userData.customerGroupId = $event.customerGroupId
                "
                :disable="action !== 'Add New User'"
                label="User Category"
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
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-input
                type="number"
                dense
                outlined
                :min="0"
                :max="5000000"
                v-model="userData.discount"
                @update:model-value="handleUpdateDiscount($event)"
                fill-mask="0"
                reverse-fill-mask
                input-class="text-right"
                label="Discount"
                color="btn-primary"
              />
            </div>
          </div>
        </div>
        <div
          v-if="
            userData.roleName === EUserRoles.ShopManager ||
            userData.roleName === EUserRoles.ShopOfficer
          "
          class="row px-2 q-col-gutter-sm"
        >
          <div class="col-md-6 w-full col-sm-12">
            <div>
              <q-select
                :options="ShopList"
                :loading="isLoading"
                dense
                map-options
                outlined
                :disable="action !== 'Add New User'"
                popup-content-class="!max-h-[200px]"
                v-model="userData.shopId"
                @update:model-value="userData.shopId = $event.shopId"
                label="Shop Name"
                color="btn-primary"
                option-label="name"
                option-value="shopId"
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
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
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
  IShopResponse,
  IUserPayload,
  IUserResponse,
} from 'src/interfaces';
import { GetCustomerGroupList, GetShopList } from 'src/services';
import { isPosError } from 'src/utils';
type PropType = {
  selectedUser: IUserResponse | null;
  action: string;
};
onMounted(() => {
  if (props.selectedUser) {
    userData.value = props.selectedUser;
  }
  getCustomerAndShopListOption();
});
const $q = useQuasar();
const isLoading = ref(false);
const customerGroupList = ref<ICustomerListResponse[]>([]);
const ShopList = ref<IShopResponse[]>([]);
const userData = ref<IUserResponse>({
  roleName: EUserRoles.Customer,
  customerGroupId: null,
  customerGroup: null,
  discount: 0,
  outStandingBalance: 0,
  fullName: '',
  status: '',
  phoneNumber: '',
  shopName: '',
  userId: -1,
  userName: '',
  address: '',
  shopId: null,
});
const roleDropdownOptions = computed(() => roleOptions);
const handleUpdateDiscount = (newVal: string | number | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (val < 0 || !val) {
      userData.value.discount = 0;
    } else {
      userData.value.discount = val;
    }
  }
};
const isButtonDisabled = computed(() => {
  const {
    fullName,
    phoneNumber,
    roleName,
    userName,
    customerGroupId,
    discount,
    shopId,
  } = userData.value;
  const validations = ref<boolean[]>([]);
  if (
    roleName === EUserRoles.Admin ||
    roleName === EUserRoles.SuperAdmin ||
    roleName === EUserRoles.HOOfficer
  ) {
    validations.value = [
      !fullName,
      !userName,
      !(phoneNumber.length >= 14 && phoneNumber.length <= 15),
    ];
  } else if (
    roleName === EUserRoles.ShopManager ||
    roleName === EUserRoles.ShopOfficer
  ) {
    const shopValidation = [
      !fullName,
      !(phoneNumber.length >= 14 && phoneNumber.length <= 15),
      !userName,
      shopId === null,
    ];
    validations.value = shopValidation;
  } else if (roleName === EUserRoles.Customer) {
    const customerValidation = [
      discount !== undefined && discount > 5000000,
      !fullName,
      !(phoneNumber.length >= 14 && phoneNumber.length <= 15),
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
  if (userData.value.phoneNumber) {
    if (userData.value.phoneNumber.charAt(3) === '0') {
      const userPhoneNumber = userData.value.phoneNumber;
      userData.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      userData.value.phoneNumber =
        userData.value.phoneNumber.substring(0, 3) +
        userData.value.phoneNumber.substring(4);
    } else if (
      userData.value.phoneNumber.charAt(3) !== '0' &&
      (userData.value.phoneNumber.length === 14 ||
        userData.value.phoneNumber.length === 15)
    ) {
      const userPhoneNumber = userData.value.phoneNumber;
      userData.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  emit('user-edit', userData.value);
};
function handleAddNewUser() {
  delete userData.value.outStandingBalance;
  delete userData.value.customerGroup;
  delete userData.value.userId;
  delete userData.value.status;
  if (userData.value.roleName !== EUserRoles.Customer) {
    delete userData.value.customerGroupId;
    delete userData.value.discount;
  }
  if (
    userData.value.roleName !== EUserRoles.ShopOfficer &&
    userData.value.roleName !== EUserRoles.ShopManager
  ) {
    delete userData.value.shopId;
    delete userData.value.shopName;
  }

  if (userData.value.phoneNumber) {
    if (userData.value.phoneNumber.charAt(3) === '0') {
      const userPhoneNumber = userData.value.phoneNumber;
      userData.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
      userData.value.phoneNumber =
        userData.value.phoneNumber.substring(0, 3) +
        userData.value.phoneNumber.substring(4);
    } else if (
      userData.value.phoneNumber.charAt(3) !== '0' &&
      (userData.value.phoneNumber.length === 14 ||
        userData.value.phoneNumber.length === 15)
    ) {
      const userPhoneNumber = userData.value.phoneNumber;
      userData.value.phoneNumber =
        userPhoneNumber.substring(0, 6) + userPhoneNumber.substring(7);
    }
  }
  emit('user-add', userData.value);
}
async function getCustomerAndShopListOption() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await GetCustomerGroupList({ status: 'Active' });
    if (res?.data && Array.isArray(res.data)) {
      customerGroupList.value = res?.data;
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
  try {
    const response = await GetShopList({
      PageNumber: 1,
      PageSize: 2000,
    });
    if (response.data) {
      ShopList.value = response.data.items;
    }
  } catch (error) {
    let message = 'Unexpected Error Occurred';

    if (isPosError(error)) {
      message = error.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
  isLoading.value = false;
}
</script>
