<template>
  <q-card class="q-pa-md full-width">
    <q-card-section>
      <div class="text-h6 q-mb-md"><span> Edit Customer Status </span></div>
      <div class="column">
        <q-radio v-model="statusVal" val="1" label="Active" />
        <q-radio v-model="statusVal" val="0" label="InActive" />
      </div>
    </q-card-section>
    <div class="row justify-end">
      <q-btn label="Cancel" flat unelevated color="red" v-close-popup />
      <q-btn
        label="Save"
        flat
        :loading="isLoading"
        unelevated
        color="signature"
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
