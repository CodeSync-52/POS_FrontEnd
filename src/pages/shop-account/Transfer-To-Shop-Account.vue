<template>
  <div>
    <div
      class="text-lg text-center row justify-between md:text-left font-medium mb-4"
    >
      <span>Add New Account</span>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">User</span>
                <q-select
                  label="Select User"
                  autofocus
                  dense
                  color="btn-primary"
                  outlined
                  clearable
                  map-options
                  use-input
                  popup-content-class="!max-h-[200px]"
                  @update:model-value="handleShowOutstandingBalance"
                  option-label="fullName"
                  option-value="userId"
                  :options="shopAccountUserList"
                  v-model="addNewAccount.cash"
                />
              </div>
              <q-input
                v-model="addNewAccount.UserOutstandingBalance"
                readonly
                label="User Outstanding Balance"
                dense
                outlined
                color="btn-primary"
              />
            </div>
            <div class="col-md-4 col-12 q-gutter-y-md">
              <div>
                <span class="text-base font-medium">Shop</span>
                <q-select
                  label="Select Shop"
                  color="btn-primary"
                  dense
                  outlined
                  clearable
                  use-input
                  popup-content-class="!max-h-[200px]"
                  map-options
                  option-label="name"
                  option-value="shopId"
                  :options="shopData"
                  :disable="
                    authStore.loggedInUser?.rolePermissions.roleName !==
                    EUserRoles.SuperAdmin.toLowerCase()
                  "
                  v-model="selectedShop.fromShop"
                />
              </div>
            </div>
            <div class="col-md-4 col-12">
              <span class="text-base font-medium">Amount</span>
              <q-input
                :min="0"
                type="number"
                dense
                color="btn-primary"
                outlined
                v-model="addNewAccount.amount"
                @update:model-value="handleUpdateAmount($event)"
              />
            </div>
          </div>
          <div class="q-gutter-y-xs">
            <span class="font-medium text-base">Comments</span>
            <q-input
              autogrow
              color="btn-primary"
              placeholder="Add your comment"
              outlined
              type="textarea"
              v-model="addNewAccount.comment"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-x-sm">
        <router-link to="/shop-account">
          <q-btn
            unelevated
            label="Cancel"
            :disable="isAdding"
            color="btn-cancel hover:bg-btn-cancel-hover"
          />
        </router-link>
        <q-btn
          label="Add"
          unelevated
          :disable="
            !addNewAccount.cash ||
            addNewAccount.amount <= 0 ||
            !addNewAccount.amount ||
            addNewAccount.amount > 9999999
          "
          :loading="isAdding"
          color="btn-primary"
          @click="handleCashReceiveFromHO"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { useRouter } from 'vue-router';
import {
  shopListApi,
  getUserListApi,
  cashReceiveFromHOApi,
} from 'src/services';
import { IShopResponse, EUserRoles, IUserResponse } from 'src/interfaces';
import { CanceledError } from 'axios';
const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const isFetchingShopList = ref(false);
const isAdding = ref(false);
const shopData = ref<IShopResponse[]>([]);
const shopAccountUserList = ref<IUserResponse[]>([]);
const addNewAccount = ref<{
  cash: IUserResponse | null;
  amount: number;
  comment: string;
  UserOutstandingBalance: null | number;
}>({
  cash: null,
  amount: 0,
  comment: '',
  UserOutstandingBalance: null,
});
const selectedShop = ref<{ fromShop: IShopResponse | null }>({
  fromShop: null,
});
onMounted(() => {
  getShopList();
  selectedShop.value.fromShop = null;
  getUserList();
});
const getShopList = async () => {
  isFetchingShopList.value = true;
  try {
    const response = await shopListApi({
      PageNumber: 1,
      PageSize: 200,
    });
    if (response.data) {
      shopData.value = response.data.items;
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
    isFetchingShopList.value = false;
  }
};
const getUserList = async () => {
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 5000,
    });
    if (res?.data) {
      shopAccountUserList.value = res.data.items.filter(
        (user) =>
          user.status === 'Active' &&
          user.roleName === 'Customer' &&
          user.customerGroup === 'Shop Account'
      );
    }
  } catch (e) {
    if (e instanceof CanceledError) return;
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
};
const handleUpdateAmount = (newVal: string | number | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val <= 0) {
      addNewAccount.value.amount = 0;
    } else if (val > 0) {
      addNewAccount.value.amount = val;
    }
  }
};
const handleShowOutstandingBalance = (value: IUserResponse) => {
  addNewAccount.value.UserOutstandingBalance =
    value?.outStandingBalance ?? null;
};
const handleCashReceiveFromHO = async () => {
  if (isAdding.value) return;
  isAdding.value = true;
  const { cash, amount, comment } = addNewAccount.value;
  try {
    const res = await cashReceiveFromHOApi({
      shopId: selectedShop.value?.fromShop?.shopId ?? -1,
      amount: amount,
      transactionUserId: cash?.userId ?? -1,
      shopAccountComment: comment,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.push('/shop-account');
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
  isAdding.value = false;
};
</script>
