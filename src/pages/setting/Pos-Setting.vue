<template>
  <div>
    <div class="text-lg font-medium mb-4">
      <span>Setting</span>
    </div>
    <div class="text-[14px] font-medium mb-4">Receipt Description</div>
    <div>
      <q-input
        v-model="receiptDescription"
        dense
        label="Description"
        autofocus
        color="btn-primary"
        outlined
      ></q-input>
    </div>
    <div class="text-end mt-5">
      <q-btn
        :loading="isLoading"
        label="Save"
        flat
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleSaveSettings"
      ></q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SaveSetting, GetSetting } from 'src/services';
import { onMounted, ref } from 'vue';
import { isPosError } from 'src/utils';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const isLoading = ref(false);
const receiptDescription = ref('');
onMounted(() => {
  getSettings();
});
const getSettings = async () => {
  try {
    isLoading.value = true;
    const res = await GetSetting();
    if (res.type === 'Success') {
      receiptDescription.value = res.data.receiptDescription ?? 'N/A';
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isLoading.value = false;
};
const handleSaveSettings = async () => {
  try {
    isLoading.value = true;
    const res = await SaveSetting({
      receiptDescription: receiptDescription.value,
    });
    if (res.type === 'Success') {
      $q.notify({
        message: res.message,
        type: 'positive',
      });
      router.push('/dashboard');
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isLoading.value = false;
};
</script>
