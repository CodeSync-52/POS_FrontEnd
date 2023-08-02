<template>
  <div
    class="grid items-center grid-cols-1 lg:grid-cols-[5fr_4fr] bg-[url('/src/assets/Images/loginBg.jpg')] h-screen"
  >
    <div class="hidden lg:!inline-block"></div>
    <div
      class="flex flex-col min-w-[320px] w-full max-w-[400px] mx-auto justify-center q-pa-md"
    >
      <div class="bg-white px-6 py-8 rounded-md q-gutter-y-md">
        <div class="w-12 mx-auto">
          <img src="/assets/Pos-icon.png" alt="logo" />
        </div>
        <h3 class="text-3xl text-center mb-8 font-medium">Welcome to POS</h3>
        <q-form @submit="handleLogin" class="q-gutter-sm">
          <q-input
            v-model="loginCredentials.userName"
            label="Username"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is mandatory',
            ]"
          />
          <q-input
            type="password"
            v-model="loginCredentials.password"
            label="Password"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'This field is mandatory',
            ]"
          />

          <div class="mb-10 text-subtitle2 text-signature flex justify-end">
            <span class="cursor-pointer hover:text-blue-400"
              >Forgot Password?</span
            >
          </div>
          <q-btn
            type="submit"
            color="primary"
            class="full-width"
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
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const router = useRouter();
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
    await authStore.loginUser(loginCredentials.value);
    router.push('/dashboard');
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
