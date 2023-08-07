<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div class="flex justify-between items-center mb-2">
        <span class="text-2xl font-medium"> {{ action }}</span>
        <q-btn
          class="font-medium"
          icon="close"
          flat
          unelevated
          dense
          v-close-popup
        />
      </div>
      <div v-if="action === 'Reset Password'" class="text-center">
        <span>Are you sure you want to reset the password?</span>
      </div>
      <div v-else class="column">
        <q-radio v-model="statusVal" val="Active" label="Active" />
        <q-radio v-model="statusVal" val="InActive" label="InActive" />
      </div>
    </q-card-section>
    <q-card-actions class="row justify-end q-gutter-x-md">
      <q-btn
        flat
        label="Cancel"
        color="white"
        v-close-popup
        class="bg-btn-primary hover:bg-btn-secondary"
      />
      <q-btn
        flat
        :label="action === 'Reset Password' ? 'Reset' : 'Save'"
        color="white"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="
          action === 'Reset Password'
            ? handleResetPassword()
            : handleChangeStatus()
        "
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
interface Iprops {
  action: string;
  selectedData: {
    customerId: number;
    status: string;
  };
}
const props = withDefaults(defineProps<Iprops>(), {
  action: '',
  selectedData: () => ({
    customerId: -1,
    status: '',
  }),
});
onMounted(() => {
  statusVal.value = props.selectedData.status;
});
const statusVal = ref<string>('');
const emit = defineEmits<{
  (event: 'reset-password', id: number): void;
  (event: 'change-status', id: number, updatedStatus: string): void;
}>();
const handleResetPassword = () => {
  emit('reset-password', props.selectedData.customerId);
};
const handleChangeStatus = () => {
  if (statusVal.value === props.selectedData.status) return;
  emit('change-status', props.selectedData.customerId, statusVal.value);
};
</script>
