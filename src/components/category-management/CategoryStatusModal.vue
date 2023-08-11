<template>
  <q-card class="q-pa-md full-width">
    <q-card-section>
      <div class="text-h6 q-mb-md"><span> Edit Category Status </span></div>
      <div class="column">
        <q-radio
          v-model="statusVal"
          val="Active"
          label="Active"
          color="btn-primary"
        />
        <q-radio
          v-model="statusVal"
          val="InActive"
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
  selectedStatus: string;
}
const isLoading = ref<boolean>(false);
const emit = defineEmits(['updated-status']);
const statusVal = ref<string>('');
const props = withDefaults(defineProps<IProps>(), {
  selectedStatus: '',
});
async function savingEditedStatus() {
  isLoading.value = true;
  await emit('updated-status', statusVal.value);
  isLoading.value = false;
}
onMounted(() => {
  statusVal.value = props.selectedStatus;
});
</script>
