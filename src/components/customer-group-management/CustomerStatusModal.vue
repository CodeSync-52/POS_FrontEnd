<template>
  <q-card class="q-pa-md full-width">
    <q-card-section>
      <div class="text-h6 q-mb-md"><span> Edit Customer Status </span></div>
      <div class="column">
        <q-radio
          v-model="statusVal"
          :val="1"
          label="Active"
          color="btn-primary"
        />
        <q-radio
          v-model="statusVal"
          :val="0"
          label="InActive"
          color="btn-primary"
        />
      </div>
    </q-card-section>
    <div class="row justify-end gap-4">
      <q-btn
        label="Cancel"
        flat
        unelevated
        color="signature"
        class="bg-btn-cancel hover:bg-btn-cancel-hover"
        v-close-popup
      />
      <q-btn
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
        class="bg-btn-primary hover:bg-btn-primary-hover"
        @click="savingEditedStatus"
      />
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface IProps {
  selectedStatus: number;
}
const isLoading = ref<boolean>(false);
const emit = defineEmits<{
  (e: 'updated-status', newVal: number, callback: () => void): void;
}>();
const statusVal = ref<number>(-1);
const props = withDefaults(defineProps<IProps>(), {
  selectedStatus: -1,
});
function savingEditedStatus() {
  isLoading.value = true;
  emit('updated-status', statusVal.value, () => {
    isLoading.value = false;
  });
}
onMounted(() => {
  statusVal.value = props.selectedStatus;
});
</script>
