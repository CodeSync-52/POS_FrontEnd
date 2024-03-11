<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">Close Shop</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          v-close-popup
        />
      </div>
      <div class="flex flex-col md:flex-row gap-2 mb-3">
        <div>
          <q-select
            :loading="isLoading"
            class="min-w-[250px]"
            dense
            popup-content-class="!max-h-[200px]"
            map-options
            outlined
            clearable
            v-model="returnAmount.user"
            :options="userList"
            label="Select User"
            color="btn-primary"
            option-label="fullName"
            option-value="userId"
            ><template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template></q-select
          >
        </div>
        <div>
          <q-input
            class="min-w-[250px]"
            :min="0"
            type="number"
            label="Amount"
            dense
            color="btn-primary"
            outlined
            v-model="returnAmount.amount"
            @update:model-value="handleUpdateAmount($event)"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="white"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        label="Close Shop"
        color="white"
        :disable="!returnAmount.user"
        :loading="isLoading"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="confirmAction"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IUserResponse } from 'src/interfaces';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores';
import { useRouter } from 'vue-router';
import { getUserListApi, returnShopAccountApi } from 'src/services';
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const isLoading = ref(false);
const userList = ref<IUserResponse[]>([]);
const confirmAction = async () => {
  isLoading.value = true;
  await handleAddNewAccount();
};
onMounted(() => {
  getUserList();
});
const returnAmount = ref<{
  user: IUserResponse | null;
  amount: number;
}>({
  user: null,
  amount: 0,
});
const handleUpdateAmount = (newVal: string | number | null) => {
  if (typeof newVal === 'string') {
    const val = parseInt(newVal);
    if (!val || val <= 0) {
      returnAmount.value.amount = 0;
    } else if (val > 0) {
      returnAmount.value.amount = val;
    }
  }
};
const getUserList = async () => {
  try {
    const res = await getUserListApi({
      pageNumber: 1,
      pageSize: 100,
    });
    if (res.data) {
      userList.value = res.data.items;
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
  }
};
const handleAddNewAccount = async () => {
  const { user, amount } = returnAmount.value;
  try {
    const res = await returnShopAccountApi({
      shopId: authStore.loggedInUser?.userShopInfoDTO.shopId ?? -1,
      amount: amount,
      transactionUserId: user?.userId ?? -1,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        color: 'green',
      });
      router.go(-1);
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred Add Cash Flow';
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
</script>
