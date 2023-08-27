<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-medium">Reset Password</span>
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
        <span>Are you sure you want to reset the password?</span>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="white"
        v-close-popup
        class="bg-btn-cancel"
      />
      <q-btn
        flat
        label="Reset"
        color="white"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="handleResetPassword"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
interface Iprops {
  selectedData: {
    customerId: number;
    status: string;
  };
}
const props = withDefaults(defineProps<Iprops>(), {
  selectedData: () => ({
    customerId: -1,
    status: '',
  }),
});
const emit = defineEmits<{
  (event: 'reset-password', id: number): void;
}>();
const handleResetPassword = () => {
  emit('reset-password', props.selectedData.customerId);
};
</script>
