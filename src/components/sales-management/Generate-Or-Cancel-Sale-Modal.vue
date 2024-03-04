<template>
  <q-card class="min-w-[310px] md:min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">{{
          isCancel ? 'Cancel Sale' : 'Generate Sale'
        }}</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          v-close-popup
        />
      </div>
      <div class="text-center">
        <span>
          {{
            `Are you sure you want to ${
              isCancel ? 'mark this as canceled' : 'mark this as completed'
            }?`
          }}</span
        >
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Close"
        color="white"
        v-close-popup
        unelevated
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        :loading="isLoading"
        unelevated
        label="ok"
        color="white"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleBill"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface IProp {
  isCancel: boolean;
  selectedRowId: number;
}
const props = withDefaults(defineProps<IProp>(), {
  selectedRowId: -1,
  isCancel: false,
});
const isLoading = ref(false);
const emit = defineEmits<{
  (event: 'cancel-sale', id: number, callback: () => void): void;
  (event: 'generate-sale', id: number, callback: () => void): void;
}>();
const handleBill = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  if (props.isCancel) {
    emit('cancel-sale', props.selectedRowId, () => (isLoading.value = false));
  } else {
    emit('generate-sale', props.selectedRowId, () => (isLoading.value = false));
  }
};
</script>
