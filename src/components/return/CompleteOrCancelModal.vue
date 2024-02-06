<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">{{ modalTitle }}</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          @click="closeModal"
        />
      </div>
      <div class="text-center">
        <span>{{ modalMessage }}</span>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="No"
        color="white"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        label="Yes"
        color="white"
        :loading="isLoading"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="confirmAction"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);
const isLoading = ref(false);
const emit = defineEmits(['confirm']);
interface IModalProps {
  title: string;
  message: string;
}
const props = defineProps<IModalProps>();
const modalTitle = ref(props.title);
const modalMessage = ref(props.message);
const closeModal = () => {
  isVisible.value = false;
};
const confirmAction = async () => {
  isLoading.value = true;
  emit('confirm');
};
</script>
