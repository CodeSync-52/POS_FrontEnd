<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="row mb-2 items-center justify-between">
        <div class="font-semibold text-lg">
          <span> Update Receipt Description </span>
        </div>
        <q-btn v-close-popup icon="close" flat unelevated dense size="md" />
      </div>
      <q-input
        v-model="description"
        type="text"
        dense
        label="Receipt Description"
        color="btn-primary"
        outlined
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn v-close-popup label="close" unelevated color="btn-cancel" />
      <q-btn
        label="save"
        unelevated
        color="btn-primary"
        :disable="!description || description.trim() === ''"
        :loading="isLoading"
        @click="handleUpdateDescription"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { isPosError } from 'src/utils';
const $q = useQuasar();
const isLoading = ref(false);
const description = ref('this is description');
const emit = defineEmits<{
  (event: 'close-description-modal', callback: () => void): void;
}>();
const handleUpdateDescription = () => {
  try {
    if (isLoading.value) return;
    isLoading.value = true;
    setTimeout(() => {
      emit('close-description-modal', () => (isLoading.value = false));
    }, 1000);
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      type: 'negative',
    });
  }
  isLoading.value = false;
};
</script>
