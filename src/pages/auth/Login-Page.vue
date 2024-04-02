<template>
  <div class="grid lg:grid-cols-[6fr_6fr]">
    <div class="hidden lg:!inline-block">
      <img
        src="/assets/login-POS.jpg"
        class="h-[100vh] object-fit"
        alt="logo"
      />
    </div>
    <div
      class="flex flex-col min-w-[320px] w-full max-w-[550px] mx-auto justify-center q-pa-md"
    >
      <div class="bg-signature px-6 py-8 rounded-md q-gutter-y-sm">
        <div class="w-full flex justify-center">
          <div class="max-w-[220px] text-[24px]">
            <img src="/assets/shoeStore.png" alt="logo" />
          </div>
        </div>
        <h3 class="text-[24px] font-semibold">Sign In</h3>
        <h4 class="text-[14px] font-normal text-text_primary">
          Please login to your account
        </h4>
        <q-form @submit="handleLogin" class="q-gutter-sm">
          <label class="text-text_primary text-[14px] font-medium"
            >Username</label
          >
          <q-input
            maxlength="250"
            v-model="loginCredentials.userName"
            label="Enter your username"
            dense
            outlined
            color="btn-primary"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is mandatory',
            ]"
          />
          <label class="text-text_primary text-[14px] font-medium"
            >Password</label
          >
          <q-input
            maxlength="250"
            type="password"
            v-model="loginCredentials.password"
            label="Enter your password"
            dense
            color="btn-primary"
            outlined
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is mandatory',
            ]"
          />

          <div class="mb-6 text-subtitle2 text-signature flex justify-end">
            <span
              class="cursor-pointer text-btn-primary hover:border-b-2 hover:border-btn-primary"
              >Forgot Password?</span
            >
          </div>
          <q-btn
            type="submit"
            color=" "
            class="bg-btn-primary full-width hover:bg-btn-primary-hover"
            :loading="isFetching"
            :disabled="
              loginCredentials.userName === '' ||
              loginCredentials.password === ''
            "
          >
            Login
          </q-btn>
        </q-form>
      </div>
    </div>
  </div>
  <div class="text-subtitle2 w-full absolute bottom-0">
    <div class="text-center md:flex justify-center md:justify-between px-2">
      <p>App Version: 1.0.6</p>
      <p>&copy; 2024 CodeSync. All rights reserved.</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authStore = useAuthStore();
const isFetching = ref(false);
const loginCredentials = ref({
  userName: '',
  password: '',
});
const handleLogin = async () => {
  if (isFetching.value) return;
  isFetching.value = true;
  try {
    let res = await authStore.loginUser(loginCredentials.value);
    if (
      res.data.rolePermissions.permissionModuleActions.every(
        (obj) => obj.actionIds.length === 0
      )
    ) {
      const message = 'You Do not have permission to login';
      $q.notify({
        message,
        icon: 'error',
        color: 'red',
      });
    }
  } catch (e) {
    let message = 'Unexpected Error Fetching Api';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message: message,
      color: 'red',
      icon: 'error',
    });
  }
  isFetching.value = false;
};
</script>
