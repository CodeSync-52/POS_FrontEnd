<template>
  <q-card class="min-w-[320px] w-full !max-w-[400px]">
    <q-card-section>
      <div class="row justify-between items-center mb-2">
        <span class="text-lg font-medium">
          {{ isReject ? 'Reject Grn' : 'Accept Grn' }}</span
        >
        <span
          ><q-btn
            class="close-modal"
            v-close-popup
            flat
            unelevated
            dense
            size="md"
            icon="close"
        /></span>
      </div>
      <div v-if="!isReject" class="text-center">
        <span>Are you sure you want to accept the selected GRN?</span>
      </div>
      <div v-else>
        <div class="mb-1 text-base">
          <span>Reason of reject</span>
        </div>
        <q-input
          outlined
          dense
          color="btn-primary"
          label="Enter your reason"
          v-model="rejectReason"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="signature"
        v-close-popup
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
      />
      <q-btn
        flat
        :label="isReject ? 'Reject' : 'Accept'"
        color="signature"
        :loading="isLoading"
        :disable="isReject && !rejectReason"
        @click="handleRejectOrAcceptStr()"
        class="bg-btn-primary hover:bg-btn-primary-hover"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface IProps {
  isReject: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  isReject: false,
});
const isLoading = ref(false);
const rejectReason = ref('');
const emit = defineEmits<{
  (event: 'accept-str', callback: () => void): void;
  (event: 'reject-str', reason: string, callback: () => void): void;
}>();
const handleRejectOrAcceptStr = () => {
  if (props.isReject) {
    isLoading.value = true;
    emit('reject-str', rejectReason.value, () => (isLoading.value = false));
  } else {
    isLoading.value = true;
    emit('accept-str', () => (isLoading.value = false));
  }
};
</script>
